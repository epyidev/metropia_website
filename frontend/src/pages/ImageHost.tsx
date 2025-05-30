import React, { useEffect, useState } from "react";
import Block from "../components/Block";
import PageWrapper from "../components/PageWrapper";
import BlockTitle from "../components/BlockTitle";
import "./pagestyles/ImageHost.css";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../components/NotificationProvider";

interface ImageHostProps {}

const ImageHost: React.FC<ImageHostProps> = ({}) => {
  const navigate = useNavigate();
  const { sendNotification } = useNotification();

  useEffect(() => {
    document.title = "Metropia - Hébergeur d'images";
    if (!localStorage.getItem("token")) {
      navigate("/");
    } else {
      fetchMyFiles();
    }
  }, []);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [myFiles, setMyFiles] = useState<
    {
      filename: string;
      url: string;
      original_label?: string;
      uploaded_at?: string;
    }[]
  >([]);
  const [error, setError] = useState<string | null>(null);

  const fetchMyFiles = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/"}/api/imagehost/my`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = await res.json();
      setMyFiles(data.files || []);
    } catch (e) {
      setError("Erreur lors du chargement de vos images.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!["image/png", "image/jpeg"].includes(file.type)) {
        setError("Seuls les fichiers PNG et JPG sont autorisés.");
        return;
      }
      if (file.size > 1000 * 1024 * 1024) {
        setError("Le fichier ne doit pas dépasser 1000 Mo.");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:3000/"}/api/imagehost/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData,
      } as any);
      const data = await res.json();
      if (res.ok && data.url) {
        fetchMyFiles();
      } else {
        // console.error("Upload error:", data);
        setError(data.message || "Erreur lors de l'upload.");
      }
    } catch (e) {
      // console.error("Upload failed:", e);
      setError("Erreur lors de l'upload.");
    } finally {
      setUploading(false);
      setSelectedFile(null);
    }
  };

  return (
    <PageWrapper>
      <div className="imagehost">
        <Block image="/images/map_background.png">
          <br />
          <br />
          <br />
          <br />
          <BlockTitle title="Hébergeur d'images" subtitle="Uploadez vos images, et utilisez le lien direct directement en jeu !" />
          <br />
          <br />
          <div>
            <label htmlFor="image-upload" className="custom-file-label">
              <input id="image-upload" type="file" accept=".png,.jpg,.jpeg" onChange={handleFileChange} disabled={uploading} style={{ display: "none" }} />
              <div className="mbutton small selectimage" style={{ cursor: uploading ? "not-allowed" : "pointer", pointerEvents: uploading ? "none" : "auto" }}>
                Sélectionner une image {selectedFile && ("(" + selectedFile.name + ")")}
              </div>
            </label>
            <br />
            <div className="mbutton small sendimage" onClick={handleUpload}>
              {uploading ? "Envoi..." : "Envoyer l'image"}
            </div>
            {error && <div style={{ color: "red", marginTop: 10 }}>{error}</div>}
            <br />
            <br />
            <br />
            <BlockTitle title="Mes images" subtitle="Toutes les images que vous avez uploadées" />
            <br />
            <br />
            <div className="files">
              {myFiles.length === 0 && <span>Vous n'avez pas encore uploadé d'images</span>}
              {myFiles.map((file) => {
                const backendUrl = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/$/, "");
                const imageUrl = file.url.startsWith("http") ? file.url : `${backendUrl}${file.url}`;
                return (
                  <div className="item" key={file.filename}>
                    <div className="infos">
                      <img src={imageUrl} alt={file.filename} />
                      <div>{file.original_label || file.filename}</div>
                    </div>
                    <div>
                      <div
                        className="mbutton small"
                        onClick={() => {
                          navigator.clipboard.writeText(imageUrl);
                          sendNotification("success", "Lien copié dans le presse-papiers !", 3000);
                        }}
                      >
                        Copier le lien
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Block>
      </div>
    </PageWrapper>
  );
};

export default ImageHost;
