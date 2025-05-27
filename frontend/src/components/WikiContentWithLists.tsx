import React, { useEffect, useState } from "react";
import { marked } from "marked";
import { Link, useNavigate } from "react-router-dom";
import { getPagesByTag } from "../api/wiki_tags";

interface WikiContentWithListsProps {
  content: string;
}

// Utilitaire pour découper le contenu en morceaux (texte/markdown ou balise LIST)
function parseContentWithLists(content: string) {
  const regex = /\[LIST:([\wÀ-ÿ' -]+)\]/gi;
  let lastIndex = 0;
  const parts: Array<{ type: "markdown" | "list"; value: string }> = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "markdown", value: content.slice(lastIndex, match.index) });
    }
    parts.push({ type: "list", value: match[1].trim() });
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < content.length) {
    parts.push({ type: "markdown", value: content.slice(lastIndex) });
  }
  return parts;
}

const WikiContentWithLists: React.FC<WikiContentWithListsProps> = ({ content }) => {
  const parts = parseContentWithLists(content);
  return (
    <div className="wiki-content-with-lists">
      {parts.map((part, idx) => {
        if (part.type === "markdown") {
          return <div key={idx} dangerouslySetInnerHTML={{ __html: marked.parse(part.value) }} />;
        } else {
          return <TagList key={idx} tag={part.value} />;
        }
      })}
    </div>
  );
};

const TagList: React.FC<{ tag: string }> = ({ tag }) => {
    const navigate = useNavigate();
  const [pages, setPages] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setPages(null);
    getPagesByTag(tag)
      .then((res) => {
        if (!cancelled) setPages(res.data.pages);
      })
      .catch(() => {
        if (!cancelled) setError("Erreur lors du chargement de la liste.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [tag]);

  if (loading)
    return (
      <div className="wikilist">
        <div className="title void">Chargement de la liste « {tag} »</div>
      </div>
    );
  if (error) return <div className="wikilist">{error}</div>;
  if (!pages || pages.length === 0)
    return (
      <div className="wikilist">
        <div className="title void">Aucune page trouvée pour « {tag} »</div>
      </div>
    );
  return (
    <div className="wikilist">
      <div className="title">Pages dans la catégorie « {tag} » :</div>
      {pages.map((page) => (
          <div className="item" key={page.id} onClick={() => navigate(`/wiki/${page.id}`)}>
            {page.title}
          </div>
        ))}
    </div>
  );
};

export default WikiContentWithLists;
