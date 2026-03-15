# Resort Booking System - Backend Architecture & API Design

## 1. Overview
This backend service manages a resort booking platform with multi-role access control. It handles resort listings, user bookings, payments (sales tracking), and administrative dashboards.

## 2. Technology Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens) + OTP (Email-based)
- **Utilities**: 
  - `bcryptjs`: Password hashing
  - `nodemailer`: Sending OTP via email
  - `mysql2`: Database driver (or Sequelize ORM)
  - `dotenv`: Environment variable management

## 3. Database Schema (MySQL)

### `users` Table
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | INT (PK) | Unique User ID |
| `name` | VARCHAR | Full Name |
| `email` | VARCHAR (Unique) | User Email |
| `password` | VARCHAR | Hashed Password |
| `role` | ENUM | 'admin', 'owner', 'user' |
| `otp` | VARCHAR | Temporary OTP for verification |
| `otp_expires` | DATETIME | OTP Expiry time |
| `is_verified` | BOOLEAN | Email verification status |
| `created_at` | TIMESTAMP | Record creation time |

### `resorts` Table
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | INT (PK) | Unique Resort ID |
| `owner_id` | INT (FK) | Reference to `users.id` (Owner) |
| `name` | VARCHAR | Resort Name |
| `description` | TEXT | Resort Details |
| `location` | VARCHAR | Address/Location |
| `price_per_night` | DECIMAL | Booking Price |
| `images` | JSON | Array of image URLs |
| `status` | ENUM | 'active', 'inactive', 'pending' |
| `created_at` | TIMESTAMP | Record creation time |

### `bookings` Table
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | INT (PK) | Unique Booking ID |
| `user_id` | INT (FK) | Reference to `users.id` (Customer) |
| `resort_id` | INT (FK) | Reference to `resorts.id` |
| `check_in` | DATE | |
| `check_out` | DATE | |
| `total_price` | DECIMAL | Total revenue from booking |
| `status` | ENUM | 'pending', 'confirmed', 'cancelled', 'completed' |
| `created_at` | TIMESTAMP | |

## 4. API Endpoints

### 4.1 Authentication & Profile
- `POST /api/auth/register` : User registration (triggers OTP).
- `POST /api/auth/verify-otp` : Verify email with OTP.
- `POST /api/auth/login` : Login with Email/Password (returns JWT).
- `GET /api/auth/me` : Get current user profile.

### 4.2 Admin Features (Admin Only)
- `GET /api/admin/dashboard` : Overall statistics (Total users, total resorts, total sales).
- `GET /api/admin/sales` : Detailed sales reports across all resorts.
- `GET /api/admin/resorts` : View all resorts (including pending/inactive).
- `PATCH /api/admin/resorts/:id/status` : Approve/Deactivate resorts.

### 4.3 Resort Owner Features (Owner/Admin)
- `POST /api/owner/resorts` : Post a new resort listing.
- `GET /api/owner/resorts` : View resorts owned by the current logged-in owner.
- `PUT /api/owner/resorts/:id` : Update resort details.
- `GET /api/owner/sales` : View sales/bookings specifically for their resorts.

### 4.4 User/Customer Features
- `GET /api/resorts` : List all active resorts (Public).
- `GET /api/resorts/:id` : View resort details (Public).
- `POST /api/bookings` : Book a resort (Authenticated User).
- `GET /api/bookings/my` : View user's own booking history.

## 5. Security & Middleware
- **JWT Middleware**: Validates token and attaches `req.user`.
- **Role-Based Access Control (RBAC)**: Checks `req.user.role` to allow/deny access to specific routes.
- **OTP Logic**:
  1. User registers/requests login.
  2. System generates 6-digit OTP, stores it in DB with expiry.
  3. System sends OTP via Nodemailer.
  4. User submits OTP to `/verify-otp`.
  5. If valid, `is_verified` set to true / User logged in.

## 6. Project Structure (Proposed)
## 7. Database Creation (SQL Queries)

You can use the following SQL queries to manually create the database and tables in MySQL.

```sql
-- 1. Create the Database
CREATE DATABASE IF NOT EXISTS resort_booking;
USE resort_booking;

-- 2. Create Users Table
CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'owner', 'user') DEFAULT 'user',
    otp VARCHAR(10) NULL,
    otpExpires DATETIME NULL,
    isVerified BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Create Resorts Table
CREATE TABLE IF NOT EXISTS Resorts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    pricePerNight DECIMAL(10, 2) NOT NULL,
    images JSON NULL,
    status ENUM('active', 'inactive', 'pending') DEFAULT 'pending',
    ownerId INT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ownerId) REFERENCES Users(id) ON DELETE CASCADE
);

-- 4. Create Bookings Table
CREATE TABLE IF NOT EXISTS Bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    checkIn DATE NOT NULL,
    checkOut DATE NOT NULL,
    totalPrice DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
    resortId INT,
    userId INT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (resortId) REFERENCES Resorts(id) ON DELETE CASCADE,
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
);
```
