# Anima's Kitchen — Security, Auth Security & Attack Prevention (Complete Guide)

**Companion to:** `animakitchen-full-build-plan.md` | **Auth:** sirf Email OTP

## 0. Pehle ek sachchi baat: "0% data leak"

Koi bhi system **100% leak-proof ki guarantee nahi de sakta**, aur client ko ye promise **contract me mat likhna**. Jo realistic hai wo ye hai:

1. **Attack surface chhota rakho:** jo data store hi nahi karte wo leak nahi ho sakta.
2. **Defense in depth:** ek layer fail ho to doosri bachaye (app check + DB check + network check).
3. **Leak hone par bhi nuksan kam:** hash, encryption, masking, short retention.
4. **Jaldi pakdo aur jaldi roko:** logs, alerts, kill switch, incident plan.

Contract wording: _"Industry-standard security practices (OWASP ASVS L2) follow kiye jaayenge"_ likho, "100% secure" nahi. Ye tumhe legal risk se bachata hai.

### Security goals

| Goal            | Matlab                                      |
| --------------- | ------------------------------------------- |
| Confidentiality | Customer ka data sirf usi ko dikhe          |
| Integrity       | Price, order, payment koi chhed nahi sakta  |
| Availability    | Site rush hour me bhi chale, DoS se na gire |
| Accountability  | Kisne kya kiya, log me (audit)              |

---

## 1. Threat model (kaun, kya, kaise)

| Attacker                | Kya chahta hai                 | Example                                    |
| ----------------------- | ------------------------------ | ------------------------------------------ |
| Random internet bot     | Spam, scan, brute force        | OTP bombing, directory scan                |
| Malicious customer      | Free khana, discount           | Coupon abuse, price tamper, fake COD       |
| Customer vs customer    | Doosre ka data                 | `/orders/123` ki ID badal ke dekhna (IDOR) |
| Rogue/compromised rider | Cash, customer data            | GPS spoof, customer phone scrape           |
| Insider / staff         | Data churana, refund fraud     | Customer list export, fake refund          |
| Competitor              | Menu/price scrape, review spam | Scraping, fake reviews                     |
| Hacker (targeted)       | Admin takeover, DB dump        | Phished admin email, SQLi, leaked key      |

**Crown jewels (sabse zyada bachana):** admin accounts, DB, customer PII (email, phone, address), payment data/keys, session secrets, OTP pepper, rider locations.

---

## 2. Data minimisation (leak se pehle ka best defence)

| Data              | Rakhna hai?                | Kaise                                           |
| ----------------- | -------------------------- | ----------------------------------------------- |
| Email             | Haan (login)               | Unique, lowercase normalize                     |
| Phone             | Haan (delivery)            | Unverified, sirf order/rider ko dikhe           |
| Address           | Haan                       | Order me **snapshot**, purane ka access limited |
| Card/UPI details  | **Kabhi nahi**             | Razorpay hosted checkout, PCI scope zero        |
| Passwords         | **Hai hi nahi** (OTP only) | Password leak ka risk khatam                    |
| Rider GPS history | Kam                        | Delivery ke baad 7-30 din me delete/aggregate   |
| OTP               | Sirf hash, 10 min          | Use ke baad delete                              |
| Logs              | PII masked                 | `r****@gmail.com`                               |
| Analytics         | Anonymous                  | Email/phone nahi                                |

**Retention schedule (cron job se enforce):**

- Expired OTP, sessions: roz purge
- Rider location history: 30 din
- Deleted account: 30 din me hard purge (legal records anonymize)
- Support tickets: 1 saal, phir archive/anonymize
- Audit logs: 1-2 saal (immutable)

---

## 3. Authentication security (Email OTP)

### 3.1 OTP generation & storage

```ts
import { randomInt, createHmac, timingSafeEqual } from "node:crypto";

const OTP_PEPPER = process.env.OTP_PEPPER!; // 32+ random bytes, secret manager me
export const makeOtp = () => String(randomInt(0, 1_000_000)).padStart(6, "0"); // CSPRNG, Math.random NAHI
export const hashOtp = (otp: string, email: string, id: string) =>
  createHmac("sha256", OTP_PEPPER).update(`${id}:${email}:${otp}`).digest(); // per-OTP salt (id)
export const safeEq = (a: Buffer, b: Buffer) => a.length === b.length && timingSafeEqual(a, b);
```

- `Math.random()` kabhi nahi. `crypto.randomInt` hi.
- HMAC with pepper + per-OTP id: DB leak ho to bhi 6-digit OTP reverse karna mushkil (aur OTP 10 min me expire).
- Constant-time compare (`timingSafeEqual`).

