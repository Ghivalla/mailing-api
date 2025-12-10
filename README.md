# Mailing API

A secure, performant backend API for handling contact form submissions on my portfolio website. Built with TypeScript, Express, and designed to run on a VPS.

## 🏗️ Architecture

This is a standalone backend service that runs separately from the Next.js portfolio, communicating via internal HTTP requests:

```
Browser → Next.js (https://ghivalla.com/api/contact) → Mailing API (http://localhost:4000/contact)
```

The API is **not publicly exposed** - it only accepts requests from authorized applications running on the same VPS (ports 3000 and 3001).

### Project Structure

```
mailing-api/
├── src/
│   ├── config/          # Configuration & environment variables
│   │   ├── env.ts       # Environment config with validation
│   │   └── logger.ts    # Pino logger configuration
│   ├── controllers/     # Request handlers
│   │   └── contactController.ts
│   ├── middleware/      # Custom middleware
│   │   ├── logger.ts    # HTTP request logging
│   │   └── rateLimiter.ts
│   ├── routes/          # Route definitions
│   │   └── contactRoutes.ts
│   ├── services/        # Business logic
│   │   └── emailService.ts
│   ├── utils/           # Helpers & validation
│   │   └── validation.ts
│   ├── app.ts           # Express app setup
│   └── index.ts         # Entry point
├── tests/
│   ├── unit/            # Unit tests
│   │   └── validation.test.ts
│   └── integration/     # Integration tests
│       └── contact.test.ts
├── dist/                # Compiled JavaScript (gitignored)
└── node_modules/        # Dependencies (gitignored)
```

### Architecture Principles

- **Separation of Concerns**: Routes → Controllers → Services
- **Security First**: Input validation, rate limiting, CORS, secure error handling
- **Type Safety**: Full TypeScript coverage with strict mode
- **Testability**: Modular design with comprehensive test coverage
- **Observability**: Structured logging with Pino



## 🔒 Security Features

1. **Input Validation & Sanitization**
   - Zod schema validation for all fields
   - Trimming whitespace and normalizing data
   - Length limits on all inputs

2. **Rate Limiting**
   - 5 requests per 15 minutes per IP
   - Prevents spam and DoS attacks

3. **CORS Protection**
   - Only allows requests from configured origins
   - Prevents unauthorized cross-origin requests

4. **Security Headers**
   - Helmet.js for security HTTP headers
   - Protection against common vulnerabilities


## 📦 Dependencies

### Core Dependencies
- **express** - Web framework
- **typescript** - Type safety
- **zod** - Runtime validation
- **nodemailer** - Email sending
- **dotenv** - Environment variables

### Security
- **helmet** - Security headers
- **express-rate-limit** - Rate limiting
- **cors** - CORS configuration

### Logging
- **pino** - Fast structured logging
- **pino-http** - HTTP request logging
- **pino-pretty** - Pretty logs in development

### Development & Testing
- **tsx** - TypeScript execution
- **vitest** - Testing framework
- **supertest** - HTTP endpoint testing



## 🚀 Installation & Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- SMTP credentials (Gmail, SendGrid, etc.) or use Ethereal for testing

### 1. Clone and Install

```bash
git clone https://github.com/Ghivalla/mailing-api.git
cd mailing-api
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
PORT=4000
NODE_ENV=development

# CORS - comma-separated allowed origins
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=5

# Email settings
EMAIL_FROM=noreply@example.com
EMAIL_TO=your-email@example.com

# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

**Note**: For Gmail, you need to use an [App Password](https://support.google.com/accounts/answer/185833), not your regular password.

### 3. Development

```bash
# Run in development mode with hot reload
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

### 4. Production Build

```bash
# Build TypeScript to JavaScript
npm run build

# Run in production mode
npm start
```



## 🧪 Testing

The project has comprehensive test coverage:

- **Unit Tests**: Validation logic and data sanitization
- **Integration Tests**: Full HTTP endpoint testing

```bash
# Run all tests
npm test

# Run with coverage report
npm run test:coverage

# Watch mode for development
npm run test -- --watch
```

### Test Coverage

- ✅ Input validation (all fields)
- ✅ Data sanitization (trim, lowercase)
- ✅ Success responses (200)
- ✅ Validation errors (400)
- ✅ Email sending integration



## 📡 API Reference

### POST /contact

Send a contact form submission.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "Your message here (min 10 chars, max 5000 chars)"
}
```

**Validation Rules:**
- `name`: 2-100 characters
- `email`: Valid email format, max 254 characters
- `message`: 10-5000 characters

**Success Response (200):**

```json
{
  "success": true,
  "message": "Email sent successfully"
}
```

**Validation Error (400):**

```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

**Rate Limit Error (429):**

```json
{
  "success": false,
  "message": "Too many requests from this IP, please try again later."
}
```

**Server Error (500):**

```json
{
  "success": false,
  "message": "Failed to send email"
}
```

### GET /health

Health check endpoint.

**Success Response (200):**

```json
{
  "status": "OK"
}
```



## 📄 License

ISC



## 👤 Author

**Ghivalla**
- GitHub: [@Ghivalla](https://github.com/Ghivalla)
- Website: [ghivalla.com](https://ghivalla.com)
