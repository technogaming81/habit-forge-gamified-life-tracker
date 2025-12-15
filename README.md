# Habit Forge - Gamified Life Tracker

[cloudflarebutton]

Habit Forge is a visually immersive, gamified habit tracking application that transforms daily routines into an RPG-like experience. It combines behavioral psychology with engaging game mechanics—XP, levels, coins, streaks, badges, and daily quests—to keep users motivated and consistent.

## 🚀 Features

- **Immersive Dashboard**: User stats header (Level, XP progress, Coins), dynamic habit grid with drag-to-reorder, daily quests widget, and mood tracker.
- **Gamification Engine**: Earn XP and coins for completions, level up with progress bars, spend coins in the shop on streak freezes and themes.
- **Advanced Analytics**: GitHub-style yearly heatmap, habit stats, streak history, and mood correlations (using Recharts).
- **Flexible Habit Management**: Daily/weekly/specific days scheduling, incremental targets (e.g., 8/8 glasses), positive/negative habits, notes.
- **Stunning Visuals**: Illustrative design with soft shadows, rounded corners, vibrant Green/Gold/Purple palette, smooth Framer Motion animations, and confetti celebrations.
- **Responsive & Accessible**: Mobile-first layout with sidebar navigation, dark/light theme support.
- **Real-time Polish**: Instant feedback, hover effects, loading states, and professional UI with Shadcn/UI components.

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript, Vite, React Router v6, Tailwind CSS v3, Shadcn/UI, Framer Motion, Recharts, Zustand (state), Lucide Icons, Sonner (toasts), Canvas Confetti.
- **Backend**: Hono (API routes), Cloudflare Workers (serverless deployment).
- **Utilities**: clsx, tailwind-merge, date-fns, immer, Zod.
- **Dev Tools**: ESLint, Bun (package manager), Wrangler (Cloudflare CLI).

## ⚡ Quick Start

### Prerequisites
- [Bun](https://bun.sh/) (recommended package manager)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install/) (for Cloudflare deployment)

### Installation
```bash
# Clone the repo
git clone <your-repo-url>
cd habit_forge

# Install dependencies
bun install
```

### Development
```bash
# Start dev server (localhost:3000)
bun run dev

# Lint code
bun run lint

# Build for production
bun run build

# Preview production build
bun run preview
```

## 📖 Usage

- **Landing Page** (`/`): Marketing hero with features and "Get Started" CTA (unauthenticated users).
- **Dashboard** (authenticated): Overview tab with habit grid, quests, mood, badges; Analytics tab with heatmap.
- **Interactions**: Check habits for XP/coins, drag to reorder, view shop modal for purchases.
- **Routing**: Sidebar navigation (Overview, Analytics, Shop, Settings).
- **State Management**: Zustand store with mock data for frontend; extensible to Cloudflare KV/Workers.

Example habit completion flow:
1. Click check button on habit card → XP/coins update instantly.
2. Level up → Animated progress bar + confetti.
3. View Analytics → Interactive heatmap shows consistency.

## ☁️ Deployment to Cloudflare

Deploy to Cloudflare Workers in one command:

```bash
# Generate types (if needed)
bun run cf-typegen

# Deploy
bun run deploy
```

This bundles the Vite-built assets and deploys the Worker with SPA routing.

[cloudflarebutton]

## 🤝 Contributing

1. Fork the repo and create a feature branch (`git checkout -b feat/amazing-feature`).
2. Commit changes (`git commit -m 'Add amazing feature'`).
3. Push to branch (`git push origin feat/amazing-feature`).
4. Open a Pull Request.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.