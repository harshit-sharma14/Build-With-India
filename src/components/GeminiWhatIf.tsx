import React, { useState } from "react";
import axios from "axios";

const GeminiWhatIf = () => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResponse("");
    try {
      const res = await axios.post("http://localhost:5000/generate", {
        prompt: 'What If '+input,
      }, {
        headers: { "Content-Type": "application/json" },
      });
      
      // Access the text property from the response
      setResponse(res.data.text || "No response generated.");
    } catch (error) {
      console.error("Error generating response:", error);
      setResponse("Failed to fetch response. Try again.");
    }
    setLoading(false);
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-gray-100 rounded-lg shadow-lg">
      <h2 className="text-xl text-black font-bold mb-2">What If Scenario Generator</h2>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter your 'What if' scenario..."
        className="w-full p-2 border rounded text-black"
      />
      <button
        onClick={handleGenerate}
        className="mt-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Answer"}
      </button>
      {response && (
        <div className="mt-4 p-2 bg-white text-black border rounded shadow">
          <strong>Response:</strong>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default GeminiWhatIf;
