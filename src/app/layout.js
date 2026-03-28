import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SaaSFlow | Multi-Tenant Business Management",
  description: "Ultra-premium business management platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body dir="ltr" className={`${inter.className} bg-background text-foreground antialiased selection:bg-accent/30 selection:text-accent`}>
        {/* Background Gradient Glow (Liquid Effect) */}
        <div className="fixed -z-10 h-full w-full overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] h-[40%] w-[40%] rounded-full bg-accent/10 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-accent/5 blur-[120px]" />
        </div>
        
        {children}
      </body>
    </html>
  );
}