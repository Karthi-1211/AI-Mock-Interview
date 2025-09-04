<<<<<<< HEAD
# AI Mock Interview – AI Question Generation Setup

## Environment Variables

Copy `.env.example` to `.env` (or your environment of choice) and set your keys:

```
OPENAI_API_KEY=
# Optional alternative providers
GEMINI_API_KEY=
GOOGLE_GEMINI_API_KEY=
GOOGLE_API_KEY=
```

Important:
- Do not commit real API keys to source control.
- In production, set these as environment variables in your hosting provider (e.g., Supabase project settings → Config → Secrets).

## How Question Generation Works

- The serverless function at `supabase/functions/generate-interview/index.ts` attempts providers in order:
  1. OpenAI (`OPENAI_API_KEY`)
  2. Gemini (`GEMINI_API_KEY` / `GOOGLE_GEMINI_API_KEY` / `GOOGLE_API_KEY`)
  3. Fallback to curated static questions (based on role/difficulty)

- The frontend uses this function for:
  - Custom interviews (already wired via `CreateInterview.tsx`).
  - Predefined templates and DB-backed templates (wired in `src/pages/Interview.tsx`).

No UI changes are needed; just set the environment variables.

## Local Development

1. Create a local `.env` file from `.env.example` and set `OPENAI_API_KEY`.
2. Start the app:
   - `npm install`
   - `npm run dev`

If you run Supabase locally with the CLI, ensure your function can read the environment variables or pass secrets as needed.

## Deploying the Supabase Function

If you use Supabase Edge Functions:

1. Set secrets in Supabase dashboard:
   - Project Settings → Config → Secrets → Add `OPENAI_API_KEY` (and optional Gemini keys).
2. Deploy the function from your repo or via CLI:
   - `supabase functions deploy generate-interview`
3. Ensure your frontend Supabase client is configured with the project's URL and anon key.

The function returns:

```
{
  "questions": string[],
  "role": string,
  "difficulty": string
}
```

## Security Notes

- Never check in raw API keys. Use environment variables only.
- Rotate keys periodically and restrict usage where possible.


=======
# 🤖 AI Mock Interview Platform

AI Mock Interview is a full-stack web application that simulates a real interview experience using AI. Users can practice job interviews in a conversational format, receive intelligent feedback, and improve their confidence and readiness.

---

## 📌 Features

- ✨ Interactive AI-based interview experience
- 📄 Dynamic question generation based on selected roles or domains
- 🎯 Real-time feedback and evaluation
- 💬 Chat-based UI for intuitive conversation flow
- 📊 Interview history and performance tracking (via Supabase)
- 🎨 Responsive and modern design with Tailwind CSS

---

## 🛠️ Tech Stack

| Category         | Technologies                               |
|------------------|--------------------------------------------|
| Frontend         | TypeScript, React, Vite, Tailwind CSS       |
| Backend/API      | OpenAI / HuggingFace API (AI interaction)   |
| Database         | Supabase (PostgreSQL + Auth + Storage)      |
| Deployment       | Vercel                                      |
| Dev Tools        | ESLint, Prettier                            |

---

## 🚀 Live Demo
[Live Demo](https://ai-mock-interview-drab.vercel.app)  

---
## 🧠 AI Model Integration
This project integrates with AI models (such as OpenAI's GPT or HuggingFace APIs) to generate interview questions and responses.

API keys must be securely stored and provided via environment variables.

## 🙋‍♂️ Author
Balu Karthik
🔗 [LinkedIn](https://linkedin/in/balu-karthik/)
📬 Feel free to connect or reach out for collaboration.
>>>>>>> 29efb74140cb00398b79a3f26172ee4d0cf78f43
