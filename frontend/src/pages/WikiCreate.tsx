import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../components/NotificationProvider";
import Block from "../components/Block";
import PageWrapper from "../components/PageWrapper";
import BlockTitle from "../components/BlockTitle";
import { createWikiPage } from "../api/wiki";
import "./pagestyles/WikiCreate.css";

const WikiCreate: React.FC = () => {
  const navigate = useNavigate();
  const { sendNotification } = useNotification();
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const userRank = Number(localStorage.getItem("rank"));

  useEffect(() => {
    document.title = "Metropia - Créer une page wiki";
    if (!localStorage.getItem("token")) {
      navigate("/");
    }
  }, []);

  const handleCreate = async () => {
    if (!title.trim()) {
      sendNotification("error", "Veuillez donner un titre à la page.", 5000);
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("token") || "";
      const response = await createWikiPage(title, "Bienvenue sur votre page nouvellement créée !", token);
      const id = response.data.id;
      sendNotification("success", "Page wiki créée avec succès !", 5000);
      navigate("/wiki/" + id);
    } catch (err) {
      sendNotification("error", "Erreur lors de la création de la page.", 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="wikicreate">
        <Block image="/images/map_background.png">
          <br />
          <br />
          <br />
          <br />
          <BlockTitle title="Créer une page wiki" subtitle="Remplissez le formulaire pour ajouter une nouvelle page au wiki" />
          <br />
          <div className="wikicreateform">
            <div className="item">
              Titre de la page
              <input
                placeholder="Titre de la page"
                value={title}
                onChange={e => setTitle(e.target.value)}
                disabled={loading}
              />
            </div>
            {userRank >= 1 && (
              <div className={`mbutton small${loading ? " disabled" : ""}`} onClick={loading ? undefined : handleCreate}>
                Créer la page
              </div>
            )}
            {userRank < 1 && (
              <div style={{color: 'var(--color-error)', marginTop: '2vh'}}>Vous n'avez pas la permission de créer une page.</div>
            )}
          </div>
        </Block>
      </div>
    </PageWrapper>
  );
};

export default WikiCreate;
