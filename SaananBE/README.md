# Saanan - IT Services Backend API

A comprehensive, production-ready **ASP.NET Core Web API** backend for a dynamic IT Services website. Built with **Clean Architecture**, **Repository/Service pattern**, **JWT authentication**, and **Entity Framework Core** with SQL Server.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    ITServices.API                         │
│         (Controllers, Middleware, Extensions)             │
├─────────────────────────────────────────────────────────┤
│                 ITServices.Application                    │
│     (Services, DTOs, Interfaces, Validators, Mappings)   │
├─────────────────────────────────────────────────────────┤
│                 ITServices.Infrastructure                 │
│   (DbContext, Repositories, EF Configs, Email, Seeder)   │
├─────────────────────────────────────────────────────────┤
│                   ITServices.Domain                       │
│            (Entities, Enums, Interfaces)                  │
└─────────────────────────────────────────────────────────┘
```

**Pattern:** Clean Architecture with Dependency Injection, Repository/Service pattern, and RESTful API design.

---

## 🚀 Features

### Public APIs
| Module | Endpoints | Description |
|--------|-----------|-------------|
| Services | `GET /api/services` | Browse active IT services with category filtering |
| Service Categories | `GET /api/service-categories` | List categories with nested services |
| Leads | `POST /api/leads` | Submit project inquiry/lead |
| Contact Messages | `POST /api/contact-messages` | Submit contact form |
| Blogs | `GET /api/blogs` | Public blog listing and detail |
| FAQs | `GET /api/faqs` | Frequently asked questions |
| Testimonials | `GET /api/testimonials` | Client testimonials |
| Portfolio | `GET /api/portfolio` | Showcase projects |
| Newsletter | `POST /api/newsletter` | Subscribe/unsubscribe |
| Site Content | `GET /api/content` | Dynamic website content sections |

### Admin APIs (JWT Protected)
| Module | Endpoints | Description |
|--------|-----------|-------------|
| Authentication | `POST /api/auth/login` | Admin login with JWT token |
| | `POST /api/auth/refresh-token` | Refresh expired tokens |
| | `POST /api/auth/change-password` | Change admin password |
| Admin Services | `CRUD /api/admin/services` | Manage IT services |
| Admin Categories | `CRUD /api/admin/service-categories` | Manage service categories |
| Admin Leads | `GET/PUT/DELETE /api/admin/leads` | Manage leads & update status |
| Admin Contacts | `GET/DELETE /api/admin/contact-messages` | View & manage contact messages |
| Admin Blogs | `CRUD /api/admin/blogs` | Manage blog posts |
| Admin FAQs | `CRUD /api/admin/faqs` | Manage FAQs |
| Admin Testimonials | `CRUD /api/admin/testimonials` | Manage testimonials |
| Admin Portfolio | `CRUD /api/admin/portfolio` | Manage portfolio projects |
| Admin Content | `PUT /api/admin/content` | Update site content |
| Admin Newsletter | `GET/DELETE /api/admin/newsletter` | Manage subscribers |
| Analytics Dashboard | `GET /api/admin/analytics` | Dashboard summary metrics |
| Query Classification | `POST /api/admin/query-classification` | AI-powered query categorization |
| Proposal Summary | `POST /api/admin/proposals` | Generate project proposals |

### Core Features
- ✅ **JWT Authentication** with refresh token support
- ✅ **Role-based Authorization** for admin endpoints
- ✅ **Rate Limiting** on public endpoints (5 req/min for submissions)
- ✅ **CORS** configured for Angular frontend
- ✅ **FluentValidation** for request validation
- ✅ **AutoMapper** for entity-to-DTO mapping
- ✅ **Global Exception Handling** middleware
- ✅ **Swagger/OpenAPI** with Public/Admin API grouping
- ✅ **Email Notifications** for leads and contact messages
- ✅ **Database Seeding** with sample data
- ✅ **Pagination** on list endpoints
- ✅ **Slug-based URLs** for SEO-friendly routing
- ✅ **AI Query Classification** (rule-based with AI extension points)
- ✅ **Proposal Summary Generator** with timeline/budget estimation

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| .NET 10 | Runtime framework |
| ASP.NET Core Web API | HTTP API framework |
| Entity Framework Core 10 | ORM / Data access |
| SQL Server (LocalDB) | Database |
| FluentValidation | Request validation |
| AutoMapper | Object mapping |
| BCrypt.Net | Password hashing |
| JWT Bearer | Authentication |
| Swashbuckle | Swagger/OpenAPI documentation |

---

## 📁 Project Structure

```
Saanan/
├── ITServices.slnx                          # Solution file
├── src/
│   ├── ITServices.API/                      # Web API Layer
│   │   ├── Controllers/
│   │   │   ├── Public/                      # Public-facing controllers
│   │   │   └── Admin/                       # Admin (JWT-protected) controllers
│   │   ├── Extensions/                      # DI registration extensions
│   │   ├── Middleware/                      # Exception handling middleware
│   │   ├── Properties/                      # Launch settings
│   │   ├── Program.cs                       # App entry point
│   │   ├── appsettings.json                 # Configuration
│   │   └── appsettings.Development.json     # Dev configuration
│   │
│   ├── ITServices.Application/              # Business Logic Layer
│   │   ├── DTOs/                            # Data Transfer Objects
│   │   │   ├── Auth/
│   │   │   ├── Services/
│   │   │   ├── ServiceCategories/
│   │   │   ├── Leads/
│   │   │   ├── ContactMessages/
│   │   │   ├── Blogs/
│   │   │   ├── Faqs/
│   │   │   ├── Testimonials/
│   │   │   ├── Portfolio/
│   │   │   ├── Content/
│   │   │   ├── Newsletter/
│   │   │   ├── Analytics/
│   │   │   ├── QueryClassification/
│   │   │   ├── ProposalSummary/
│   │   │   ├── EmailNotifications/
│   │   │   └── Common/                     # ApiResponse<T>, PaginatedResult
│   │   ├── Helpers/                         # SlugHelper
│   │   ├── Interfaces/                      # Service interfaces
│   │   ├── Mappings/                        # AutoMapper profiles
│   │   ├── Services/                        # Service implementations
│   │   └── Validators/                      # FluentValidation validators
│   │
│   ├── ITServices.Domain/                   # Domain Layer
│   │   ├── Entities/                        # Domain entities
│   │   ├── Enums/                           # LeadStatus, ContentType, etc.
│   │   └── Interfaces/                      # Repository interfaces
│   │
│   └── ITServices.Infrastructure/           # Data Access Layer
│       ├── Data/
│       │   ├── ApplicationDbContext.cs      # EF Core DbContext
│       │   └── DatabaseSeeder.cs            # Initial data seeding
│       ├── Configurations/                  # EF Core Fluent API configs
│       ├── Repositories/                    # Repository implementations
│       ├── Services/                        # EmailService implementation
│       └── DependencyInjection.cs           # Infrastructure DI registration
```

---

## ⚡ Getting Started

### Prerequisites

- [.NET 10 SDK](https://dotnet.microsoft.com/download/dotnet/10.0)
- [SQL Server LocalDB](https://docs.microsoft.com/en-us/sql/database-engine/configure-windows/sql-server-express-localdb) (comes with Visual Studio)
- Visual Studio 2022+ or VS Code

### Clone & Setup

```bash
git clone https://github.com/themahipalt/Saanan.git
cd Saanan
```

### Configure Connection String

Update `src/ITServices.API/appsettings.json` with your SQL Server instance:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=(localdb)\\MSSQLLocalDB;Database=ITServicesDb;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"
}
```

