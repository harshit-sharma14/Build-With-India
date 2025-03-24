import { useState } from "react";

const CrimeDataComponent = () => {
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCrimeData = async () => {
    if (!startYear || !endYear) {
      setError("Please enter both start and end years.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const apiKey = "M6zZo23SompJqeJglAAlTUgEEVUbdtFvMIk3veeT"; // Replace with your actual API key
      const url = `https://api.usa.gov/crime/fbi/sapi/api/summarized/state/CA/violent-crime/${startYear}/${endYear}?API_KEY=${apiKey}`;

      const response = await fetch(url, {
        headers: {
          // If the API requires the key in headers, uncomment the following line:
          // "Authorization": `Bearer ${apiKey}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch crime data: ${response.statusText}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching crime data:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 bg-black min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Crime Data Trend Explorer</h1>
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Start year (e.g., 2018)"
          value={startYear}
          onChange={(e) => setStartYear(e.target.value)}
          className="p-2 text-black border rounded-md"
        />
        <input
          type="text"
          placeholder="End year (e.g., 2022)"
          value={endYear}
          onChange={(e) => setEndYear(e.target.value)}
          className="p-2 text-black border rounded-md"
        />
      </div>
      <button
        onClick={fetchCrimeData}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Fetch Data
      </button>

      {loading && <p className="mt-4">Loading...</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}
      {data && (
        <div className="mt-6 bg-white p-4 rounded-md shadow-md w-full max-w-md">
          <h2 className="text-lg font-semibold">Crime Data Trend from {startYear} to {endYear}</h2>
          <ul className="mt-2">
            {data.results?.map((item: any, index: number) => (
              <li key={index} className="border-b py-2">
                <strong>{item.year}</strong>: {item.offense} - {item.actual}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CrimeDataComponent;