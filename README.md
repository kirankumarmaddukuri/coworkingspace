# Co-working Space Desk Booking & Amenity Management System

 streamlined workspace reservation platform built with Spring Boot and React. Manages desk bookings, amenity reservations, role-based access control, and administrative reporting.

## Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [Getting Started](#getting-started)
- [Role-Based Access](#role-based-access)
- [Business Workflow](#business-workflow)
- [Known Limitations](#known-limitations)
- [License](#license)

---

## Tech Stack

### Backend
- **Java 17** — Object-oriented programming language
- **Spring Boot 3.2.4** — REST API framework
- **Spring Security** — Authentication & Authorization
- **Spring Data JPA** — Database ORM
- **PostgreSQL** — Primary database
- **JWT (jjwt)** — Token-based authentication
- **Maven** — Dependency management
- **Lombok** — Boilerplate code reduction
- **SpringDoc OpenAPI** — API documentation (Swagger UI)

### Frontend
- **React 19** — Component-based UI library
- **Vite 5** — Build tool and dev server
- **React Router v7** — Client-side routing
- **Axios** — HTTP client for API calls
- **Lucide React** — Icon library
- **ESLint** — Code linting

---

## Features

### Implemented
| Feature | Status | Details |
|---------|--------|---------|
| Desk/Meeting Room Booking | ✅ | Members can book desks with time-slot validation |
| Amenity Reservation | ✅ | Reserve WiFi, Projector, Parking, Locker linked to bookings |
| Space Manager Management | ✅ | Create workspaces, add desks, update availability |
| Double-Booking Prevention | ✅ | Database-level conflict detection excluding cancelled bookings |
| Admin Monitoring | ✅ | View all bookings, generate utilization reports |
| Cancel Bookings | ✅ | Members can cancel their bookings |
| Booking History | ✅ | Full audit trail via timestamps and history tables |
| Admin Reports | ✅ | Booking stats, amenity usage, desk utilization metrics |



## Project Structure

```text
mockhackathon/
├── backend/
│   ├── pom.xml
│   └── src/main/java/com/guvi/coworking/
│       ├── controller/       # REST endpoints
│       │   ├── AuthController.java
│       │   ├── BookingController.java
│       │   ├── DeskController.java
│       │   ├── AmenityController.java
│   │     ├── AmenityReservationController.java
│   │     ├── ReportController.java
│   │     ├── UserController.java
│   │     └── WorkspaceController.java
│   ├── dto/                 # Request/response objects
│   │   ├── request/
│   │   └── response/
│   ├── exception/           # Global exception handler
│   ├── model/               # JPA entities
│   │   ├── User.java
│   │   ├── Workspace.java
│   │   ├── Desk.java
│   │   ├── Booking.java
│   │   ├── Amenity.java
│   │   ├── AmenityReservation.java
│   │   └── enums/
│   ├── repository/          # Spring Data JPA repositories
│   ├── security/            # JWT filters & config
│   │   ├── jwt/
│   │   └── services/
│   └── service/             # Business logic layer
│       ├── BookingService.java
│       ├── DeskService.java
│       ├── AmenityService.java
│       ├── AmenityReservationService.java
│       └── WorkspaceService.java
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── eslint.config.js
│   └── src/
│       ├── components/      # Reusable UI components
│       │   ├── Layout.jsx
│       │   └── Sidebar.jsx
│       ├── context/         # React context (auth)
│       │   └── AuthContext.jsx
│       ├── pages/           # Route components
│       │   ├── Login.jsx
│       │   ├── Signup.jsx
│       │   ├── MemberDashboard.jsx
│       │   ├── MyBookings.jsx
│       │   ├── BookingCalendar.jsx
│       │   ├── Workspaces.jsx
│       │   ├── WorkspaceDetail.jsx
│       │   ├── ManagerDashboard.jsx
│       │   ├── SpaceManagement.jsx
│       │   ├── AmenityApproval.jsx
│       │   ├── AdminDashboard.jsx
│       │   └── UserManagement.jsx
│       ├── services/        # API service layer
│       │   └── api.js
│       ├── App.jsx          # Router configuration
│       └── main.jsx         # Entry point
├── README.md
└── .gitignore
```

---

## Database Schema

### Core Entities

#### Users
| Field | Type | Description |
|-------|------|-------------|
| id | BIGINT (PK) | Unique identifier |
| name | VARCHAR | Full name |
| email | VARCHAR (Unique) | Login identifier |
| password | VARCHAR | BCrypt hashed |
| phoneNumber | VARCHAR | Contact number |
| role | ENUM | ADMIN, MEMBER, SPACE_MANAGER |
| createdAt | TIMESTAMP | Record creation time |

#### Workspaces
| Field | Type | Description |
|-------|------|-------------|
| id | BIGINT (PK) | Unique identifier |
| workspaceName | VARCHAR | Name of workspace |
| location | VARCHAR | Physical address |
| totalDesks | INTEGER | Capacity |
| availableDesks | INTEGER | Current availability |
| status | ENUM | ACTIVE, FULL, INACTIVE |
| createdBy | BIGINT (FK → users) | Manager who created |
| createdAt | TIMESTAMP | Record creation time |

#### Desks
| Field | Type | Description |
|-------|------|-------------|
| id | BIGINT (PK) | Unique identifier |
| workspaceId | BIGINT (FK → workspaces) | Parent workspace |
| deskNumber | VARCHAR | Unique desk identifier |
| deskType | ENUM | HOT_DESK, DEDICATED_DESK |
| availabilityStatus | ENUM | AVAILABLE, RESERVED, OCCUPIED, UNAVAILABLE |
| createdAt | TIMESTAMP | Record creation time |

#### Bookings
| Field | Type | Description |
|-------|------|-------------|
| id | BIGINT (PK) | Unique identifier |
| userId | BIGINT (FK → users) | Member who booked |
| deskId | BIGINT (FK → desks) | Reserved desk |
| bookingDate | DATE | Date of booking |
| startTime | TIME | Start hour |
| endTime | TIME | End hour |
| bookingStatus | ENUM | REQUESTED, CONFIRMED, IN_USE, COMPLETED, CANCELLED |
| createdAt | TIMESTAMP | When booking was made |
| updatedAt | TIMESTAMP | Last status change |

#### Amenities
| Field | Type | Description |
|-------|------|-------------|
| id | BIGINT (PK) | Unique identifier |
| amenityName | VARCHAR | e.g., WiFi, Projector |
| description | TEXT | Optional details |
| availabilityStatus | ENUM | AVAILABLE, RESERVED, UNAVAILABLE |
| createdAt | TIMESTAMP | Record creation time |

#### AmenityReservations
| Field | Type | Description |
|-------|------|-------------|
| id | BIGINT (PK) | Unique identifier |
| bookingId | BIGINT (FK → bookings) | Linked booking |
| amenityId | BIGINT (FK → amenities) | Reserved amenity |
| reservationDate | DATE | Date of use |
| reservationStatus | ENUM | REQUESTED, APPROVED, REJECTED, COMPLETED |
| createdAt | TIMESTAMP | Record creation time |

### Indexes & Constraints
- Foreign key constraints ensure referential integrity
- `Bookings` table has composite index on `(desk_id, booking_date, start_time, end_time)` for overlap queries
- Unique constraints on desk numbers per workspace

---

## API Documentation

### Swagger UI
When the backend is running, access interactive API docs at:

```
http://localhost:8080/swagger-ui/index.html
```

OpenAPI JSON specification:

```
http://localhost:8080/v3/api-docs
```

### Authentication Flow
1. `POST /api/auth/signup` — Register new user (ADMIN only for non-self)
2. `POST /api/auth/signin` — Login, returns JWT token
3. Include token in subsequent requests:
   ```
   Authorization: Bearer <your-jwt-token>
   ```

> **Note**: Swagger UI requires manual token entry. Use the "Authorize" button in the UI.

---

## Getting Started

### Prerequisites
- Java 17+ (OpenJDK or Oracle)
- Maven 3.9+
- Node.js 18+ and npm
- PostgreSQL 14+

### 1. Clone Repository

```bash
git clone https://github.com/<your-username>/mockhackathon.git
cd mockhackathon
```

### 2. Configure PostgreSQL

Create database:

```sql
CREATE DATABASE coworking_db;
```

Update credentials in `backend/src/main/resources/application.properties` if needed:

```properties
spring.datasource.username=postgres
spring.datasource.password=your_password
```

### 3. Run Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend will start at: **http://localhost:8080**

### 4. Run Frontend

Open new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend will start at: **http://localhost:5173**

---

## Role-Based Access

### ADMIN
- Full system access
- Create/delete users
- View all bookings & reports
- Access admin dashboard

### SPACE_MANAGER
- Create & manage workspaces
- Add/edit desks
- Approve/reject amenity reservations
- View all bookings

### MEMBER
- Browse available workspaces
- Book desks (request → confirm)
- Cancel own bookings
- Reserve amenities
- View personal booking history

---

## Business Workflow

### Desk Booking Flow

```
MEMBER selects desk & time 
    ↓
Booking Status: REQUESTED → Desk Status: RESERVED
    ↓
SPACE_MANAGER confirms booking (optional auto-confirm could be added)
    ↓
Booking Status: CONFIRMED
    ↓
Member uses desk → Booking Status: IN_USE
    ↓
Booking ends → Booking Status: COMPLETED
```

### Amenity Reservation Flow

```
MEMBER requests amenity during booking
    ↓
Amenity Status: RESERVED → Reservation Status: REQUESTED
    ↓
SPACE_MANAGER reviews & APPROVES/REJECTS
    ↓
If APPROVED → Reservation Status: APPROVED → Amenity used → COMPLETED
If REJECTED → Reservation Status: REJECTED → Amenity released to AVAILABLE
```

### Conflict Prevention

System prevents overlapping bookings using time-range query:

```sql
SELECT COUNT(*) > 0 FROM bookings
WHERE desk_id = ?
  AND booking_date = ?
  AND start_time < ?
  AND end_time > ?
  AND booking_status NOT IN ('CANCELLED')
```

---

## API Endpoint Summary

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/signup` | PUBLIC | Register user |
| POST | `/api/auth/signin` | PUBLIC | Login |
| POST | `/api/auth/password/change` | MEMBER+ | Change password |

### Users (Admin only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List all users |
| GET | `/api/users?role=MEMBER` | Filter by role |
| POST | `/api/users` | Create user |
| DELETE | `/api/users/{id}` | Delete user |

### Workspaces
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/workspaces` | SPACE_MANAGER | Create workspace |
| GET | `/api/workspaces` | ALL | List workspaces |
| GET | `/api/workspaces/{id}` | ALL | Workspace details |

### Desks
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/desks?workspaceId=1` | SPACE_MANAGER | Add desk |
| GET | `/api/desks?workspaceId=1` | ALL | List desks in workspace |
| PUT | `/api/desks/{id}/status?status=AVAILABLE` | SPACE_MANAGER | Update status |
| PUT | `/api/desks/{id}` | SPACE_MANAGER | Edit desk details |

### Bookings
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/bookings` | MEMBER | Create booking |
| PUT | `/api/bookings/{id}/cancel` | MEMBER | Cancel booking |
| PUT | `/api/bookings/{id}/confirm` | SPACE_MANAGER | Confirm booking |
| GET | `/api/bookings` | ADMIN+ | All bookings |
| GET | `/api/bookings/my` | MEMBER | My bookings |

### Amenities
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/amenities` | SPACE_MANAGER | Create amenity |
| GET | `/api/amenities` | ALL | List all amenities |
| GET | `/api/amenities/available` | ALL | List available only |

### Amenity Reservations
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/amenity-reservations?bookingId=1&amenityId=2` | MEMBER | Request amenity |
| PUT | `/api/amenity-reservations/{id}/approve` | SPACE_MANAGER | Approve request |
| PUT | `/api/amenity-reservations/{id}/reject` | SPACE_MANAGER | Reject request |
| GET | `/api/amenity-reservations` | SPACE_MANAGER+ | All reservations |
| GET | `/api/amenity-reservations/booking/{id}` | ALL | By booking |

### Reports (Admin only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports/booking-stats` | Bookings per workspace |
| GET | `/api/reports/amenity-stats` | Usage per amenity |
| GET | `/api/reports/utilization` | Overall desk utilization % |

---

