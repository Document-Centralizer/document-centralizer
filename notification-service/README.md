# Document Centralizer - Notification Service

This document provides a comprehensive overview of the Notification Service microservice built using .NET 8. It is designed to act as a headless background service that processes and dispatches email and SMS notifications triggered by the main Java Spring Boot backend.

---

## 1. Project Type
**Type:** ASP.NET Core Web API

We chose an **ASP.NET Core Web API** instead of a traditional MVC (Model-View-Controller) application. 
- Traditional MVC applications render full HTML web pages (Views). 
- A Web API is a "headless" backend service. It has Models and Controllers but no Views. It exclusively receives and returns raw data (like JSON). This is the perfect architectural choice for a microservice that simply needs to listen for HTTP POST requests from a Java backend and dispatch emails in the background.

---

## 2. Architecture Justification: Why a Separate .NET Service?

An interviewer will likely ask why you didn't just write the email logic inside the existing Java Spring Boot application. Here is the reasoning:

### Why a separate Microservice?
1. **Decoupling & Performance:** Sending emails and SMS requires calling third-party external APIs (like Twilio or SMTP servers), which can be slow or experience downtime. If this logic was inside the Java backend, a slow email server could block the main application threads. By offloading this to a separate service, the Java backend remains fast and highly responsive.
2. **Scalability:** If the application scales to thousands of users uploading documents simultaneously, the notification system will experience a heavy load. Having it as a separate microservice allows us to scale it independently of the core Java application.

### Why .NET specifically?
1. **Polyglot Microservices:** Modern enterprise architectures rarely use just one language. Building a "Polyglot" (multi-language) system demonstrates advanced architectural knowledge and the ability to integrate different technology stacks (Java, React, Python, and C#) seamlessly.
2. **Ecosystem Strength:** C# and .NET 8 provide incredibly robust, high-performance libraries for background task processing and API routing, making it an excellent choice for a lightweight, fast-executing notification router.

---

## 3. Database Approach
**Approach:** Entity Framework Core "Code-First"

We used the **Code-First Approach** using Entity Framework (EF) Core with a shared MySQL database.
- Instead of manually writing SQL queries to create tables in MySQL Workbench, we write pure C# classes (like `NotificationLog`).
- We then use EF Core Migrations (`dotnet ef migrations add`) to automatically translate those C# classes into database tables.
- **Why?** It is the modern industry standard. It keeps the database schema version-controlled alongside the application code and ensures that any developer can easily recreate the database using simple terminal commands.

---

## 3. Folder Architecture
Even though this is a Web API without HTML UI views, it still strictly adheres to the separation of concerns principles:

- **`/Models`**: Contains the data structures and entities (e.g., `NotificationLog.cs`). These map directly to the tables in the MySQL database.
- **`/Data`**: Contains the `AppDbContext.cs`, which is the core bridge managing the Entity Framework connection between our C# application and the MySQL Database.
- **`/Controllers`**: Contains the API endpoints (e.g., `NotificationController.cs`). These act as the entry points for HTTP requests coming from the Java Spring Boot app.
- **`/Services`**: Contains the core business logic. This is where the code for connecting to SMTP (via MailKit) and dispatching SMS messages (via Twilio) lives, keeping the Controllers clean and focused only on HTTP routing.

---

## 4. Business & System Flow
The primary business logic of this microservice revolves around notifying users when a SuperAdmin verifies or rejects a document. The flow operates as follows:

1. **Trigger (Frontend to Java Backend):** 
   A SuperAdmin logs into the React frontend and clicks "Approve" or "Reject" on a document. This sends a request to the Java Spring Boot backend (`SuperAdminController`).
2. **Database Update (Java Backend):** 
   Spring Boot updates the document status in the MySQL database.
3. **Payload Generation (Java Backend):** 
   Spring Boot gathers the user's details (Email, Phone, Document Name, Status, Remarks) and sends them as a JSON payload via an HTTP POST request to this .NET Notification Service.
4. **Processing Request (.NET Controller):** 
   The `.NET Web API` receives the payload. The `NotificationController` inspects the `status` field.
5. **Template Selection (.NET Service):**
   - If `VERIFIED`: The service loads a success email template.
   - If `REJECTED`: The service loads a rejection email template and injects the SuperAdmin's remarks.
6. **Dispatch (.NET Service):** 
   The service uses SMTP to dispatch the email and an SMS provider API to dispatch the text message.
7. **Logging (.NET Data):** 
   Finally, the service saves a record of the sent notification into the `NotificationLogs` MySQL table for auditing purposes.