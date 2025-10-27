import React from 'react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';

interface PageProps {
  onBack: () => void;
}

export const UserManual: React.FC<PageProps> = ({ onBack }) => {
  return (
    <Card className="w-full max-w-4xl mx-auto animate-fade-in">
      <div className="prose prose-invert max-w-none prose-h2:text-cyan-400 prose-a:text-cyan-400 hover:prose-a:text-cyan-300">
        <h2>User Manual</h2>
        <p>Welcome to VoiceGen Pro! This guide will walk you through the process of creating high-quality voiceovers from your scripts.</p>
        
        <h4>Step 1: Choose Your Input Type</h4>
        <p>When you start, you'll be asked to choose how you want to provide your scripts:</p>
        <ul>
            <li><strong>Single Script Mode:</strong> Perfect for generating a voiceover for a single piece of text. Simply paste your script into the text area.</li>
            <li><strong>Bulk Mode:</strong> Ideal for processing multiple scripts at once. You can upload <code>.txt</code> or <code>.csv</code> files. Each <code>.txt</code> file is treated as one script, while each line in a <code>.csv</code> file is treated as a separate script.</li>
        </ul>

        <h4>Step 2: Configuration</h4>
        <p>In this step, you'll finalize your scripts and settings.</p>
        <ul>
            <li><strong>Provide Script Content:</strong> Paste your text or upload your files as chosen in Step 1.</li>
            <li><strong>Paragraphs per Generation:</strong> This crucial setting determines how your script is "chunked" for processing. Smaller numbers (e.g., 1-2 paragraphs) can lead to more natural-sounding audio but may take slightly longer. We recommend starting with the default value of 2.</li>
        </ul>

        <h4>Step 3: Model Selection</h4>
        <p>Select the AI voice model you want to use. Each model has a unique character and language capability. The description will help you choose the best one for your needs. We support various models from ElevenLabs, including multilingual options.</p>

        <h4>Step 4: Voice &amp; Settings</h4>
        <p>This is where you bring your script to life.</p>
        <ul>
            <li><strong>Add a Voice:</strong> To use a voice, you need its Voice ID from your ElevenLabs account. Paste the ID into the input field and click "Add". Your saved voices will appear for easy selection.</li>
            <li><strong>Select a Voice:</strong> Click on any of your saved voices to select it for generation. You can preview any voice that has a play icon.</li>
            <li><strong>Adjust Settings:</strong> Depending on the model you chose in Step 3, you may see sliders for settings like Stability and Clarity. These allow you to fine-tune the voice output. Your adjustments are saved automatically for that voice and model combination.</li>
        </ul>

        <h4>Step 5: Generation</h4>
        <p>Once you click "Generate Voiceover," the process begins. You'll see a progress bar for each script. Please remain on this page until all scripts are processed.</p>

        <h4>Step 6: Output</h4>
        <p>Congratulations! Your voiceovers are ready. On this final screen, you can play each audio file directly and download it as an <code>.mp3</code> file to your computer.</p>
        
        <h4>Managing Your History</h4>
        <p>Click on your profile icon and select "Generation History" to view, play, and re-download all your past creations. You can also view the original script or delete old files.</p>
      </div>
      <div className="text-center mt-8">
        <Button onClick={onBack}>Back to App</Button>
      </div>
    </Card>
  );
};