### 3.2 OTP abuse rules (hard limits)

| Control                          | Value                                     |
| -------------------------------- | ----------------------------------------- |
| OTP validity                     | 10 min (admin/rider: **5 min**)           |
| Verify attempts / OTP            | 5, phir OTP invalid (naya maangna padega) |
| Verify attempts / email / ghanta | 15, phir 30 min lock                      |
| Request / email                  | 1 per 60 sec, 5 per ghanta                |
| Request / IP                     | 10 per ghanta, 30 per din                 |
| Request / device fingerprint     | 15 per din                                |
| Global OTP rate (alarm)          | spike par alert + Turnstile mandatory     |
| Concurrent active OTPs           | 1 (naya aaye to purana invalid)           |

**Email bombing roko** (attacker kisi aur ki email par OTP spam kare): per-email limit upar wala + captcha. Response hamesha same: _"Agar ye email valid hai to code bhej diya gaya"_ (user enumeration nahi).

**Timing attack:** existing/non-existing email par response time same rakho (dummy work / queue me email bhejo, response turant).

### 3.3 Bot protection

- **Cloudflare Turnstile** OTP request par (invisible), server-side verify.
- Disposable email domains blocklist (mailinator etc.), optional.
- Honeypot field signup form me.

### 3.4 Sessions

```ts
// session.ts
const SESSION_TTL = {
  customer: 30 * 24 * 3600,
  rider: 7 * 24 * 3600,
  staff: 12 * 3600,
  admin: 8 * 3600,
}; // seconds

export async function createSession(user, req) {
  const token = randomBytes(32).toString("base64url"); // 256-bit
  await db.insert(sessions).values({
    id: sha256(token), // DB me hash, token nahi
    userId: user.id,
    ip: req.ip,
    userAgent: req.ua,
    expiresAt: addSeconds(new Date(), SESSION_TTL[user.role]),
    lastSeenAt: new Date(),
  });
  return setCookie("ak_session", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_TTL[user.role],
    // prod: "__Host-ak_session" prefix (secure, path=/, no domain)
  });
}
```

- Cookie name `__Host-ak_session` (production): subdomain attacks se bachata hai.
- **Session ID login ke baad hamesha naya** (session fixation roko).
- **Sliding expiry + absolute max** (admin 8h absolute, customer 30d).
- **Idle timeout:** admin 30 min inactivity par re-auth.
- Logout: DB row delete (server-side revoke). "Logout all devices".
- Role/status badalne par (suspend, demote) uske **sab sessions revoke**.
- Active sessions page: device, city (approx), last used, "revoke".
- JWT localStorage **nahi**. Cookie-based server session.

### 3.5 Privileged accounts (admin/manager/KDS/rider)

- Public signup **nahi**; sirf **invite** (single-use token, 24h expiry, hash stored, role+branch fixed).
- **Step-up auth:** sensitive actions (refund > ₹500, price change, staff invite, export, role change, settings) par **fresh OTP** (last 5 min me verify).
- **Admin ke liye 2nd factor:** Email OTP + **TOTP (authenticator app)** ya **passkey (WebAuthn)**. Sirf email OTP par admin account = email hack = poora system hack.
- Owner account ka email **alag secure mailbox** (2FA ON, recovery set), shared mailbox nahi.
- **Naye device login** par owner ko alert email "Naya login: Chrome/Windows, Bhopal".
- Break-glass: ek recovery process documented (client + tum, dono ki sahmati).

### 3.6 Account recovery

Passwordless hai to "forgot password" attack surface nahi. Email change ek **sensitive action**: purane email par confirmation + naye par OTP + 24h cooldown notification (account takeover pakadne ke liye).

### 3.7 Email security (OTP ka raasta)

- SPF, DKIM, DMARC (`p=quarantine` -> `p=reject`), BIMI optional
- Alag subdomain transactional emails ke liye (`mail.animaskitchen.com`)
- OTP email me: code, expiry, "Ye aapne nahi maanga to ignore karein", **koi click-link nahi** (phishing se alag dikhe), brand + domain
- Bounce/complaint webhook handle (bad emails suppress)
- Email provider API key restricted, rotate

---

## 4. Authorization (sabse common leak: IDOR)

**Rule:** har endpoint par 3 check: (1) logged in? (2) role allowed? (3) **ye object is user ka hai?**

