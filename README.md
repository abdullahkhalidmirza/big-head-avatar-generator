<img width="1280" height="720" alt="before-after-image-4" src="https://github.com/user-attachments/assets/9af09681-3166-4c90-9ce1-36eee66f40a0" />
<img width="1280" height="720" alt="before-after-image-3" src="https://github.com/user-attachments/assets/2e0cf2de-fed0-4ad8-8046-6ffaa089896b" />
<img width="1280" height="720" alt="before-after-image-2" src="https://github.com/user-attachments/assets/07b9c251-e7d4-4f1b-93d7-605a49b348f1" />
<img width="1280" height="720" alt="before-after-image-1" src="https://github.com/user-attachments/assets/596bffee-f5eb-4471-8e14-b941c79d725d" />
<img width="1280" height="720" alt="before-after-image-10" src="https://github.com/user-attachments/assets/d7f8af3b-5fc8-4fb2-bda6-7ac4afdd9343" />
<img width="1280" height="720" alt="before-after-image-9" src="https://github.com/user-attachments/assets/9eb82d4b-7582-4491-b116-cd1f5adce7f5" />
<img width="1280" height="720" alt="before-after-image-8" src="https://github.com/user-attachments/assets/f2b3fcec-3242-41f0-baad-1e6cdd2fc34b" />
<img width="1280" height="720" alt="before-after-image-7" src="https://github.com/user-attachments/assets/65e93821-92f9-4e1d-8be7-084df9fa7c05" />
<img width="1280" height="720" alt="before-after-image-6" src="https://github.com/user-attachments/assets/b5e0b308-3d62-4172-9b09-c22db477f9bd" />
<img width="1280" height="720" alt="before-after-image-5" src="https://github.com/user-attachments/assets/ec937fe3-a6e6-4723-98ae-f478c32501df" />
<img width="966" height="640" alt="main-image" src="https://github.com/user-attachments/assets/45d6bc0b-7a48-4ed2-add6-33e443019732" />
# Big Head Avatar Generator

Create funny, stylish, and high-quality "Big Head" cartoon avatars from your selfies using AI image generation.

## How It Works

This application allows users to upload a selfie and instantly generate a beautifully stylized, exaggerated "big head" cartoon version of themselves. It uses state-of-the-art AI image-to-image generation APIs to preserve facial identity, hairstyle, and expression while applying a stylistic transformation.

### Features
* **Multiple Styles**: Choose from 3D Cartoon, Pixar Style, Line Art, Vector Illustration, and more.
* **Background Selection**: Choose solid backgrounds or transparent ones.
* **Flexible Layouts**: Generate avatars in various aspect ratios (1:1, 4:3, 9:16, 16:9).
* **Provider Choice**: Support for APIs like Fal (flux-pro) and OpenAI (DALL-E 3).
* **Client-side Storage**: Keeps track of previously generated images securely in your local browser history.

## API Configuration & Usage

To generate images, this project requires an API key from either **Fal** or **OpenAI**. 
The app is designed to prompt users for their API key in the UI (via the Settings gear icon) upon first usage. Keys are stored safely in the browser's local storage and are never sent to external servers other than the API providers themselves.

* **Fal AI:** Uses the `fal-ai/flux-pro/v1.1/image-to-image` model.
* **OpenAI:** Uses the `dall-e-3` model (Note: OpenAI typically requires image prompts to be text only, but the app adapts logic as necessary).

## Tech Stack & Hosting (Vercel)

* **Framework:** React 18, Vite
* **Styling:** Tailwind CSS, Framer Motion
* **Hosting Details:** Easily streamable to Vercel. 
  1. Important: In your Vercel project settings, set the **Framework Preset** to Vite.
  2. The **Build Command** is `npm run build`.
  3. The **Output Directory** is `dist`.

## Development Setup

1. Clone the repository.
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`
4. Open the application on `http://localhost:3000`

## Author

Built by [Abdullah Khalid Mirza](https://abdullahkhalidmirza.com)
