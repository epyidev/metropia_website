import React, { useState } from "react";
import { login } from "../api/auth";
import Block from "../components/Block";
import PageWrapper from "../components/PageWrapper";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../components/NotificationProvider";

interface LoginProps {
}

const Login: React.FC<LoginProps> = ({}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { sendNotification } = useNotification();

  const handleLogin = async () => {
    try {
      const response = await login(email, password);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", response.data.username);
      sendNotification("success", "Vous êtes désormais connecté !", 5000);
      navigate("/")
    } catch (err) {
        sendNotification("error", "Erreur lors de la connexion. Veuillez vérifier vos identifiants.", 5000);
    }
  };

  return (
    <PageWrapper>
      <div>
        <Block image="/images/map_background.png">
          <br />
          <br />
          <br />
          <br />
          <h2>Connexion</h2>
          <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
          <input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
          <button onClick={handleLogin}>Se connecter</button>
        </Block>
      </div>
    </PageWrapper>
  );
};

export default Login;
