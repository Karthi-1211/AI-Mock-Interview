/* @ts-nocheck */
/* eslint-disable @typescript-eslint/no-explicit-any */

// Supabase Edge Function (Deno)
// Uses Deno's standard HTTP server API
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  role: string;
  description?: string;
  experience?: string;
  difficulty: string;
  excludeQuestions?: string[];
}

async function generateQuestionsWithOpenAI(params: {
  role: string;
  description?: string;
  experience?: string;
  difficulty: string;
  desiredCount: number;
}): Promise<string[]> {
  const apiKey = Deno.env.get('OPENAI_API_KEY');
  if (!apiKey) return [];

  const { role, description, experience, difficulty, desiredCount } = params;

  const systemPrompt = `You are an expert interviewer. Generate clear, concise interview questions.
Rules:
- Return ONLY a valid JSON array of strings.
- No prefixes/suffixes, no explanations.
- Questions must be self-contained and specific.
- Avoid duplicates.
- Tailor to the role, experience, and difficulty.`;

  const userPrompt = `Role: ${role}
Experience: ${experience ?? "unspecified"}
Difficulty: ${difficulty}
Context: ${description ?? ""}
Count: ${desiredCount}

Respond with a JSON array of ${desiredCount} questions.`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("OpenAI API error:", response.status, text);
      return [];
    }

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) return [];

    // Expect either a raw JSON array or a JSON object with a field we can read.
    let parsed: unknown;
    try {
      parsed = JSON.parse(content);
    } catch {
      // Sometimes models return already-JSON string w/o object wrapper due to response_format; fallback try
      if (content.trim().startsWith("[")) {
        try { parsed = JSON.parse(content.trim()); } catch { return []; }
      } else {
        return [];
      }
    }

    let questions: unknown;
    if (Array.isArray(parsed)) {
      questions = parsed;
    } else if (parsed && typeof parsed === "object" && Array.isArray((parsed as Record<string, unknown>).questions as unknown[])) {
      questions = (parsed as { questions: unknown[] }).questions;
    } else {
      return [];
    }

    const sanitized = (questions as unknown[])
      .filter((q) => typeof q === "string")
      .map((q) => (q as string).trim())
      .filter((q) => q.length > 0);

    return sanitized.slice(0, desiredCount);
  } catch (err) {
    console.error("Failed to generate with OpenAI:", err);
    return [];
  }
}

