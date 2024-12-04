// app/components/PlantGuide.js
import { Sprout, Sun, Droplet } from "lucide-react";

export default function PlantGuide() {
  const guideItems = [
    {
      icon: Droplet,
      title: "Watering",
      description:
        "Each plant has unique watering needs. Check soil moisture and adjust frequency based on plant type and environment.",
      color: "text-blue-600",
    },
    {
      icon: Sun,
      title: "Sunlight",
      description:
        "Understanding your plant's light requirements is crucial. Some thrive in bright direct light, while others prefer indirect illumination.",
      color: "text-yellow-600",
    },
    {
      icon: Sprout,
      title: "Nutrition",
      description:
        "Regular fertilization supports healthy growth. Use balanced, plant-specific nutrients during active growing seasons.",
      color: "text-green-600",
    },
  ];

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-green-100/50">
      <h2 className="text-3xl font-bold mb-6 text-green-900 text-center">
        Plant Care Essentials
      </h2>
      <div className="space-y-6">
        {guideItems.map((item, index) => (
          <div
            key={index}
            className="flex items-start space-x-4 bg-green-50/50 p-4 rounded-xl hover:bg-green-100/50 transition"
          >
            <item.icon className={`h-10 w-10 ${item.color} flex-shrink-0`} />
            <div>
              <h3 className="text-xl font-semibold text-green-900 mb-2">
                {item.title}
              </h3>
              <p className="text-green-800 text-opacity-80">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
