# Todo Application

A full-stack todo application built with NestJS, featuring microservices architecture with API, Worker, and Cronjobs services. The application includes user authentication, task management, email notifications, and background job processing.

## 🏗️ Architecture

The application consists of three main services:

- **API Service** (Port 3001): Main REST API for authentication and task management
- **Worker Service** (Port 3003): Background job processing for email notifications
- **Cronjobs Service** (Port 3002): Scheduled tasks for task reminders and status updates

## 📸 Screenshots

### API Documentation

![Swagger API Documentation](./images/swagger-api.png)
_Interactive API documentation with Swagger UI_

### Queue Dashboard

![BullMQ Dashboard](./images/queue-dashboard.png)
_Real-time monitoring of background jobs and queues_

### Authentication

![Login Interface](./images/login-interface.png)
_Secure user authentication with Basic auth_

### Welcome Email System

![Welcome Email](./images/welcome-email.png)
_Automated welcome emails sent to new users upon registration_

The application automatically sends personalized welcome emails to new users when they register. The welcome email includes:

- **Personalized greeting** with the user's name
- **Professional design** with responsive layout
- **Background job processing** via BullMQ queues

**Features:**

- ✅ **Automatic triggering** when users register
- ✅ **Queue-based processing** for reliable delivery
- ✅ **HTML email templates** with professional design
- ✅ **Personalization** with user's name and email
- ✅ **Error handling** and retry mechanisms
- ✅ **Real-time monitoring** via queue dashboard

### Login Detection Notifications

![Login Detection Email](./images/login-detected-email.png)
_Security notifications sent when users log in to their accounts_

The application sends security notifications whenever users log in to their accounts. These emails help users:

- **Track account activity** and detect unauthorized access
- **Maintain security awareness** of login events
- **Receive immediate notifications** of successful logins

**Features:**

- ✅ **Real-time notifications** on every login
- ✅ **Security awareness** for account monitoring
- ✅ **Professional email design** with login details
- ✅ **Background processing** via BullMQ queues

### Task Reminder System

![Task Reminder Email](./images/task-reminder-email.png)
_Daily reminders for tasks due tomorrow_

The system automatically sends daily reminders for tasks that are due the next day, helping users:

- **Stay organized** with upcoming deadlines
- **Never miss important tasks** with timely reminders
- **Plan their day** with clear task overviews
- **Maintain productivity** with proactive notifications

**Features:**

- ✅ **Daily automated reminders** for upcoming tasks
- ✅ **Personalized task lists** with due dates
- ✅ **Professional email templates** with task details
- ✅ **Scheduled processing** via cronjobs service

### Overdue Task Alerts

![Overdue Tasks Email](./images/overdue-tasks-email.png)
_Notifications for tasks that have passed their due date_

The application sends alerts for tasks that have exceeded their due dates, ensuring users:

- **Never lose track** of overdue tasks
- **Receive immediate notifications** when tasks are late
- **Stay accountable** for their commitments
- **Maintain task visibility** across all overdue items

**Features:**

- ✅ **Automatic overdue detection** and notifications
- ✅ **Comprehensive task overview** with overdue details
- ✅ **Professional alert design** with clear urgency indicators
- ✅ **Scheduled processing** via cronjobs service

## 🚀 Quick Start with Docker

### Prerequisites

#### Install Docker and Docker Compose

**macOS:**

```bash
# Install Docker Desktop
brew install --cask docker
```

**Ubuntu/Debian:**

```bash
# Update package index
sudo apt-get update

# Install prerequisites
sudo apt-get install apt-transport-https ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Set up stable repository
echo "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add user to docker group
sudo usermod -aG docker $USER
```

**Windows:**
Download and install [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)

### Environment Setup

1. **Copy the example environment file:**

```bash
cp .env.example .env
```

2. **Edit the `.env` file** with your configuration:

#### Email Testing Setup

**For testing email notifications, we recommend using Mailtrap:**

