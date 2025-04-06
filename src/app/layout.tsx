import { ClerkProvider } from '@clerk/nextjs';
import { Inter, Source_Code_Pro } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const sourceCodePro = Source_Code_Pro({ subsets: ['latin'], variable: '--font-mono' });

export const metadata = {
  title: 'Vosler | Team Builder',
  description: 'Mission-Ready Team Builder',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${sourceCodePro.variable} antialiased`}>
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
