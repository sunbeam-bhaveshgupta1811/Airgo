# ✈️ Airline Reservation System

A full-stack Airline Reservation System built with **React.js** (frontend) and **Spring Boot** (backend). Users can search flights, book tickets, add passengers, make payments, and receive email confirmations. Admins can manage airlines, flights, schedules, bookings, and view analytics.

---

## ⚡ How to Run the Project

### Prerequisites

Make sure these are installed before starting:

| Tool | Version | Download |
|---|---|---|
| Java | 17+ | https://adoptium.net |
| Maven | 3.8+ | https://maven.apache.org |
| MySQL | 8+ | https://dev.mysql.com |
| Node.js | 18+ | https://nodejs.org |
| npm | 9+ | comes with Node.js |

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/yourusername/airline-reservation-system.git
cd airline-reservation-system
```

---

### Step 2 — Set Up MySQL Database

Open MySQL Workbench or terminal and run:

```sql
CREATE DATABASE airline_db;
```

---

### Step 3 — Configure Backend

Open `backend/src/main/resources/application.properties` and update these values:

```properties
# ── Database ──────────────────────────────────────────────────────
spring.datasource.url=jdbc:mysql://localhost:3306/airline_db?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD

# ── JWT ───────────────────────────────────────────────────────────
jwt.secret=YourSuperSecretKeyMustBeAtLeast32CharactersLong!
jwt.expiration=86400000

# ── Gmail SMTP (for email verification + notifications) ───────────
spring.mail.username=your_gmail@gmail.com
spring.mail.password=your_16_char_app_password

# ── App base URL (used inside email links) ────────────────────────
app.base-url=http://localhost:8080
```

> **How to get Gmail App Password:**
> 1. Go to your Google Account → Security
> 2. Enable **2-Step Verification**
> 3. Go to **App Passwords**
> 4. Select app: Mail → Generate
> 5. Copy the 16-character password into `spring.mail.password`

---

### Step 4 — Run the Backend

```bash
cd backend
mvn spring-boot:run
```

```
✅ Backend  →  http://localhost:8080
✅ Swagger  →  http://localhost:8080/swagger-ui.html
```

---

### Step 5 — Configure Frontend

Open `frontend/src/config.js` and verify:

```js
export const config = {
  serverURL: "http://localhost:8080"
}
```

---

### Step 6 — Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

```
✅ Frontend  →  http://localhost:5173
```

---

### Step 7 — Create Admin User

Register a normal account through the app, then promote it to ADMIN in MySQL:

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'your_admin_email@gmail.com';
```

Now log in with that email at `/admin/login` to access the Admin Dashboard.

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| React Router v6 | Client-side routing |
| Axios | HTTP requests to backend |
| Bootstrap 5 | Styling and layout |
| React Toastify | Success/error notifications |
| Vite | Build tool and dev server |

### Backend
| Technology | Purpose |
|---|---|
| Java 17 | Language |
| Spring Boot 3.5 | Framework |
| Spring Security + JWT | Auth and authorization |
| Spring Data JPA | Database ORM |
| MySQL 8 | Relational database |
| JavaMailSender | Email sending via Gmail SMTP |
| Springdoc OpenAPI | Swagger documentation |
| Lombok | Reduces boilerplate code |

---

## 🗂 Frontend Structure

