import React, { useRef } from 'react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import type { FinalAudio } from '../../types';

interface Step6Props {
  finalAudios: FinalAudio[];
  onRestart: () => void;
}

export const Step6_Output: React.FC<Step6Props> = ({ finalAudios, onRestart }) => {
  // Ref to hold all audio elements to ensure only one plays at a time
  const audioElementsRef = useRef<Map<string, HTMLAudioElement>>(new Map());

  const handlePlay = (event: React.SyntheticEvent<HTMLAudioElement>) => {
    const currentAudio = event.currentTarget;
    // Pause all other audio elements
    audioElementsRef.current.forEach((audioEl) => {
      if (audioEl !== currentAudio) {
        audioEl.pause();
      }
    });
  };
  
  return (
    <Card className="w-full max-w-3xl text-center">
      <h2 className="text-3xl font-bold mb-4">Generation Complete!</h2>
      <p className="text-gray-400 mb-8">Here are your generated voiceover files.</p>

      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {finalAudios.map(audio => (
          <div key={audio.scriptId} className="bg-white/5 p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="font-medium truncate">{audio.scriptName}</span>
            <div className="flex items-center gap-4">
                <audio 
                  controls 
                  src={audio.url} 
                  className="h-10"
                  onPlay={handlePlay}
                  ref={(el) => {
                      if (el) {
                          audioElementsRef.current.set(audio.scriptId, el);
                      } else {
                          audioElementsRef.current.delete(audio.scriptId);
                      }
                  }}
                ></audio>
                <a
                    href={audio.url}
                    download={`${audio.scriptName}.mp3`}
                    className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg transition-colors hover:bg-green-700 whitespace-nowrap"
                >
                    Download
                </a>
            </div>
          </div>
        ))}
      </div>

      <Button onClick={onRestart} className="mt-12">
        Generate Another Voiceover
      </Button>
    </Card>
  );
};