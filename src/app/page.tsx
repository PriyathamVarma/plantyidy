// app/page.js

import IdentificationUploader from "./components/IdentificationUploader";

export default function Home() {
  return (
    <div className="flex flex-col">
      <div className="space-y-8">
        <IdentificationUploader />
      </div>
    </div>
  );
}
