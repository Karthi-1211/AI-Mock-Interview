/* @ts-nocheck */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EvalRequestBody {
  role?: string;
  difficulty?: string;
  questions: string[];
  answers: string[];
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    let body: EvalRequestBody;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const { questions = [], answers = [], role = 'Interview', difficulty = 'medium' } = body;

    const apiKey = Deno.env.get('OPENAI_API_KEY');
    const totalQuestions = Math.max(questions.length, answers.length);
    const answeredCount = answers.filter(a => a && a.trim().length > 10).length;
    const contentRatio = totalQuestions > 0 ? answeredCount / totalQuestions : 0;
    let overallScore = 0;
    let feedback = '';
    let skillBreakdown: Record<string, number> = {};
    let perAnswer: Array<{ question: string; answer: string; score: number; feedback: string; strengths: string[]; improvements: string[]; }> = [];

    try {
      if (!apiKey) throw new Error('missing key');
      const prompt = `You are an expert, strict interview evaluator. Score realistically. Penalize missing, off-topic, generic, or incorrect answers. If an answer is empty or irrelevant, score it 0.
Given questions and answers, return ONLY a JSON object with fields:
{
  "overallScore": number 0-100,
  "feedback": string,
  "skillBreakdown": { "technicalKnowledge":0-100, "communication":0-100, "problemSolving":0-100, "domainExpertise":0-100, "articulation":0-100, "confidenceLevel":0-100 },
  "answerFeedback": [ { "question": string, "answer": string, "score":0-100, "feedback": string, "strengths": string[], "improvements": string[] } ],
  "performanceTrend": [ { "question": string, "score":0-100 } ]
}
Rules:
- Evaluate according to role ${role} and difficulty ${difficulty}.
- If an answer length < 15 chars or says "don't know"/"not sure", score must be 0-20.
- If answer has factual errors or misses the question, score must be 0-40.
- Reserve 80-100 only for highly accurate, complete, structured answers.
- Be consistent and conservative.`;

      const user = JSON.stringify({ questions, answers, role, difficulty });

      const resp = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [ { role: 'system', content: prompt }, { role: 'user', content: user } ],
          temperature: 0.1,
          response_format: { type: 'json_object' },
        }),
      });
      if (!resp.ok) throw new Error(await resp.text());
      const data = await resp.json();
      const content = data?.choices?.[0]?.message?.content;
      if (!content) throw new Error('no content');
      const parsed = JSON.parse(content);
      overallScore = parsed.overallScore ?? 0;
      feedback = parsed.feedback ?? '';
      skillBreakdown = parsed.skillBreakdown ?? {};
      perAnswer = parsed.answerFeedback ?? [];
      const performanceTrend = parsed.performanceTrend ?? perAnswer.map((a: any, i: number) => ({ question: `Q${i+1}`, score: a.score ?? 0 }));

      // Safety clamps to avoid inflated scores when little content was provided
      const cap = Math.round(contentRatio * 100);
      overallScore = Math.min(overallScore, cap);
      perAnswer = perAnswer.map((item, idx) => {
        const ans = (answers[idx] || '').trim().toLowerCase();
        const tooShort = ans.length < 15;
        const dontKnow = ans.includes("don't know") || ans.includes('not sure') || ans.includes('no idea');
        const minCap = dontKnow ? 10 : (tooShort ? 20 : 100);
        const cappedScore = Math.min(item.score ?? 0, minCap);
        return { ...item, score: cappedScore };
      });

      return new Response(JSON.stringify({
        overallScore,
        feedback,
        skillBreakdown,
        answerFeedback: perAnswer,
        performanceTrend,
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    } catch (e) {
      // Heuristic fallback
      overallScore = Math.round(contentRatio * 100);
      skillBreakdown = {
        technicalKnowledge: overallScore,
        communication: Math.max(0, Math.min(100, overallScore - 5)),
        problemSolving: Math.max(0, Math.min(100, overallScore - 2)),
        domainExpertise: Math.max(0, Math.min(100, overallScore - 8)),
        articulation: Math.max(0, Math.min(100, overallScore - 5)),
        confidenceLevel: Math.max(0, Math.min(100, overallScore - 3)),
      };
      feedback = overallScore > 80 ? 'Strong performance.' : overallScore > 60 ? 'Good foundation.' : overallScore > 30 ? 'Needs improvement.' : 'Insufficient content provided.';
      perAnswer = questions.map((q, i) => ({
        question: q,
        answer: answers[i] || '',
        score: (answers[i] && answers[i].trim().length >= 15) ? Math.max(0, Math.min(100, overallScore - 5)) : 0,
        feedback: (answers[i] && answers[i].trim().length >= 15) ? 'Heuristic evaluation.' : 'Answer too short or missing.',
        strengths: [],
        improvements: [],
      }));
      const performanceTrend = perAnswer.map((a, i) => ({ question: `Q${i+1}`, score: a.score }));
      return new Response(JSON.stringify({ overallScore, feedback, skillBreakdown, answerFeedback: perAnswer, performanceTrend }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to evaluate interview' }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});


