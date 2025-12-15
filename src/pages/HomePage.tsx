// This file now delegates to LandingPage.
// The main routing logic is in src/main.tsx.
import { LandingPage } from './LandingPage';
export function HomePage() {
  return <LandingPage />;
}