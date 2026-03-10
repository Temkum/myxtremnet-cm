'use client';

// import { Header } from '@/components/header';
import { HeroSection } from '@/components/sections/hero-section';
import { UserSection } from '@/components/sections/user-section';
import { ProductSection } from '@/components/sections/product-section';
import { ContactSection } from '@/components/sections/contact-section';
import { Footer } from '@/components/footer';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      {/* <Header /> */}
      <main className="flex-1">
        <HeroSection />
        <UserSection />
        <ProductSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
