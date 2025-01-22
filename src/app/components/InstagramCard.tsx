// app/components/InstagramCard.js
export default function InstagramCard() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-between">
      <div>
        <h2 className="text-xl font-bold text-green-800">
          Follow me on Instagram
        </h2>
        <p className="text-green-700">
          Stay updated with the latest farming tips and plant insights.
        </p>
      </div>
      <a
        href="https://www.instagram.com/varma_the_farmer"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition"
      >
        Follow @varma_the_farmer
      </a>
    </div>
  );
}
