<div align="center">

<h1>Instant Mechanic</h1>

<p><strong>Full-Stack Vehicle Service Operations Platform</strong></p>

<p>
  A modern operations dashboard for managing bookings, mechanics, customers,
  analytics, authentication, and service workflows from a single platform.
</p>

<p>
  <a href="https://github.com/Nitin07877/instant-mechanic">
    <img src="https://img.shields.io/badge/GitHub-Repository-181717?style=flat-square&logo=github" alt="GitHub" />
  </a>
  <a href="https://instant-mechanic-jfdj.onrender.com/api/docs">
    <img src="https://img.shields.io/badge/API-Swagger-85EA2D?style=flat-square&logo=swagger&logoColor=black" alt="Swagger API" />
  </a>
  <img src="https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=flat-square&logo=postgresql" alt="PostgreSQL" />
</p>

<p>
  <a href="https://instant-mechanic-jfdj.onrender.com/api/docs">API Documentation</a>
  &nbsp; • &nbsp;
  <a href="https://github.com/Nitin07877/instant-mechanic">Source Code</a>
</p>

</div>

---

<h2>Overview</h2>

Instant Mechanic is a full-stack vehicle-service management platform built to centralize operational workflows for service businesses.

The application provides a structured interface for managing service bookings, mechanics, customers, operational metrics, analytics, authentication, and administrative actions.

The project follows a decoupled architecture in which the Next.js frontend communicates with a RESTful Express backend, while Prisma provides structured access to a PostgreSQL database hosted on Neon.

### Why Instant Mechanic?

Vehicle-service operations often involve bookings, customer information, mechanics, service status updates, and business metrics being maintained across multiple systems.

Instant Mechanic brings these workflows into a single dashboard so operational data can be accessed, filtered, managed, and monitored more efficiently.

---

<h2>Key Features</h2>

<table>
  <tr>
    <th>Module</th>
    <th>Functionality</th>
  </tr>
  <tr>
    <td><strong>Dashboard</strong></td>
    <td>Operational statistics and business overview</td>
  </tr>
  <tr>
    <td><strong>Bookings</strong></td>
    <td>Search, filtering, sorting, pagination, booking details, and status management</td>
  </tr>
  <tr>
    <td><strong>Mechanics</strong></td>
    <td>Mechanic records and operational information</td>
  </tr>
  <tr>
    <td><strong>Customers</strong></td>
    <td>Customer information and service-related records</td>
  </tr>
  <tr>
    <td><strong>Analytics</strong></td>
    <td>Business and operational performance insights</td>
  </tr>
  <tr>
    <td><strong>Authentication</strong></td>
    <td>User registration, login, JWT authentication, and authenticated sessions</td>
  </tr>
  <tr>
    <td><strong>Authorization</strong></td>
    <td>Role-aware application behavior for administrative workflows</td>
  </tr>
  <tr>
    <td><strong>CSV Export</strong></td>
    <td>Export booking data for external reporting and operational use</td>
  </tr>
  <tr>
    <td><strong>API Documentation</strong></td>
    <td>Interactive Swagger/OpenAPI documentation</td>
  </tr>
</table>

---

<h2>Technology Stack</h2>

### Frontend

| Technology | Purpose |
| --- | --- |
| Next.js 16 | React-based application framework |
| React | User interface development |
| TypeScript | Static typing and maintainability |
| Tailwind CSS | Styling and responsive UI |
| shadcn/ui | Reusable UI components |
| Lucide React | Interface icons |

### Backend

| Technology | Purpose |
| --- | --- |
| Node.js | JavaScript runtime |
| Express 5 | REST API framework |
| TypeScript | Type-safe backend development |
| Prisma ORM | Database access and schema management |
| JWT | Authentication |
| bcryptjs | Password hashing |
| Swagger / OpenAPI | API documentation |
| CORS | Cross-origin API access |

### Infrastructure

| Technology | Purpose |
| --- | --- |
| PostgreSQL | Relational database |
| Neon | Managed PostgreSQL hosting |
| Render | Backend deployment |
| Vercel | Frontend deployment |
| GitHub | Source control and repository hosting |

---

<h2>Architecture</h2>

```text
                         ┌───────────────────────┐
                         │        User           │
                         └───────────┬───────────┘
                                     │
                                     ▼
                         ┌───────────────────────┐
                         │      Next.js          │
                         │   React Frontend      │
                         └───────────┬───────────┘
                                     │
                              HTTPS / REST
                                     │
                                     ▼
                         ┌───────────────────────┐
                         │      Express API      │
                         │    TypeScript         │
                         └───────────┬───────────┘
                                     │
                              Prisma ORM
                                     │
                                     ▼
                         ┌───────────────────────┐
                         │      PostgreSQL       │
                         │         Neon          │
                         └───────────────────────┘
