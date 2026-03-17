import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sora 2 - Free Unlimited Video Generation',
  description: 'Powered by CloudPrice.net - No Limits AI Video Generation',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-zinc-950 text-zinc-100 min-h-screen">{children}</body>
    </html>
  );
}