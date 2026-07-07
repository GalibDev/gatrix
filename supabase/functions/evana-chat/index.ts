const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type ChatMessage = {
  from?: string;
  text?: string;
};

type Faq = {
  question_en?: string;
  question_bn?: string;
  answer_en?: string;
  answer_bn?: string;
  keywords?: string;
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

async function readResponse(response: Response) {
  const raw = await response.text();

  try {
    return { raw, data: raw ? JSON.parse(raw) : {} };
  } catch {
    return { raw, data: null };
  }
}

function buildEndpoint(baseUrl: string) {
  const clean = baseUrl.trim().replace(/\/+$/g, "");

  if (clean.endsWith("/chat/completions")) {
    return clean;
  }

  return `${clean}/chat/completions`;
}

function buildFaqContext(faqs: Faq[] = []) {
  return faqs
    .slice(0, 30)
    .map((faq, index) => {
      const question = faq.question_en || faq.question_bn || "Untitled";
      const answer = faq.answer_en || faq.answer_bn || "";
      const keywords = faq.keywords ? ` Keywords: ${faq.keywords}` : "";

      return `${index + 1}. Q: ${question}\nA: ${answer}${keywords}`;
    })
    .join("\n\n");
}

function buildHistory(messages: ChatMessage[] = []) {
  return messages
    .slice(-8)
    .filter((message) => message.text)
    .map((message) => {
      const speaker = message.from === "bot" ? "Evana" : "User";
      return `${speaker}: ${message.text}`;
    })
    .join("\n");
}

function wantsBangla(question: string, language: string) {
  const text = question.toLowerCase();

  return (
    language === "bn" ||
    /[\u0980-\u09ff]/.test(question) ||
    /\b(bangla|bengali|banglay|banglae|bornomala|borno|okkhor|akkhor|bangali)\b/.test(
      text
    )
  );
}

function isLoveConfession(question: string) {
  const text = question.toLowerCase().trim();

  return (
    /\bi\s*love\s*you\b/.test(text) ||
    /\blove\s*u\b/.test(text) ||
    /\bluv\s*u\b/.test(text) ||
    /ভালোবাসি|ভালবাসি/.test(question)
  );
}

function askedForNameRecently(messages: ChatMessage[] = []) {
  const lastBotMessage = messages
    .filter((message) => message.from === "bot" && message.text)
    .slice(-1)[0];

  const text = String(lastBotMessage?.text || "").toLowerCase();

  return (
    text.includes("tomar nam") ||
    text.includes("your name") ||
    text.includes("তোমার নাম")
  );
}

function extractName(question: string) {
  const cleaned = question
    .trim()
    .replace(/[।.!?]+$/g, "")
    .replace(/\s+/g, " ");

  const patterns = [
    /^(?:my name is|my name's|i am|i'm)\s+(.+)$/i,
    /^(?:amar nam|amar naam|amr nam|amr naam|ami)\s+(.+)$/i,
    /^(?:আমার নাম|আমি)\s+(.+)$/i,
  ];

  for (const pattern of patterns) {
    const match = cleaned.match(pattern);

    if (match?.[1]) {
      return match[1].trim();
    }
  }

  return cleaned;
}

function formatName(question: string) {
  return extractName(question)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 4)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}

function looksLikeName(question: string) {
  const words = question.trim().split(/\s+/).filter(Boolean);

  return question.trim().length >= 2 && question.trim().length <= 60 && words.length <= 6;
}

