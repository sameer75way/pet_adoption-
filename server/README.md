# Pet Adoption - Server

This is the backend for the Pet Adoption application. It is built using Node.js, Express, and TypeScript, and relies on MongoDB and Redis.

## Important environment variables

Create a `.env` file with the following variables before running:

```
NODE_ENV=development
PORT=5000

MONGODB_URI=mongodb://localhost:27017/pet-adoption
REDIS_URL=redis://localhost:6379

JWT_ACCESS_SECRET=your_super_secret_access_key
JWT_REFRESH_SECRET=your_super_secret_refresh_key
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

CLIENT_URL=http://localhost:5173
BCRYPT_ROUNDS=12

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
OTP_EXPIRY=300
OTP_LENGTH=6
```

## Available Scripts

- `npm run dev`: Start the development server using nodemon/ts-node.
- `npm run build`: Build the TypeScript code.
- `npm start`: Run the built code.