```ts
// order access: customer apna, rider assigned, staff apni branch, admin sab (audit ke saath)
export async function canReadOrder(user, order) {
  if (user.role === "customer") return order.userId === user.id;
  if (user.role === "rider") return order.riderId === user.id && isActiveStatus(order.status);
  if (user.role === "kds") return order.branchId === user.branchId;
  if (["manager", "admin"].includes(user.role))
    return user.branchIds.includes(order.branchId) || user.role === "owner";
  return false;
}
// kabhi: db.select().from(orders).where(eq(orders.id, params.id))   <-- galat (IDOR)
// hamesha: where(and(eq(orders.id, id), ownerCondition(user)))        <-- sahi
```

- **Public IDs random UUID/ULID**, sequential integers nahi (order tracking page par `orderNumber` guessable ho to token bhi chahiye).
- Guest/shared tracking link: `/track/{128-bit random token}` (expire after delivery + 24h).
- **Field-level filtering:** rider ko customer ka sirf naam + delivery address + phone **active delivery ke dauran**; delivered ke baad hide/mask (`98****21`).
- **Branch scoping:** manager sirf apni branch.
- **Mass assignment roko:** request body se `role`, `userId`, `price`, `status`, `walletBalance` kabhi direct na lo; Zod schema me sirf allowed fields (`.strict()`).
- **Postgres Row Level Security (RLS)** second layer:

```sql
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY customer_own ON orders FOR SELECT
  USING (user_id = current_setting('app.user_id')::uuid);
CREATE POLICY staff_branch ON orders FOR SELECT
  USING (branch_id = ANY (string_to_array(current_setting('app.branch_ids'), ',')::uuid[]));
-- app DB user ko BYPASSRLS/superuser mat do. Har request: SET LOCAL app.user_id = '...'
```

App bug ho jaye tab bhi DB data nahi dega.

### Permission matrix

| Action               | Customer | Rider        | KDS | Manager | Admin/Owner                      |
| -------------------- | -------- | ------------ | --- | ------- | -------------------------------- |
| Menu dekhna          | ✔        | ✔            | ✔   | ✔       | ✔                                |
| Menu edit/price      | ✖        | ✖            | ✖   | branch  | ✔                                |
| Apna order           | ✔        | -            | -   | -       | -                                |
| Assigned order       | -        | ✔            | -   | -       | -                                |
| Branch orders        | -        | -            | ✔   | ✔       | ✔                                |
| Refund               | request  | ✖            | ✖   | ≤₹500*  | ✔*                               |
| Customer list/export | ✖        | ✖            | ✖   | ✖       | **owner only + step-up + audit** |
| Staff/roles          | ✖        | ✖            | ✖   | ✖       | owner                            |
| Settings/API keys    | ✖        | ✖            | ✖   | ✖       | owner                            |
| Analytics (revenue)  | ✖        | own earnings | ✖   | branch  | ✔                                |
| *step-up OTP + audit |

---

## 5. OWASP Top 10 coverage (checklist)

| Risk                       | Is project me kaise                                                                                   |
| -------------------------- | ----------------------------------------------------------------------------------------------------- |
| A01 Broken access control  | Sec 4 (IDOR, RBAC, RLS, scoped queries, tests)                                                        |
| A02 Cryptographic failures | HTTPS+HSTS, hashed OTP/tokens, encrypted backups, secrets manager, no sensitive in URL                |
| A03 Injection              | ORM parameterized, Zod, no raw SQL string concat, output encode (React), no `dangerouslySetInnerHTML` |
| A04 Insecure design        | Threat model, server-side pricing, state machine, rate limits, abuse cases                            |
| A05 Misconfiguration       | Security headers, no debug in prod, no default creds, locked CORS, error pages generic                |
| A06 Vulnerable components  | `npm audit`, Dependabot, lockfile, **ek hi package manager**, beta deps pin                           |
| A07 Auth failures          | Sec 3                                                                                                 |
| A08 Integrity failures     | Webhook signatures, signed builds/CI, SRI for CDN scripts, no unsafe deserialization                  |
| A09 Logging failures       | Sec 11                                                                                                |
| A10 SSRF                   | Server user-supplied URL kabhi fetch na kare; image proxy allowlist                                   |

---

## 6. Web attack prevention (ek ek karke)

### 6.1 Security headers (Nitro middleware)

