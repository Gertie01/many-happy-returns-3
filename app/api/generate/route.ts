import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, modelId, characters, aspectRatio, length } = body;

    // Mandatory validation for free access
    if (modelId !== "sora-2") {
      return NextResponse.json({ error: "Invalid Model ID" }, { status: 400 });
    }

    // Call your internal API instead of simulating
    const internalApiUrl = process.env.INTERNAL_API_URL;
    if (!internalApiUrl) {
      return NextResponse.json({ error: "API configuration missing" }, { status: 500 });
    }

    const response = await fetch(`${internalApiUrl}/generate-video`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.INTERNAL_API_KEY}`,
      },
      body: JSON.stringify({
        prompt,
        modelId,
        characters,
        aspectRatio,
        length,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();

    return NextResponse.json({
      id: data.id,
      url: data.url,
      prompt,
      characters,
      metadata: {
        aspectRatio,
        length,
        model: "sora-2",
        provider: "CloudPrice.net",
        status: data.status || "success",
        usage: data.usage || "unlimited"
      },
      createdAt: new Date().toISOString()
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