```
frontend/src/
│
├── config.js                           ← Backend base URL
├── App.jsx                             ← All routes
├── main.jsx                            ← React entry point
│
├── contents/
│   └── authContents.js                 ← AuthContext (JWT + user state)
│
├── pages/
│   │
│   ├── Home.jsx                        ← Public landing page
│   │
│   ├── auth/
│   │   ├── Register.jsx                ← Signup form
│   │   ├── ForgetPassword.jsx          ← Enter email → get reset link
│   │   ├── ResetPasswordPage.jsx       ← Reset using token from email
│   │   ├── VerifyEmailPage.jsx         ← Auto-verifies account from email link
│   │   ├── VerifyFailed.jsx            ← Shown when verification link is expired
│   │   └── ProtectedRoute.jsx          ← Redirects unauthenticated users
│   │
│   ├── customer/
│   │   ├── auth/Login.jsx              ← Customer login
│   │   ├── FlightSearch.jsx            ← Search by origin, destination, date
│   │   ├── FlightList.jsx              ← Search results with available seats
│   │   ├── BookingPreview.jsx          ← Review before confirming booking
│   │   ├── PassengerDetails.jsx        ← Add passenger name, DOB, ID proof
│   │   ├── Payment.jsx                 ← Select payment method and pay
│   │   ├── TicketPage.jsx              ← Confirmation + download PDF ticket
│   │   └── ChangePassword.jsx          ← Change password while logged in
│   │
│   ├── admin/
│   │   ├── auth/Login.jsx              ← Admin login
│   │   ├── AdminLayout.jsx             ← Sidebar + layout wrapper
│   │   ├── AirlineManagement.jsx       ← View, add, deactivate airlines
│   │   ├── AddAirline.jsx              ← Add new airline form
│   │   ├── FlightManagement.jsx        ← View, add, deactivate flights
│   │   ├── Addflight.jsx               ← Add new flight form
│   │   ├── ScheduleFight.jsx           ← View all schedules
│   │   ├── AddScheduleFlight.jsx       ← Add flight schedule form
│   │   └── PassengersList.jsx          ← Passengers per flight/booking
│   │
│   ├── dashboards/
│   │   └── AdminDashboard.jsx          ← Stats: airlines, flights, bookings, revenue
│   │
│   └── feedback/
│       └── CustomerFeedback.jsx        ← Customer submits rating + comment
│
├── components/
│   ├── HomeNavbar.jsx                  ← Navbar for public pages
│   ├── AdminNavbar.jsx                 ← Navbar for admin panel
│   ├── Profile.jsx                     ← User profile view + edit
│   ├── PerformanceChart.jsx            ← Revenue/booking chart (admin dashboard)
│   ├── About.jsx                       ← About page
│   ├── ContactUs.jsx                   ← Contact form
│   ├── Faq.jsx                         ← FAQ accordion
│   ├── footer.jsx                      ← Footer
│   └── auth/
│       └── BaseLogin.jsx               ← Shared login form (used by customer + admin)
│
└── services/
    ├── auth/
    │   └── user.js                     ← signup, login, verify, forgot/reset password
    │
    ├── AdminServices/
    │   ├── airlineManagementServies.js  ← fetchAllAirlines, addAirline, deactivateAirline
    │   ├── AddFlightService.js          ← createFlight, fetchAllFlights, deactivateFlight
    │   ├── adminDashboardServices.js    ← getDashboardStats, counts, revenue
    │   ├── AdminProfile.js             ← admin profile fetch
    │   └── feedback.js                 ← admin view all feedback
    │
    └── customerService/
        ├── flightSearchService.js       ← searchFlights(from, to, date, passengers)
        ├── bookingService.js            ← createBooking, addPassengers, makePayment, cancel
        ├── paymentService.js            ← processPayment, getPaymentByBookingId
        ├── profile.js                   ← getProfileData, updateProfileData
        └── ticketService.js             ← getBookingById, generateTicketPDF
```

---

## 🗄 Database Tables

| Table | Description |
|---|---|
| `users` | User accounts — email, password (BCrypt), role, email verification token |
| `airlines` | Airline master — name, IATA code, country, ACTIVE/INACTIVE status |
| `airports` | Airport master — IATA code (DEL, BOM), city, country |
| `flights` | Static route — airline + origin + destination + duration |
| `flight_schedules` | Dynamic schedule — date, time, price, available seats per flight |
| `bookings` | User booking — links user + schedule, tracks PENDING→CONFIRMED status |
| `passengers` | One row per passenger — name, DOB, ID proof, seat number |
| `payments` | One row per booking — transaction ID, method, SUCCESS/FAILED/REFUNDED |

