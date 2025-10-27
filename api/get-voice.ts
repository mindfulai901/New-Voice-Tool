// Vercel Serverless Function at /api/get-voice

const API_BASE_URL = 'https://api.elevenlabs.io/v1';
const API_KEY = process.env.ELEVENLABS_API_KEY;

export async function GET(request: Request) {
  if (!API_KEY) {
    return new Response(JSON.stringify({ error: 'Server API key not configured.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { searchParams } = new URL(request.url);
  const voiceId = searchParams.get('voiceId');

  if (!voiceId) {
    return new Response(JSON.stringify({ error: 'Voice ID is required.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const response = await fetch(`${API_BASE_URL}/voices/${voiceId}`, {
      headers: { 'xi-api-key': API_KEY },
    });

    if (!response.ok) {
        const errorText = await response.text();
        try {
            const errorJson = JSON.parse(errorText);
            const message = errorJson.detail?.message || `Failed to fetch voice ${voiceId}.`;
             return new Response(JSON.stringify({ error: message }), {
                status: response.status,
                headers: { 'Content-Type': 'application/json' },
            });
        } catch {
            return new Response(JSON.stringify({ error: `An unknown error occurred fetching voice ${voiceId}.` }), {
                status: response.status,
                headers: { 'Content-Type': 'application/json' },
            });
        }
    }
    
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: 'An internal server error occurred.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}