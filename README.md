# MindCare AI

<div align="center">

![MindCare AI Landing Page](https://github.com/shashwatkarna/mindcareai/blob/main/public/screenshots/landing-page.png)

<br />

<h1>Mental Wellness, Reimagined.</h1>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-project-gallery">Gallery</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a>
</p>

<p align="center">
  <b>A secure, privacy-focused platform for mental health support and wellness tracking.</b>
</p>

</div>

---

## 📖 Introduction

**MindCare AI** is more than just an app; it's a comprehensive mental health companion designed to empower you on your wellness journey. Built with a "Privacy First" philosophy, it offers a sanctuary for tracking moods, journaling thoughts, and accessing vital resources. Whether you're monitoring daily emotional trends or scheduling professional appointments, MindCare AI integrates seamlessly into your life.

## 📸 Project Gallery

Take a peek inside MindCare AI.

| **Features Overview** | **Pricing Plans** |
|:---:|:---:|
| ![Features](/screenshots/features.png) | ![Pricing](/screenshots/pricing.png) |
| **About Us** | **Secure Login** |
| ![About](/screenshots/about.png) | ![Login](/screenshots/login.png) |

## ✨ Features

- **🔐 Privacy First**:
  Secure user authentication and encrypted data handling powered by **Supabase**. Your data is yours alone.
- **📊 Wellness Dashboard**:
  A personalized hub to view your daily wellness snapshot, activity summaries, and progress at a glance.
- **😊 Mood Tracking**:
  Log your daily moods and visualize emotional trends over time with intuitive charts.
- **📓 Private Journal**:
  A secure space to record thoughts and reflections, helping you process emotions effectively.
- **📝 Assessments**:
  Clinically-inspired assessments to gain deeper insights into your mental well-being.
- **📅 Appointments**:
  Easily schedule and manage appointments with certified mental health professionals.
- **💎 Premium Content**:
  Unlock exclusive resources, guided exercises, and premium tools for just ₹1.

## 🛠 Tech Stack

Built with the latest and greatest web technologies for performance and scale.

<div align="center">

| Core | Styling | Backend | Tools |
| :---: | :---: | :---: | :---: |
| **Next.js 16** (App Router) | **Tailwind CSS 4** | **Supabase** (Auth & DB) | **TypeScript** |
| **React 19** | **Shadcn UI** | **PostgreSQL** | **Recharts** |

</div>

## 🚀 Getting Started

Follow these periods to set up the project locally.

### Prerequisites

*   [Node.js](https://nodejs.org/) (Latest LTS)
*   [Git](https://git-scm.com/)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/mindcare-ai.git
    cd mindcare-ai
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    # or
    bun install
    ```

3.  **Environment Setup:**

    Create a `.env.local` file in the root directory and add your Supabase credentials:

    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Running the Dev Server:**

    ```bash
    npm run dev
    ```

5.  **Explore:**

    Open [http://localhost:3000](http://localhost:3000) with your browser to witness the application in action.

## 📂 Project Structure

A quick look at the top-level files and directories you'll encounter.

- `app/`: The heart of the application, containing pages and API routes.
- `components/`: A library of reusable UI components.
- `public/`: Static assets like images and icons.
- `lib/`: Utility functions and database helpers.

## 📄 License

This project is proudly open source and available under the [MIT License](LICENSE).