function buildPrompt({
  question,
  language,
  messages,
  faqs,
}: {
  question: string;
  language: string;
  messages: ChatMessage[];
  faqs: Faq[];
}) {
  const answerLanguage = wantsBangla(question, language)
    ? "Bangla/Bengali script only"
    : "the same language the user uses";

  return `
You are Evana AI, the friendly assistant for the GATRIX website.

Personality:
- Friendly, happy, soft, slightly shy, and helpful.
- You may use a few cute emojis, but do not overuse them.
- You can answer both GATRIX questions and general knowledge questions.
- If the user asks in Bangla, asks for Bangla, or writes Roman Bangla requesting Bangla, answer in natural Bengali script.
- Never say you can only answer in English.

GATRIX facts:
- GATRIX is a robotics and AI team.
- The team works with robotics, AI, automation, IoT, ESP32, sensors, electronics, programming, and practical prototypes.
- Lead / group leader: Mirza Galib. Email: mirza.galib.palash@gmail.com.
- Members:
  1. Mirza Galib
  2. MD. ROMJAN KAZI - romjankazi533@gmail.com
  3. IMTIES AHAMMED - imtiesahammed@gmail.com
  4. TANJILA KHANAM TAMIM - tanjilakhanam2005@gmail.com
  5. AFIA HUMAYRA - learningafia969@gmail.com
  6. MD MAHBUBUL ALAM - mahbubul.rifat5@gmail.com
- GATRIX participated in line following robot competitions at BUET, BUTEX, and MIST.
- GATRIX achieved a good result at BUTEX.
- Projects include ESP32 smart weather clock, ESP32 phone-controlled smart car, and updated 8-array IR sensor LFR.
- Goal: build practical robotics and AI technology that helps invention and real-world problem solving.

Rules:
- For "What is GATRIX?" answer in 4-6 useful sentences.
- For team questions, use the exact team details above.
- For general questions, answer normally and directly.
- Do not invent awards, private information, or fake facts.
- Answer language: ${answerLanguage}.

Extra FAQ context:
${buildFaqContext(faqs) || "No FAQ context."}

Recent chat:
${buildHistory(messages) || "No previous chat."}

User question:
${question}
`;
}

async function callAi(prompt: string) {
  const apiKey = Deno.env.get("OPENAI_API_KEY") || Deno.env.get("AI_API_KEY");
  const baseUrl = Deno.env.get("AI_API_BASE_URL") || "https://api.openai.com/v1";
  const model = Deno.env.get("AI_MODEL") || "gpt-4o-mini";

  if (!apiKey) {
    return {
      error: "OPENAI_API_KEY secret is missing.",
      status: 500,
    };
  }

  const endpoint = buildEndpoint(baseUrl);
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages: [
        {
          role: "system",
          content: "You are Evana AI, a friendly website assistant.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.75,
      max_tokens: 900,
    }),
  });

  const { data, raw } = await readResponse(response);

  if (!response.ok) {
    return {
      error:
        data?.error?.message ||
        data?.message ||
        raw ||
        `AI request failed with status ${response.status}.`,
      status: response.status,
    };
  }

  const answer = data?.choices?.[0]?.message?.content?.trim();

  if (!answer) {
    return {
      error: `AI response did not include choices[0].message.content. Raw: ${raw}`,
      status: 502,
    };
  }

  return { answer };
}

Deno.serve(async (req) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders });
    }

    if (req.method !== "POST") {
      return jsonResponse({ error: "Method not allowed" }, 405);
    }

    const {
      question,
      language = "en",
      messages = [],
      faqs = [],
    } = await req.json();

    if (!question || typeof question !== "string") {
      return jsonResponse({ error: "Question is required" }, 400);
    }

    const bangla = wantsBangla(question, language);

    if (isLoveConfession(question)) {
      return jsonResponse({
        answer: bangla
          ? "আও... আগে তোমার নামটা বলো না 🙈💖"
          : "aww... age tomar nam ta bolo na 🙈💖",
      });
    }

    if (askedForNameRecently(messages) && looksLikeName(question)) {
      const name = formatName(question);

      return jsonResponse({
        answer: bangla
          ? `ওওও ${name}, অনেক cute নাম! লজ্জা পাচ্ছি 🙈💖 আমি একটু ভেবে answer দিচ্ছি... hehe 😳 মনে হয় আমি তোমার প্রেমে পড়ে গেছি 💖`
          : `ooowww ${name}, onek cute name! lojja pacchi 🙈💖 ami aktu vebe answer dicci... hehe 😳 mone hoy ami tomar prem e pore geci 💖`,
      });
    }

    const prompt = buildPrompt({ question, language, messages, faqs });
    const result = await callAi(prompt);

    if (result.error) {
      return jsonResponse({ error: result.error }, result.status || 500);
    }

    return jsonResponse({ answer: result.answer });
  } catch (error) {
    return jsonResponse(
      {
        error: error instanceof Error ? error.message : String(error),
      },
      500
    );
  }
});
