import React, { useState } from "react";
import { searchWikiPages } from "../api/wiki";

interface WikiWrapperProps {
  children: React.ReactNode;
}

const WikiWrapper: React.FC<WikiWrapperProps> = ({ children }) => {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async () => {
    if (!search.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    try {
      const res = await searchWikiPages(search.trim());
      setSearchResults(res.data.pages);
      setShowResults(true);
    } catch {
      setSearchResults([]);
      setShowResults(true);
    }
  };

  return (
    <div className="wiki-wrapper">
      <div className="wiki-header">
        <div className="wiki-searchbar">
          <input
            type="text"
            placeholder="Rechercher une page (titre, id, contenu)"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
          <span className="mbutton small" onClick={handleSearch}>Rechercher</span>
        </div>
        {showResults && (
          <div className="wiki-search-results">
            {searchResults.length === 0 ? (
              <div>Aucun résultat.</div>
            ) : (
              <ul>
                {searchResults.map((p: any) => (
                  <li key={p.id}>
                    <a href={`/wiki/${p.id}`}>{p.title} <span style={{ color: '#aaa', fontSize: 12 }}>({p.id})</span></a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
      <div className="wiki-content">
        {children}
      </div>
    </div>
  );
};

export default WikiWrapper;
