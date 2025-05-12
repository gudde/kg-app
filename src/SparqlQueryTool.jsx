import React, { useState } from "react";

export default function SparqlQueryTool() {
  const [query, setQuery] = useState("SELECT ?s ?p ?o WHERE {?s ?p ?o} LIMIT 10");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleQuery = async () => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch("https://kg-project.fly.dev:7200/repositories/kg-01", {
        method: "POST",
        headers: {
          "Content-Type": "application/sparql-query",
          Accept: "application/sparql-results+json",
        },
        body: query,
      });

      if (!response.ok) throw new Error("Failed to fetch SPARQL results");

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Knowledge Graphs // GraphDB SPARQL Query Tool</h1>
      <textarea
        className="w-full p-2 border rounded h-40 font-mono text-sm"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button
        onClick={handleQuery}
        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Run Query
      </button>

      {loading && <p className="mt-4">Loading...</p>}
      {error && <p className="mt-4 text-red-600">Error: {error}</p>}

      {results && (
        <div className="mt-6 overflow-x-auto">
          <table className="table-auto border-collapse border w-full">
            <thead>
              <tr>
                {results.head.vars.map((v) => (
                  <th key={v} className="border px-4 py-2 text-left">{v}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.results.bindings.map((row, idx) => (
                <tr key={idx}>
                  {results.head.vars.map((v) => (
                    <td key={v} className="border px-4 py-2 text-sm">
                      {row[v] ? row[v].value : ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

