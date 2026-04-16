#  POS Billing System

A Full Stack Point of Sale (POS) Billing Application built using MERN Stack (MongoDB, Express, React, Node.js).
This system helps shops manage products, billing, invoices, and sales analytics efficiently.

🚀 Features
- Authentication

Secure Login / Logout

JWT Authentication

Protected Routes

📦 Product Management

Add Products

Edit Products

Delete Products

Product Search

Stock Management

🛒 Billing System

Add products to cart

Select quantity

Automatic price calculation

GST calculation

Multiple payment modes

💳 Payment Methods

Cash

UPI

Card

🧾 Invoice Generator

Auto generated Invoice Number

Download PDF Invoice

Shows:

Shop details

Customer name

Product list

Total amount

Payment method

Date

📊 Dashboard

Today's Sales

Weekly Sales Chart

Recent Sales

📜 Sales History

View all invoices

Search by:

Invoice Number

Customer Name

Download invoice PDF

Revenue and orders summary

⚙️ Settings Page

Store shop information:

Shop Name

GST Number

Shop Address

Used in invoice generation.

🛠 Tech Stack
Frontend

React.js

Axios

React Router

Tailwind CSS

Recharts (for charts)

Backend

Node.js

Express.js

MongoDB

Mongoose

JWT Authentication

PDFKit (Invoice PDF)

📂 Project Structure
POS-Billing-System
│
├── client
│   ├── components
│   ├── pages
│   ├── context
│   └── App.jsx
│
├── server
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── middleware
│   ├── utils
│   │   └── generateInvoice.js
│   └── server.js
│
└── README.md
⚙️ Installation
1️⃣ Clone Repository
git clone https://github.com/Rb-rohit/pos-billing-system.git
2️⃣ Install Backend Dependencies
cd server
npm install
3️⃣ Install Frontend Dependencies
cd client
npm install
▶️ Run the Application
Start Backend
cd server
npm run dev

Server runs on:

http://localhost:5000
Start Frontend
cd client
npm run dev

Frontend runs on:

http://localhost:5173

👨‍💻 Author

Rohit Bodalkar

LinkedIn:
www.linkedin.com/in/rohit-bodalkar-539472391
