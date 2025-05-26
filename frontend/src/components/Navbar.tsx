import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useNotification } from "./NotificationProvider";

const SERVER_STATUS_URL = import.meta.env.VITE_CONNECTED_PLAYERS_API_URL;

const Navbar: React.FC = () => {
  const [playerCount, setPlayerCount] = useState<number | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpened, setIsMobileMenuOpened] = useState(false);
  const navigate = useNavigate();
  const { sendNotification } = useNotification();

  useEffect(() => {
    let isMounted = true;
    const fetchPlayers = async () => {
      try {
        if (!SERVER_STATUS_URL) {
          if (isMounted) setPlayerCount(null);
          return;
        }
        const res = await fetch(SERVER_STATUS_URL);
        const json = await res.json();
        if (isMounted) {
          if (json.status !== "error") {
            setPlayerCount(json.players.now);
          } else {
            setPlayerCount(null);
          }
        }
      } catch {
        if (isMounted) setPlayerCount(null);
      }
    };
    fetchPlayers();
    const interval = setInterval(fetchPlayers, 5000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!isDropdownOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.querySelector(".profile");
      if (dropdown && !dropdown.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <>
      <div className={`mnavbar ${isMobileMenuOpened ? " opened" : ""}`}>
        <div className="up">
          <div
            className="button"
            onClick={() => {
              navigate("/");
              setIsMobileMenuOpened(false);
            }}
          >
            Accueil
          </div>
          <div className="button">Wiki</div>
          <div className="button">Nous soutenir</div>
        </div>
        <div className="down">
          {localStorage.getItem("username") ? (
            <>
              <div className="button" onClick={() => {
								navigate("/");
								setIsMobileMenuOpened(false);
							}}>
                Mon profil
              </div>
							<div className="button" onClick={() => {
								navigate("/imagehost");
								setIsMobileMenuOpened(false);
							}}>
								Hébergeur d'images
							</div>
              <div
                className="button"
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("username");
                  sendNotification("success", "Vous êtes déconnecté !", 5000);
                  navigate("/");
                }}
              >
                Déconnexion
              </div>
            </>
          ) : (
            <>
              <div className="button" onClick={() => {
								navigate("/login");
								setIsMobileMenuOpened(false);
							}}>
                Connexion
              </div>
              <div className="button" onClick={() => {
								navigate("/register");
								setIsMobileMenuOpened(false);
							}}>
                Inscription
              </div>
            </>
          )}
          <div className="predownload">
            <div className="button download">
              Commencer à jouer
              <small>{playerCount === null ? "Chargement..." : playerCount > 0 ? `${playerCount} joueur${playerCount > 1 ? "s" : ""} connecté${playerCount > 1 ? "s" : ""}` : null}</small>
            </div>
          </div>
        </div>
      </div>
      <div className="navbar">
        <div className="readzone">
          <div className="left">
            <img className="logo" src="/images/logo_white.png" alt="Logo" onClick={() => {
							navigate("/");
							setIsMobileMenuOpened(false);
						}}/>
            <div className="button desktop" onClick={() => navigate("/")}>
              Accueil
            </div>
            <div className="button desktop">Wiki</div>
            <div className="button desktop">Nous soutenir</div>
          </div>
          <div className="right">
            <FontAwesomeIcon
              className="mobile burger"
              icon={isMobileMenuOpened ? faXmark : faBars}
              onClick={() => {
                setIsMobileMenuOpened(!isMobileMenuOpened);
              }}
            />
            <div className="desktop">
              <div className="profile">
                <div className="main-button" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                  {localStorage.getItem("username") || "Invité"}
                  <div className={`arrow${isDropdownOpen ? " rotated" : ""}`}>▼</div>
                </div>
                <div className="dropdown" style={{ display: isDropdownOpen ? "block" : "none" }}>
                  {localStorage.getItem("username") ? (
                    <>
                      <div className="item">Mon profil</div>
											<div className="item" onClick={() => {
												navigate("/imagehost");
											}}>Hébergeur d'images</div>
                      <div
                        className="item"
                        onClick={() => {
                          localStorage.removeItem("token");
                          localStorage.removeItem("username");
                          sendNotification("success", "Vous êtes déconnecté !", 5000);
                          navigate("/");
                        }}
                      >
                        Déconnexion
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="item" onClick={() => navigate("/login")}>
                        Connexion
                      </div>
                      <div className="item" onClick={() => navigate("/register")}>
                        Inscription
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="predownload desktop">
              <div className="button download">
                Commencer à jouer
                <small>{playerCount === null ? "Chargement..." : playerCount > 0 ? `${playerCount} joueur${playerCount > 1 ? "s" : ""} connecté${playerCount > 1 ? "s" : ""}` : null}</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
