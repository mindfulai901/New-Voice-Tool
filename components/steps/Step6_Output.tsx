import React, { useRef, useState } from 'react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Spinner } from '../common/Spinner';
import type { FinalAudio } from '../../types';

interface Step6Props {
  finalAudios: FinalAudio[];
  onRestart: () => void;
}

export const Step6_Output: React.FC<Step6Props> = ({ finalAudios, onRestart }) => {
  const audioElementsRef = useRef<Map<string, HTMLAudioElement>>(new Map());
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const handlePlay = (event: React.SyntheticEvent<HTMLAudioElement>) => {
    const currentAudio = event.currentTarget;
    audioElementsRef.current.forEach((audioEl) => {
      if (audioEl !== currentAudio) {
        audioEl.pause();
      }
    });
  };

  const handleDownload = async (url: string, scriptName: string, scriptId: string) => {
    setDownloadingId(scriptId);
    setDownloadError(null);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch audio file. Status: ${response.status}`);
      }
      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = objectUrl;
      a.download = `${scriptName}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error("Download failed:", error);
      setDownloadError(`Could not download "${scriptName}". Please try again.`);
    } finally {
      setDownloadingId(null);
    }
  };
  
  return (
    <Card className="w-full max-w-3xl text-center">
      <h2 className="text-3xl font-bold mb-4">Generation Complete!</h2>
      <p className="text-gray-400 mb-8">Here are your generated voiceover files.</p>

      {downloadError && (
        <p className="text-red-400 text-sm mb-4">{downloadError}</p>
      )}

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
                <Button
                    variant="secondary"
                    className="!bg-green-600 hover:!bg-green-700 !px-4 !py-2 whitespace-nowrap w-36 flex justify-center items-center"
                    onClick={() => handleDownload(audio.url, audio.scriptName, audio.scriptId)}
                    disabled={downloadingId !== null}
                >
                    {downloadingId === audio.scriptId ? <Spinner /> : 'Download'}
                </Button>
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