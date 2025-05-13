import React, { useState } from 'react';

const SparqlQueryTool = () => {
  const [query, setQuery] = useState(`
    SELECT ?s ?p ?o WHERE {
      ?s ?p ?o
    } LIMIT 10
  `);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runQuery = async () => {
    setLoading(true);
    setError(null);
    setResults([]);

    const encodedQuery = encodeURIComponent(query);
    const endpoint = `https://kg-project.fly.dev/repositories/kg-01?query=${encodedQuery}`;

    try {
      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          Accept: "application/sparql-results+json"
        }
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
    <div style={{
      maxWidth: '1000px',
      margin: '2rem auto',
      fontFamily: 'Arial, sans-serif',
      padding: '1rem'
    }}>
      <h1 style={{ textAlign: 'center' }}>SPARQL Query Interface</h1>

      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        rows="8"
        style={{
          width: '100%',
          fontSize: '1rem',
          fontFamily: 'monospace',
          padding: '1rem',
          boxSizing: 'border-box',
          borderRadius: '6px',
          border: '1px solid #ccc',
          marginBottom: '1rem'
        }}
      />

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
        <button
          onClick={runQuery}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            borderRadius: '5px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Run Query
        </button>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {results.length > 0 && (
        <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.95rem'
          }}>
            <thead>
              <tr>
                {Object.keys(results[0]).map((col) => (
                  <th key={col} style={{
                    border: '1px solid #ccc',
                    padding: '8px',
                    backgroundColor: '#f0f0f0',
                    textAlign: 'left'
                  }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((row, i) => (
                <tr key={i}>
                  {Object.values(row).map((cell, j) => (
                    <td key={j} style={{
                      border: '1px solid #ccc',
                      padding: '8px',
                      wordBreak: 'break-word'
                    }}>{cell.value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SparqlQueryTool;