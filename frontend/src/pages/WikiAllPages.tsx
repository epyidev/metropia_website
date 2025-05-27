import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Block from "../components/Block";
import PageWrapper from "../components/PageWrapper";
import BlockTitle from "../components/BlockTitle";
import { getWikiPages } from "../api/wiki";
import "./pagestyles/WikiAllPages.css";

const WikiAllPages: React.FC = () => {
  const navigate = useNavigate();
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Metropia - Toutes les pages du wiki";
    fetchPages();
  }, []);

  const fetchPages = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getWikiPages();
      setPages(res.data.pages || []);
    } catch {
      setError("Erreur lors du chargement des pages.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="wikiallpages">
        <Block image="/images/map_background.png">
          <br />
          <br />
          <br />
          <br />
          <BlockTitle title="Toutes les pages du wiki" subtitle="Liste de toutes les pages existantes" />
          <br />
          <br />
          {loading ? (
            <div>Chargement...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : (
            <div className="list">
              {pages.length === 0 ? (
                <div>Aucune page trouvée.</div>
              ) : (
                pages.map((p) => (
                  <div
                    className="item"
                    key={p.id}
                    onClick={() => navigate(`/wiki/${p.id}`)}
                  >
                    {p.title}
                  </div>
                ))
              )}
            </div>
          )}
        </Block>
      </div>
    </PageWrapper>
  );
};

export default WikiAllPages;
