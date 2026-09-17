import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Hero from '../../components/Hero';
import TouchscreenExperience from '../../components/TouchscreenExperience';
import HowItWorks from '../../components/HowItWorks';
import IdleAdsFeature from '../../components/IdleAdsFeature';
import LivePrintModal from '../../components/LivePrintModal';
import FeaturesGrid from '../../components/FeaturesGrid';
import ROICalculator from '../../components/ROICalculator';
import LocationsStats from '../../components/LocationsStats';
import WhereItFits from '../../components/WhereItFits';
import KioskSpecs from '../../components/KioskSpecs';
import FranchiseModels from '../../components/FranchiseModels';
import FranchiseForm from '../../components/FranchiseForm';
import FAQSection from '../../components/FAQSection';
import CTAHostBanner from '../../components/CTAHostBanner';
import Footer from '../../components/Footer';
import AboutPage from '../../components/AboutPage';
import XeroxShopPage from '../../components/XeroxShopPage';
import ContactPage from '../../components/ContactPage';
import FloatingWhatsAppWidget from '../../components/FloatingWhatsAppWidget';

export default function LandingPage() {
  const [activePage, setActivePage] = useState('home'); // 'home', 'about', 'franchise', 'xerox-shop', 'contact'
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [selectedFranchiseModel, setSelectedFranchiseModel] = useState('own');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage]);

  const handleOpenFranchise = (modelTitle = 'own') => {
    setActivePage('franchise');
    setSelectedFranchiseModel(modelTitle);
    setTimeout(() => {
      const el = document.getElementById('franchise-form-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between relative selection:bg-[#0C3D97] selection:text-white">
      
      {/* Top Floating Glassmorphism Navbar with Partner & Admin Login */}
      <Navbar 
        activePage={activePage} 
        setActivePage={setActivePage} 
        onOpenPrintModal={() => setIsPrintModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activePage === 'home' && (
          <>
            {/* 1. Hero Section */}
            <Hero 
              onOpenPrintModal={() => setIsPrintModalOpen(true)}
              onOpenFranchise={() => handleOpenFranchise('own')}
            />

            {/* 2. Interactive Touchscreen Hardware Experience */}
            <TouchscreenExperience onOpenPrintModal={() => setIsPrintModalOpen(true)} />

            {/* 3. How to Use Section */}
            <HowItWorks onOpenPrintModal={() => setIsPrintModalOpen(true)} />

            {/* 4. Idle Screen Advertisement Monetization Feature */}
            <IdleAdsFeature onOpenFranchise={() => handleOpenFranchise('host')} />

            {/* 5. Features Section */}
            <FeaturesGrid />

            {/* 6. Interactive ROI & Profit Calculator */}
            <ROICalculator onOpenFranchise={() => handleOpenFranchise('own')} />

            {/* 7. Live Kiosk Locations & Network Map */}
            <LocationsStats />

            {/* 8. Where Does EasyXerox Fit */}
            <WhereItFits onOpenFranchise={() => handleOpenFranchise('host')} />

            {/* 9. Hardware Specs: PRO vs MINI */}
            <KioskSpecs onOpenFranchise={() => handleOpenFranchise('own')} />

            {/* 10. Franchise Models */}
            <FranchiseModels onSelectModel={(model) => handleOpenFranchise(model)} />

            {/* 11. Multi-Step Franchise Application Form */}
            <FranchiseForm initialModel={selectedFranchiseModel} />

            {/* 12. FAQ Accordions */}
            <FAQSection />

            {/* 13. Host Kiosk CTA Banner */}
            <CTAHostBanner onOpenFranchise={() => handleOpenFranchise('host')} />
          </>
        )}

        {activePage === 'about' && (
          <AboutPage onOpenFranchise={() => handleOpenFranchise('own')} />
        )}

        {activePage === 'franchise' && (
          <div className="pt-10">
            <FranchiseModels onSelectModel={(model) => handleOpenFranchise(model)} />
            <ROICalculator onOpenFranchise={() => handleOpenFranchise('own')} />
            <KioskSpecs onOpenFranchise={() => handleOpenFranchise('own')} />
            <FranchiseForm initialModel={selectedFranchiseModel} />
            <FAQSection />
          </div>
        )}

        {activePage === 'xerox-shop' && (
          <XeroxShopPage onOpenFranchise={() => handleOpenFranchise('own')} />
        )}

        {activePage === 'contact' && (
          <ContactPage />
        )}
      </main>

      {/* Footer */}
      <Footer 
        setActivePage={setActivePage}
        onOpenPrintModal={() => setIsPrintModalOpen(true)}
      />

      {/* Floating Instant Inquiry & WhatsApp Support Button */}
      <FloatingWhatsAppWidget />

      {/* Interactive Print Simulator Modal */}
      <LivePrintModal 
        isOpen={isPrintModalOpen} 
        onClose={() => setIsPrintModalOpen(false)} 
      />

    </div>
  );
}
