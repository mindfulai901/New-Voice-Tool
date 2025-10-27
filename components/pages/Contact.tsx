import React from 'react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';

interface PageProps {
  onBack: () => void;
}

export const Contact: React.FC<PageProps> = ({ onBack }) => {
  return (
    <Card className="w-full max-w-2xl mx-auto text-center animate-fade-in">
        <div className="prose prose-invert max-w-none prose-h2:text-cyan-400">
            <h2>Contact Us</h2>
            <p className="text-lg">
                We'd love to hear from you! Whether you have a question about features, need support, or want to provide feedback, please don't hesitate to reach out.
            </p>
            
            <div className="mt-8 p-6 bg-black/10 dark:bg-white/5 rounded-lg">
                <h3 className="text-xl font-semibold">Support & General Inquiries</h3>
                <p>For the fastest response, please email us at:</p>
                <a href="mailto:support@voicegenpro.example.com" className="text-2xl font-mono text-cyan-400 hover:text-cyan-300 transition-colors">
                    support@voicegenpro.example.com
                </a>
                <p className="text-sm mt-2 text-gray-400">We aim to respond to all inquiries within 24-48 hours.</p>
            </div>
        </div>
        <div className="text-center mt-12">
            <Button onClick={onBack}>Back to App</Button>
        </div>
    </Card>
  );
};