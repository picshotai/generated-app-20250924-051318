# Edge Podium: F1 Fantasy

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/picshotai/generated-app-20250924-051318)

Edge Podium is a retro-themed Formula 1 fantasy league application. Users can create and manage their own F1 fantasy team by selecting 5 drivers and 1 constructor while adhering to a $100M budget. The application calculates points based on real-world race results, allowing users to compete in public and private leagues. The entire user interface is designed with a nostalgic, early-internet 'Retro' aesthetic, featuring pixel art fonts, neon color palettes, glitch effects, and grainy textures to evoke the feeling of 90s web culture while delivering a modern, responsive user experience.

## ✨ Key Features

*   **Team Creation:** Build your dream F1 team of 5 drivers and 1 constructor.
*   **Budget Management:** Strategize your picks to stay within the $100M salary cap.
*   **Retro UI/UX:** A unique, visually stunning interface inspired by 90s web design, built with modern technology.
*   **Fantasy Leagues:** Compete against friends and other F1 fans in public and private leagues.
*   **Points System:** Scoring based on real-world F1 race results for qualifying, sprints, and Grand Prix.
*   **Responsive Design:** A flawless experience on desktop, tablet, and mobile devices.

## 🛠️ Technology Stack

*   **Frontend:** React, Vite, React Router, Zustand, Tailwind CSS, shadcn/ui, Framer Motion
*   **Backend:** Hono on Cloudflare Workers
*   **Storage:** Cloudflare Durable Objects
*   **Language:** TypeScript
*   **Tooling:** Bun, Wrangler CLI

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   [Bun](https://bun.sh/) installed on your machine.
*   [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) for Cloudflare development and deployment.

### Installation

1.  **Clone the repository:**
    ```sh
    git clone <repository-url>
    cd edge_podium_f1_fantasy
    ```

2.  **Install dependencies:**
    This project uses Bun for package management.
    ```sh
    bun install
    ```

3.  **Run the development server:**
    This command starts the Vite development server for the frontend and the Wrangler development server for the backend worker simultaneously.
    ```sh
    bun run dev
    ```
    The application will be available at `http://localhost:3000`.

## 🖥️ Development

The project is structured as a monorepo with a shared core, a frontend application, and a backend worker.

*   `src/`: Contains the React frontend application. All pages, components, and client-side logic reside here.
*   `worker/`: Contains the Hono backend application that runs on Cloudflare Workers. API routes and Durable Object entity definitions are located here.
*   `shared/`: Contains shared TypeScript types and mock data used by both the frontend and the backend to ensure type safety.

## ☁️ Deployment

This project is designed for seamless deployment to Cloudflare's global network.

1.  **Build the project:**
    This command bundles the frontend and backend for production.
    ```sh
    bun run build
    ```

2.  **Deploy to Cloudflare:**
    Ensure you are logged in to your Cloudflare account via the Wrangler CLI (`wrangler login`). Then, run the deploy command:
    ```sh
    bun run deploy
    ```
    Wrangler will deploy your application, including the static assets and the worker, to your Cloudflare account.

Alternatively, you can deploy your own version of this project with a single click.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/picshotai/generated-app-20250924-051318)