import { Inter, Source_Code_Pro } from "next/font/google";
import "./globals.css";
import Providers from "./providers"; // 👈 import the wrapper

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const sourceCodePro = Source_Code_Pro({ subsets: ["latin"], variable: "--font-mono" });

export const metadata = {
  title: "Vosler | Proving Grounds",
  description: "Mission-Ready Team Builder",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${sourceCodePro.variable} antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