```ts
// server/middleware/security.ts
export default defineEventHandler((event) => {
  setResponseHeaders(event, {
    "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY", // clickjacking (CSP frame-ancestors bhi)
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), payment=(self), geolocation=(self)",
    "Cross-Origin-Opener-Policy": "same-origin",
    "Cross-Origin-Resource-Policy": "same-site",
    "Content-Security-Policy": [
      "default-src 'self'",
      "script-src 'self' 'nonce-{NONCE}' https://checkout.razorpay.com https://challenges.cloudflare.com https://maps.googleapis.com",
      "style-src 'self' 'unsafe-inline'", // Tailwind inline; nonce se tighten karo agar ho sake
      "img-src 'self' data: blob: https://res.cloudinary.com https://*.googleapis.com https://*.gstatic.com",
      "connect-src 'self' https://api.razorpay.com https://lumberjack.razorpay.com https://maps.googleapis.com",
      "frame-src https://api.razorpay.com https://challenges.cloudflare.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
      "upgrade-insecure-requests",
    ].join("; "),
  });
});
```

Test: securityheaders.com, Mozilla Observatory (target A+). CSP pehle `Report-Only` me chalao, violations dekh ke enforce.

### 6.2 XSS

- React default escape; **`dangerouslySetInnerHTML` ban** (ESLint rule `react/no-danger`).
- User content (reviews, instructions, ticket messages, coupon names, dish names) store raw, render as text. Agar rich text chahiye to DOMPurify allowlist.
- JSON-LD me `<` ko `\u003c` escape.
- CSP nonce + no inline scripts (upar).
- URL fields (website/social) `https:` allowlist (`javascript:` block).
- Admin panel XSS = sabse khatarnak (stored XSS -> admin takeover), isliye reviews/tickets admin me bhi escape.

### 6.3 CSRF

- Cookies `SameSite=Lax` + state-changing requests sirf **POST/PUT/PATCH/DELETE** (GET me kabhi nahi).
- **Origin/Host check** server par har mutation par; ya double-submit CSRF token.
- Custom header required (`X-Requested-With`/JSON content-type only) - simple form POST block.
- Razorpay webhook CSRF se exempt par signature verify.

### 6.4 SQL/NoSQL injection

ORM (Drizzle/Prisma) parameterized. Raw SQL zaroori ho to `sql\`...${param}\`` tagged template. Sort/filter column names **allowlist** se (user se direct column name nahi). DB user ko DDL rights nahi.

### 6.5 SSRF / Open redirect / Path traversal

- Server kabhi user-given URL fetch nahi karta (image URL se download, webhook URL). Zaroori ho to allowlist + private IP range block.
- `?redirect=` params: sirf same-origin relative paths allow (`/` se shuru, `//` ya `http` nahi).
- File paths: user input se file path nahi banana; storage keys random.

### 6.6 Clickjacking, CORS, Host header

- `frame-ancestors 'none'`.
- CORS: sirf apna origin, credentials ke saath `*` kabhi nahi.
- Host header validate (allowlist domains) — password-reset-poisoning jaise issues + cache poisoning.

### 6.7 Race conditions / business-logic attacks (cloud kitchen me bahut common)

| Attack                                | Fix                                                                                                             |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Coupon double use (parallel requests) | DB transaction + unique `(coupon_id, user_id, order_id)` + row lock / `UPDATE ... WHERE used < limit RETURNING` |
| Wallet double spend                   | Ledger + `SELECT ... FOR UPDATE`, balance check atomic, negative balance constraint `CHECK (balance >= 0)`      |
| Refund twice                          | Idempotency key + refund status unique per payment                                                              |
| Price tamper                          | Server price only (sec 7)                                                                                       |
| Cart item quantity negative/huge      | Zod min 1 max 20                                                                                                |
| Order for unavailable item            | Server availability re-check at checkout                                                                        |
| Cancel after prepared (refund abuse)  | State machine rules                                                                                             |
| Loyalty points farm                   | Points sirf delivered+paid orders par, cap, reversal on refund                                                  |
| Referral/new-user coupon abuse        | Per-email + per-device + per-address limits                                                                     |
| Re-using delivery OTP                 | Single-use, order-bound, attempts limit (3)                                                                     |

```sql
-- coupon atomic redeem
UPDATE coupons SET used_count = used_count + 1
WHERE id = $1 AND active AND now() BETWEEN valid_from AND valid_to
  AND (usage_limit IS NULL OR used_count < usage_limit)
RETURNING id;     -- 0 rows = reject
```

### 6.8 DoS / abuse / scraping

- Cloudflare proxy (WAF, DDoS, bot management), rate limits per IP + per user + per route:
  | Route               | Limit                   |
  | ------------------- | ----------------------- |
  | Global              | 120 req/min/IP          |
  | OTP request         | sec 3.2                 |
  | OTP verify          | 10/10min/IP             |
  | Order create        | 5/min/user              |
  | Coupon apply        | 10/min/user             |
  | Search/menu         | 60/min/IP (scrape slow) |
  | Contact/ticket form | 3/hour/IP + Turnstile   |
  | Rider location      | 1 per 3 sec/rider       |
