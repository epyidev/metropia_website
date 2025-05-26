import React, { useState } from "react";
import { register } from "../api/auth";
import Block from "../components/Block";
import PageWrapper from "../components/PageWrapper";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../components/NotificationProvider";

interface RegisterProps {}

const Register: React.FC<RegisterProps> = ({}) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { sendNotification } = useNotification();

  const handleRegister = async () => {
    try {
      const response = await register(username, email, password);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", response.data.username);
      sendNotification("success", "Inscription réussie ! Vous êtes désormais connecté.", 5000);
      navigate("/");
    } catch (err) {
      sendNotification("error", "Erreur lors de l'inscription. Veuillez vérifier vos informations.", 5000);
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
          <h2>Inscription</h2>
          <input placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
          <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
          <input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
          <button onClick={handleRegister}>S'inscrire</button>
        </Block>
      </div>
    </PageWrapper>
  );
};

export default Register;
