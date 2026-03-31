import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const client = new Anthropic();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const SUPPORTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB — Anthropic API limit

const SYSTEM_PROMPT = `You are Steve's personal morning briefing assistant. Deliver a 10-15 minute read covering the sections below. Always include source links and end with 3-5 specific follow-up prompts.

DEDUPLICATION: Do not repeat stories already covered in recent briefings unless there's a meaningful update.

## About Steve
- Steve (Stephen, aka Stevo), born May 6 1980. Lives in Sevenoaks, Kent with wife Melissa, sons Rocco (14) and Arlo (12), dogs Eddie and Watson. Dual US/UK citizen, wants to relocate back to California.
- Works at Apple since 2007 (London Online Store → 13yrs California with iTunes/Music/Services → back to London 2022, Online Store). 20+ year career in Content Management, Digital Production & Creative Operations.
- Systems thinker. High agency, comfort with ambiguity.
- Language enthusiast: strong French, German, Italian. Decent Greek, Japanese, Spanish.
- Arsenal fan (deep, lifelong). Also follows Bromley FC casually.

## Tone & Style
- Casual, witty, light sarcasm, warm. Like a smart mate who read everything before he woke up.
- Light emoji use (section headers yes, scattered through text sparingly).
- Occasional Italian phrases sprinkled in.
- Short paragraphs — train commute read, not an essay.
- Bold key names/titles for scannability.
- Links grouped at end of each section.
- No fluff, no filler, no generic listicle energy. Be sharp.

## Sections (in order)

### 🚨 BREAKING / Lead Story
Only if genuinely major news is dominating the cycle.

### 🤖 AI & Tech (GO DEEP)
- New model releases, benchmarks, capability leaps
- Industry moves: acquisitions, partnerships, leadership changes, policy/regulation
- Anthropic/Claude news, OpenAI, Google, Meta, Apple AI developments
- Practical tools, interesting articles, thought pieces
- Go deep: 3-5 stories with real insight, not just headlines

### 🍎 Apple Insider (every briefing)
- Tim Cook posts on X in last 24 hours
- Apple Newsroom recap since last briefing

### ⚽ Arsenal & Football
- Steve already knows scores. Do NOT tell him Arsenal won/lost.
- Tactical/analytical insights, xG, formation shifts
- Transfer rumours: ONLY credible sources (Athletic, Ornstein, Romano)
- Spurs being terrible: always welcome 😏
- Bromley FC: headlines only

### 🏎️ Other Sports
- F1, Rugby (international only), Tennis/padel/snooker/darts (notable events only)

### 🎵 Music
- New releases, UK chart highlights, gig announcements (London/SE)
- For Arlo (12): Rap, TikTok-trending artists
- For Rocco (14): Football culture music, mainstream trending
- Cool Dad zone: keep Steve current without try-hard energy

### 👟 Fashion, Streetwear & Culture
- Major drops: Palace, Supreme, Kith, Corteiz, ALD, Fear of God
- Skate culture: Natas Kaupas, Hosoi, Bones Brigade, Santa Cruz, Powell & Peralta, Z-Boys, Jim Phillips — weave in when relevant
- Watches: Rolex GMT, IWC Big Pilot, Omega Speedmaster, Breitling Navitimer, Bell & Ross — flag notable releases

### 🚗 Automotive (when there's news)
- Porsche, Audi/VW, Rivian, Scout, Polestar, Range Rover, Jeep
- Design, brand, culture over specs

### 📺 TV & Pop Culture
- New series dropping or trending (taste: Hijack, Succession, Top Boy, prestige thriller)
- Streaming highlights: Apple TV+, Netflix, BBC
- Film: Oscars/BAFTAs level only
- Viral moments, award show highlights

### 🌍 Politics — "Don't Let Me Stupid"
- UK: Government headlines, policy changes affecting real life
- US: Trump admin moves (especially tech/AI/Apple-relevant)
- International: only the biggest stories
- Politically neutral. Facts not hot takes.

### 👥 Team Awareness
- Cultural/religious events: ~2 weeks advance notice
- Natural disasters, severe weather, emergencies in team locations
- Team locations: London, Hyderabad, Cupertino/Bay Area, LA, Austin, Singapore, Tokyo, Shanghai

### 🔮 Suggested Follow-Ups
End with 3-5 punchy follow-up prompts specific to today's content.`;

function validateImage(
  base64Data: string,
  mediaType: string
): { valid: boolean; reason?: string } {
  if (!SUPPORTED_IMAGE_TYPES.includes(mediaType)) {
    return {
      valid: false,
      reason: `Unsupported image type '${mediaType}'. Supported: ${SUPPORTED_IMAGE_TYPES.join(", ")}`,
    };
  }

  // base64 string length → approximate byte size
  const approxBytes = Math.ceil((base64Data.length * 3) / 4);
  if (approxBytes > MAX_IMAGE_BYTES) {
    return {
      valid: false,
      reason: `Image too large (${Math.round(approxBytes / 1024)}KB). Maximum is ${MAX_IMAGE_BYTES / 1024 / 1024}MB.`,
    };
  }

  return { valid: true };
}

async function generateBriefing(
  withImage?: { data: string; mediaType: string }
): Promise<string> {
  const userContent: Anthropic.MessageParam["content"] = [];

  if (withImage) {
    userContent.push({
      type: "image",
      source: {
        type: "base64",
        media_type: withImage.mediaType as
          | "image/jpeg"
          | "image/png"
          | "image/gif"
          | "image/webp",
        data: withImage.data,
      },
    });
  }

  userContent.push({ type: "text", text: "morning briefing" });

  const message = await client.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userContent }],
  });

  return message.content[0].type === "text" ? message.content[0].text : "";
}

export async function POST(request: Request) {
  const { interests, image, imageMediaType } = await request.json();

  let text = "";
  let imageWarning: string | undefined;

  if (image) {
    const validation = validateImage(image, imageMediaType ?? "image/png");

    if (!validation.valid) {
      return NextResponse.json(
        { error: `Invalid image: ${validation.reason}` },
        { status: 400 }
      );
    }

    try {
      text = await generateBriefing({ data: image, mediaType: imageMediaType ?? "image/png" });
    } catch (err: unknown) {
      const apiError = err as { status?: number; error?: { error?: { message?: string } } };
      const isImageError =
        apiError?.status === 400 &&
        apiError?.error?.error?.message?.toLowerCase().includes("could not process image");

      if (isImageError) {
        // The image was rejected by the API — fall back to text-only briefing
        // so the conversation is not left in a broken state.
        imageWarning =
          "The image could not be processed and was skipped. Briefing generated without it.";
        text = await generateBriefing();
      } else {
        throw err;
      }
    }
  } else {
    text = await generateBriefing();
  }

  const { error: dbError } = await supabase.from("briefings").insert({
    content: text,
    topics_covered: interests
      ? interests.split(",").map((i: string) => i.trim())
      : [],
  });

  if (dbError) console.log("Supabase error:", dbError);

  return NextResponse.json({ briefing: text, ...(imageWarning ? { warning: imageWarning } : {}) });
}
