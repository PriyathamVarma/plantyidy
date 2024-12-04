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
        {
          error: "Gemini API key is not configured",
        },
        { status: 500 },
      );
    }

    // Initialize Gemini AI
    // const genAI = new GoogleGenerativeAI(
    //   "AIzaSyAx-VM37ARtgVREP4ioH6iIV1Ef54WyzyE",
    // );

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
          data: image.split(",")[1], // Remove data URL prefix
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
              text: "Identify this plant scientifically. Provide the following in a clear format: 1) Scientific Name 2) Common Name 3) Brief Description 4) Habitat",
            },
            ...imageParts,
          ],
        },
      ],
    });

    console.log("Identifying plant: Step 6 - Content generation complete");

    // Get the response text
    const response = result.response;
    const text = response.text();

    console.log("Identifying plant: Step 7 - Response received", text);

    // Parse the response
    const parseResponse = (text: string) => {
      // Use a more robust parsing method
      const scientificNameMatch = text.match(/Scientific Name:\s*([^;]+)/i);
      const commonNameMatch = text.match(/Common Name:\s*([^;]+)/i);
      const descriptionMatch = text.match(/Description:\s*([^;]+)/i);
      const habitatMatch = text.match(/Habitat:\s*([^;]+)/i);

      return {
        scientificName: scientificNameMatch
          ? scientificNameMatch[1].trim()
          : "Unknown",
        commonName: commonNameMatch
          ? commonNameMatch[1].trim()
          : "Unknown Plant",
        description: descriptionMatch
          ? descriptionMatch[1].trim()
          : "No description available",
        habitat: habitatMatch ? habitatMatch[1].trim() : "Not specified",
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

// Ensure you have the correct export type
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};
