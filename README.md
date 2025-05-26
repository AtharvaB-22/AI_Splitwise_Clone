Splitr
Splitr is a modern web application designed to streamline the process of managing shared expenses, splitting bills, and tracking balances among friends and groups. It offers a unique, user-friendly interface and a robust backend to make group finances simple and efficient.

Table of Contents

Features
Technologies Used
Installation
Usage
Deployment
Contributing
License
Acknowledgements


Features

User Authentication: Secure sign-up and login powered by Clerk.
Group Management: Create and manage groups to organize expense sharing.
Expense Tracking: Add expenses, define splits among group members, and track debts.
Balance Overview: View individual and group balances clearly.
Transaction History: Access a detailed log of expenses and settlements.
Email Notifications: Send updates to users via email using RESEND.


Technologies Used

Frontend and Backend: Next.js - A React framework for full-stack development.
Authentication: Clerk - Manages user authentication and sessions.
Database and Backend: Convex - A platform for real-time data and backend logic.
Task Scheduling: Inngest - Handles background jobs and workflows.
Email Service: RESEND - Sends transactional emails to users.
Styling: Tailwind CSS - A utility-first CSS framework for responsive design.


Installation
To set up Splitr locally, follow these steps:
Prerequisites

Node.js (v14 or later)
Convex account for backend services
Clerk account for authentication
RESEND account for email services
Inngest account for task scheduling (if applicable)

Steps

Clone the repository:
git clone https://github.com/yourusername/splitr.git
cd splitr

Replace yourusername with your GitHub username or the correct repository URL.

Install dependencies:
npm install


Set up environment variables:Create a .env.local file in the project root and add the following:
# Deployment used by `npx convex dev`
CONVEX_DEPLOYMENT=
NEXT_PUBLIC_CONVEX_URL=

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
CLERK_JWT_ISSUER_DOMAIN=

# RESEND
RESEND_API_KEY=

# Gemini API (if used)
GEMINI_API_KEY=


CONVEX_DEPLOYMENT and NEXT_PUBLIC_CONVEX_URL: Get these from your Convex dashboard.
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY and CLERK_SECRET_KEY: Obtain from your Clerk dashboard.
CLERK_JWT_ISSUER_DOMAIN: Your Clerk instance’s issuer domain.
RESEND_API_KEY: From your RESEND account.
GEMINI_API_KEY: Add your key here if using the Gemini API.


Run the development server:
npm run dev


Open your browser and visit http://localhost:3000.



Usage
Here’s how to use Splitr:

Sign Up or Log In: Create an account or log in using Clerk.
Create a Group: Start a group and invite friends to join.
Add an Expense: Input expense details (amount, description, participants) and split it as needed.
View Balances: See who owes what within the group.
Settle Up: Record payments to resolve balances.


Deployment
Splitr is deployed on Vercel, a platform optimized for Next.js applications.

Deployment URL: https://your-splitr-app.vercel.app (replace with your actual URL)
Environment Variables: Add all variables from .env.local to Vercel’s dashboard under your project’s settings.

Refer to the Vercel documentation for detailed deployment instructions.

Contributing
Contributions are welcome! To contribute:

Fork the repository.
Create a branch for your changes (git checkout -b feature/your-feature).
Commit your updates with clear messages.
Push your branch and submit a pull request.

Ensure your code aligns with the project’s style and includes any necessary tests.

License
This project is licensed under the MIT License.

