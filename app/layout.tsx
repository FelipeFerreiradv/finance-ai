import type { Metadata } from 'next';
import { Mulish } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import './globals.css';
import { Toaster } from './components/ui/sonner';

const mulish = Mulish({
  subsets: ['latin-ext'],
});

export const metadata: Metadata = {
  title: 'Finnance AI',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${mulish.className} antialiased dark h-full bg-[#0b0b0b]`}
      >
        <ClerkProvider appearance={{ baseTheme: dark }}>
          {children}
          <Toaster />
        </ClerkProvider>
      </body>
    </html>
  );
}
