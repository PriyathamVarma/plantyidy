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

    // Generate content with English and Telugu response
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Identify this plant scientifically. Provide the following in a clear format:
                1) Scientific Name
                2) Common Name
                3) Brief Description
                4) Habitat
                
                Also, translate the above information into Telugu and provide in a clear format:
                5) Telugu Scientific Name
                6) Telugu Common Name
                7) Telugu Description
                8) Telugu Habitat`,
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
      console.log("Raw response text:", text); // Log the raw response

      // Function to extract a specific section
      const extractSection = (startMarker: string, endMarkers: string[]) => {
        const startIndex = text.indexOf(startMarker);
        if (startIndex === -1) return "N/A";

        let endIndex = text.length;
        for (const marker of endMarkers) {
          const potentialEndIndex = text.indexOf(
            marker,
            startIndex + startMarker.length,
          );
          if (potentialEndIndex !== -1) {
            endIndex = Math.min(endIndex, potentialEndIndex);
          }
        }

        return text
          .slice(startIndex + startMarker.length, endIndex)
          .replace(/\*\*/g, "")
          .replace(/\*/g, "")
          .trim();
      };

      // Extract English sections
      const englishSections = {
        scientificName: extractSection("Scientific Name:", [
          "2) Common Name:",
          "Telugu Translation:",
          "5) Telugu Scientific Name:",
        ]),
        commonName: extractSection("Common Name:", [
          "3) Brief Description:",
          "Telugu Translation:",
          "6) Telugu Common Name:",
        ]),
        description: extractSection("Brief Description:", [
          "4) Habitat:",
          "Telugu Translation:",
          "7) Telugu Description:",
        ]),
        habitat: extractSection("Habitat:", [
          "Telugu Translation:",
          "8) Telugu Habitat:",
        ]),
      };

      // Extract Telugu sections with new specific markers
      const teluguSections = {
        teluguScientificName: extractSection("5) Telugu Scientific Name:", [
          "6) Telugu Common Name:",
        ]),
        teluguCommonName: extractSection("6) Telugu Common Name:", [
          "7) Telugu Description:",
        ]),
        teluguDescription: extractSection("7) Telugu Description:", [
          "8) Telugu Habitat:",
        ]),
        teluguHabitat: extractSection("8) Telugu Habitat:", []),
      };

      return {
        ...englishSections,
        ...teluguSections,
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
