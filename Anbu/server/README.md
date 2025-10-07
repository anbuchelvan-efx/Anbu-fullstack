# Movie Recommendation Backend Server

A Node.js/Express backend server with MongoDB for user authentication and management.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Password Hashing**: bcryptjs
- **Authentication**: jsonwebtoken (JWT)
- **CORS**: cors middleware
- **Environment Variables**: dotenv

## Project Structure

```
server/
├── db/
│   └── conn.js          # Database connection logic
├── models/
│   └── User.js          # User model/schema
├── routes/
│   └── auth.js          # Authentication routes
├── server.js            # Main server file
├── package.json         # Dependencies and scripts
├── env.example          # Environment variables template
└── README.md           # This file
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Configuration

1. Copy the environment template:
   ```bash
   cp env.example .env
   ```

2. Edit `.env` file with your actual values:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   PORT=5000
   NODE_ENV=development
   ```

### 3. MongoDB Setup

- Make sure MongoDB is running locally or use MongoDB Atlas
- Update the `MONGO_URI` in your `.env` file
- The database will be created automatically when you first connect

### 4. Start the Server

**Development mode (with auto-restart):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication Routes

#### POST `/api/signup`
Register a new user.

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User created successfully",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "fullName": "John Doe",
    "email": "john@example.com"
  }
}
```

#### POST `/api/login`
Login with existing credentials.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "fullName": "John Doe",
    "email": "john@example.com"
  }
}
```

### Health Check

#### GET `/health`
Check if the server is running.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid credentials)
- `409` - Conflict (user already exists)
- `404` - Not Found
- `500` - Internal Server Error

## Security Features

- **Password Hashing**: All passwords are hashed using bcryptjs with 12 salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive validation for all inputs
- **CORS Protection**: Configured to allow requests from React frontend only
- **Environment Variables**: Sensitive data stored in environment variables

## Development

### Available Scripts

- `npm start` - Start the server in production mode
- `npm run dev` - Start the server in development mode with auto-restart
- `npm test` - Run tests (not implemented yet)

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `MONGO_URI` | MongoDB connection string | Yes | - |
| `JWT_SECRET` | Secret key for JWT signing | Yes | - |
| `PORT` | Server port | No | 5000 |
| `NODE_ENV` | Environment mode | No | development |

## Integration with React Frontend

The server is configured to accept requests from `http://localhost:3000` (React development server). To integrate with your React frontend:

1. Make API calls to `http://localhost:5000/api/...`
2. Include the JWT token in the Authorization header:
   ```
   Authorization: Bearer <jwt_token>
   ```
3. Handle the responses according to the API documentation above

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**: Ensure MongoDB is running and the connection string is correct
2. **Port Already in Use**: Change the PORT in .env file or kill the process using the port
3. **JWT Secret Missing**: Make sure JWT_SECRET is set in your .env file
4. **CORS Errors**: Verify the frontend URL matches the CORS configuration

### Logs

The server logs connection status, errors, and request information to the console. Check the console output for debugging information.
