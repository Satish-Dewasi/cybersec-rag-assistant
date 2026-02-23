import { useState } from "react";
import axios from "axios";

function App() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setResponse(null);

    try {
      const res = await axios.post("http://127.0.0.1:8000/ask", {
        query,
      });

      setResponse(res.data);
    } catch (error) {
      console.error(error);
      alert("Error connecting to backend");
    }

    setLoading(false);
  };

  const getConfidenceColor = (level) => {
    if (level === "high") return "bg-green-600";
    if (level === "medium") return "bg-yellow-500";
    return "bg-red-600";
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-10">
      <div className="max-w-4xl mx-auto">

        <h1 className="text-4xl font-bold mb-8 text-center">
          Cyber Threat Intelligence Assistant
        </h1>

        {/* Input Section */}
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Ask your cybersecurity question..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none"
          />
          <button
            onClick={handleAsk}
            className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Ask
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center text-gray-400 mb-6">
            Analyzing threat intelligence...
          </div>
        )}

        {/* Response */}
        {response && (
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">

            {/* Confidence */}
            <div className="flex items-center gap-4 mb-4">
              <div
                className={`px-4 py-1 rounded-full text-sm font-semibold ${getConfidenceColor(
                  response.confidence_level
                )}`}
              >
                {response.confidence_level.toUpperCase()} (
                {response.confidence_score}%)
              </div>

              <div className="flex flex-wrap gap-2">
                {response.citations.map((cite, index) => (
                  <span
                    key={index}
                    className="bg-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {cite}
                  </span>
                ))}
              </div>
            </div>

            {/* Answer */}
            <div className="whitespace-pre-wrap text-gray-200 leading-relaxed">
              {response.answer}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;