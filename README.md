# SiliconFriends

SiliconFriends is a modern web application built with **Next.js 16**, featuring a robust authentication system, an AI-powered resume builder, and an intuitive user interface powered by **HeroUI** and **Tailwind CSS**.

## ✨ Features

- **Authentication**: Secure login and registration using **Better Auth**.
- **Role-Based Access Control**: Separate dashboard and routing for `admin` and regular users.
- **AI Resume Builder**: Create, edit, and generate PDFs of resumes tailored to your skills and experience.
- **Modern UI**: Built with **HeroUI** and **Tailwind CSS v4** for a sleek, responsive design.
- **Animations**: Smooth transitions and interactions powered by **Framer Motion**.
- **Database**: Efficient and scalable database operations using **Drizzle ORM** and **Turso (LibSQL)**.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/), [HeroUI](https://heroui.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Authentication**: [Better Auth](https://better-auth.com/)
- **Database ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Database Provider**: [Turso](https://turso.tech/) (LibSQL)
- **PDF Generation**: `@react-pdf/renderer`, `jspdf`, `html2canvas`
- **State Management**: [Nanostores](https://github.com/nanostores/nanostores)

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
- Node.js (v20+)
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/siliconfriends.git
   cd siliconfriends
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Set up environment variables:**

   Create a `.env.local` file in the root directory and add your necessary environment variables (e.g., Database URL, Better Auth secret, etc.).

   ```env
   # Example .env.local
   DATABASE_URL=your_turso_database_url
   DATABASE_AUTH_TOKEN=your_turso_auth_token
   BETTER_AUTH_SECRET=your_auth_secret
   ```

4. **Run database migrations:**

   ```bash
   npx drizzle-kit push
   ```

5. **Start the development server:**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application in action.

## 📁 Project Structure

- `app/`: Next.js App Router containing pages, layouts, and API routes.
  - `admin/`: Admin dashboard pages.
  - `profile/`: User profile and resume builder pages.
  - `login/` & `register/`: Authentication pages.
  - `components/`: Reusable React components (including the AI Resume Builder).
- `lib/`: Utility functions and shared libraries.
- `db/` & `drizzle/`: Database schemas, configuration, and migrations.
- `actions/`: Server actions for Next.js.
- `public/`: Static assets like images and fonts.

## 📜 Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the app for production.
- `npm run start`: Runs the production server.
- `npm run lint`: Runs ESLint to check for code issues.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/your-username/siliconfriends/issues).

## 📝 License

This project is licensed under the MIT License.
