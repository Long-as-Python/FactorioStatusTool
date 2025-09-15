import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Factorio Server Dashboard',
  description: 'Monitor Factorio server status and activity',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
