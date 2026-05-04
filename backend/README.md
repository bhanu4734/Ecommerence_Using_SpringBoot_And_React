# Nexus Backend API

The backend for the Nexus E-Commerce platform. This is a monolithic REST API built using modern Java and Spring Boot practices. It handles all data persistence, business rules, and serves as the single source of truth for the frontend application.

## 🚀 Tech Stack

- **Framework:** Spring Boot 3.2
- **Language:** Java 17
- **Database:** PostgreSQL
- **ORM:** Spring Data JPA / Hibernate
- **API Documentation:** Swagger / OpenAPI 3.0
- **Build Tool:** Maven

## 🏗️ Architecture

The backend follows a strict layered architecture:
- **Controllers:** Expose REST endpoints and handle HTTP requests/responses using DTOs.
- **Services:** Contain the core business logic. Interfaces are defined for flexibility.
- **Repositories:** Spring Data JPA interfaces for database interactions.
- **Entities:** JPA domain models representing database tables.
- **DTOs:** Request and Response objects to decouple database models from API contracts.

## 📦 Core Modules

- **User Management:** CRUD operations for customers and administrators.
- **Product Catalog:** Management of products, including stock levels, prices, and relationships to categories.
- **Categories:** Grouping of products for easy navigation.
- **Shopping Cart:** Session-based (simulated via userId in this demo) cart management.
- **Order Processing:** Transitioning cart items into finalized orders with lifecycle statuses (`PENDING`, `SHIPPED`, etc.).

## ⚙️ Configuration & Setup

1. **Database Setup**
   Ensure PostgreSQL is running and create a database named `ecommerce_db`.
   
2. **application.properties**
   The configuration is located in `src/main/resources/application.properties`. Ensure the credentials match your local setup:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/ecommerce_db
   spring.datasource.username=postgres
   spring.datasource.password=your_password
   ```

3. **Running the Application**
   ```bash
   ./mvnw spring-boot:run
   ```
   The server will start on port `8081`.

## 📚 API Documentation

Once the server is running, you can explore and test the API endpoints interactively via Swagger UI:
👉 **[http://localhost:8081/swagger-ui/index.html](http://localhost:8081/swagger-ui/index.html)**

## 🌱 Data Seeding

The application includes a `DataLoader` component that automatically seeds the database with initial users, categories, and products on the first run, making it immediately ready for frontend consumption.
