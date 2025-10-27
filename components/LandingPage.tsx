import React, { useState } from 'react';
import { Button } from './common/Button';
import { Card } from './common/Card';
import { Auth } from './auth/Auth';

export const LandingPage: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <div className="min-h-screen text-gray-900 dark:text-white flex flex-col bg-gray-50 dark:bg-[#0E1117]">
      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
          <Card className="max-w-md w-full relative">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <Auth />
          </Card>
        </div>
      )}

      {/* Header */}
      <header className="py-4 px-8 flex justify-between items-center border-b border-gray-200 dark:border-white/10">
         <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-400 dark:to-blue-500 text-transparent bg-clip-text">
            VoiceGen Pro
          </h1>
        <Button onClick={() => setShowAuthModal(true)}>Login / Sign Up</Button>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center text-center p-8">
        <div className="animate-fade-in max-w-4xl">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-cyan-600 to-blue-700 dark:from-cyan-300 dark:to-blue-400 text-transparent bg-clip-text">
            Studio-Quality Voiceovers in Seconds
          </h2>
          <p className="mt-6 text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Leverage state-of-the-art AI to generate high-quality, natural-sounding voiceovers from your scripts. Perfect for content creators, developers, and businesses.
          </p>
          <Button onClick={() => setShowAuthModal(true)} className="mt-10 !text-lg !px-8 !py-4">
            Get Started For Free
          </Button>
        </div>

        {/* Features Section */}
        <section className="mt-24 w-full max-w-5xl">
            <h3 className="text-3xl font-bold mb-12">Why Choose VoiceGen Pro?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <FeatureCard 
                    title="Intelligent Chunking" 
                    description="Our app intelligently splits your long scripts into smaller, optimized paragraphs for faster, more reliable voice generation and higher quality audio."
                />
                <FeatureCard 
                    title="Secure Cloud Storage" 
                    description="Your scripts and generated audio files are securely saved and linked to your account, accessible whenever you need them."
                />
                 <FeatureCard 
                    title="Flexible Configuration" 
                    description="Fine-tune your audio with model-specific settings like stability and clarity. Save your favorite voices and settings for consistent results."
                />
            </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-4 px-8 text-center text-gray-500 text-sm border-t border-gray-200 dark:border-white/10">
        <p>&copy; {new Date().getFullYear()} VoiceGen Pro. All rights reserved.</p>
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<{title: string; description: string}> = ({title, description}) => (
    <div className="bg-white/80 dark:bg-white/5 p-6 rounded-lg border border-gray-200 dark:border-white/10 text-left">
        <h4 className="text-xl font-semibold text-cyan-600 dark:text-cyan-400 mb-3">{title}</h4>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
);