import React, { useEffect, useState } from "react";
import { register } from "../api/auth";
import Block from "../components/Block";
import PageWrapper from "../components/PageWrapper";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../components/NotificationProvider";
import "./pagestyles/Register.css";
import BlockTitle from "../components/BlockTitle";

interface RegisterProps {}

const Register: React.FC<RegisterProps> = ({}) => {
  useEffect(() => {
    document.title = "Metropia - Créer un compte";
  }, []);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const navigate = useNavigate();
  const { sendNotification } = useNotification();

  const handleRegister = async () => {
    // Vérification des champs vides
    if (!username || !email || !password) {
      sendNotification("error", "Veuillez remplir tous les champs.", 5000);
      return;
    }

    // Vérification du format de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      sendNotification("error", "Veuillez entrer une adresse e-mail valide.", 5000);
      return;
    }

    // Vérification de la longueur du mot de passe
    if (password.length < 6) {
      sendNotification("error", "Le mot de passe doit contenir au moins 6 caractères.", 5000);
      return;
    }

    // Vérification que les mots de passe correspondent
    if (password !== repeatPassword) {
      sendNotification("error", "Les mots de passe ne correspondent pas.", 5000);
      return;
    }

    try {
      const response = await register(username, email, password);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", response.data.username);
      sendNotification("success", "Inscription réussie ! Vous êtes désormais connecté.", 5000);
      navigate("/");
    } catch (err) {
      sendNotification("error", "Un utilisateur avec ce nom d'utilisateur ou cette adresse e-mail existe déjà.", 5000);
    }
  };

  return (
    <PageWrapper>
      <div className="register">
        <Block image="/images/map_background.png">
          <br />
          <br />
          <br />
          <br />
          <BlockTitle title="Inscription" subtitle="Créez votre compte Metropia" />
          <br />
          <br />
          <div className="registerform">
            <div className="item">
              Nom d'utilisateur
              <input placeholder="Nom d'utilisateur" onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="item">
              Adresse e-mail
              <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="item">
              Mot de passe
              <input placeholder="Mot de passe" type="password" onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="item">
              Répétez votre mot de passe
              <input placeholder="Mot de passe" type="password" onChange={(e) => setRepeatPassword(e.target.value)} />
            </div>
            <div className="mbutton small" onClick={handleRegister}>
              S'inscrire
            </div>
          </div>
        </Block>
      </div>
    </PageWrapper>
  );
};

export default Register;
