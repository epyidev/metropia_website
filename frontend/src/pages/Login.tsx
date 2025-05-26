import React, { useState } from "react";
import { login } from "../api/auth";
import Block from "../components/Block";
import PageWrapper from "../components/PageWrapper";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../components/NotificationProvider";
import BlockTitle from "../components/BlockTitle";
import "./pagestyles/Login.css";

interface LoginProps {}

const Login: React.FC<LoginProps> = ({}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { sendNotification } = useNotification();

const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
        sendNotification("error", "Veuillez saisir un nom d'utilisateur et un mot de passe.", 5000);
        return;
    }
    try {
        const response = await login(username, password);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("username", response.data.username);
        sendNotification("success", "Vous êtes désormais connecté !", 5000);
        navigate("/");
    } catch (err) {
        sendNotification("error", "Il n'éxiste pas d'utilisateur avec ce nom d'utilisateur et ce mot de passe.", 5000);
    }
};

  return (
    <PageWrapper>
      <div className="login">
        <Block image="/images/map_background.png">
          <br />
          <br />
          <br />
          <br />
          <BlockTitle title="Connexion" subtitle="Connectez-vous à votre compte Metropia" />
          <br />
          <br />
          <div className="loginform">
            <div className="item">
                Nom d'utilisateur
                <input placeholder="Nom d'utilisateur" onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className="item">
                Mot de passe
                <input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="mbutton small" onClick={handleLogin}>Se connecter</div>
          </div>
        </Block>
      </div>
    </PageWrapper>
  );
};

export default Login;
