This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Production Setup (Mercado Pago)

This project includes a simple Mercado Pago checkout via redirect. Configure the following environment variables before deploying:

- `MP_ACCESS_TOKEN`: Your Mercado Pago access token (production).
- `NEXT_PUBLIC_APP_ORIGIN` (optional): Absolute origin for callbacks, e.g. `https://tu-dominio.com`. If not set, the server uses the `Origin` header.

API Routes

- `POST /api/checkout/mp`: Creates an order (pending) and Mercado Pago preference, returns `init_point`.
- `POST /api/mercadopago/webhook`: Receives payment notifications and updates order status.
- `GET /api/orders`: Lists stored orders (file-based persistence under `data/orders.json`).

Payload example:

```
{
  "items": [
    { "title": "Producto 1", "quantity": 1, "unit_price": 120000, "currency_id": "COP" }
  ],
  "external_reference": "order-123",
  "payer": { "name": "Nombre", "email": "email@dominio.com" }
}
```

Response:

```
{ "id": "<preference-id>", "init_point": "<url-para-redirigir>" }
```

After approval, the user is redirected to:

- `/checkout/success` (cart is cleared)
- `/checkout/failure`
- `/checkout/pending`

Notes
- Orders are persisted in `data/orders.json`. For real production use a database and server auth.
- Webhook endpoint updates the order status using Mercado Pago payment details.

## Local testing (Mercado Pago)

Use test credentials first. Create a `.env.local` from `.env.local.example` and set:

- `MP_ACCESS_TOKEN=TEST-...` (never commit or share real tokens)
- `NEXT_PUBLIC_APP_ORIGIN=http://localhost:3000`

Run the dev server and use the checkout button. For webhooks on local, start an HTTPS tunnel (e.g. ngrok/cloudflared) and set `NEXT_PUBLIC_APP_ORIGIN` to the tunnel URL. The checkout endpoint sets `notification_url` automatically to `/api/mercadopago/webhook` at that origin.

Public key is not required for Checkout Pro in this project; only the Access Token is used server-side to create preferences and read payment status.

### Restrict payment methods (temporary)

If some methods fail while your account is being enabled, you can hide them by setting env vars:

- `MP_EXCLUDE_METHODS`: comma-separated `payment_method_id` list (e.g. `pse,nequi`).
- `MP_EXCLUDE_TYPES`: comma-separated `payment_type_id` list (e.g. `bank_transfer,wallet`).

These are sent to the Mercado Pago preference as `payment_methods.excluded_*`.
