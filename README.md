# zocket-assignment
Take home frontend assignment for zocket
# AI-Powered Task Management System

## Overview
This project is an AI-powered task management system that helps users create, assign, and track tasks efficiently. It includes AI-based task suggestions and a chatbot for assistance.

## Tech Stack
- **Frontend**: Next.js (TypeScript) with Tailwind CSS (Deployed on Vercel)
- **Backend**: Flask (Runs locally)
- **AI Integration**: Gemini API for task recommendations

## Live Frontend Deployment
The frontend is deployed on Vercel and can be accessed here:
👉 [AI Task Management System](https://zocket-assignmnt.vercel.app/)

## Running the Chatbot Backend Locally
To run the chatbot backend, execute the following command:

```sh
$env:GEMINI_API_KEY="YOUR_GEMINI_API_KEY"; python chatbot.py
```

**Note:** Replace `YOUR_GEMINI_API_KEY` with your actual API key.

## Features
✅ Task creation, assignment, and tracking  
✅ AI-powered task recommendations  
✅ JWT-based authentication  
✅ Next.js frontend deployed on Vercel  
✅ Flask backend runs locally  

## Setup Instructions
### 1. Clone the Repository
```sh
git clone https://github.com/your-repo.git
cd your-repo
```

### 2. Install Frontend Dependencies
```sh
cd frontend
npm install
```

### 3. Run the Frontend Locally
```sh
npm run dev
```

### 4. Run the Flask Backend Locally
```sh
cd backend
$env:GEMINI_API_KEY="YOUR_GEMINI_API_KEY"; python chatbot.py
```

## Test Credentials
To test the functionalities, use the following credentials:
- **Username**: `admin`
- **Password**: `password123`

## Notes
- Ensure you have Python installed to run the chatbot.
- The frontend is already live on Vercel, but the backend must be run locally.