---

## 🔗 API Endpoints

### 🔐 Auth `/api/auth/**` — Public

| Method | URL | Description |
|---|---|---|
| `POST` | `/api/auth/signup` | Register new user — sends verification email |
| `POST` | `/api/auth/login` | Login — returns JWT token |
| `GET` | `/api/auth/verify-email?token=` | Activate account from email link |
| `POST` | `/api/auth/resend-verification?email=` | Resend verification email |
| `POST` | `/api/auth/forgot-password` | Send password reset link to email |
| `POST` | `/api/auth/reset-password` | Reset password using token from email |

---

### ✈️ Airlines

| Method | URL | Role | Description |
|---|---|---|---|
| `POST` | `/admin/airlines` | ADMIN | Add new airline |
| `PUT` | `/admin/airlines/{id}` | ADMIN | Update airline |
| `PATCH` | `/admin/airlines/{id}/deactivate` | ADMIN | Soft delete (INACTIVE) |
| `PATCH` | `/admin/airlines/{id}/reactivate` | ADMIN | Re-enable airline |
| `GET` | `/admin/airlines` | ADMIN | All airlines (active + inactive) |
| `GET` | `/api/airlines` | Public | Active airlines only |
| `GET` | `/api/airlines/{id}` | Public | Single airline |

---

### 🛫 Flights

| Method | URL | Role | Description |
|---|---|---|---|
| `POST` | `/admin/flights` | ADMIN | Add flight |
| `PUT` | `/admin/flights/{id}` | ADMIN | Update flight |
| `PATCH` | `/admin/flights/{id}/deactivate` | ADMIN | Deactivate |
| `PATCH` | `/admin/flights/{id}/reactivate` | ADMIN | Reactivate |
| `GET` | `/admin/flights` | ADMIN | All flights |
| `GET` | `/admin/flights/airline/{id}` | ADMIN | Flights by airline |
| `GET` | `/api/flights` | Public | Active flights |
| `GET` | `/api/flights/{id}` | Public | Single flight |

---

### 📅 Schedules

| Method | URL | Role | Description |
|---|---|---|---|
| `POST` | `/admin/schedules` | ADMIN | Add schedule |
| `PUT` | `/admin/schedules/{id}` | ADMIN | Update schedule |
| `PATCH` | `/admin/schedules/{id}/cancel` | ADMIN | Cancel schedule |
| `PATCH` | `/admin/schedules/{id}/status?status=DELAYED` | ADMIN | Update status |
| `GET` | `/admin/schedules` | ADMIN | All schedules |
| `GET` | `/admin/schedules/{id}` | ADMIN | Schedule by ID |
| `GET` | `/admin/schedules/flight/{id}` | ADMIN | By flight |
| `POST` | `/api/flights/search` | Public | Search available flights |
| `GET` | `/api/flights/schedules/{id}` | Public | Schedule details |

---

### 🎫 Bookings

| Method | URL | Role | Description |
|---|---|---|---|
| `POST` | `/bookings/create` | USER | Create booking |
| `POST` | `/bookings/{id}/passengers` | USER | Add passengers |
| `GET` | `/bookings/my` | USER | My all bookings |
| `GET` | `/bookings/{id}` | USER | Booking by ID |
| `GET` | `/bookings/reference/{ref}` | USER | By reference number |
| `PATCH` | `/bookings/{id}/cancel` | USER | Cancel booking |
| `GET` | `/admin/bookings` | ADMIN | All bookings |
| `PATCH` | `/admin/bookings/{id}/cancel` | ADMIN | Cancel any booking |

---

### 💳 Payments

| Method | URL | Role | Description |
|---|---|---|---|
| `POST` | `/payments/pay` | USER | Make payment |
| `GET` | `/payments/booking/{id}` | USER | Payment by booking |
| `GET` | `/payments/transaction/{txnId}` | USER | By transaction ID |
| `GET` | `/admin/payments` | ADMIN | All payments |
| `PATCH` | `/admin/payments/{id}/refund` | ADMIN | Refund payment |

