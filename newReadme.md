# Smart Stock Inventory System — Presentation

## Slide 1 — Title
- Smart Stock Inventory System
- Inventory, Sales, Alerts, Reporting
- Your Name | Date

## Slide 2 — Problem Statement
- Manual stock tracking causes errors and stockouts
- No real-time visibility for admins
- Reports and analytics are hard to generate

## Slide 3 — Objectives
- Centralized inventory management
- Secure login and role-based access
- Low-stock alerts and notifications
- Sales tracking and analytics
- Exportable reports (CSV/PDF)

## Slide 4 — High-Level Architecture
- Frontend: React (Vite) SPA
- Backend: Flask REST API
- Database: MongoDB (users, products, sales, transactions)
- Optional integrations: Email (SMTP), SMS (Twilio), OpenAI Assistant

## Slide 5 — Tech Stack (Actual Code)
- Backend: Flask, PyMongo, JWT, bcrypt
- Frontend: React, react-router-dom, Axios
- Database: MongoDB
- Reporting: reportlab for PDF export

## Slide 6 — Core Modules (Overview)
- Authentication & User Management
- Inventory Management
- Transactions (Purchase/Sale)
- Reports (CSV/PDF)
- Sales Analytics
- Alerts & Notifications
- Smart Assistant (optional AI)

## Slide 7 — Module 1: Authentication
- Register/Login with JWT tokens
- Password hashing using bcrypt
- Role-based access (admin, employee)
- Forgot/Reset password via email token

## Slide 8 — Module 2: Inventory
- Add/Edit/Delete products
- Category, supplier, price, quantity
- Stock policy fields: reorder point, min, max
- Pagination for performance

## Slide 9 — Module 3: Transactions
- Record Purchase (stock in) / Sale (stock out)
- Auto-updates product quantity
- Logs who created the transaction
- Creates sales entry for analytics

## Slide 10 — Module 4: Reports
- Inventory summary
- Category breakdown and low stock list
- Export CSV for inventory, sales, low stock
- Export PDF (styled report)

## Slide 11 — Module 5: Sales Analytics
- Total revenue, items sold, orders
- 30-day trend graph data
- Top-selling products

## Slide 12 — Module 6: Alerts & Notifications
- Low-stock detection using reorder point
- Email notifications to admins
- Optional SMS via Twilio
- Alerts page in frontend

## Slide 13 — Module 7: Smart Assistant
- Built-in helper for app usage
- Local fallback answers
- Optional OpenAI API for richer responses

## Slide 14 — Frontend Pages
- Landing page, Login, Signup
- Dashboard
- Inventory
- Transactions
- Reports
- Sales Dashboard
- Low Stock Alerts
- Users (admin only)
- Profile + Settings

## Slide 15 — Data Model (MongoDB Collections)
- users
- products
- sales
- transactions
- reset_tokens

## Slide 16 — Security & Reliability
- JWT auth + token expiry
- Password hashing
- Role checks for admin endpoints
- Server-side validation
- MongoDB indexes for performance

## Slide 17 — Demo Flow (What to Show)
- Login as admin
- Add a product in Inventory
- Record a sale in Transactions
- Show low-stock alert
- Export a report (CSV/PDF)
- Open Sales Dashboard

## Slide 18 — Future Enhancements
- Supplier management
- Purchase order automation
- Barcode scanning
- Multi-branch stock
- Cloud deployment

## Slide 19 — Conclusion
- Smart Stock streamlines inventory + sales
- Real-time visibility with alerts
- Ready for scale and production upgrades

---

### Note for Presentation
- The running backend is Flask + MongoDB (not FastAPI + SQLite).
- Avoid showing any real credentials from backend/.env in the demo.
