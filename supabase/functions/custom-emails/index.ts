/// <reference types="https://deno.land/std@0.168.0/http/server.d.ts" />
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

/// <reference types="https://esm.sh/@supabase/supabase-js@2/index.d.ts" />
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// This edge function handles custom email functionality
// It modifies the confirmation URL to ensure redirect to dashboard for SIGNUP events

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { event, email, subject, data } = await req.json();
    
    // Log the email event details for debugging
    console.log(`Email event received: ${event}`);
    console.log(`Email to: ${email}`);
    console.log(`Subject: ${subject}`);
    console.log(`Data:`, data);
    
    const modifiedData = { ...data };
    
    // Handle SIGNUP event and modify confirmation URL
    if (event === 'SIGNUP' && data?.confirmation_url) {
      console.log(`Original confirmation URL: ${data.confirmation_url}`);
      
      try {
        const url = new URL(data.confirmation_url);
        const redirectTo = url.searchParams.get('redirect_to');
        console.log(`Redirect to parameter: ${redirectTo}`);
        
        // Ensure the confirmation URL redirects to dashboard
        const baseUrl = url.origin;
        const dashboardUrl = `${baseUrl}/dashboard`;
        if (!redirectTo || !redirectTo.includes('/dashboard')) {
          url.searchParams.set('redirect_to', dashboardUrl);
          modifiedData.confirmation_url = url.toString();
          console.log(`Modified confirmation URL: ${modifiedData.confirmation_url}`);
        }
        
        // Log all URL parameters for debugging
        console.log("All URL parameters:");
        url.searchParams.forEach((value, key) => {
          console.log(`${key}: ${value}`);
        });
      } catch (urlError) {
        console.error(`Error parsing confirmation URL: ${urlError}`);
      }
    }
    
    // Create a Supabase client with service_role_key (for potential future use)
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );
    
    return new Response(
      JSON.stringify({
        success: true,
        message: "Email event processed",
        notes: "Confirmation URL modified to redirect to dashboard. Update email templates in Supabase Dashboard > Authentication > Email Templates if needed.",
        event,
        email,
        subject,
        data: modifiedData,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Email function error:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal server error',
        message: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});