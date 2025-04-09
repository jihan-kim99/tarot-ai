import { NextResponse } from "next/server";
import {
  GoogleGenerativeAI,
  GoogleGenerativeAIFetchError,
} from "@google/generative-ai";
import { HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

interface FormattedMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

// Position descriptions for Universal 6 Card Spread
const positionDescriptions = [
  "How you feel about yourself now",
  "What you most want at this moment",
  "Your fears",
  "What is going for you",
  "What is going against you",
  "The outcome according to your current situation",
];

export async function POST(request: Request) {
  try {
    // Validate API key first
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      console.error("Missing GOOGLE_API_KEY environment variable");
      return NextResponse.json(
        { error: "API configuration error: Missing API key" },
        { status: 500 }
      );
    }

    const {
      userInfo,
      question,
      cards,
      card,
      spreadType = "single",
    } = await request.json();
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash", // Using a more widely available model
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
      ],
    });

    let prompt = "";
    let structuredOutput = false;

    // Handle different spread types
    if (
      spreadType === "universal6" &&
      Array.isArray(cards) &&
      cards.length === 6
    ) {
      structuredOutput = true;
      prompt = [
        `You are an expert tarot card reader. You will interpret the Universal 6 Card Spread.`,
        `About the querent: ${userInfo}`,
        `The querent has asked: "${question}"`,
        `The Universal 6 Card Spread is a famous spread that has been consulted over 200 million times since 2002. It uses Major Arcana cards to provide a snapshot of the querent's current situation.`,
        `Here are the 6 cards drawn in their respective positions:`,
        ...cards.map(
          (card, i) =>
            `Position ${i + 1} (${positionDescriptions[i]}): ${card.name}`
        ),
        `RESPONSE FORMAT: Your response must be valid JSON with the following structure:`,
        `{
  "positions": [
    {
      "position": 1,
      "card": "Card Name",
      "description": "Position description",
      "interpretation": "Detailed interpretation for this position"
    },
    // ... repeat for all 6 positions
  ],
  "overall": "Overall synthesis of the reading that ties all positions together"
}`,
        `Each position's interpretation should explain what the card means in that specific position and how it relates to the querent's question.`,
        `The "overall" field should provide a comprehensive synthesis that ties all positions together.`,
        `Answer in the language of the querent's question.`,
        `Remember that the first reading is always the most appropriate - emphasize accepting this reading rather than seeking another.`,
      ].join("\n");
    } else {
      // Fallback to single card reading
      const singleCard =
        card || (Array.isArray(cards) && cards.length > 0 ? cards[0] : null);

      if (!singleCard) {
        return NextResponse.json(
          { error: "No cards provided for reading" },
          { status: 400 }
        );
      }

      prompt = [
        `You are a tarot card reader. You will answer the user's question based on the tarot card drawn. The user is ${userInfo}.`,
        `The user has asked: "${question}".`,
        `The tarot card drawn is "${singleCard.name}".`,
        `Answer in the language of the user's question`,
        `Please provide a detailed interpretation of the card in relation to the user's question.`,
        `The interpretation should be insightful and relevant to the user's situation.`,
      ].join("\n");
    }

    const formattedHistory: FormattedMessage[] = [
      {
        role: "user",
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ];

    try {
      const chat = model.startChat({
        history: formattedHistory,
        generationConfig: {
          maxOutputTokens: 2000, // Increased for multi-card readings
        },
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
          },
        ],
      });

      const result = await chat.sendMessage(prompt);
      const response = await result.response;
      const text = response.text();

      // For Universal 6 Card Spread, try to parse the response as JSON
      if (structuredOutput) {
        try {
          // Extract JSON if it's wrapped in code blocks
          const jsonMatch =
            text.match(/```(?:json)?([\s\S]*?)```/) ||
            text.match(/\{[\s\S]*\}/);
          const jsonContent = jsonMatch
            ? jsonMatch[0].replace(/```json|```/g, "")
            : text;

          // Parse the JSON content
          const parsedResponse = JSON.parse(jsonContent);
          return NextResponse.json({ response: parsedResponse });
        } catch (jsonError) {
          console.error("Failed to parse JSON response:", jsonError);
          // Fallback to returning the text response
          return NextResponse.json({ response: text, structured: false });
        }
      } else {
        // For single card reading, return text as before
        return NextResponse.json({ response: text });
      }
    } catch (apiError: unknown) {
      console.error("Google API Error:", apiError);
      if (apiError instanceof GoogleGenerativeAIFetchError) {
        console.error("Fetch Error:", apiError.message);

        return NextResponse.json(
          { error: "Failed to fetch from AI service" },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { error: "Failed to generate content from AI service" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("General Error:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}
