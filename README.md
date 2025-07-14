# ePay Subscription System

A professional-grade subscription platform built using the **MERN stack**—**MongoDB**, **Express**, **React**, and **Node.js**—with seamless mobile money integration via **PayChangu API** for Airtel Money and Mpamba payments in **Malawi Kwacha (MWK)**. The system enables users to choose plans, process payments, and track transaction statuses in real-time, with full support for webhook updates and data persistence in MongoDB.

---

## 📁 Project Structure

```
ePay-subscription-system/
├── server/                    # Backend (Node.js + Express)
│   ├── models/                # MongoDB schemas
│   ├── routes/                # Payment API routes
│   ├── .env                   # Environment variables
│   └── server.js              # Main Express app
├── ePay/                      # Frontend (React + Tailwind)
│   └── src/components/        # UI components (Subscription, Checkout, Feedback)
├── README.md                  # Project documentation
```

---

## 🚀 Features

### 🔧 Backend (Node.js + Express)
- **Payment Initialization** via PayChangu’s `/mobile-money/payments/initialize`
- **Webhook Handling** for transaction status updates
- **Transaction Status Endpoint** for frontend polling
- **MongoDB Integration** with Mongoose schemas
- **Phone Number Normalization** for local MW numbers

### 🎨 Frontend (React + Tailwind CSS)
- Interactive **Subscription Plan UI** (Basic, Premium)
- **Custom Checkout** with user detail capture and payment initiation
- **Live Payment Polling** and auto-redirection to success/failure pages
- **Mobile-Friendly Design** using Tailwind CSS

### 🔗 PayChangu API Integration
- Direct Mobile Money payments via sandbox API
- USSD-based confirmation with fallback handling
- Webhook support with sandbox simulation via Postman

---

## ⚙️ Prerequisites
- Node.js v16+
- MongoDB Atlas or local instance
- PayChangu sandbox account (API keys)
- Ngrok (for webhook testing)
- Postman (for simulating webhooks)

---

## 🧪 Setup Instructions

### Backend (`/server`)

```bash
cd server
npm install
```

Create a `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net
PAYCHANGU_API_KEY=<public_key>
PAYCHANGU_SECRET_KEY=<secret_key>
PAYCHANGU_MERCHANT_ID=<merchant_id>
PAYCHANGU_API_URL=https://api.paychangu.com
PAYCHANGU_SUCCESS_URL=http://localhost:3000/success
PAYCHANGU_CANCEL_URL=http://localhost:3000/failure
```

Run the server:
```bash
npm start
```

### Frontend (`/ePay`)

```bash
cd ePay
npm install
npm run dev
```

---

## 🌐 Running the Application

1. **Start Backend**
   ```bash
   cd server && npm start
   ```

2. **Start Frontend**
   ```bash
   cd ePay && npm run dev
   ```

3. **Expose Webhook (Ngrok)**
   ```bash
   ngrok http 5000
   ```
   Set the webhook in PayChangu to:
   ```
   https://<ngrok-id>.ngrok-free.app/api/payment-webhook
   ```

---

## 🧪 Testing Payment Flow

- Access `http://localhost:3000`
- Select a plan, proceed to checkout
- Enter valid details (use test numbers for sandbox)
- Submit and observe USSD confirmation instructions
- Use Postman to simulate webhook:

```json
POST /api/payment-webhook
Content-Type: application/json

{
  "charge_id": "<your-transaction-id>",
  "status": "success",
  "amount": 5000,
  "mobile": "888000000",
  "trans_id": "abc-123" 
}
```

---

## 🧰 Troubleshooting

- **Webhook not received?** Check `http://localhost:4040` (ngrok logs)
- **Polling issues?** Inspect network tab in browser
- **PayChangu errors?** Validate test numbers, contact support
- **MongoDB issues?** Confirm transaction and subscription entries

---

## 📚 Resources

- [PayChangu Docs](https://developer.paychangu.com)
- [Ngrok](https://ngrok.com)
- [MongoDB Atlas](https://mongodb.com)
- [React Router](https://reactrouter.com)
- [Axios](https://axios-http.com)

---

Crafted with 💙 in Malawi 🇲🇼, By Philip Maulidi