- Request body size limit (100 KB JSON), upload limits, pagination max (`limit<=50`), query timeout (`statement_timeout`), GraphQL/depth none.
- SSE connections per user cap (3), heartbeat, idle close.
- Expensive endpoints (analytics, export) background job + cache + admin only.
- Scraping: menu public hai to theek, par bulk scraping slow karo (rate limit + Cloudflare bot score), customer/data endpoints kabhi public nahi.

### 6.9 File / image upload security

- Admin only upload, **signed Cloudinary/R2 upload**, direct browser -> storage (server pass-through nahi).
- Allow: jpg/png/webp, max 5 MB, magic-byte check, dimension limit, re-encode (EXIF/GPS strip).
- Random filenames, kabhi `.svg` upload allow na karo (script ho sakta hai) ya sanitize.
- Storage bucket me **listing off**, private assets signed URL (invoice PDFs).
- Invoice PDFs: guessable URL nahi, signed + expiry, owner check.

---

## 7. Payment security

- Card/UPI data tumhare server ya DB me **kabhi nahi** (Razorpay Checkout).
- **Amount server se**: `razorpay.orders.create({ amount: serverTotal })`; client amount ignore.
- **Webhook:**

```ts
// raw body zaroori; JSON parse signature verify ke baad
const expected = createHmac("sha256", RAZORPAY_WEBHOOK_SECRET).update(rawBody).digest("hex");
if (!safeEq(Buffer.from(sig), Buffer.from(expected)))
  return new Response("bad sig", { status: 400 });
// idempotency: webhook event id unique table me insert; duplicate = 200 OK, kaam skip
// amount match: payload.amount === order.total_paise && currency === "INR" else flag + manual review
```

- Client "payment success" par bharosa nahi: order tab hi `placed` jab **webhook/server fetch** se paid confirm.
- `payment_id` unique constraint (ek payment se do orders na bane).
- Refund sirf server-side, amount <= paid, audit log, high value par step-up.
- Razorpay keys: test vs live alag env, webhook secret alag, dashboard par IP/role restrict, 2FA ON.
- **COD fraud:** COD limit, new account COD cap, repeat fake-order users flag/block, rider cash collection reconciliation (daily), rider wallet negative alert.
- Chargeback/dispute process documented.

---

## 8. Rider & realtime security

- Rider sirf apne assigned order dekhe, location post sirf **active delivery** me accepted.
- **GPS spoofing:** server-side sanity check (speed > 120 km/h, teleport jump, accuracy bad) -> flag; delivery complete karne par rider location <= 300m from customer **aur** delivery OTP match.
- Delivery OTP: 4 digit weak hai, isliye: 3 attempts limit, order-bound, 30 min validity after "reached", brute-force par lock + support alert. (Optional 6-digit karo.)
- SSE/WebSocket: **connect par session verify**, har event room server decide kare (client room choose na kare), customer ko sirf apna order stream, rider location customer ko sirf apne order ke liye.
- SSE URL me token mat daalo (logs me aata hai); cookie auth use karo.
- Rider app (PWA) lost device: admin se rider session revoke, rider status offline.
- Rider data minimization: delivered ke baad customer phone/address mask.

---

## 9. Secrets & infrastructure security

### 9.1 Secrets

- `.env` kabhi git me nahi. `.gitignore` check. **Git history me bhi secret hai to rotate** (repo public hai! `mahendra0011/animakitchen` — check karo koi key commit to nahi hui; `gitleaks detect` chalao).
- Secrets: Render env groups / Doppler / AWS Secrets Manager. Dev/staging/prod alag keys.
- Rotation: `SESSION_SECRET`, `OTP_PEPPER` (dual-key support), API keys har 90 din ya leak shak par.
- Pre-commit: `gitleaks`/`secretlint`. GitHub secret scanning + push protection ON.
- Frontend bundle me secret nahi (sirf public keys: Razorpay key id, Maps key **domain-restricted**, Turnstile site key).
- Google Maps key: HTTP referrer restrict + sirf zaroori APIs + quota cap.

### 9.2 Database

- Managed Postgres, **private network / IP allowlist**, SSL required (`sslmode=require`).
- **Least privilege users:** `app_rw` (CRUD, no DDL, no BYPASSRLS), `migrator` (DDL, sirf CI), `readonly_analytics`. Superuser app me kabhi nahi.
- Encryption at rest (provider), sensitive columns (phone, address) ke liye app-level encryption optional (pgcrypto/libsodium) + blind index search ke liye.
- Backups: daily + PITR, **encrypted**, alag region/account, **monthly restore drill**, backup access sirf owner.
- `statement_timeout`, `idle_in_transaction_session_timeout`, connection limit.
- Logs me query params (PII) off.
- Admin ka DB access: no direct prod DB access daily kaam ke liye; break-glass + log.

