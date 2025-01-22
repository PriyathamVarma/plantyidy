// app/api/identify/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: NextRequest) {
  console.log("Identifying plant: Step 1 - Request received");

  try {
    // Parse the request body
    const requestBody = await request.json();
    const { image } = requestBody;

    console.log("Identifying plant: Step 2 - Image received");

    // Validate API key
    if (!process.env.GEMINI_API_KEY) {
      console.error("Gemini API key is missing");
      return NextResponse.json(
        { error: "Gemini API key is not configured" },
        { status: 500 },
      );
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
    console.log("Identifying plant: Step 3 - Gemini AI initialized");

    // Get the vision model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    console.log("Identifying plant: Step 4 - Model selected");

    // Prepare the image data
    const imageParts = [
      {
        inlineData: {
          mimeType: "image/jpeg",
          data: image.split(",")[1], // Extract the base64 data
        },
      },
    ];

    console.log("Identifying plant: Step 5 - Image parts prepared");

    // Generate content
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Identify this plant scientifically. Provide the following details in a clear format:
                1) Scientific Name
                2) Common Name
                3) Brief Description
                4) Habitat
                5) Suitable soils
                6) Sunlight requirements
                7) Pesticides requirements
                8) Uses
                9) Market in India
                10) Facts`,
            },
            ...imageParts,
          ],
        },
      ],
    });

    console.log("Identifying plant: Step 6 - Content generation complete");

    // Extract the response text
    const response = result.response;
    const text = response.text();
    console.log("Identifying plant: Step 7 - Response received", text);

    // Parse the response
    const parseResponse = (text: string) => {
      const extractField = (field: string) => {
        const regex = new RegExp(`${field}:\\s*(.*?)(?:\\n|$)`, "i");
        const match = text.match(regex);
        return match ? match[1].trim() : "N/A";
      };

      return {
        scientificName: extractField("Scientific Name"),
        commonName: extractField("Common Name"),
        description: extractField("Brief Description"),
        habitat: extractField("Habitat"),
        SuitableSoils: extractField("Suitable Soils"),
        SunlightRequirements: extractField("Sunlight Requirements"),
        PesticidesRequirements: extractField("Pesticides Requirements"),
        Uses: extractField("Uses"),
        MarketInIndia: extractField("Market In India"),
        Facts: extractField("Facts"),
      };
    };

    const plantInfo = parseResponse(text);
    console.log("Identifying plant: Step 8 - Parsed response", plantInfo);

    return NextResponse.json(plantInfo);
  } catch (error) {
    console.error("Plant identification error:", error);
    return NextResponse.json(
      {
        error: "Plant identification failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// Ensure the API can handle larger payloads for images
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};
