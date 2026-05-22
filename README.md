<img width="966" height="640" alt="main-image" src="https://github.com/user-attachments/assets/fe3a47ff-7113-4ee0-b77c-8b9ae9821368" />

# Big Head Avatar Generator

Create funny, stylish, and high-quality "Big Head" cartoon avatars from your selfies using AI image generation.

**[View Live Demo](https://big-head-avatar-generator.vercel.app/)**

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