### 9.3 Server / hosting

- Render paid ya VPS: OS patches auto, SSH key-only, no root, fail2ban, firewall (only 80/443), Docker non-root user, read-only fs jahan ho.
- Cloudflare in front: origin IP hide, "only Cloudflare IPs" allow, Authenticated Origin Pulls.
- `NODE_ENV=production`, stack traces user ko nahi, generic error pages (`error-page.ts` check karo: internal error details leak na ho).
- Health endpoint `/api/health` me version/env/secret info nahi.
- Debug/dev routes (demo login, simulation buttons, `isSimulationPlaying`) **production build se poori tarah delete**.
- Domain: DNSSEC, registrar lock + 2FA, CAA record, expiry auto-renew.
- Admin panel extra: `/admin` par Cloudflare Access / IP allowlist (optional, client office IP ho to).

### 9.4 Supply chain

- `package-lock.json` **ya** `bun.lock` — ek rakho, CI me `npm ci` (frozen).
- Dependabot/Renovate, weekly update, `npm audit --omit=dev --audit-level=high` CI fail.
- Beta packages (`nitro 3.0.xxx-beta`, Vite 8, TanStack Start RC) **exact version pin**, update se pehle staging test.
- Naye dependency add karne se pehle: downloads, maintainers, last release; typosquat check.
- Postinstall scripts: `scripts/ensure-rolldown.cjs` jaise custom scripts review karo, `npm install --ignore-scripts` jahan ho sake.
- CI: CodeQL/Semgrep (SAST), Trivy (container), SBOM (`cyclonedx`), GitHub Actions pinned by SHA, minimal token permissions.
- Third-party scripts (analytics, chat widget) minimum; SRI hashes jahan CDN.

---

## 10. Insider threat & admin safety

- Principle of least privilege; staff ko sirf unki branch aur kaam.
- **Customer data export** sirf owner + step-up OTP + audit + email alert owner ko.
- **Refund/discount fraud:** limit per staff per day, manager approval above threshold, daily report.
- Menu price change history (kisne, kab, purana-naya) + alert big change (>30%).
- Staff offboarding checklist: session revoke, role remove, 24h me.
- Shared accounts nahi; har staff ka apna email login.
- Admin screen par customer phone/email **masked by default**, "reveal" click par audit log.
- Bulk actions (delete menu, mass refund) par confirm + step-up.
- Tamper-evident audit log (hash chain), insert-only table (UPDATE/DELETE revoke).

```sql
REVOKE UPDATE, DELETE ON audit_logs FROM app_rw;   -- sirf INSERT, SELECT
```

---

## 11. Logging, monitoring, detection

### 11.1 Kya log karein (structured JSON, request id ke saath)

Login success/fail, OTP request/verify fail, role change, refund, price change, export, webhook fail, admin actions, rate-limit hits, 4xx/5xx spikes, new device login.

**Kabhi log nahi:** OTP, session token, full email/phone/address, payment secrets, request bodies jisme PII.

```ts
const log = pino({
  redact: {
    paths: [
      "req.headers.cookie",
      "req.headers.authorization",
      "*.otp",
      "*.token",
      "*.email",
      "*.phone",
      "*.address",
    ],
    censor: "[redacted]",
  },
});
```

### 11.2 Alerts (turant notification: email/WhatsApp to you + client)

| Alert                   | Trigger                                   |
| ----------------------- | ----------------------------------------- |
| OTP spike               | >100 OTP requests / 5 min                 |
| Brute force             | >20 failed verify / 5 min on one email/IP |
| Admin login new device  | any                                       |
| Mass data read          | >200 customer records read / min          |
| Export/refund large     | threshold                                 |
| 5xx spike               | >2%                                       |
| Webhook signature fail  | any repeated                              |
| DB CPU/connections high | threshold                                 |
| Cert/domain expiry      | 14 din pehle                              |
| Dependency critical CVE | Dependabot                                |

### 11.3 Tools

Sentry (errors, PII scrub `beforeSend`), uptime monitor, Cloudflare analytics/WAF events, Postgres `pg_stat_statements`, log shipping (Better Stack/Grafana Loki), log retention 90-180 din.

### 11.4 Honeytokens (cheap tripwire)

Fake admin account/fake customer record/fake API key DB me; unka koi use = turant alert (data dump ho raha hai).

---

## 12. Privacy & compliance (DPDP + food business)