1. **Create a Mailtrap Account:**
   - Go to [Mailtrap.io](https://mailtrap.io)
   - Sign up for a free account
   - Verify your email address

2. **Set up an Inbox:**
   - Log in to your Mailtrap dashboard
   - Click "Add Inbox" or use the default inbox
   - Give your inbox a name (e.g., "Todo App Testing")

3. **Get SMTP Credentials:**
   - Click on your inbox
   - Go to the "SMTP Settings" tab
   - Select "Show Credentials"
   - Copy the following details:
     - **Host:** smtp.mailtrap.io
     - **Port:** 2525 (or 587 for TLS)
     - **Username:** Your Mailtrap username
     - **Password:** Your Mailtrap password

4. **Configure in .env file:**
   - Uncomment the Mailtrap configuration in your `.env` file
   - Replace the placeholder values with your actual Mailtrap credentials
   - You can replace the placeholder values with your actual credentials of MONGODB_URI

#### Customizing Default User Account

You can customize the default user account by setting these environment variables in your `.env` file:

```bash
DEFAULT_USER_EMAIL=your-email@example.com
DEFAULT_USER_NAME=Your Name
DEFAULT_USER_PASSWORD=your-password
```

The default user will be created automatically when the MongoDB container starts for the first time.

```bash
# MongoDB Configuration
# Option 1: Use individual components (recommended for Docker)
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=password123
MONGO_DATABASE=to-do
MONGO_PORT=27017

# Option 2: Use complete MongoDB URI (overrides individual components)
# MONGODB_URI=mongodb://username:password@host:port/database?authSource=admin

# Redis Configuration
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=redis123

# Service Ports
WORKER_PORT=3003
CRONJOBS_PORT=3002

# Email Configuration (for notifications)
# Option 1: Gmail (requires App Password)
# EMAIL_HOST=smtp.gmail.com
# EMAIL_PORT=587
# EMAIL_USER=your-email@gmail.com
# EMAIL_PASSWORD=your-app-password
# EMAIL_FROM=your-email@gmail.com

# Option 2: Mailtrap (recommended for testing)
EMAIL_HOST=smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=your-mailtrap-username
EMAIL_PASSWORD=your-mailtrap-password
EMAIL_FROM=noreply@yourdomain.com

# Queue Dashboard Authentication
BULL_DASHBOARD_USER=admin
BULL_DASHBOARD_PASSWORD=password123

# Default User Account (created automatically)
DEFAULT_USER_EMAIL=johnDoe@todoapp.com
DEFAULT_USER_NAME=John Doe
DEFAULT_USER_PASSWORD=password123
```

### Run with Docker

1. **Start all services:**

This command will run all the services and containers in one go, including the API service, Worker service, Cronjobs service, MongoDB database, and Redis cache.

```bash
docker-compose up -d
```

2. **Check service status:**

```bash
docker-compose ps
```

3. **View logs:**

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api
docker-compose logs -f worker
docker-compose logs -f cronjobs
```

4. **Stop services:**

```bash
docker-compose down
```

### Access Services

- **API Service:** http://localhost:3001
- **API Documentation (Swagger):** http://localhost:3001/api
- **Worker Service:** http://localhost:3003
- **Worker Queue Dashboard:** http://localhost:3003/queues
- **Cronjobs Service:** http://localhost:3002
- **MongoDB:** localhost:27017
- **Redis:** localhost:6379

### Default User Account

A default user account is automatically created when the MongoDB container starts:

- **Email:** johnDoe@todoapp.com
- **Password:** password123
- **Name:** John Doe

You can use these credentials to log in and test the application immediately after startup.

## 🛠️ Manual Installation

### Prerequisites

- Node.js 22.17.0 or higher
- pnpm 10.12.4 or higher
- MongoDB 7.0 or higher
- Redis 7.0 or higher

### Install Dependencies

```bash
# Install pnpm globally
npm install -g pnpm@10.12.4

# Install project dependencies
pnpm install
```

### Database Setup

1. **Start MongoDB:**

```bash
# macOS with Homebrew
brew services start mongodb-community

# Ubuntu/Debian
sudo systemctl start mongod

# Or run MongoDB in Docker
docker run -d --name mongodb \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password123 \
  -e MONGO_INITDB_DATABASE=todo_app \
  -p 27017:27017 \
  mongo:7
```

2. **Start Redis:**

```bash
# macOS with Homebrew
brew services start redis

# Ubuntu/Debian
sudo systemctl start redis-server

# Or run Redis in Docker
docker run -d --name redis \
  -e REDIS_PASSWORD=redis123 \
  -p 6379:6379 \
  redis:7-alpine redis-server --requirepass redis123
```

### Environment Configuration

1. **Copy the example environment file:**

```bash
cp .env.example .env
```

2. **Edit the `.env` file** with the same configuration as shown in the Docker section above.

### Run Services

1. **Development mode (all services):**

```bash
# Terminal 1 - API Service
pnpm run dev:api

# Terminal 2 - Worker Service
pnpm run dev:worker

# Terminal 3 - Cronjobs Service
pnpm run dev:cronjobs
```

## 📚 API Documentation

### Base URL

```
http://localhost:3001
```

### API Documentation (Swagger)

The API documentation is available at: **http://localhost:3001/api**

This interactive Swagger UI provides:

- Complete API endpoint documentation
- Request/response schemas
- Interactive testing interface
- Authentication token management
- Example requests and responses

### Queue Dashboard

Monitor background jobs and queues at: **http://localhost:3003/queues**

**Authentication:**

- Username: `admin` (or `BULL_DASHBOARD_USER` from environment)
- Password: `password123` (or `BULL_DASHBOARD_PASSWORD` from environment)

The queue dashboard shows:

- **Users Queue:** Welcome email processing for new user registrations
- **Auth Queue:** Login attempt email processing
- **Tasks Queue:** Task reminders, overdue alerts, and status updates
- Active jobs
- Failed jobs
- Job history
- Queue statistics
- Real-time job processing status

### Authentication

All task endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Endpoints

#### Authentication

**POST /auth/login**

- **Description:** Authenticate user and get access token
- **Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

- **Response:**

```json
{
  "accessToken": "jwt-access-token",
  "refreshToken": "jwt-refresh-token",
  "user": {
    "_id": "user-id",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

**POST /auth/refresh**

- **Description:** Refresh access token using refresh token
- **Request Body:**

```json
{
  "refreshToken": "jwt-refresh-token"
}
```

#### User Management

**POST /users**

- **Description:** Create a new user account
- **Features:** Automatically sends welcome email via background job processing
- **Request Body:**

```json
{
  "email": "user@example.com",
  "name": "User Name",
  "password": "password123"
}
```

- **Response:**

```json
{
  "message": "Successfully created user",
  "data": {
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

**GET /users**

- **Description:** Get all users with pagination support
- **Query Parameters:**
  - `skip` (number, optional): Number of users to skip (default: 0)
  - `limit` (number, optional): Number of users to return (default: 10, max: 100)
- **Response:**

```json
{
  "message": "Users retrieved successfully",
  "data": [
    {
      "_id": "user-id",
      "email": "user@example.com",
      "name": "User Name",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 25
}
```

#### Task Management

**POST /tasks**

- **Description:** Create a new task
- **Authentication:** Required
- **Request Body:**

```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive documentation for the todo app",
  "dueDate": "2024-01-15T10:00:00.000Z",
  "priority": "high",
  "category": "work"
}
```

**GET /tasks**

- **Description:** Get user's tasks with optional filtering
- **Authentication:** Required
- **Query Parameters:**
  - `limit` (number): Number of items per page
  - `status` (string): Filter by task status
  - `priority` (string): Filter by priority (low, medium, high)
  - `category` (string): Filter by category

**PATCH /tasks/:id**

- **Description:** Update a task
- **Authentication:** Required
- **Request Body:**

```json
{
  "title": "Updated task title",
  "description": "Updated description",
  "dueDate": "2024-01-16T10:00:00.000Z",
  "priority": "medium",
  "category": "personal"
}
```

**DELETE /tasks/:id**

- **Description:** Delete a task
- **Authentication:** Required

**POST /tasks/:id/status**

- **Description:** Update task status
- **Authentication:** Required
- **Request Body:**

```json
{
  "status": "completed"
}
```

### Task Properties

- **title** (required): Task title
- **description** (optional): Task description
- **dueDate** (required): ISO date string for task due date
- **priority** (optional): Task priority - "low", "medium", "high" (default: "medium")
- **category** (optional): Task category for organization
- **status** (optional): Task status - "pending", "in-progress", "completed", "cancelled"

### Testing Email Notifications

The application sends various email notifications:

1. **Welcome Emails:** Sent automatically when new users register
2. **Login Attempt Emails:** Sent when users log in
3. **Task Reminders:** Daily reminders for tasks due tomorrow
4. **Overdue Task Alerts:** Notifications for overdue tasks
5. **Task Status Updates:** When task status changes

**To test email functionality:**

1. Set up Mailtrap as described in the Email Testing Setup section
2. Create a user account and log in
3. Create tasks with due dates
4. Check your Mailtrap inbox for received emails
5. Monitor the queue dashboard at http://localhost:3003/queues for job processing

## 🔧 Development

### Available Scripts

```bash
# Development
pnpm run dev:api          # Start API service in watch mode
pnpm run dev:worker       # Start Worker service in watch mode
pnpm run dev:cronjobs     # Start Cronjobs service in watch mode
```

### Project Structure

```
todo-app/
├── apps/
│   ├── api/              # Main API service
│   ├── worker/           # Background job processing
│   └── cronjobs/         # Scheduled tasks
├── libs/
│   ├── common/           # Shared libraries and utilities
│   └── databases/        # Database configurations
├── docker-compose.yml    # Docker services configuration
├── Dockerfile.dev        # Development Docker configuration
└── mongo-init.js         # MongoDB initialization script
```

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use:**
   - Check if services are already running: `docker-compose ps`
   - Stop existing containers: `docker-compose down`
   - Change ports in `.env` file if needed

2. **MongoDB connection issues:**
   - Verify MongoDB is running: `docker-compose logs mongodb`
   - Check connection string in environment variables
   - Ensure MongoDB container is healthy: `docker-compose ps`

3. **Redis connection issues:**
   - Verify Redis is running: `docker-compose logs redis`
   - Check Redis password in environment variables
   - Ensure Redis container is healthy: `docker-compose ps`

4. **Email notifications not working:**
   - Verify email configuration in `.env` file
   - Check if email service is running: `docker-compose logs cronjobs`
   - Ensure email credentials are correct
   - **For Mailtrap testing:** Check your Mailtrap inbox for received emails
   - **For Gmail:** Ensure 2FA is enabled and App Password is generated

### Logs and Debugging

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f api
docker-compose logs -f worker
docker-compose logs -f cronjobs

# View logs with timestamps
docker-compose logs -f --timestamps

# View last 100 lines
docker-compose logs --tail=100 api
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
