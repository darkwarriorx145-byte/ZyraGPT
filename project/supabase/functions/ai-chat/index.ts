const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY") ?? "";
const HF_API_KEY = Deno.env.get("HUGGING_FACE_API_KEY") ?? "";

const MODEL_MAP: Record<string, string> = {
  "zyra-mini": "openrouter/free",
  "zyra-flash": "openrouter/free",
  "zyra-pro": "openrouter/free",
  "zyra-reason": "openrouter/free",
};

const IMAGE_KEYWORDS = [
  "generate an image",
  "generate image",
  "make an image",
  "make image",
  "create an image",
  "create image",
  "draw",
  "render an image",
  "render image",
  "produce an image",
  "produce image",
  "image of",
  "picture of",
  "photo of",
];

function isImageRequest(text: string): boolean {
  const lower = text.toLowerCase().trim();
  return IMAGE_KEYWORDS.some((kw) => lower.includes(kw));
}

function extractImagePrompt(text: string): string {
  const lower = text.toLowerCase();
  for (const kw of IMAGE_KEYWORDS) {
    const idx = lower.indexOf(kw);
    if (idx !== -1) {
      const after = text.slice(idx + kw.length).trim();
      const cleaned = after.replace(/^(of|for|me|please|a|an|the)\s+/i, "").trim();
      if (cleaned.length > 2) return cleaned;
    }
  }
  return text.trim();
}

async function generateImage(prompt: string): Promise<{ image: string } | { error: string }> {
  if (!HF_API_KEY) {
    return {
      error:
        "Hugging Face API key not configured. Set HUGGING_FACE_API_KEY as an edge function secret.",
    };
  }

  const models = [
    "stabilityai/stable-diffusion-xl-base-1.0",
  ];

  for (const model of models) {
    try {
      const response = await fetch(
        `https://router.huggingface.co/models/${model}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${HF_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: prompt,
            options: { wait_for_model: true },
          }),
        }
      );

      if (response.ok) {
        const buffer = await response.arrayBuffer();
        const base64 = btoa(
          String.fromCharCode(...new Uint8Array(buffer))
        );
        return { image: `data:image/png;base64,${base64}` };
      }

      if (response.status === 503) {
        continue;
      }

      const errText = await response.text();
      console.error(`HF model ${model} failed:`, response.status, errText);
    } catch (err) {
      console.error(`HF model ${model} error:`, err.message);
    }
  }

  return { error: "Image generation failed. All models are currently unavailable." };
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (!OPENROUTER_API_KEY) {
    return new Response(
      JSON.stringify({
        error:
          "OpenRouter API key not configured. Set OPENROUTER_API_KEY as an edge function secret.",
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const { messages, model = "zyra-mini" } = await req.json();

    const lastMessage = messages[messages.length - 1];
    const lastContent = lastMessage?.content ?? "";

    if (isImageRequest(lastContent)) {
      const prompt = extractImagePrompt(lastContent);
      const result = await generateImage(prompt);

      if ("error" in result) {
        return new Response(
          JSON.stringify({ error: result.error }),
          { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      return new Response(
        JSON.stringify({
          content: `Here's the image I generated for: **${prompt}**`,
          image: result.image,
          type: "image",
          model: "huggingface",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const openRouterModel = MODEL_MAP[model] ?? MODEL_MAP["zyra-mini"];

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: openRouterModel,
          messages: [
            {
              role: "system",
              content:
                "You are ZyraGPT, a helpful AI assistant running on edge GPU infrastructure. Keep responses concise, informative, and well-structured.",
            },
            ...messages,
          ],
          max_tokens: 1024,
          temperature: 0.7,
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      return new Response(
        JSON.stringify({ error: `AI provider error: ${response.status}`, detail: errText }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? "No response generated.";

    return new Response(
      JSON.stringify({ content, model: openRouterModel, type: "text" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
