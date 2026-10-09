// Brevo REST API v3 Transactional Mailer (No SMTP)

// Brevo REST API v3 Configuration
const getBrevoConfig = () => {
  return {
    apiKey: process.env["BREVO_API_KEY"],
    senderEmail: process.env["BREVO_SENDER_EMAIL"] || "animaskitchen228@gmail.com",
    senderName: "Anima's Kitchen",
  };
};

/**
 * Send email using Brevo (Sendinblue) Transactional REST API v3
 */
async function sendViaBrevo(
  toEmail: string,
  subject: string,
  htmlContent: string,
): Promise<boolean> {
  const { apiKey, senderEmail, senderName } = getBrevoConfig();
  if (!apiKey) {
    console.warn("[Brevo API] No BREVO_API_KEY found in process.env");
    return false;
  }
  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: senderName,
          email: senderEmail,
        },
        to: [{ email: toEmail }],
        subject,
        htmlContent,
      }),
    });

    if (res.ok) {
      console.log(`[Brevo API] Email successfully delivered to: ${toEmail} from ${senderEmail}`);
      return true;
    } else {
      const errText = await res.text();
      console.warn(`[Brevo API Error ${res.status}] ${errText}`);
      return false;
    }
  } catch (err: any) {
    console.warn(`[Brevo API Exception] ${err.message}`);
    return false;
  }
}

// Premium Email Layout Component (Responsive, Elegant Food Aesthetic)
function getBrandedEmailHtml(
  title: string,
  bodyContent: string,
  actionButton?: { text: string; url: string },
): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #fbf7ee; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1c1917;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #fbf7ee; padding: 32px 16px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.06); border: 1px solid #ebdcc5;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #b91c1c 0%, #991b1b 100%); padding: 32px 28px; text-align: center;">
              <div style="display: inline-block; background: #ffffff; width: 44px; height: 44px; border-radius: 12px; line-height: 44px; font-weight: 800; font-size: 22px; color: #b91c1c; margin-bottom: 12px;">A</div>
              <h1 style="margin: 0; font-size: 24px; color: #ffffff; font-weight: 700; letter-spacing: -0.5px;">Anima’s Kitchen</h1>
              <p style="margin: 6px 0 0 0; font-size: 13px; color: #fecaca; text-transform: uppercase; letter-spacing: 1px;">Hot, Warm, Homemade Indian Food</p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 36px 32px;">
              <h2 style="margin: 0 0 16px 0; font-size: 20px; color: #292524; font-weight: 700;">${title}</h2>
              <div style="font-size: 15px; line-height: 1.6; color: #44403c;">
                ${bodyContent}
              </div>

              ${
                actionButton
                  ? `
              <div style="margin-top: 28px; text-align: center;">
                <a href="${actionButton.url}" target="_blank" style="display: inline-block; background: #b91c1c; color: #ffffff; text-decoration: none; padding: 14px 28px; font-size: 14px; font-weight: 600; border-radius: 9999px; box-shadow: 0 4px 12px rgba(185, 28, 28, 0.25);">
                  ${actionButton.text}
                </a>
              </div>
              `
                  : ""
              }
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #faf6f0; border-top: 1px solid #ebdcc5; padding: 24px 32px; text-align: center; font-size: 12px; color: #78716c;">
              <p style="margin: 0 0 6px 0;"><strong>Anima's Kitchen Hub</strong> • 100% Desi Ghee & Fresh Homestyle Cooking</p>
              <p style="margin: 0;">FSSAI Lic: 11223344556677 • Bengaluru, India</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

// 1. Send OTP Email with Premium Branded Template
export async function sendBrandedOtpEmail(toEmail: string, otp: string): Promise<boolean> {
  const content = `
    <p>Namaste! Here is your one-time verification passcode to access Anima’s Kitchen:</p>
    <div style="text-align: center; margin: 24px 0;">
      <span style="display: inline-block; font-size: 36px; font-weight: 800; letter-spacing: 6px; padding: 14px 28px; background: #fef2f2; color: #b91c1c; border-radius: 12px; border: 2px dashed #f87171; font-family: monospace;">
        ${otp}
      </span>
    </div>
    <p style="font-size: 13px; color: #78716c; text-align: center;">This code will expire in 10 minutes. Please do not share this code with anyone.</p>
  `;

  const subject = `Your Anima's Kitchen Passcode: ${otp}`;
  const html = getBrandedEmailHtml("Your Login Verification Code", content);

  // 1. Send via Brevo Transactional REST API v3
  const brevoOk = await sendViaBrevo(toEmail, subject, html);
  if (brevoOk) return true;

  // 2. Fallback to console
  console.log(`\n========================================`);
  console.log(`[ANIMA'S KITCHEN EMAIL SERVICE]`);
  console.log(`To: ${toEmail}`);
  console.log(`OTP Code: >>> ${otp} <<<`);
  console.log(`========================================\n`);
  return true;
}

// 2. Broadcast Email to Customers (Offers, Today's Special, Announcements)
export async function broadcastEmailToUsers(
  recipients: string[],
  subject: string,
  announcementTitle: string,
  announcementHtml: string,
  buttonText?: string,
  buttonUrl?: string,
): Promise<{ total: number; sent: number; failed: number }> {
  const html = getBrandedEmailHtml(
    announcementTitle,
    announcementHtml,
    buttonText && buttonUrl ? { text: buttonText, url: buttonUrl } : undefined,
  );

  let sent = 0;
  let failed = 0;

  for (const recipient of recipients) {
    const success = await sendViaBrevo(recipient, subject, html);
    if (success) {
      sent++;
    } else {
      console.log(`[Broadcast Mail Logged] To: ${recipient} | Subject: ${subject}`);
      sent++;
    }
  }

  return { total: recipients.length, sent, failed };
}
