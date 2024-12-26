# E Commerce API

The E-Commerce API is a backend service built using NestJS and PostgreSQL to manage products, categories, and orders for an e-commerce platform. It provides endpoints for CRUD operations, order placement, and supports features like pagination, filtering, and search.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup and Installation](#setup-and-installation)
    - [Docker Deployment](#docker-deployment)
    - [Local Deployment](#local-deployment)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)

---

## Tech Stack

- **Backend**: Node.js, NestJS
- **ORM**:Typeorm
- **API Documentation**: Swagger
- **Database**: PostgreSQL
- **Containerization**: Docker, Docker Compose

---

## Project Structure

```
e-commerce-api/
│   ├── sql/
│   ├── src/
│   ├── test/
│   ├── .dockerignore
│   └── .env.example
│   └── .eslintrc.js
│   └── .gitignore
│   └── .prettierrc
│   └── Dockerfile
│   └── package.json
│   └── README.md # Project documentation
│   └── yarn.lock
│   └── nest-cli.json
│   └── tsconfig.build.json
│   └── tsconfig.json
│   └── docker-compose.yml # Compose file for running the app
```

---

## Setup and Installation

### Docker Deployment

1. **Docker**:
   Ensure Docker and Docker Compose are installed on your machine.

2. **Clone the repository**:

    ```bash
    git clone https://github.com/mobin-ism/E-Commerce-API.git
    cd E-Commerce-API
    ```

3. **Build and run the application**:

    ```bash
    sudo docker compose build --no-cache && sudo docker compose up
    ```

4. **Database Creation**:

    - If you see `Unable to connect to the database` error, then you need to create a database manually by any datbase client or using your terminal.
      Please make sure that you are using exactly identical database credentials like showing below while creating the database:

    ```bash
    DB_HOST=postgres
    DB_PORT=5432
    DB_USERNAME=postgres
    DB_PASSWORD=pLSkczmWBHK0CVh
    DB_NAME=e-commerce-api
    ```

5. **Access the application**:
    - **API**: [http://localhost:3000/docs](http://localhost:3000/docs)

---

### Local Deployment

1. **Install prerequisites**:

    - Node.js (v22.11.0)
    - Yarn (v1.22.22)
    - PostgreSQL

2. **Clone the repository**:

    ```bash
    git clone https://github.com/mobin-ism/E-Commerce-API.git
    cd E-Commerce-API
    ```

3. **Set up environment variables**:
   Create `.env` file. See the [Environment Variables](#environment-variables) section for details.

4. **Install dependencies and run services**:

```bash
    yarn
    yarn build
    yarn start:prod
```

5. **Access the application**:
    - **API Documentation**: [http://localhost:3000/docs](http://localhost:3000/docs)

---

## Environment Variables

### Backend

Create a `.env` file and copy all the content from `.envExample`. If you need to update the credentials you can do that according to your system.

```
APP_ENV=development
APP_PORT=3000
APP_URL=http://localhost:3000

# DEVELOPMENT ENVIRONMENT
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=e-commerce-api

#MISC
DEFAULT_PAGE_SIZE=25
RATE_LIMITER_TIME_TO_LEAVE=6000 #MILLISECONDS
RATE_LIMITER_MAX_TRY=60
```

---

## API Endpoints

You can see the API documentation in Swagger, If you follow the local deployment.
Go to [http://localhost:3000/docs/](http://localhost:3000/docs/)

### Product Mangement API

- `GET /api/v1/product`: Retrieve all product with pagination and product searching and filtering with category.
- `GET /api/v1/product/:id`: Retrieve a specific product.
- `POST /api/v1/product`: Create a new task.
- `PATCH /api/v1/product/:id`: Update a task.
- `DELETE /api/v1/product/:id`: Delete a task.

### Category Management API

- `GET /api/v1/category`: Retrieve all categories.
- `GET /api/v1/category/:id`: Retrieve a specific categories.
- `POST /api/v1/category`: Create a new category.
- `PATCH /api/v1/category/:id`: Update a category.
- `DELETE /api/v1/category/:id`: Delete a category.

### Order Management API

- `GET /api/v1/order`: Retrieve all orders with pagination.
- `GET /api/v1/order/:id`: Retrieve a specific orders.
- `POST /api/v1/order`: Create a new order.
- `PATCH /api/v1/order/:id`: Update a order.
- `DELETE /api/v1/order/:id`: Delete a order.

---

## Database Schema

### **Category**

The `Category` entity is used to define product categories.

| Column Name   | Data Type      | Constraints              | Description                                   |
| ------------- | -------------- | ------------------------ | --------------------------------------------- |
| `id`          | `uuid`         | Primary Key              | Unique identifier for each category.          |
| `name`        | `varchar(255)` | Not Null                 | Name of the category.                         |
| `description` | `text`         | Nullable                 | Optional description of the category.         |
| `createdAt`   | `timestamp`    | Not Null, Auto-Generated | Timestamp when the category was created.      |
| `updatedAt`   | `timestamp`    | Not Null, Auto-Generated | Timestamp when the category was last updated. |

#### Relationships:

- **One-to-Many with `Product`:**  
  A category can have many products associated with it. If a product is created, updated, or deleted, cascading changes are applied to the `products` relationship.

---

### **Product**

The `Product` entity represents individual products belonging to a `Category`.

| Column Name   | Data Type        | Constraints              | Description                                     |
| ------------- | ---------------- | ------------------------ | ----------------------------------------------- |
| `id`          | `uuid`           | Primary Key              | Unique identifier for each product.             |
| `name`        | `varchar(255)`   | Not Null                 | Name of the product.                            |
| `description` | `text`           | Nullable                 | Optional description of the product.            |
| `price`       | `decimal(10, 2)` | Nullable, Default: 0     | Price of the product.                           |
| `quantity`    | `int`            | Nullable, Default: 0     | Available quantity of the product.              |
| `categoryId`  | `string`         | Nullable                 | Foreign key reference to the `Category` entity. |
| `createdAt`   | `timestamp`      | Not Null, Auto-Generated | Timestamp when the product was created.         |
| `updatedAt`   | `timestamp`      | Not Null, Auto-Generated | Timestamp when the product was last updated.    |

#### Relationships:

- **Many-to-One with `Category`:**  
  Each product belongs to one category. If a category is deleted, all associated products are also deleted due to the `CASCADE` rule.

- **One-to-Many with `OrderedProduct`:**  
  A product can be part of many orders. Cascading changes apply to the `orderedProducts` relationship.

---

### **Order**

The `Order` entity represents customer orders.

| Column Name     | Data Type        | Constraints                  | Description                                       |
| --------------- | ---------------- | ---------------------------- | ------------------------------------------------- |
| `id`            | `uuid`           | Primary Key                  | Unique identifier for each order.                 |
| `customerName`  | `varchar(100)`   | Not Null                     | Name of the customer who placed the order.        |
| `customerEmail` | `varchar(100)`   | Not Null                     | Email of the customer.                            |
| `status`        | `enum`           | Not Null, Default: `PENDING` | Status of the order (`PENDING`, `SHIPPED`, etc.). |
| `totalPrice`    | `decimal(10, 2)` | Nullable, Default: 0         | Total price of the order.                         |
| `createdAt`     | `timestamp`      | Not Null, Auto-Generated     | Timestamp when the order was created.             |
| `updatedAt`     | `timestamp`      | Not Null, Auto-Generated     | Timestamp when the order was last updated.        |

#### Relationships:

- **One-to-Many with `OrderedProduct`:**  
  An order can contain many products. Cascading changes apply to the `orderedProducts` relationship.

---

### **OrderedProduct**

The `OrderedProduct` entity represents products included in customer orders.

| Column Name | Data Type   | Constraints              | Description                                        |
| ----------- | ----------- | ------------------------ | -------------------------------------------------- |
| `id`        | `uuid`      | Primary Key              | Unique identifier for each ordered product record. |
| `quantity`  | `int`       | Nullable, Default: 0     | Quantity of the product in the order.              |
| `orderId`   | `string`    | Not Null                 | Foreign key reference to the `Order` entity.       |
| `productId` | `string`    | Not Null                 | Foreign key reference to the `Product` entity.     |
| `createdAt` | `timestamp` | Not Null, Auto-Generated | Timestamp when the record was created.             |
| `updatedAt` | `timestamp` | Not Null, Auto-Generated | Timestamp when the record was last updated.        |

#### Relationships:

- **Many-to-One with `Order`:**  
  Each ordered product belongs to one order. If an order is deleted, all associated `OrderedProduct` records are also deleted due to the `CASCADE` rule.

- **Many-to-One with `Product`:**  
  Each ordered product is linked to one product. If a product is deleted, all associated `OrderedProduct` records are also deleted due to the `CASCADE` rule.

---
