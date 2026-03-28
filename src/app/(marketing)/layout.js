import Footer from "@/components/marketing/Footer";
import Navbar from "@/components/shared/Navbar";

export default function MarketingLayout({ children }) {
  return (
    <div className="relative min-h-screen">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}