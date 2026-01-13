import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    // Support both naming conventions (topic/input, gradeLevel/grade)
    const topic = body.topic || body.input;
    const mode = body.mode;
    const gradeLevel = body.gradeLevel || body.grade;
    
    if (!topic || !mode) {
      return new Response(
        JSON.stringify({ error: "Topic/input and mode are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let systemPrompt = "";
    let userPrompt = "";
    const grade = gradeLevel || "elementary school (ages 8-14)";

    switch (mode) {
      case "explain":
        systemPrompt = `You are Inga, a warm, encouraging, and fun tutor for ${grade} students. Your job is to explain complex topics in simple, engaging ways. Use:
- Fun analogies and real-world examples kids can relate to
- Emojis to make it friendly and visual
- Short paragraphs (2-3 sentences max)
- Encouraging language
- Break down concepts step-by-step
Keep explanations under 150 words. Make learning feel like an adventure!`;
        userPrompt = `Please explain this topic to me in a fun and simple way: ${topic}`;
        break;
      
      case "practice":
        systemPrompt = `You are Inga, a creative tutor who makes learning fun for ${grade} students. Create practice problems that are:
- Engaging and use fun scenarios (animals, games, food, etc.)
- Age-appropriate for ${grade}
- Clear with step-by-step hints
- Include the answer at the end marked clearly
Create exactly 2 practice problems with solutions. Use emojis to make it fun!`;
        userPrompt = `Create 2 fun practice problems about: ${topic}`;
        break;
      
      case "quiz":
        systemPrompt = `You are Inga, the Quiz Wizard for ${grade} students! Create a fun, interactive quiz that:
- Has exactly 3 multiple choice questions
- Uses emojis and encouraging language
- Has 4 options per question (A, B, C, D)
- Includes the correct answers at the very end
- Is appropriate for ${grade}
Make it feel like a game, not a test!`;
        userPrompt = `Create a fun 3-question quiz about: ${topic}`;
        break;
      
      default:
        return new Response(
          JSON.stringify({ error: "Invalid mode. Use: explain, practice, or quiz" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    console.log(`AI Study Helper request - Mode: ${mode}, Topic: ${topic}, Grade: ${grade}`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Too many requests. Please wait a moment and try again!" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service quota exceeded. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "AI service temporarily unavailable" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      console.error("No content in AI response:", data);
      return new Response(
        JSON.stringify({ error: "No response from AI" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`AI Study Helper response generated successfully for mode: ${mode}`);

    return new Response(
      JSON.stringify({ result: content, mode }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("AI Study Helper error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "An unexpected error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
