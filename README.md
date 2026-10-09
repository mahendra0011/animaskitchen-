# Anima’s Kitchen — Cloud Kitchen & Pure Desi Ghee Thali Platform

Authentic Indian cloud kitchen platform serving small-batch, slow-simmered home-cooked thalis, soft tawa rotis, and aromatic biryanis prepared with 100% cow desi ghee.

## Features

- **Customer App**: Interactive thali customizer, small-batch daily menu, nutrition & "What's Inside" details, instant cart drawer with auto-slide, coupon codes, and live delivery tracking.
- **Admin Dashboard**: Live revenue analytics, order status management, multi-branch kitchen metrics, and inventory control.
- **Kitchen Display System (KDS)**: Real-time KOT display with preparation timers, priority tags, and station workflows.
- **Delivery Partner App**: Live OTP verification, map routes, and earnings tracker.

## Development

```sh
npm install
npm run dev
```

## Deployment

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/mahendra0011/animakitchen)

### Deploying via Render Blueprint

This repository includes a pre-configured `render.yaml` blueprint.

1. Click the **Deploy to Render** button above or go to [Render Dashboard](https://dashboard.render.com).
2. Select **New +** → **Blueprint**.
3. Connect `mahendra0011/animakitchen` and click **Apply**.
4. Render will automatically install dependencies, build with `node-server` preset, and launch the service.

### Manual Configuration on Render

If you created the Web Service manually on Render (instead of Blueprint):

- **Runtime**: Node
- **Build Command**: `npm install --include=dev && npm install @rolldown/binding-linux-x64-gnu@1.2.1 && npm run build`
- **Start Command**: `npm start`
- **Environment Variables**:
  - `NODE_VERSION`: `22.14.0` (Vite 8 & Nitro require Node `>=22.12.0`)
  - `NITRO_PRESET`: `node-server`
  - `NODE_ENV`: `production`
  - `PORT`: `10000`

## Built with

- TanStack Start & React 19
- Nitro (Node server)
- TypeScript
- Tailwind CSS
- Lucide Icons & Radix UI
