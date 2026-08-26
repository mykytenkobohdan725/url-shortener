# 🔗 High-Performance URL Shortener Service

A robust, production-ready RESTful URL Shortener microservice built with **NestJS**, **MongoDB**, and **Redis**. Features multi-tenant project isolation, high-performance API Key authentication with Redis read-through caching, and collision-resistant short code generation.

---

## 🚀 Features

* **Multi-Tenant Architecture**: URL management isolated by Projects/API Keys.
* **High-Performance Guard**: `ApiKeyGuard` with Redis read-through caching to eliminate redundant database queries.
* **Collision-Safe Code Generation**: Short codes generated using `nanoid` with custom alphabet and automatic retry loops.
* **Analytics-Friendly Redirects**: Utilizes `302 Found` HTTP redirects to bypass browser caching and ensure accurate click tracking.
* **Custom Param Decorators**: Clean controller logic using custom `@ProjectId()` decorator.
* **MongoDB TTL Indexing**: Automatic link expiration support using Mongoose TTL indexes.

---

## 🛠 Tech Stack

* **Framework**: NestJS (TypeScript)
* **Database**: MongoDB (via `@nestjs/mongoose` & Mongoose ORM)
* **Caching**: Redis (via `@nestjs/cache-manager`)
* **Utilities**: `nanoid`, `dotenv`, `@nestjs/config`

---

## 📦 Getting Started

### 1. Prerequisites

Ensure you have the following installed:
* Node.js (v18+)
* MongoDB Atlas or local MongoDB instance
* Redis server

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
PORT=3000
MONGODB_URI=mongodb+srv://<user>:<password>
REDIS_HOST=localhost
REDIS_PORT=6379