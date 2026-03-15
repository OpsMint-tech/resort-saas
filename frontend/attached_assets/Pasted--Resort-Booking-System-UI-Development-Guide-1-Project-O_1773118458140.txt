# Resort Booking System - UI Development Guide

## 1. Project Overview
A multi-role platform for booking resorts. It features a public-facing booking site, a Resort Owner portal for listing management, and a Super Admin dashboard for platform-wide oversight and financial tracking.

---

## 2. User Roles & Access Control

### 👤 User (Customer)
- **Permissions**: Browse resorts, book stays, view personal booking history.
- **Workflow**: Register -> Verify via OTP/Link -> Browse -> Book -> View "My Bookings".

### 🏨 Resort Owner
- **Permissions**: Post new resorts, update/delete their own resorts, view their specific sales dashboard.
- **Workflow**: Login -> Add Resort (Status: Pending) -> Wait for Admin Approval -> View Sales/Revenue.

### 🛡️ Super Admin
- **Permissions**: View platform-wide stats, approve/reject resorts, view detailed money flow across all owners.
- **Workflow**: Login -> Dashboard (Stats) -> Manage Resorts (Approve/Delete) -> Platform Ledger.

---

## 3. Screen Requirements & Data Mapping

### A. Authentication (Auth Module)
- **Register Screen**: Fields (`name`, `email`, `password`, `role`).
- **OTP/Verification Screen**: 6-digit input or success message for email links.
- **Login Screen**: Fields (`email`, `password`). Returns `token` and `user` object.

### B. User (Public) Screens
1. **Home/Search**: GET `/api/resorts` (Returns active resorts).
2. **Resort Detail**: GET `/api/resorts/:id`.
3. **Booking Form**: POST `/api/bookings` (Requires Auth Token).
4. **My Bookings**: GET `/api/bookings/my`.

### C. Owner Portal Screens
1. **Owner Dashboard**: GET `/api/bookings/owner/dashboard`.
   - **Summary Cards**: Total Resorts, Total Revenue, Confirmed vs. Pending money.
   - **Money Flow Table**: List of recent transactions with Customer Name, Date, and Stay Period.
2. **Manage Resorts**: GET `/api/resorts/my`.
3. **Add/Edit Resort Form**: POST/PUT `/api/resorts`. Fields (`name`, `description`, `location`, `pricePerNight`, `images`).

### D. Admin Dashboard Screens
1. **Global Dashboard**: GET `/api/bookings/admin/dashboard`.
   - **Metrics**: Total Users, Total Owners, Global Sales, Revenue Breakdown by Status.
   - **Master Ledger**: End-to-end money flow across all properties.
2. **Resort Approval**: GET `/api/resorts/all`.
   - Action: PATCH `/api/resorts/:id/status` (Toggle between `pending` and `active`).

---

## 4. Key Enums & Logic

### Resort Status
- `pending`: Waiting for Admin review (Hidden from public).
- `active`: Live and bookable.
- `inactive`: Temporarily hidden.

### Booking Status
- `pending`: User booked but payment/confirmation not finalized.
- `confirmed`: Payment received and stay secured.
- `cancelled`: User or Admin wiped the booking.
- `completed`: Stay date has passed.

---

## 5. Security Headers
For any screen requiring a login (Dashboard, Booking, Management), include the following header:
```javascript
{
  "Authorization": "Bearer YOUR_JWT_TOKEN"
}
```

---

## 6. Development Tips for UI team
1. **Dynamic Lists**: Use the `statusBreakdown` array from dashboards to render pie charts or bar graphs of revenue.
2. **Money Formatting**: The backend returns prices as decimals (e.g., `450.00`). Format these to local currency (e.g., `$450`).
3. **Role-Based Navigation**: Store the user's `role` from the login response to show/hide the "Owner Dashboard" or "Admin Panel" in the sidebar.