---

### 👥 Passengers

| Method | URL | Role | Description |
|---|---|---|---|
| `GET` | `/bookings/{id}/passengers` | USER | My booking's passengers |
| `GET` | `/passengers/{id}` | USER | Single passenger |
| `GET` | `/admin/passengers` | ADMIN | All passengers |
| `GET` | `/admin/passengers/schedule/{id}` | ADMIN | By schedule |
| `GET` | `/admin/bookings/{id}/passengers` | ADMIN | Any booking's passengers |

---

### 🪑 Seat Assignment

| Method | URL | Role | Description |
|---|---|---|---|
| `GET` | `/bookings/{id}/seats` | USER | My assigned seats |
| `POST` | `/admin/seats/assign/{bookingId}` | ADMIN | Trigger seat assignment |
| `PATCH` | `/admin/seats/passenger/{id}?seat=12A` | ADMIN | Manually assign seat |
| `PATCH` | `/admin/seats/reassign/{bookingId}` | ADMIN | Reassign all seats |
| `GET` | `/admin/seats/map/{scheduleId}` | ADMIN | Full seat map |
| `GET` | `/admin/seats/booking/{id}` | ADMIN | Seats for any booking |

---

## 🎫 Booking Flow

```
Step 1  →  POST /api/flights/search
           { originCode: "DEL", destinationCode: "BOM",
             journeyDate: "2026-06-10", passengers: 2 }

Step 2  →  POST /bookings/create
           { scheduleId: 5, numberOfPassengers: 2 }
           ← Returns bookingId, status: PENDING

Step 3  →  POST /bookings/{id}/passengers
           [ { firstName, lastName, gender, dateOfBirth, idType, idNumber } ]

Step 4  →  POST /payments/pay
           { bookingId: 12, paymentMethod: "UPI" }
           ← booking → CONFIRMED
           ← seats auto-assigned (11A, 11B)
           ← confirmation email sent

Step 5  →  GET /bookings/{id}/seats     (view seat numbers)
           GET /bookings/{id}/pdf       (download PDF ticket)
```

---

## 🪑 Seat Layout

```
Rows  1 –  4   →  Business Class      (24 seats)
Rows  5 – 10   →  Premium Economy     (36 seats)
Rows 11 – 40   →  Economy Class       (180 seats)
Columns: A  B  C  D  E  F
```

Seats are auto-assigned from Economy row 11 onwards after payment. Admin can override via `PATCH /admin/seats/passenger/{id}?seat=12A`.

---

## 📧 Email Notifications

| Trigger | Email Sent |
|---|---|
| User registers | Verification link (valid 24h) |
| Forgot password requested | Reset link (valid 1h) |
| Password reset done | Password changed confirmation |
| Payment SUCCESS | Booking confirmation with seat numbers and flight details |
| Booking cancelled | Cancellation notice + refund timeline |
| Payment FAILED | Failure reason + retry link |

---

## 🛡 Access Control

| URL Pattern | Who |
|---|---|
| `/api/auth/**` | Everyone (no token) |
| `/api/airlines/**` | Everyone (no token) |
| `/api/airports/**` | Everyone (no token) |
| `/api/flights/**` | Everyone (no token) |
| `/user/**` | Logged-in user |
| `/bookings/**` | Logged-in user |
| `/payments/**` | Logged-in user |
| `/passengers/**` | Logged-in user |
| `/admin/**` | ADMIN role only |

Every protected request needs this header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

---

## 📖 Swagger UI

```
http://localhost:8080/swagger-ui.html
```

**To test protected endpoints in Swagger:**
1. Call `POST /api/auth/login` → copy the `token` value from response
2. Click **Authorize** button (top right)
3. Paste: `Bearer your_token_here`
4. Click Authorize → Close
5. All protected endpoints now work

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourlinkedin)

---

## 📄 License

This project is open source under the [MIT License](LICENSE).