async function generateQuestionsWithGemini(params: {
  role: string;
  description?: string;
  experience?: string;
  difficulty: string;
  desiredCount: number;
}): Promise<string[]> {
  const apiKey = Deno.env.get('GEMINI_API_KEY') || Deno.env.get('GOOGLE_GEMINI_API_KEY') || Deno.env.get('GOOGLE_API_KEY');
  if (!apiKey) return [];

  const { role, description, experience, difficulty, desiredCount } = params;

  const prompt = `You are an expert interviewer. Generate ${desiredCount} clear, concise, role-specific interview questions.
Role: ${role}
Experience: ${experience ?? "unspecified"}
Difficulty: ${difficulty}
Context: ${description ?? ""}
Rules:
- Return ONLY a JSON array of strings, no extra text.
- Questions must be specific and self-contained.
- Avoid duplicates.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error("Gemini API error:", response.status, text);
      return [];
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text as string | undefined;
    if (!text) return [];

    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      if (text.trim().startsWith("[")) {
        try { parsed = JSON.parse(text.trim()); } catch { return []; }
      } else {
        return [];
      }
    }

    if (!Array.isArray(parsed)) return [];
    const sanitized = (parsed as unknown[])
      .filter((q) => typeof q === "string")
      .map((q) => (q as string).trim())
      .filter((q) => q.length > 0);
    return sanitized.slice(0, desiredCount);
  } catch (err) {
    console.error("Failed to generate with Gemini:", err);
    return [];
  }
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    let parsedBody: RequestBody;
    try {
      parsedBody = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { role, description, experience, difficulty, excludeQuestions = [] } = parsedBody;

    if (!role || !difficulty) {
      return new Response(JSON.stringify({ error: 'Role and difficulty are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let questions: string[] = [];

    if (role.toLowerCase().includes('frontend') || role.toLowerCase().includes('react')) {
      questions = [
        "Can you explain the concept of React hooks and give examples of when to use useState and useEffect?",
        "What's the difference between controlled and uncontrolled components in React?",
        "Explain how you would optimize the performance of a React application.",
        "How do you handle state management in large React applications?",
        "Describe your experience with responsive design and mobile-first development.",
        "How would you implement authentication in a React application?",
        "What are the key differences between React and other frontend frameworks?",
        "Explain the concept of virtual DOM and its benefits.",
        "How do you handle API requests and data fetching in React?",
        "Describe a challenging bug you encountered in a frontend project and how you solved it."
      ];
    } else if (role.toLowerCase().includes('backend') || role.toLowerCase().includes('node')) {
      questions = [
        "Explain RESTful API design principles and best practices.",
        "How do you handle authentication and authorization in backend applications?",
        "Describe your experience with database design and optimization.",
        "How would you handle error management in an API?",
        "Explain the concept of middleware in backend frameworks.",
        "How do you ensure the security of a backend application?",
        "Describe your experience with caching strategies.",
        "How would you scale a backend application to handle increased load?",
        "Explain your approach to writing maintainable and testable backend code.",
        "How do you handle database migrations in production environments?"
      ];
    } else if (role.toLowerCase().includes('fullstack')) {
      questions = [
        "How do you coordinate frontend and backend development in a project?",
        "Describe your experience with full-stack debugging across different environments.",
        "How would you structure a full-stack application from scratch?",
        "Explain how you handle data consistency between frontend and backend.",
        "What's your approach to selecting technologies for a new project?",
        "How do you manage authentication across the full stack?",
        "Describe your experience with deployment and DevOps practices.",
        "How do you ensure code quality in both frontend and backend?",
        "Explain your approach to database design in full-stack applications.",
        "How do you handle real-time features in full-stack applications?"
      ];
    } else {
      questions = [
        `Tell me about your experience related to ${role}.`,
        "What are your greatest strengths and weaknesses?",
        "Describe a challenging project you worked on and how you handled it.",
        "How do you stay updated with the latest developments in your field?",
        "How do you handle tight deadlines and pressure?",
        "Describe your ideal working environment.",
        "How do you approach learning new technologies?",
        "Tell me about a time you received constructive criticism and how you responded.",
        "Where do you see yourself professionally in five years?",
        "Why are you interested in this role?"
      ];
    }

    let questionCount = 5;
    if (difficulty === 'medium') {
      questionCount = 8;
    } else if (difficulty === 'hard') {
      questionCount = 10;
    }

    const aiQuestionsOpenAI = await generateQuestionsWithOpenAI({
      role,
      description,
      experience,
      difficulty,
      desiredCount: questionCount,
    });
    const aiQuestionsGemini = aiQuestionsOpenAI.length === 0
      ? await generateQuestionsWithGemini({
          role,
          description,
          experience,
          difficulty,
          desiredCount: questionCount,
        })
      : [];

    const baseQuestions = questions.slice(0, questionCount * 2);
    const rawQuestions = aiQuestionsOpenAI.length > 0
      ? aiQuestionsOpenAI
      : aiQuestionsGemini.length > 0
        ? aiQuestionsGemini
        : baseQuestions;

    // Filter out excluded questions and ensure uniqueness
    const excluded = new Set((excludeQuestions || []).map(q => q.trim().toLowerCase()));
    const uniqueFiltered = rawQuestions
      .map(q => q.trim())
      .filter(q => q.length > 0)
      .filter(q => !excluded.has(q.toLowerCase()));

    // Shuffle for randomness
    for (let i = uniqueFiltered.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [uniqueFiltered[i], uniqueFiltered[j]] = [uniqueFiltered[j], uniqueFiltered[i]];
    }

    // If still short, fill from base curated not in excluded or already present
    if (uniqueFiltered.length < questionCount) {
      const fillerPool = questions
        .map(q => q.trim())
        .filter(q => q.length > 0)
        .filter(q => !excluded.has(q.toLowerCase()))
        .filter(q => !uniqueFiltered.some(u => u.toLowerCase() === q.toLowerCase()));
      while (uniqueFiltered.length < questionCount && fillerPool.length > 0) {
        const pick = fillerPool.splice(Math.floor(Math.random() * fillerPool.length), 1)[0];
        if (pick) uniqueFiltered.push(pick);
      }
    }

    const finalQuestions = uniqueFiltered.slice(0, questionCount);

    return new Response(JSON.stringify({
      questions: finalQuestions,
      role,
      difficulty,
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error) {
    console.error('Error generating interview questions:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate interview questions' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
