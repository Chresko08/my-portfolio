# 🌐 Shubham Srivastava — Portfolio Website

[![Deploy to GitHub Pages](https://github.com/Chresko08/my-portfolio/actions/workflows/deploy.yml/badge.svg)](https://github.com/Chresko08/my-portfolio/actions/workflows/deploy.yml)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-4.4.5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-10.16.4-FF0055?logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![GitHub Pages](https://img.shields.io/badge/Hosted%20on-GitHub%20Pages-222222?logo=github&logoColor=white)](https://chresko08.github.io/my-portfolio/)

A modern, fast, and interactive developer portfolio for **Shubham Srivastava**, Big Data Engineer & Business Analyst. Built with **React 18**, **Vite**, and **Framer Motion**, featuring glassmorphic UI design, animated data-engineering-themed SVGs, active scroll-spy navigation, dark/light theme switching, interactive project & skill filters, one-click copy contact actions, and automated CI/CD deployment via GitHub Actions.

🔗 **Live Demo:** [https://chresko08.github.io/my-portfolio/](https://chresko08.github.io/my-portfolio/)

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Architecture & Structure](#-project-architecture--structure)
- [Component Breakdown](#-component-breakdown)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Development Server](#development-server)
  - [Production Build](#production-build)
- [Available Scripts](#-available-scripts)
- [Deployment](#-deployment)
  - [Automated Deployment (GitHub Actions)](#automated-deployment-github-actions)
  - [Manual Deployment](#manual-deployment)
- [Configuration & Customization](#-configuration--customization)
- [Connect & Contact](#-connect--contact)
- [License](#-license)

---

## ✨ Features

- **⚡ High Performance:** Ultra-fast bundling and Hot Module Replacement (HMR) powered by Vite 4.
- **🎨 Glassmorphic Modern UI:** Frosted glass cards (`backdrop-filter: blur(14px)`), ambient radial gradient orbs, and clean typography with Google Font *Outfit*.
- **🌓 Dark & Light Themes:** Instant theme toggle with animated sun/moon transition, subtle glow, and `localStorage` persistence.
- **🧭 Active Scroll-Spy Navigation:** Header automatically tracks and highlights the active section as you scroll.
- **📊 Interactive Key Metrics & Counters:** Quick-impact stat cards highlighting 4+ years experience, 500+ SQL rules, 60% pipeline optimization, and AWS certifications.
- **🏷️ Interactive Skill Filters:** Dynamically filter technical competencies (*All*, *Big Data & ETL*, *Cloud & DBs*, *Languages & Tools*) with Framer Motion layout animations.
- **💼 Interactive Career Timeline:** Toggle between *Professional Experience* (EY, Infosys) and *Internships & Training* with KPI impact badges and verifiable credential links.
- **🚀 Categorized Projects Showcase:** Filter enterprise Big Data architectures and cloud infrastructure initiatives, complete with impact metrics and custom animated SVGs.
- **📜 Verified Credentials Grid:** Dedicated highlight for AWS Certified Cloud Practitioner alongside direct verification cards for HackerRank credentials (SQL Advanced, Python, Java, Problem Solving).
- **📋 One-Click Copy Email:** Copy contact email directly to clipboard with real-time feedback toast notification.
- **⬆️ Smooth Back-To-Top Button:** Floating action button with smooth animation when scrolling through the page.
- **🤖 Automated CI/CD:** Auto-deploys to GitHub Pages on every push to `main` with build date injection.

---

## 🛠 Tech Stack

### Core Framework & Tooling
| Technology | Role |
| :--- | :--- |
| **[React 18](https://react.dev/)** | Component-based UI library |
| **[Vite 4](https://vitejs.dev/)** | Next-generation frontend build tool and dev server |
| **[Framer Motion](https://www.framer.com/motion/)** | Production-ready motion and gesture library |
| **[React Icons](https://react-icons.github.io/react-icons/)** | Icon sets (Feather Icons, Simple Icons) |
| **[ESLint](https://eslint.org/)** | Code quality and linting |
| **[gh-pages](https://www.npmjs.com/package/gh-pages)** | Deployment utility for static hosting on GitHub Pages |

### Styling & Design System
- Pure CSS3 with CSS custom properties (`--bg-color`, `--surface-color`, `--primary-color`, etc.)
- Glassmorphic card design tokens with responsive grid and flexbox layouts
- Google Font: **[Outfit](https://fonts.google.com/specimen/Outfit)** (300, 400, 500, 600, 700, 800)

---

## 📂 Project Architecture & Structure

```
my-portfolio/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions CI/CD deployment workflow
├── public/
│   └── profile.jpg             # Shubham's profile photograph
├── src/
│   ├── components/
│   │   ├── About.jsx           # Bio, stats counter, interactive skill category filters
│   │   ├── BackToTop.jsx       # Floating scroll-to-top button
│   │   ├── Certificates.jsx    # AWS highlight card & HackerRank verified badges
│   │   ├── Contact.jsx         # Contact CTA, copy-to-clipboard button & social grid
│   │   ├── Experience.jsx      # Interactive work timeline (EY, Infosys) & internships
│   │   ├── Hero.jsx            # Hero section with status pill, tech chips & quick actions
│   │   ├── Logo.jsx            # Dynamic isometric SVG data cube logo
│   │   ├── LogoShowcase.jsx    # Logo concepts design showcase
│   │   ├── Navbar.jsx          # Scroll-spy navigation, theme switcher & resume CTA
│   │   └── Projects.jsx        # Interactive project filter cards & impact metrics
│   ├── App.jsx                 # Layout orchestrator, BackToTop & dynamic footer
│   ├── index.css               # Design system, glassmorphic tokens & responsive styling
│   └── main.jsx                # DOM mount entry point (React.StrictMode)
├── .gitignore                  # Git ignore rules (node_modules, dist, etc.)
├── index.html                  # HTML5 entry template with font links & viewport meta
├── install_deps.sh             # Helper shell script for dependency installation
├── package.json                # Project dependencies, metadata, and scripts
├── package-lock.json           # Lockfile for reproducible installs
├── start_dev.sh                # Helper shell script for starting the dev server
└── vite.config.js              # Vite bundler configuration (React plugin, base URL)
```

---

## 🧩 Component Breakdown

| Component | Description |
| :--- | :--- |
| [`Navbar.jsx`](src/components/Navbar.jsx) | Fixed top navbar with scroll-spy tracking, theme switcher (`FiSun`/`FiMoon`), mobile drawer menu, and resume link. |
| [`Hero.jsx`](src/components/Hero.jsx) | Introductory header with live availability pill, floating tech chips, personal intro, CTA buttons, and quick social links. |
| [`About.jsx`](src/components/About.jsx) | Profile photo in glowing gradient frame, career summary, B.Tech education, AWS certification, impact counters, and categorized skill pills. |
| [`Experience.jsx`](src/components/Experience.jsx) | Interactive timeline toggleable between enterprise roles (EY, Infosys) and internships with impact badges and verified certificate links. |
| [`Projects.jsx`](src/components/Projects.jsx) | Filterable project showcase (*All*, *Enterprise Big Data*, *Cloud & Infrastructure*) with key impact metrics and custom SVGs. |
| [`Certificates.jsx`](src/components/Certificates.jsx) | Verified credentials with dedicated AWS Certified Cloud Practitioner card and HackerRank certification links. |
| [`Contact.jsx`](src/components/Contact.jsx) | Direct email CTA with interactive "Copy Email" button (with toast feedback) and social platform grid. |
| [`BackToTop.jsx`](src/components/BackToTop.jsx) | Floating scroll-to-top button appearing after scrolling past the hero. |
| [`Logo.jsx`](src/components/Logo.jsx) | Animated vector graphic symbolizing data pipelines (isometric block, flowing stream, and pulsating nodes). |

---

## 🚀 Getting Started

### Prerequisites

- **[Node.js](https://nodejs.org/)** (v18.0.0 or higher recommended)
- **[npm](https://www.npmjs.com/)** (v9.0.0 or higher) or yarn/pnpm

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Chresko08/my-portfolio.git
   cd my-portfolio
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

### Development Server

Start the Vite development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173/my-portfolio/`.

### Production Build

To compile and bundle optimized static assets for production:

```bash
npm run build
```

The compiled files will be output to the `dist/` folder.

To preview the production build locally:

```bash
npm run preview
```

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Runs the app in development mode on Vite server |
| `npm run build` | Compiles the production build into `dist/` |
| `npm run preview` | Serves the production build locally for verification |
| `npm run lint` | Runs ESLint to check for code style and syntax errors |
| `npm run predeploy` | Automatically runs `npm run build` prior to deployment |
| `npm run deploy` | Deploys the `dist/` directory to GitHub Pages via `gh-pages` |

---

## 🚢 Deployment

### Automated Deployment (GitHub Actions)

This repository includes a GitHub Actions workflow located at [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

- Every push to the `main` branch automatically triggers the workflow.
- Injects `VITE_LAST_UPDATED` with the current date.
- Executes `npm install` and `npm run build`.
- Deploys the built `dist/` directory to the `gh-pages` branch using `JamesIves/github-pages-deploy-action@v4`.

### Manual Deployment

To deploy directly from your local terminal:

```bash
npm run deploy
```

---

## 📬 Connect & Contact

- **Name:** Shubham Srivastava
- **Role:** Big Data Engineer & Business Analyst
- **Email:** [shubhamsrivastava08@gmail.com](mailto:shubhamsrivastava08@gmail.com)
- **LinkedIn:** [linkedin.com/in/chresko](https://www.linkedin.com/in/chresko)
- **GitHub:** [@Chresko08](https://github.com/Chresko08)
- **LeetCode:** [leetcode.com/u/shubham_chresko](https://leetcode.com/u/shubham_chresko/)
- **Resume:** [View on Google Drive](https://drive.google.com/file/d/13T3uAmP2iG6Pq2qosDZdNuk17G41v7cf/view?usp=share_link)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE). Feel free to customize and use it for your own portfolio!
