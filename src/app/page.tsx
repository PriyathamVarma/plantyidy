// app/page.js
import PlantGuide from "./components/PlantGuide";
import IdentificationUploader from "./components/IdentificationUploader";

export default function Home() {
  return (
    <div className="grid lg:grid-cols-2 gap-12">
      <div className="space-y-8">
        <PlantGuide />
      </div>
      <div className="space-y-8">
        <IdentificationUploader />
      </div>
    </div>
  );
}
