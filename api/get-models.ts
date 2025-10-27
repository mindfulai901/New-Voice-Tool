// This is a Vercel Serverless Function
// It will be deployed at the endpoint /api/get-models

const API_BASE_URL = 'https://api.elevenlabs.io/v1';
const API_KEY = process.env.ELEVENLABS_API_KEY;

export async function GET() {
  if (!API_KEY) {
    return new Response(JSON.stringify({ error: 'Server API key not configured.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const response = await fetch(`${API_BASE_URL}/models`, {
      headers: { 'xi-api-key': API_KEY },
    });

    if (!response.ok) {
        const errorText = await response.text();
        // Try to parse the error from ElevenLabs to provide a better message
        try {
            const errorJson = JSON.parse(errorText);
            const message = errorJson.detail?.message || 'Failed to fetch models from ElevenLabs.';
            return new Response(JSON.stringify({ error: message }), {
                status: response.status,
                headers: { 'Content-Type': 'application/json' },
            });
        } catch {
             return new Response(JSON.stringify({ error: 'An unknown error occurred while fetching models.' }), {
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