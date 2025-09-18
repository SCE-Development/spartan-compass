import { GeistSans } from 'geist/font/sans';
import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/header';
import { ThemeProvider } from '@/components/theme-provider';

export const metadata: Metadata = {
  title: 'Spartan Compass',
  description: 'An SJSU exclusive professor search tool',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header>{children}</Header>
        </ThemeProvider>
      </body>
    </html>
  );
}
