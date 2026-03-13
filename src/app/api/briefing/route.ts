import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const client = new Anthropic();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  const { interests } = await request.json();

  const message = await client.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: `You are Kairo, a personal morning briefing assistant. Generate a concise, intelligent morning briefing for someone with the following interests: ${interests}. Cover: top news, anything relevant to their interests, and end with one sharp observation or question to think about today. Be direct, warm, and intelligent. No fluff.`,
      },
    ],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";

  const { data, error } = await supabase.from("briefings").insert({
    content: text,
    topics_covered: interests.split(",").map((i: string) => i.trim()),
  });

  console.log("Supabase insert result:", { data, error });

  return NextResponse.json({ briefing: text });
}
