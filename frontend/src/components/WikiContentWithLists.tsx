import React, { useEffect, useState, useRef } from "react";
import { marked } from "marked";
import { useNavigate } from "react-router-dom";
import { getPagesByTag } from "../api/wiki_tags";

interface WikiContentWithListsProps {
  content: string;
}

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

const MarkdownWithNavigate: React.FC<{ markdown: string }> = ({ markdown }) => {
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "A") {
        const href = (target as HTMLAnchorElement).getAttribute("href");
        if (href && href.startsWith("/wiki/")) {
          e.preventDefault();
          navigate(href);
        } else if (href && !href.startsWith("/")) {
          // Lien externe : ouvrir dans un nouvel onglet
          (target as HTMLAnchorElement).setAttribute("target", "_blank");
          (target as HTMLAnchorElement).setAttribute("rel", "noopener noreferrer");
        }
      }
    };
    container.addEventListener("click", handleClick);
    // Ajout direct de target _blank sur tous les liens externes au rendu initial
    container.querySelectorAll("a[href]").forEach((a) => {
      const href = a.getAttribute("href");
      if (href && !href.startsWith("/")) {
        a.setAttribute("target", "_blank");
        a.setAttribute("rel", "noopener noreferrer");
      }
    });
    return () => {
      container.removeEventListener("click", handleClick);
    };
  }, [markdown, navigate]);
  return <div ref={ref} dangerouslySetInnerHTML={{ __html: marked.parse(markdown) }} />;
};

const WikiContentWithLists: React.FC<WikiContentWithListsProps> = ({ content }) => {
  const parts = parseContentWithLists(content);
  return (
    <div className="wiki-content-with-lists">
      {parts.map((part, idx) =>
        part.type === "markdown" ? (
          <MarkdownWithNavigate key={idx} markdown={part.value} />
        ) : (
          <TagList key={idx} tag={part.value} />
        )
      )}
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
