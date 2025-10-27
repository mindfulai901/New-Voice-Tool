import type { ElevenLabsVoice } from '../types';

// A curated list of high-quality public voices from ElevenLabs.
// Using a static list is faster and more reliable than fetching from the API every time.
export const publicVoices: ElevenLabsVoice[] = [
  {
    voice_id: '21m00Tcm4TlvDq8ikWAM',
    name: 'Rachel',
    labels: { accent: 'american', description: 'calm', age: 'young', gender: 'female' },
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/21m00Tcm4TlvDq8ikWAM/df03da2b-6895-43dd-807c-f52f4625642a.mp3',
  },
  {
    voice_id: 'AZnzlk1XvdvUeBnXmlld',
    name: 'Domi',
    labels: { accent: 'american', description: 'strong', age: 'young', gender: 'female' },
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/AZnzlk1XvdvUeBnXmlld/50eb2117-2f32-4706-8153-27261a8286a9.mp3',
  },
  {
    voice_id: 'EXAVITQu4vr4xnSDxMaL',
    name: 'Bella',
    labels: { accent: 'american', description: 'soft', age: 'young', gender: 'female' },
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/EXAVITQu4vr4xnSDxMaL/eea51394-1736-40b2-9366-3d7a83d399f3.mp3',
  },
  {
    voice_id: 'ErXwobaYiN019PkySvjV',
    name: 'Antoni',
    labels: { accent: 'american', description: 'well-rounded', age: 'young', gender: 'male' },
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/ErXwobaYiN019PkySvjV/101a6652-efd8-4340-811c-def54d026bd6.mp3',
  },
  {
    voice_id: 'MF3mGyEYCl7XYWbV9V6O',
    name: 'Elli',
    labels: { accent: 'american', description: 'emotional', age: 'young', gender: 'female' },
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/MF3mGyEYCl7XYWbV9V6O/a2f7e416-a36a-4b71-891a-f7944c20573e.mp3',
  },
  {
    voice_id: 'TxGEqnHWrfWFTfGW9XjX',
    name: 'Josh',
    labels: { accent: 'american', description: 'deep', age: 'young', gender: 'male' },
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/TxGEqnHWrfWFTfGW9XjX/a01a30f1-286a-4712-875c-099a5f78b671.mp3',
  },
  {
    voice_id: 'VR6AewLTigWG4xSOh_eA',
    name: 'Arnold',
    labels: { accent: 'american', description: 'crisp', age: 'middle aged', gender: 'male' },
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/VR6AewLTigWG4xSOh_eA/e4822b63-a25e-450f-86fd-826c6460119e.mp3',
  },
  {
    voice_id: 'pNInz6obpgDQGcFmaJgB',
    name: 'Adam',
    labels: { accent: 'american', description: 'deep', age: 'middle aged', gender: 'male' },
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/pNInz6obpgDQGcFmaJgB/25294371-2947-4965-b310-858349a5e888.mp3',
  },
  {
    voice_id: 'yoZ06aMmMKFVSoeJsPAz',
    name: 'Sam',
    labels: { accent: 'american', description: 'raspy', age: 'young', gender: 'male' },
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/yoZ06aMmMKFVSoeJsPAz/873c520a-b333-4ce4-8e11-88d448378f44.mp3',
  },
  {
    voice_id: 'z9fAnlkpzviPz146aGWa',
    name: 'Nicole',
    labels: { accent: 'american', 'description': 'whispering', age: 'young', gender: 'female' },
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/z9fAnlkpzviPz146aGWa/5336952c-7059-4256-bb6e-21398f72f03f.mp3'
  },
  {
    voice_id: '2EiwWnXFnvU5JabPnv8n',
    name: 'Jessie',
    labels: { accent: 'american', 'description': 'raspy', age: 'old', gender: 'male' },
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/2EiwWnXFnvU5JabPnv8n/537383cd-2114-4c3c-888e-3b2b8e3a2417.mp3'
  },
  {
    voice_id: '5Q0t7uMcjvnagumLfvZi',
    name: 'Ryan',
    labels: { accent: 'american', 'description': 'conversational', age: 'middle aged', gender: 'male' },
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/5Q0t7uMcjvnagumLfvZi/740d999f-7489-4b61-a54c-11239965a3d9.mp3'
  },
  {
    voice_id: '7mU2Yy3iGq3i5l2j2E9A',
    name: 'Glinda',
    labels: { accent: 'american', 'description': 'witch', age: 'middle aged', gender: 'female' },
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/7mU2Yy3iGq3i5l2j2E9A/a8c39a00-2522-4a47-a878-a28a2a0e27dc.mp3'
  },
  {
    voice_id: '8BfK824Yh2FgB12KzQ4Y',
    name: 'Giovanni',
    labels: { accent: 'american', 'description': 'storyteller', age: 'young', gender: 'male' },
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/8BfK824Yh2FgB12KzQ4Y/f3a61ce5-555e-4e9f-b52f-b25860d5b248.mp3'
  },
  {
    voice_id: '9F4C8ztUa5Be2K8B35sW',
    name: 'Mimi',
    labels: { accent: 'american', 'description': 'childish', age: 'young', gender: 'female' },
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/9F4C8ztUa5Be2K8B35sW/59b133a8-a35f-4228-ad8c-1e8c45d315b8.mp3'
  },
  {
    voice_id: 'IKne3meq5aSn9XLyUdCD',
    name: 'Serena',
    labels: { accent: 'american', 'description': 'pleasant', age: 'middle aged', gender: 'female' },
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/IKne3meq5aSn9XLyUdCD/5053531c-3c8c-4545-8167-27a93557a2f5.mp3'
  },
  {
    voice_id: 'LcfcDJNUP1GQjkzn1xUU',
    name: 'Dave',
    labels: { accent: 'american', 'description': 'conversational', age: 'young', gender: 'male' },
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/LcfcDJNUP1GQjkzn1xUU/e4a1a673-451e-450f-a36c-922657e3f42c.mp3'
  },
  {
    voice_id: 'SOYHLrjzK2X1ezoPC6cr',
    name: 'Harry',
    labels: { accent: 'american', 'description': 'anxious', age: 'young', gender: 'male' },
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/SOYHLrjzK2X1ezoPC6cr/63043810-7459-4560-b7a4-10e83b87a078.mp3'
  },
  {
    voice_id: 'ZQe5CZNOzWTMqCbvU6UR',
    name: 'Liam',
    labels: { accent: 'american', 'description': 'neutral', age: 'young', gender: 'male' },
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/ZQe5CZNOzWTMqCbvU6UR/b324021f-1e9a-41c6-a67b-2321c1729a6e.mp3'
  },
  {
    voice_id: 'bVMeCyTHy58xNoL34h3p',
    name: 'Charlotte',
    labels: { accent: 'english-swedish', 'description': 'seductive', age: 'middle aged', gender: 'female' },
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/bVMeCyTHy58xNoL34h3p/3505919e-f0b0-4a8f-8898-75752311448b.mp3'
  },
  {
    voice_id: 'flq6f7yk4E4fJM5XTYUD',
    name: 'Matilda',
    labels: { accent: 'american', 'description': 'warm', age: 'young', gender: 'female' },
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/flq6f7yk4E4fJM5XTYUD/09450809-5838-4665-8b9a-a28a39626458.mp3'
  },
  {
    voice_id: 'jBpfuIE2acCO8z3wKNLl',
    name: 'Matthew',
    labels: { accent: 'american', 'description': 'calm', age: 'middle aged', gender: 'male' },
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/jBpfuIE2acCO8z3wKNLl/8a04f56f-5b43-4e44-85b3-3a0595955651.mp3'
  },
  {
    voice_id: 'oWAxZDx7w5VEj9dCyTzz',
    name: 'James',
    labels: { accent: 'australian', 'description': 'calm', age: 'old', gender: 'male' },
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/oWAxZDx7w5VEj9dCyTzz/e48b6c50-d26b-4a6c-b2e1-489e2ba286a5.mp3'
  },
  {
    voice_id: 'onwK4e9ZLuTAKqWW03F9',
    name: 'Joseph',
    labels: { accent: 'british', 'description': 'conversational', age: 'middle aged', gender: 'male' },
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/onwK4e9ZLuTAKqWW03F9/a26eb2b5-e65a-4573-8608-857c3272e276.mp3'
  },
  {
    voice_id: 'pMsXgVXv3BLzUgSXRplE',
    name: 'Jeremy',
    labels: { accent: 'american-irish', 'description': 'excited', age: 'young', gender: 'male' },
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/pMsXgVXv3BLzUgSXRplE/350e4171-f999-4a01-98e3-0c3a81289cc5.mp3'
  },
  {
    voice_id: 't0jbNlBVZ17f02VDIeMI',
    name: 'Michael',
    labels: { accent: 'american', 'description': 'orotund', age: 'old', gender: 'male' },
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/t0jbNlBVZ17f02VDIeMI/65b6f3a2-149b-4395-b040-3b42f2b704f0.mp3'
  },
  {
    voice_id: 'wViXBPUzp2ZZixB1xweK',
    name: 'Thomas',
    labels: { accent: 'american', 'description': 'calm', age: 'young', gender: 'male' },
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/wViXBPUzp2ZZixB1xweK/0f9104f2-b248-47ad-a42e-a50e3fd1293c.mp3'
  },
  {
    voice_id: 'zcAOhNBS3c14rBihAFp1',
    name: 'Gigi',
    labels: { accent: 'american', 'description': 'childish', age: 'young', gender: 'female' },
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/zcAOhNBS3c14rBihAFp1/63359f1c-a1d2-40ed-b3b3-2f47c3e3e1d1.mp3'
  },
  {
    voice_id: 'iP95p4dFdkVjceagFedw',
    name: 'Freya',
    labels: { accent: 'american', 'description': 'overhyped', age: 'young', gender: 'female' },
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/iP95p4dFdkVjceagFedw/1d643ac9-1888-4a5f-a36c-2f22b724490a.mp3'
  },
  {
    voice_id: 'jsCqWAovK2LkecY7zXl4',
    name: 'Grace',
    labels: { accent: 'american-southern', 'description': 'conversational', age: 'young', gender: 'female' },
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/jsCqWAovK2LkecY7zXl4/9713639e-a89c-48ed-be0f-62024c65349b.mp3'
  },
  {
    voice_id: 'N2lVS1w4EtoT3dr4eOWO',
    name: 'Daniel',
    labels: { accent: 'british', 'description': 'deep', age: 'middle aged', gender: 'male' },
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/N2lVS1w4EtoT3dr4eOWO/addb2567-4632-4114-b461-59114757c2a7.mp3'
  },
  {
    voice_id: 'ODq5zmih8GrVes37Dizd',
    name: 'Lily',
    labels: { accent: 'british', 'description': 'raspy', age: 'young', gender: 'female' },
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/ODq5zmih8GrVes37Dizd/499b50b5-9014-411e-8b35-86f32b8a74b4.mp3'
  },
  {
    voice_id: 'CYw3kZ02Hs0563khs1Fj',
    name: 'Dorothy',
    labels: { accent: 'british', 'description': 'pleasant', age: 'old', gender: 'female' },
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/CYw3kZ02Hs0563khs1Fj/48999cc2-20c2-40f4-8a40-34825e59b66b.mp3'
  },
  {
    voice_id: 'ThT5KcBeYPX3keUQqHPh',
    name: 'Wayne',
    labels: { accent: 'american', 'description': 'narrator', age: 'middle aged', gender: 'male' },
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/ThT5KcBeYPX3keUQqHPh/98a3e7ed-359f-43eb-8531-3148416d61f9.mp3'
  },
  {
    voice_id: 'XB0fDUnXU5aWgSThjJHi',
    name: 'Bill',
    labels: { accent: 'american', 'description': 'strong', age: 'middle aged', gender: 'male' },
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/XB0fDUnXU5aWgSThjJHi/1dc55364-89c6-4325-8669-9f7a77e2311f.mp3'
  },
  {
    voice_id: 'Yko7saHWWbF9VnDE7frG',
    name: 'Vincent',
    labels: { accent: 'malay-singaporean', 'description': 'youthful', age: 'middle aged', gender: 'male' },
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/Yko7saHWWbF9VnDE7frG/e8a261a8-2026-455b-8666-3d74c0eafb50.mp3'
  },
  {
    voice_id: 'g5CIjZEefmcbnhLrqLq5',
    name: 'George',
    labels: { accent: 'british', 'description': 'raspy', age: 'middle aged', gender: 'male' },
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/g5CIjZEefmcbnhLrqLq5/a36d2ed9-801a-4f51-8d2a-a537f76906a2.mp3'
  },
  {
    voice_id: 'i82fvo2j952g7g28oHCO',
    name: 'Olivia',
    labels: { accent: 'american', 'description': 'soft', age: 'young', gender: 'female' },
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/i82fvo2j952g7g28oHCO/d8807d47-f37b-40f3-80e9-a41738758d4a.mp3'
  },
  {
    voice_id: 'za3E2O2zvgK5n9sY5BKV',
    name: 'Paul',
    labels: { accent: 'american', 'description': 'narrator', age: 'old', gender: 'male' },
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/za3E2O2zvgK5n9sY5BKV/6631899a-33b0-4a5f-9f7c-50a30b42c4b5.mp3'
  },
  {
    voice_id: 'piTKgcLEGmPE4e6mEKli',
    name: 'Patrick',
    labels: { accent: 'american', 'description': 'shout', age: 'middle aged', gender: 'male' },
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/piTKgcLEGmPE4e6mEKli/a193916e-cd34-4a49-bb17-688941836a0d.mp3'
  },
  {
    voice_id: 'zW2Y6e7ba66w2zCjc0bA',
    name: 'Drew',
    labels: { accent: 'american', 'description': 'well-rounded', age: 'middle aged', gender: 'male' },
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/zW2Y6e7ba66w2zCjc0bA/b18a1a38-89c0-48e0-b620-353683f25d98.mp3'
  },
];
