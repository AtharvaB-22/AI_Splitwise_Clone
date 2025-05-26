# Splitr

Splitr is a modern web application designed to streamline the process of managing shared expenses, splitting bills, and tracking balances among friends and groups. It offers a unique, user-friendly interface and a robust backend to make group finances simple and efficient.

---

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

---

## Features

- **User Authentication**: Secure sign-up and login powered by Clerk.
- **Group Management**: Create and manage groups to organize expense sharing.
- **Expense Tracking**: Add expenses, define splits among group members, and track debts.
- **Balance Overview**: View individual and group balances clearly.
- **Transaction History**: Access a detailed log of expenses and settlements.
- **Email Notifications**: Send updates to users via email using RESEND.

---

## Technologies Used

- **Frontend and Backend**: [Next.js](https://nextjs.org/) - A React framework for full-stack development.
- **Authentication**: [Clerk](https://clerk.dev/) - Manages user authentication and sessions.
- **Database and Backend**: [Convex](https://convex.dev/) - A platform for real-time data and backend logic.
- **Task Scheduling**: [Inngest](https://inngest.com/) - Handles background jobs and workflows.
- **Email Service**: [RESEND](https://resend.com/) - Sends transactional emails to users.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework for responsive design.

---

## Installation

To set up Splitr locally, follow these steps:

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [Convex](https://convex.dev/) account for backend services
- [Clerk](https://clerk.dev/) account for authentication
- [RESEND](https://resend.com/) account for email services
- [Inngest](https://inngest.com/) account for task scheduling (if applicable)

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/splitr.git
   cd splitr
   ```
   *Replace `yourusername` with your GitHub username or the correct repository URL.*

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the project root and add the following:
   ```
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
   ```
   - `CONVEX_DEPLOYMENT` and `NEXT_PUBLIC_CONVEX_URL`: Get these from your Convex dashboard.
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`: Obtain from your Clerk dashboard.
   - `CLERK_JWT_ISSUER_DOMAIN`: Your Clerk instance’s issuer domain.
   - `RESEND_API_KEY`: From your RESEND account.
   - `GEMINI_API_KEY`: Add your key here if using the Gemini API.

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. Open your browser and visit `http://localhost:3000`.

---

## Usage

Here’s how to use Splitr:

1. **Sign Up or Log In**: Create an account or log in using Clerk.
2. **Create a Group**: Start a group and invite friends to join.
3. **Add an Expense**: Input expense details (amount, description, participants) and split it as needed.
4. **View Balances**: See who owes what within the group.
5. **Settle Up**: Record payments to resolve balances.

---

## Deployment

Splitr is deployed on [Vercel](https://vercel.com/), a platform optimized for Next.js applications.

- **Deployment URL**: `https://your-splitr-app.vercel.app` (replace with your actual URL)
- **Environment Variables**: Add all variables from `.env.local` to Vercel’s dashboard under your project’s settings.

Refer to the [Vercel documentation](https://vercel.com/docs) for detailed deployment instructions.

---

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a branch for your changes (`git checkout -b feature/your-feature`).
3. Commit your updates with clear messages.
4. Push your branch and submit a pull request.

Ensure your code aligns with the project’s style and includes any necessary tests.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Acknowledgements

- Built with cutting-edge web technologies for a seamless experience.
- Thanks to the teams behind Next.js, Clerk, Convex, Inngest, RESEND, and Tailwind CSS for their excellent tools.

