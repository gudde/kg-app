import React, { useState } from 'react';

const SparqlQueryTool = () => {
  const [query, setQuery] = useState(`
    SELECT ?s ?p ?o WHERE {
      ?s ?p ?o
    } LIMIT 10
  `);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runQuery = async () => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch("https://kg-project.fly.dev/repositories/kg-01", {
        method: "GET",
        headers: {
          "Content-Type": "application/sparql-query",
          "Accept": "application/sparql-results+json"
        },
        body: query
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setResults(data.results.bindings);
    } catch (err) {
      console.error("SPARQL query error:", err);
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h2>SPARQL Query Tool</h2>

      <textarea
        rows="8"
        cols="80"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ width: '100%', fontFamily: 'monospace', fontSize: '1rem' }}
      />

      <button onClick={runQuery} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
        Run Query
      </button>

      {loading && <p>Running query...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {results && (
        <table border="1" cellPadding="6" style={{ marginTop: '1rem', width: '100%' }}>
          <thead>
            <tr>
              {Object.keys(results[0] || {}).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.map((row, i) => (
              <tr key={i}>
                {Object.values(row).map((val, j) => (
                  <td key={j}>{val.value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SparqlQueryTool;
