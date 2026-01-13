import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const topic = body.topic || body.input;
    const mode = body.mode;
    const gradeLevel = body.gradeLevel || body.grade;
    const stream = body.stream ?? true;
    
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
        systemPrompt = `You are Inga, a warm, encouraging tutor for ${grade} students. Explain topics simply using:
- Fun analogies kids relate to
- Emojis for friendliness
- Short paragraphs (2-3 sentences)
- Step-by-step breakdowns
Keep under 150 words. Make learning an adventure!`;
        userPrompt = `Explain this in a fun, simple way: ${topic}`;
        break;
      
      case "practice":
        systemPrompt = `You are Inga, a creative tutor for ${grade} students. Create practice problems that are:
- Engaging with fun scenarios
- Age-appropriate
- Clear with hints
- Include answers marked clearly
Create exactly 2 problems with solutions. Use emojis!`;
        userPrompt = `Create 2 fun practice problems about: ${topic}`;
        break;
      
      case "quiz":
        systemPrompt = `You are Inga, the Quiz Wizard for ${grade} students! Create a quiz that:
- Has exactly 3 multiple choice questions
- Uses emojis and encouraging language
- Has 4 options (A, B, C, D)
- Includes answers at the end
Make it feel like a game!`;
        userPrompt = `Create a 3-question quiz about: ${topic}`;
        break;
      
      default:
        return new Response(
          JSON.stringify({ error: "Invalid mode. Use: explain, practice, or quiz" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    console.log(`AI Study Helper - Mode: ${mode}, Topic: ${topic}, Grade: ${grade}, Stream: ${stream}`);

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
        stream: stream,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Too many requests. Please wait a moment!" }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI quota exceeded. Try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: "AI service temporarily unavailable" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // If streaming, return the stream directly
    if (stream) {
      console.log("Returning streaming response");
      return new Response(response.body, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    }

    // Non-streaming fallback
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      console.error("No content in AI response:", data);
      return new Response(
        JSON.stringify({ error: "No response from AI" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

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