> **Note:** Common LocalDB instance names are `MSSQLLocalDB` or `LocalDB`. Check yours with `sqllocaldb info`.

### Install EF Core Tools (if not installed)

```bash
dotnet tool install --global dotnet-ef
```

### Create Database

```bash
dotnet ef database update --project src/ITServices.Infrastructure --startup-project src/ITServices.API
```

This will:
- Create the `ITServicesDb` database
- Apply all migrations (create tables)
- On first app run, seed initial data (admin user, categories, services, FAQs, content)

### Run the Application

**Visual Studio:**
1. Open `ITServices.slnx`
2. Set `ITServices.API` as startup project
3. Press **F5**

**Terminal:**
```bash
cd src/ITServices.API
dotnet run --launch-profile http
```

### Access Swagger

Open in browser: **http://localhost:5198/swagger**

- **Public API** tab — No auth required
- **Admin API** tab — Requires JWT token

---

## 🔐 Default Admin Credentials

| Field | Value |
|-------|-------|
| Email | `admin@itservices.com` |
| Password | `Admin@123456` |

> ⚠️ Change these immediately in production!

### Get JWT Token

1. Open Swagger → Admin API → `POST /api/auth/login`
2. Send:
```json
{
  "email": "admin@itservices.com",
  "password": "Admin@123456"
}
```
3. Copy the `token` from response
4. Click **Authorize** button in Swagger → Enter: `<your-token>`
5. Now all admin endpoints are accessible

---

## 📧 Email Configuration

Update `appsettings.json` with your SMTP settings:

```json
"EmailSettings": {
  "SmtpHost": "smtp.gmail.com",
  "SmtpPort": 587,
  "SenderEmail": "your-email@gmail.com",
  "SenderName": "IT Services",
  "Username": "your-email@gmail.com",
  "Password": "your-app-password",
  "EnableSsl": true
}
```

> For Gmail, generate an [App Password](https://support.google.com/accounts/answer/185833).

---

## 🗄️ Database Entities

| Entity | Description |
|--------|-------------|
| AdminUser | Admin authentication |
| ServiceCategory | IT service categories |
| Service | Individual IT services |
| Lead | Project inquiries |
| ContactMessage | Contact form submissions |
| Blog | Blog posts |
| Faq | Frequently asked questions |
| Testimonial | Client testimonials |
| PortfolioProject | Showcase projects |
| Content | Dynamic site content sections |
| NewsletterSubscriber | Email subscribers |
| QueryClassification | AI query categorization results |
| ProposalSummary | Generated proposals |

---

## 🧪 API Response Format

All endpoints return a consistent response:

```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": { },
  "errors": []
}
```

Paginated responses include:
```json
{
  "success": true,
  "data": {
    "items": [],
    "totalCount": 100,
    "page": 1,
    "pageSize": 10
  }
}
```

---

## 🌐 CORS Configuration

Configured for Angular frontend (update in `appsettings.json`):

```json
"Cors": {
  "AllowedOrigins": [
    "http://localhost:4200",
    "https://localhost:4200",
    "https://your-production-domain.com"
  ]
}
```

---

## 📝 License

This project is for educational and portfolio purposes.

---

## 👤 Author

**Mahi Palt**  
GitHub: [@themahipalt](https://github.com/themahipalt)
