import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Block from "../components/Block";
import PageWrapper from "../components/PageWrapper";
import WikiEditor from "../components/WikiEditor";
import WikiContentWithLists from "../components/WikiContentWithLists";
import "../components/WikiContentWithLists.css";
import { getWikiPage, updateWikiPage, deleteWikiPage, getWikiHistory, restoreWikiHistory, searchWikiPages } from "../api/wiki";
import { getAllTags, assignTag, removeTag, createTag } from "../api/wiki_tags";
import "./pagestyles/WikiPage.css";
import { useNotification } from "../components/NotificationProvider";

const WikiPage: React.FC = () => {
  const navigate = useNavigate();
  const { sendNotification } = useNotification();

  const { id: paramId } = useParams();
  const id = paramId || "home";
  const [page, setPage] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<any[] | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [allTags, setAllTags] = useState<any[]>([]);
  const [pageTags, setPageTags] = useState<any[]>([]);
  const [newTag, setNewTag] = useState("");
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const userRank = Number(localStorage.getItem("rank"));

  useEffect(() => {
    fetchPage();
    fetchTags();
    // eslint-disable-next-line
  }, [id]);

  const fetchPage = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getWikiPage(id!);
      setPage(res.data.page);
      setPageTags(res.data.page.tags || []);
    } catch {
      setError("Page non trouvée");
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      const res = await getAllTags();
      setAllTags(res.data.tags);
    } catch {
      setAllTags([]);
    }
  };

  const handleAddTag = async (tagId: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await assignTag(id!, tagId, token);
      fetchPage();
    } catch {
      sendNotification("error", "Erreur lors de l'ajout du tag", 5000);
    }
  };

  const handleRemoveTag = async (tagId: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      await removeTag(id!, tagId, token);
      fetchPage();
    } catch {
      sendNotification("error", "Erreur lors de la suppression du tag", 5000);
    }
  };

  const handleCreateTag = async () => {
    const token = localStorage.getItem("token");
    if (!token || !newTag.trim()) return;
    try {
      await createTag(newTag.trim(), token);
      setNewTag("");
      fetchTags();
      sendNotification("success", "Tag créé avec succès", 5000);
    } catch {
      sendNotification("error", "Erreur lors de la création du tag", 5000);
    }
  };

  const handleSave = async (content: string) => {
    setError(null);
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Vous devez être connecté pour éditer");
      return;
    }
    try {
      await updateWikiPage(id!, page.title, content, token);
      setEditMode(false);
      fetchPage();
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Erreur lors de la sauvegarde");
      }
    }
  };

  const handleDelete = async () => {
    setError(null);
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Vous devez être connecté pour supprimer cette page");
      return;
    }
    if (!window.confirm("Supprimer cette page ?")) return;
    try {
      await deleteWikiPage(id!, token);
      navigate("/wiki");
    } catch {
      setError("Erreur lors de la suppression");
    }
  };

  const handleShowHistory = async () => {
    setShowHistory(true);
    setHistoryError(null);
    try {
      const res = await getWikiHistory(id!);
      setHistory(res.data.history);
    } catch {
      setHistoryError("Erreur lors du chargement de l'historique");
      setHistory(null);
    }
  };

  const handleCloseHistory = () => {
    setShowHistory(false);
    setHistory(null);
    setHistoryError(null);
  };

  const handleRestore = async (historyId: string) => {
    setError(null);
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Vous devez être connecté pour restaurer");
      return;
    }
    if (!window.confirm("Restaurer cette version ?")) return;
    try {
      await restoreWikiHistory(id!, historyId, token);
      fetchPage();
      handleShowHistory();
    } catch {
      setError("Erreur lors de la restauration");
    }
  };

  const handleSearch = async () => {
    if (!search.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await searchWikiPages(search.trim());
      setSearchResults(res.data.pages);
    } catch {
      setSearchResults([]);
    }
  };

  return (
    <PageWrapper>
      <div className="wikipage">
        <Block image="/images/map_background.png" paddingbottom="0vh">
          <br />
          <br />
          <br />
          <br />
          <div className="header">
            <div className="title">{page?.title || "Page Wiki"}</div>
            <div className="searchbar">
              <div>
                <input type="text" placeholder="Rechercher une page (titre, id, contenu)" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} />
                <span className="mbutton small" onClick={handleSearch}>
                  Rechercher
                </span>
              </div>
              <div className="results">
                {searchResults &&
                  searchResults.length > 0 &&
                  searchResults.map((p: any) => (
                    <div className="result" key={p.id} onClick={() => navigate(`/wiki/${p.id}`)}>
                      {p.title}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </Block>
        <Block paddingbottom="4vh">
          {loading ? (
            <div>Chargement...</div>
          ) : error ? (
            <div>{error}</div>
          ) : (
            <div>
              {editMode ? (
                <>
                  <WikiEditor pageId={id} initialContent={page.content} onSave={handleSave} />
                  <div className={editMode ? "tagsedit" : "tagsview"}>
                    <b>Tags :</b>
                    {pageTags.length === 0 && <span> Aucun</span>}
                    {pageTags.map((tag: any) => (
                      <span key={tag.id}>
                        {tag.name}
                        {localStorage.getItem("token") && (
                          <span className="tagremove" onClick={() => handleRemoveTag(tag.id)}>
                            ×
                          </span>
                        )}
                      </span>
                    ))}
                    {editMode && (
                      <>
                        <select onChange={(e) => handleAddTag(Number(e.target.value))} value="">
                          <option value="">+ Ajouter un tag</option>
                          {allTags
                            .filter((t) => !pageTags.some((pt: any) => pt.id === t.id))
                            .map((t) => (
                              <option key={t.id} value={t.id}>
                                {t.name}
                              </option>
                            ))}
                        </select>
                        <input type="text" placeholder="Nouveau tag" value={newTag} onChange={(e) => setNewTag(e.target.value)} />
                        <div className="mbutton small" onClick={handleCreateTag}>
                          Créer
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <div>
                  <WikiContentWithLists content={page.content || ""} />
                  <hr />
                  <br />
                  {!editMode && page && (
                    <>
                      <div className="tagsview">
                        <b>Tags :</b>
                        {pageTags.length === 0 && <span> Aucun</span>}
                        {pageTags.map((tag: any) => (
                          <span key={tag.id}>{tag.name}</span>
                        ))}
                      </div>
                    </>
                  )}
                  {localStorage.getItem("token") && page && (
                    <>
                      {userRank >= 1 && (
                        <>
                          <div className="actionstitle">Actions sur la page</div>
                          <div className="actions">
                            <div className="mbutton small" onClick={() => setEditMode(true)}>
                              Éditer la page
                            </div>
                            <div className="mbutton small" onClick={handleDelete}>
                              Supprimer la page
                            </div>
                            <div className="mbutton small" onClick={showHistory ? handleCloseHistory : handleShowHistory}>
                              {showHistory ? "Fermer l'historique de la page" : "Voir l'historique de la page"}
                            </div>
                          </div>
                        </>
                      )}
                      <div className="actionstitle">Actions sur le wiki</div>
                      <div className="actions">
                        {userRank >= 1 && (
                          <div className="mbutton small" onClick={() => navigate("/wiki-create")}>
                            Créer une nouvelle page
                          </div>
                        )}
                        <div className="mbutton small" onClick={() => navigate("/wiki-all-pages")}>
                          Voir toutes les pages
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
          {showHistory && (
            <div className="wiki-history-modal">
              <h3>Historique de la page</h3>
              {historyError && <div className="wiki-tag-error">{historyError}</div>}
              {history ? (
                history.map((h) => (
                  <div key={h.id}>
                    <b>{h.edited_at}</b> par <b>{h.editor_username || h.editor_id}</b>
                    <pre>{h.content}</pre>
                    {localStorage.getItem("token") && (
                      <div className="mbutton small" onClick={() => handleRestore(h.id)}>
                        Restaurer cette version
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div>Chargement...</div>
              )}
            </div>
          )}
        </Block>
      </div>
    </PageWrapper>
  );
};

export default WikiPage;
