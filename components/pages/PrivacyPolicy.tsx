import React from 'react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';

interface PageProps {
  onBack: () => void;
}

export const PrivacyPolicy: React.FC<PageProps> = ({ onBack }) => {
  return (
    <Card className="w-full max-w-4xl mx-auto animate-fade-in">
      <div className="prose prose-invert max-w-none prose-h2:text-cyan-400 prose-a:text-cyan-400 hover:prose-a:text-cyan-300">
        <h2>Privacy Policy</h2>
        <p><strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        
        <p>Welcome to VoiceGen Pro ("we," "our," or "us"). We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application.</p>
        
        <h4>1. Information We Collect</h4>
        <p>We may collect information about you in a variety of ways. The information we may collect includes:</p>
        <ul>
            <li><strong>Personal Data:</strong> Personally identifiable information, such as your name and email address, that you voluntarily give to us when you register for an account.</li>
            <li><strong>User Content:</strong> The scripts you upload or type into the application, and the resulting audio files generated from that content.</li>
            <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the application, such as your IP address, browser type, and the dates and times of access.</li>
        </ul>

        <h4>2. Use of Your Information</h4>
        <p>Having accurate information permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you to:</p>
        <ul>
            <li>Create and manage your account.</li>
            <li>Process your scripts to generate audio files.</li>
            <li>Store your scripts and generated audio files for your access and history.</li>
            <li>Email you regarding your account or order.</li>
            <li>Monitor and analyze usage and trends to improve your experience with the application.</li>
        </ul>

        <h4>3. Disclosure of Your Information</h4>
        <p>We do not share, sell, rent, or trade your information with third parties for their commercial purposes. We may share information we have collected about you in certain situations:</p>
        <ul>
            <li><strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others.</li>
            <li><strong>Third-Party Service Providers:</strong> We use third-party services for hosting, database management, and authentication (Supabase) and for voice generation (ElevenLabs). These services only have access to the information necessary to perform their functions and are required to protect it. Your scripts are sent to the ElevenLabs API for processing.</li>
        </ul>

        <h4>4. Security of Your Information</h4>
        <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.</p>

        <h4>5. Your Rights</h4>
        <p>You have the right to:</p>
        <ul>
            <li>Review or update your account information at any time.</li>
            <li>Delete your account and all associated data, including scripts and generated audio files, via the "Advanced Settings" menu. This action is irreversible.</li>
        </ul>

        <h4>6. Contact Us</h4>
        <p>If you have questions or comments about this Privacy Policy, please contact us through the "Contact" page.</p>

      </div>
       <div className="text-center mt-8">
        <Button onClick={onBack}>Back to App</Button>
      </div>
    </Card>
  );
};