- Consent notice + checkbox (pre-ticked nahi), marketing alag consent.
- User rights: **data export, correction, account delete** (account page me), grievance officer email.
- Privacy policy me sach likho: kya store, kitna, kis ko share (Razorpay, email provider, maps).
- Vendors ke saath DPA, vendor list.
- Breach plan: Data Protection Board + affected users notification (72 ghante ke andar initial reporting), CERT-In reporting guidelines (lawyer se current rule confirm).
- Cookie banner agar analytics/marketing cookies.
- Children data: age 18+ ya parent consent line (ToS).
- FSSAI/GST invoice me required fields; invoice PDF me full customer data nahi, sirf zaroori.

---

## 13. Incident response runbook

**Severity:** S1 data leak/admin takeover/payment issue | S2 partial outage | S3 minor.

**Kill switches (pehle se bana ke rakho):**

1. Sab sessions revoke (`DELETE FROM sessions`)
2. Admin/staff login disable flag
3. Order-taking pause (settings flag)
4. Webhook/endpoint block (Cloudflare rule)
5. API keys rotate (Razorpay, email, Cloudinary, Maps, DB)

**Steps:** Detect -> Contain (kill switch) -> Assess (kya data, kitne users, kab se) -> Preserve logs -> Eradicate (root cause patch, rotate keys) -> Notify (users, Board, CERT-In, client, Razorpay agar relevant) -> Recover -> Post-mortem (blameless, action items).

**Contact sheet banao:** you, client owner, hosting support, Razorpay, lawyer, email provider.
Quarterly **tabletop drill**: "admin ka email hack ho gaya, ab kya?"

---

## 14. Security testing plan

| Kab                       | Kya                                                                                 | Tool                    |
| ------------------------- | ----------------------------------------------------------------------------------- | ----------------------- |
| Har commit (CI)           | Lint, typecheck, unit, `npm audit`, gitleaks, Semgrep/CodeQL                        | GitHub Actions          |
| Har PR                    | Security review checklist (authz? validation? PII in logs?)                         | PR template             |
| Weekly                    | Dependabot updates, ZAP baseline scan on staging                                    | OWASP ZAP               |
| Launch se pehle           | **Manual pentest checklist** (neeche), headers scan, SSL Labs A+, load + abuse test | Burp Community, ZAP, k6 |
| Launch ke baad 3-6 mahine | Third-party pentest (client budget), fix report                                     | vendor                  |
| Quarterly                 | Access review, key rotation, restore drill, tabletop                                | manual                  |

### Must-pass security tests (automated)

- [ ] Customer A ko Customer B ka `/orders/:id`, address, wallet, invoice **403/404**
- [ ] Rider ko unassigned order **403**; delivered ke baad customer phone masked
- [ ] Customer ne admin API (`/api/admin/*`) hit kiya -> 403
- [ ] Request body me `role: "admin"`, `price`, `status`, `walletBalance` bheja -> ignore/400
- [ ] Price tamper: cart price badla -> server total sahi
- [ ] Coupon 50 parallel requests -> sirf limit tak redeem
- [ ] Wallet parallel spend -> negative nahi
- [ ] Webhook galat signature -> 400; replay -> single processing; amount mismatch -> flag
- [ ] OTP: 6th galat attempt lock; expired OTP reject; reuse reject; rate limit hit
- [ ] OTP request existing vs non-existing email: same response + similar timing
- [ ] Session logout ke baad purana cookie reject; role change ke baad sessions revoke
- [ ] Admin sensitive action bina step-up -> reject
- [ ] SQLi/XSS payloads (`' OR 1=1--`, `<script>`) review/instructions/ticket fields me -> escape/safe
- [ ] CSRF: cross-origin POST bina origin -> reject
- [ ] Security headers/CSP present; clickjacking iframe fail
- [ ] File upload: `.html`/`.svg`/fake extension reject
- [ ] SSE: bina login connect fail; doosre order ka stream subscribe fail
- [ ] Error responses me stack trace/SQL nahi
- [ ] Rate limits: har listed route par 429

### Manual pentest checklist (launch gate)

Auth bypass, IDOR on every `/:id` route (ID badal ke), role escalation, forced browsing `/admin`, JWT/session tampering, OTP brute force/bypass, parameter pollution, race conditions (coupon/wallet/refund), business logic abuse (cancel+refund loops), file upload bypass, XSS (stored in admin), CSRF, CORS misconfig, open redirect, SSRF, info disclosure (`.git`, `.env`, source maps, `/api/health`), directory listing, subdomain takeover, TLS config, cache poisoning, webhook spoofing.

