
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RequestBody {
  role: string;
  description?: string;
  experience?: string;
  difficulty: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  
  try {
    const body: RequestBody = await req.json()
    const { role, description, experience, difficulty } = body
    
    if (!role || !difficulty) {
      return new Response(
        JSON.stringify({ error: 'Role and difficulty are required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      )
    }

    // Generate questions based on the job role and other parameters
    // In a real implementation, this would call an AI model
    // For now, we'll use predefined questions based on role type
    
    let questions: string[] = []
    
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
      ]
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
      ]
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
      ]
    } else {
      // Default general questions
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
      ]
    }
    
    // Adjust number of questions based on difficulty
    let questionCount = 5;
    if (difficulty === 'medium') {
      questionCount = 8;
    } else if (difficulty === 'hard') {
      questionCount = 10;
    }
    
    // Return only the requested number of questions
    const finalQuestions = questions.slice(0, questionCount);
    
    console.log(`Generated ${finalQuestions.length} questions for ${role} role`);
    
    return new Response(
      JSON.stringify({ 
        questions: finalQuestions,
        role,
        difficulty 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error generating interview questions:', error);
    
    return new Response(
      JSON.stringify({ error: 'Failed to generate interview questions' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
