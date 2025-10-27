// Vercel Serverless Function at /api/generate-voice

const API_BASE_URL = 'https://api.elevenlabs.io/v1';
const API_KEY = process.env.ELEVENLABS_API_KEY;

export async function POST(request: Request) {
  if (!API_KEY) {
    return new Response(JSON.stringify({ error: 'Server API key not configured.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { text, voiceId, modelId, voiceSettings } = await request.json();

    if (!text || !voiceId || !modelId) {
        return new Response(JSON.stringify({ error: 'Missing required parameters: text, voiceId, or modelId.' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const response = await fetch(`${API_BASE_URL}/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'xi-api-key': API_KEY,
            'Accept': 'audio/mpeg',
        },
        body: JSON.stringify({
            text: text,
            model_id: modelId,
            voice_settings: {
                ...voiceSettings,
                use_speaker_boost: voiceSettings.use_speaker_boost === 'true' // Ensure boolean
            },
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        try {
            const errorJson = JSON.parse(errorText);
            const message = errorJson.detail?.message || `API error during audio generation.`;
            return new Response(JSON.stringify({ error: message }), {
                status: response.status,
                headers: { 'Content-Type': 'application/json' },
            });
        } catch {
             return new Response(JSON.stringify({ error: 'Unknown API error during audio generation.' }), {
                status: response.status,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    }
    
    // Stream the audio blob back to the client
    const audioBlob = await response.blob();
    return new Response(audioBlob, {
      status: 200,
      headers: { 'Content-Type': 'audio/mpeg' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: 'An internal server error occurred.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}