# Event Management System

The Event Management System is a backend-focused API designed to facilitate the management of events, attendees, and registrations. Built using NestJS and PostgreSQL, the system supports a wide range of features, including CRUD operations for events and attendees, registration management, and filtering functionalities.

Advanced capabilities include caching frequently accessed data with Redis, background job handling with Worker Threads for email notifications, scheduled reminders using @nestjs/schedule, and real-time updates via WebSocket. The project emphasizes clean, modular, and maintainable code following NestJS best practices, complete with comprehensive API documentation through Swagger.

This system is ideal for handling dynamic event scenarios while ensuring high performance and scalability.

---

## Table of Contents

- [Features Covered](#features-covered)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup and Installation](#setup-and-installation)
    - [Docker Deployment](#docker-deployment)
    - [Local Deployment](#local-deployment)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)

---

### Features Covered

#### Core Features

    ✔ CRUD operations for events
    ✔ CRUD operations for attendees
    ✔ Registration system with constraints
    ✔ Prevent exceeding max_attendees
    ✔ Avoid duplicate registrations for the same event
    ✔ Filter events by date
    ✔ Search attendees by name or email

#### Advanced Features

    - Caching:
        ✔ Cache frequently accessed data (e.g., event details, attendee lists)
        ✔ Invalidate cache for updates or deletions

    - Background Jobs with Worker Threads:
        ✔ Send confirmation emails after registration
        ✔ Use worker threads for asynchronous tasks

    -  Scheduling:
        ✔ Send event reminders 24 hours before an event
        ✔ Use task schedulers like @nestjs/schedule

    -  Notifications:
        ✔ Implement email notifications using Nodemailer
        ✔ Create templates for registration confirmation and event reminders

    -  Real-time Updates:
        ✔ Notify attendees when new events are created
        ✔ Alert attendees when event spots are nearly full in my cause less than or equal to 2.

## Tech Stack

- **Backend**: Node.js (v22.11.0), NestJS (v10.4.15)
- **ORM**: TypeORM
- **Real-Time Notifications**: WebSockets
- **Caching**: Redis
- **Task Scheduling**: NestJS Scheduler
- **Database**: PostgreSQL
- **Containerization**: Docker, Docker Compose
- **API Documentation**: Swagger

---

## Project Structure

```
event-management-system/
│   ├── .vscode/
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

### 🐋 Docker Deployment

1. **Docker**:
   Ensure Docker and Docker Compose are installed on your machine.

2. **Clone the repository**:

    ```bash
    git clone https://github.com/mobin-ism/event-management-system.git
    cd event-management-system
    ```

3. **Build and run the application**:

    ```bash
    sudo docker compose build --no-cache && sudo docker compose up
    ```

4. **Database Creation**:

    If you encounter the error `Unable to connect to the database`, you may need to create the database manually using any database client or via the terminal.

    Ensure that you use the exact same database credentials as shown below when creating the database:

    ```bash
    DB_HOST=localhost
    DB_PORT=5432
    DB_USERNAME=postgres
    DB_PASSWORD=pLSkczmWBHK0CVh
    DB_NAME=event-management

    ```

5. **Access the API Documentation**:
    - **API**: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

### 💻 Local Deployment

1. **Install prerequisites**:

    - Node.js (v22.11.0)
    - Yarn (v1.22.22)
    - PostgreSQL
    - Redis

2. **Clone the repository**:

    ```bash
    git clone https://github.com/mobin-ism/event-management-system.git
    cd event-management-system
    ```

3. **Set up environment variables**:
   Create `.env` file. See the [Environment Variables](#environment-variables) section for details.

4. **Install dependencies and run services**:

    ```bash
    yarn && yarn build && yarn start:prod
    ```

5. **Access the API Documentation**:
    - **API Documentation**: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

## Environment Variables

### Backend

Create a `.env` file and copy all the content from `.envExample`. If you need to update the credentials you can do that according to your system.

```
APP_ENV=development
APP_PORT=3000
APP_URL=http://localhost:3000

# DEVELOPMENT ENVIRONMENT
DB_HOST=YOUR_DB_HOST
DB_PORT=YOUR_DB_PORT
DB_USERNAME=YOUR_POSTGRES_USERNAME
DB_PASSWORD=YOUR_POSTGRES_PASSWORD
DB_NAME=YOUR_POSTGRES_DB_NAME

#SMTP CONFIG
SMTP_HOST=YOUR_SMTP_HOST
SMTP_USER=YOUR_SMTP_USER
SMTP_PASSWORD=YOUR_SMTP_PASSWORD
SMTP_MAIL_FROM=YOUR_EMAIL
SMTP_PORT=YOUR_SMTP_PORT

# REDIS CONFIG
REDIS_HOST=YOUR_REDIS_HOST
REDIS_PORT=YOUR_REDIS_PORT
TTL=3600 #SECONDS

#MISC
RATE_LIMITER_TIME_TO_LEAVE=6000 #MILLISECONDS
RATE_LIMITER_MAX_TRY=60
```

---

## API Endpoints

You can see the API documentation in Swagger, If you follow the local deployment.
Go to [http://localhost:3000/api-docs/](http://localhost:3000/api-docs/)

### Event Mangement API

- `GET /api/v1/event`: Retrieve all events with attendee information.
- `GET /api/v1/event/date-range`: Retrieve all events in a specific date range with attendee information.
- `GET /api/v1/event/:id`: Retrieve a specific event.
- `POST /api/v1/event`: Create a new event.
- `PATCH /api/v1/event/:id`: Update an event.
- `DELETE /api/v1/event/:id`: Delete an event.

### Attendee Management API

- `GET /api/v1/attendee`: Retrieve all attendees with name and email filteration.
- `GET /api/v1/attendee/:id`: Retrieve a specific attendee.
- `POST /api/v1/attendee`: Create a new attendee.
- `PATCH /api/v1/attendee/:id`: Update a attendee.
- `DELETE /api/v1/attendee/:id`: Delete a attendee.

### Registration Management API

- `GET /api/v1/registration`: Retrieve all registration with pagination.
- `GET /api/v1/registration/:id`: Retrieve a specific order.
- `POST /api/v1/registration`: Create a new order.
- `DELETE /api/v1/registration/:id`: Canceling an order.

---

### Real-Time Notifications (WebSocket)

In addition to the RESTful API, the system supports real-time notifications through WebSockets, providing instant updates to clients. The base URL for the WebSocket connection is:

- **Base URL**: `http://localhost:3000`

The server publishes the following events:

- **new-event**: This event is triggered whenever a new event is created. Clients subscribed to this event will receive notifications with the latest event information.
- **event-availability**: This event is triggered to notify attendees when an event is nearing capacity. Clients will be informed that the event space is limited and may be filled soon, allowing them to take action (e.g., register quickly).

Clients should subscribe to these events in order to receive real-time updates during their session.

---

## Database Schema

### **Event**

The `Event` entity is used to define events, including their name, description, date, location, and max attendees.

| Column Name    | Data Type      | Constraints              | Description                                |
| -------------- | -------------- | ------------------------ | ------------------------------------------ |
| `id`           | `uuid`         | Primary Key              | Unique identifier for each event.          |
| `name`         | `varchar(255)` | Not Null                 | Name of the event.                         |
| `description`  | `text`         | Nullable                 | Optional description of the event.         |
| `date`         | `date`         | Not Null                 | The date of the event (no time).           |
| `location`     | `varchar(255)` | Nullable                 | Location of the event.                     |
| `maxAttendees` | `int`          | Not Null, Default: 1     | Maximum number of attendees for the event. |
| `createdAt`    | `timestamp`    | Not Null, Auto-Generated | Timestamp when the event was created.      |
| `updatedAt`    | `timestamp`    | Not Null, Auto-Generated | Timestamp when the event was last updated. |

### **Indexes & Constraints**

- **Unique Constraint:** (`location`, `date`) — Ensures that each event has a unique combination of location and date.
- **Index:** (`location`, `date`) — Improves query performance for filtering events by location and date.

### **Relations**

- **One-to-Many with `Registration`:**
    - The `Event` entity has a one-to-many relationship with the `Registration` entity.
    - A single event can have many registrations (attendees).
    - The `Registration` entity has a foreign key to the `Event` entity.

---

### **Attendee**

The `Attendee` entity is used to define event attendees, including their name, email, and their relation to the `Registration` entity.

| Column Name | Data Type      | Constraints              | Description                                   |
| ----------- | -------------- | ------------------------ | --------------------------------------------- |
| `id`        | `uuid`         | Primary Key              | Unique identifier for each attendee.          |
| `name`      | `varchar(100)` | Not Null                 | Name of the attendee.                         |
| `email`     | `varchar(100)` | Not Null, Unique         | Email address of the attendee (unique).       |
| `createdAt` | `timestamp`    | Not Null, Auto-Generated | Timestamp when the attendee was created.      |
| `updatedAt` | `timestamp`    | Not Null, Auto-Generated | Timestamp when the attendee was last updated. |

### **Relations**

- **One-to-Many with `Registration`:**
    - The `Attendee` entity has a one-to-many relationship with the `Registration` entity.
    - A single attendee can have multiple registrations (one for each event they attend).
    - The `Registration` entity has a foreign key to the `Attendee` entity.

### **Indexes & Constraints**

- **Unique Constraint:** `email` — Ensures that each attendee's email address is unique.
- **Index:** (`name`, `email`) — Improves query performance for searching attendees by name and email.

---

### **Registration**

The `Registration` entity is used to store the registration details for an attendee to a particular event.

| Column Name    | Data Type   | Constraints              | Description                                              |
| -------------- | ----------- | ------------------------ | -------------------------------------------------------- |
| `id`           | `uuid`      | Primary Key              | Unique identifier for each registration.                 |
| `eventId`      | `uuid`      | Not Null, Foreign Key    | The ID of the event to which the attendee is registered. |
| `attendeeId`   | `uuid`      | Not Null, Foreign Key    | The ID of the attendee who is registered.                |
| `registeredAt` | `date`      | Not Null                 | The date when the attendee registered for the event.     |
| `createdAt`    | `timestamp` | Not Null, Auto-Generated | Timestamp when the registration was created.             |
| `updatedAt`    | `timestamp` | Not Null, Auto-Generated | Timestamp when the registration was last updated.        |

### **Relations**

- **Many-to-One with `Event`:**

    - The `Registration` entity has a many-to-one relationship with the `Event` entity.
    - Each registration belongs to a single event.
    - The `Event` entity has a one-to-many relationship with `Registration`.

- **Many-to-One with `Attendee`:**
    - The `Registration` entity has a many-to-one relationship with the `Attendee` entity.
    - Each registration belongs to a single attendee.
    - The `Attendee` entity has a one-to-many relationship with `Registration`.

### **Indexes & Constraints**

- **On Delete Cascade:** If an event or attendee is deleted, all corresponding registrations are also deleted automatically.

---
