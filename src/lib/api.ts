export type ApiProvider = 'openai' | 'fal' | 'replicate';

export interface ApiKeys {
  openai: string;
  fal: string;
  replicate: string;
}

export const getStoredKeys = (): ApiKeys => {
  const keys = localStorage.getItem('api_keys');
  if (keys) {
    try {
      return JSON.parse(keys);
    } catch {
      // Ignore parse error
    }
  }
  return {
    openai: import.meta.env.VITE_OPENAI_API_KEY || '',
    fal: import.meta.env.VITE_FAL_KEY || '',
    replicate: import.meta.env.VITE_REPLICATE_API_TOKEN || '',
  };
};

export const saveKeys = (keys: ApiKeys) => {
  localStorage.setItem('api_keys', JSON.stringify(keys));
};

export interface GenerationOptions {
  image?: string; // Base64 data URL
  style: string;
  provider: ApiProvider;
  backgroundColor?: string;
}

// Fallback high-quality avatars for demo purposes
const MOCK_AVATARS = [
  'https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&q=80&w=500&h=500',
  'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&q=80&w=500&h=500',
  'https://images.unsplash.com/photo-1580477651145-668ba458a436?auto=format&fit=crop&q=80&w=500&h=500'
];

export async function generateAvatar(options: GenerationOptions): Promise<string> {
  const keys = getStoredKeys();
  const key = keys[options.provider];

  // If no valid key is present (or if it's a dummy key), use the DEMO mode
  if (!key || key.startsWith('demo_')) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const randomMock = MOCK_AVATARS[Math.floor(Math.random() * MOCK_AVATARS.length)];
        resolve(randomMock);
      }, 3500); // Simulate network latency
    });
  }

  let bgContext = '';
  if (options.backgroundColor && options.backgroundColor !== 'transparent') {
    bgContext = ` Set the background strictly to a solid color defined by this hex code: ${options.backgroundColor}.`;
  } else if (options.backgroundColor === 'transparent') {
    bgContext = ` Use a transparent background.`;
  }

  const prompt = `Create a high-quality stylized big-head cartoon avatar from this selfie. Preserve facial identity, hairstyle, expression, and skin tone. Exaggerate the head size in a cute and modern way. Clean background, cinematic lighting, ultra detailed, social media profile picture style, 3D cartoon look. Style: ${options.style}.${bgContext}`;

  try {
    if (options.provider === 'openai') {
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: prompt,
          n: 1,
          size: '1024x1024',
          response_format: 'url',
        }),
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error.message);
      }
      return data.data[0].url;
    } 
    
    // For Fal or Replicate, you would typically integrate their specific endpoints.
    // Fal endpoint for face-to-image e.g. pulid/flux
    if (options.provider === 'fal') {
      const response = await fetch('https://fal.run/fal-ai/pulid', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Key ${key}`,
        },
        body: JSON.stringify({
          prompt: prompt,
          image_url: options.image, // assume base64 or URL
        }),
      });

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      return data.images[0].url;
    }

    throw new Error('Provider not implemented yet');
  } catch (error: any) {
    console.error('Generation Error:', error);
    throw new Error(error.message || 'Failed to generate avatar. Please check your API key.');
  }
}
