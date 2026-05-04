# Nexus E-Commerce Platform

Nexus is a full-stack, premium e-commerce application built with a modern, responsive frontend and a robust, scalable backend. It provides a complete shopping experience for users alongside a comprehensive dashboard for administrators.

## 🚀 Architecture Overview

This project is divided into two distinct components:

### 1. [Backend Service](./backend/README.md)
A RESTful API built with **Java 17, Spring Boot 3, and PostgreSQL**.
- Handles all business logic, data persistence, and state management.
- Features complete CRUD operations for Users, Products, Categories, Shopping Cart, and Orders.
- Interactive API documentation powered by Swagger/OpenAPI.

### 2. [Frontend Application](./frontend/README.md)
A premium Single Page Application built with **React, Vite, Tailwind CSS, and Framer Motion**.
- Features a highly polished, glassmorphism-inspired design system.
- Implements role-based routing (Admin vs. Customer views).
- Includes fluid animations, interactive shopping carts, and dynamic data tables.

## 💻 Tech Stack Summary

**Frontend:** React, Tailwind CSS, Framer Motion, Axios, React Router v6, Vite  
**Backend:** Java 17, Spring Boot 3.2, Spring Data JPA, Hibernate, PostgreSQL, Swagger UI  

## 🛠️ Quick Start

### Prerequisites
- Java 17+
- Node.js 18+
- PostgreSQL

### 1. Start the Backend
```bash
cd backend
# Make sure your PostgreSQL server is running and configure application.properties if necessary
./mvnw spring-boot:run
```
*The backend will run on `http://localhost:8081`*

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
*The frontend will run on `http://localhost:5173`*

## 🔑 Demo Credentials

When the backend starts, it automatically seeds the database with demo data. You can log in using:

**Admin Dashboard:**
- **Email:** `admin@ecommerce.com`
- **Password:** `admin123`

**Customer View:**
- **Email:** `john@example.com`
- **Password:** `john123`

## 📄 License
This project is for educational and portfolio purposes.
