import './globals.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import BootstrapClient from './components/BootstrapClient';

export const metadata = {
  title: 'Zip! Puzzle Game',
  description: 'A simple path-drawing game',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body>
        <Analytics />
        <SpeedInsights />
        <BootstrapClient />
        {children}
      </body>
    </html>
  );
}