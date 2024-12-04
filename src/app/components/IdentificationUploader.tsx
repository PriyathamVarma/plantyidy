// app/components/IdentificationUploader.js
"use client";

import { useState } from "react";
import { ImagePlus, Loader2, Sparkles } from "lucide-react";
import { IDResult } from "../../../shared/interface/idresult";
import Image from "next/image";

export default function IdentificationUploader() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IDResult | null>(null);
  const [showTelugu, setShowTelugu] = useState(false);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string | null);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const identifyPlant = async () => {
    if (!image) return;

    setLoading(true);
    try {
      const response = await fetch("/api/identify", {
        method: "POST",
        body: JSON.stringify({ image }),
        headers: { "Content-Type": "application/json" },
      });
      const data: IDResult = await response.json();
      console.log("Received identification result:", data); // Debugging log
      setResult(data);
    } catch (error) {
      console.error("Plant identification error:", error);
    }
    setLoading(false);
  };

  const resetHandler = () => {
    setImage(null);
    setResult(null);
    setLoading(false);
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-green-100/50">
      <div className="flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-6 text-green-900 text-center flex items-center space-x-3">
          <Sparkles className="text-green-600" />
          <span>Plant Identification</span>
          <Sparkles className="text-green-600" />
        </h2>

        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          id="plant-upload"
        />
        <label
          htmlFor="plant-upload"
          className="cursor-pointer w-full max-w-md"
        >
          <div className="border-2 border-dashed border-green-300 p-8 rounded-2xl hover:bg-green-50/50 transition text-center group">
            {image ? (
              <Image
                src={image}
                alt="Uploaded plant"
                width={512}
                height={256}
                className="object-cover rounded-xl mb-4 shadow-md group-hover:scale-105 transition"
              />
            ) : (
              <div className="flex flex-col items-center">
                <ImagePlus className="h-16 w-16 text-green-600 mb-4 group-hover:scale-110 transition" />
                <span className="text-green-700 font-medium">
                  Upload Plant Image
                </span>
                <p className="text-sm text-green-600 mt-2">
                  JPG, PNG, or WEBP (max 10MB)
                </p>
              </div>
            )}
          </div>
        </label>

        {image && (
          <div className="flex space-x-4 mt-6">
            <button
              onClick={identifyPlant}
              disabled={loading}
              className="bg-green-600 text-white px-8 py-3 rounded-xl hover:bg-green-700 transition flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 animate-spin" />
                  Identifying Plant...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  <span>Identify Plant</span>
                  <Sparkles className="h-5 w-5" />
                </>
              )}
            </button>
            <button
              onClick={resetHandler}
              className="bg-gray-300 text-gray-800 px-8 py-3 rounded-xl hover:bg-gray-400 transition"
            >
              Reset
            </button>
          </div>
        )}

        {result && (
          <div className="mt-8 w-full max-w-md bg-green-50 p-6 rounded-2xl shadow-md">
            <h3 className="text-2xl font-bold text-green-900 mb-4">
              Identification Result
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-lg font-semibold text-green-800">
                  Scientific Name:
                </p>
                <p className="text-green-700">
                  {showTelugu
                    ? result.teluguScientificName
                    : result.scientificName || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-lg font-semibold text-green-800">
                  Common Name:
                </p>
                <p className="text-green-700">
                  {showTelugu
                    ? result.teluguCommonName
                    : result.commonName || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-lg font-semibold text-green-800">
                  Description:
                </p>
                <p className="text-green-700">
                  {showTelugu
                    ? result.teluguDescription
                    : result.description || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-lg font-semibold text-green-800">Habitat:</p>
                <p className="text-green-700">
                  {showTelugu ? result.teluguHabitat : result.habitat || "N/A"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowTelugu(!showTelugu)}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition"
            >
              {showTelugu ? "Show in English" : "Show in Telugu"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