**Source maps:** production me public source maps off (ya Sentry ko hi upload).

---

## 15. Phase-wise security rollout

| Phase           | Security deliverables                                                                                                                                                      |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 Foundation    | Real auth (OTP hardening), sessions, RBAC, invites, headers+CSP report-only, rate limiting, secrets manager, gitleaks CI, DB least-privilege + RLS, demo login code delete |
| 2 Customer core | Server pricing, coupon/wallet transactions, Razorpay webhook security, COD limits, input validation everywhere, Turnstile                                                  |
| 3 Ops           | Admin step-up + TOTP/passkey, audit log (insert-only), SSE authz, rider data masking, GPS sanity                                                                           |
| 4 Extended      | Export controls, staff offboarding, inventory/refund approval limits, signed invoice URLs                                                                                  |
| 5 Growth        | Referral/loyalty abuse limits, review moderation, email consent                                                                                                            |
| 6 Hardening     | ZAP + manual pentest, load/abuse test, CSP enforce, backup restore drill, incident drill, privacy pages                                                                    |
| 7 Launch        | Alerts live, on-call contact sheet, keys rotated to prod, monitoring dashboard, client security handover doc                                                               |

---

## 16. Final launch security gate (sab tick hone chahiye)

**Auth**

- [ ] OTP hashed+peppered, limits (sec 3.2) live, Turnstile ON, same-response enumeration safe
- [ ] Sessions server-side, `__Host-` cookie, rotate on login, revoke on role change
- [ ] Admin/owner: OTP + TOTP/passkey, step-up for sensitive actions, new-device alerts
- [ ] Koi demo/quick login/role-switch code production me nahi

**Data**

- [ ] IDOR tests pass, RLS ON, least-privilege DB users, DB private network
- [ ] No PII/OTP/tokens in logs, Sentry scrubbed
- [ ] Backups encrypted + restore tested, retention jobs running
- [ ] Customer export owner-only + audit

**App**

- [ ] Headers/CSP enforced, A/A+ on scanners, no `dangerouslySetInnerHTML`
- [ ] Zod strict validation on all inputs, mass assignment blocked
- [ ] Server-side pricing, transactional coupons/wallet, webhook verified + idempotent
- [ ] Upload restrictions, signed URLs, source maps off, generic errors

**Infra**

- [ ] Cloudflare WAF + origin locked, TLS A+, HSTS, domain locked
- [ ] Secrets in manager, git history clean (gitleaks), keys rotated for prod
- [ ] Single lockfile, deps audited, beta deps pinned, CI security scans green
- [ ] Monitoring + alerts + kill switches + incident runbook tested

**Compliance**

- [ ] Privacy/Terms/Refund pages, consent, delete/export account, grievance contact
- [ ] FSSAI/GST on invoices, vendor DPAs

---

## 17. Client ko kya dena hai (handover)

1. **Security summary** (1-2 page): kya controls lage, kya client ki zimmedari (strong email passwords, 2FA, staff offboarding, kisi ko OTP/login share na karna).
2. **Admin security guide:** TOTP setup, step-up OTP, alerts kaise padhna, shak ho to kisko call.
3. **Access register:** kis ke paas kaun sa access (hosting, DB, Razorpay, email, domain), client ke naam par accounts.
4. **Incident contact sheet** + kill switch kaise use karna (admin panel me "Emergency" page).
5. **Maintenance retainer:** monthly dependency updates, key rotation, backup check, security patch SLA (critical 48 ghante).
6. **Disclaimer (contract me):** "Industry-standard practices follow kiye gaye; absolute security guarantee nahi di ja sakti; client ki taraf se credential leaks/phishing responsibility alag."

---

## 18. Quick-win list (pehle 3 din me karo)

1. `gitleaks detect` chalao (repo public hai), koi key mile to rotate
2. Demo fake login (`loginAsRole`, quick role buttons) ko `import.meta.env.DEV` ke peeche ya delete
3. Ek lockfile rakho (`bun.lock` ya `package-lock.json`)
4. Security headers middleware + CSP Report-Only
5. Rate limiting middleware (in-memory pehle, baad me Redis)
6. Postgres + least-privilege user + sessions table + OTP table (hashed)
7. `requireRole` + ownership check helper, sab routes par lagao
8. Cloudflare in front + HTTPS/HSTS
9. Sentry + PII redaction
10. Audit log table (insert-only)

> Is file ko `animakitchen-full-build-plan.md` ke saath padho. Plan me **kya banana hai** hai, yahan **kaise safe banana hai**. Dono ko contract ke technical annexure me attach kar sakte ho.
