import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import "./Navbar.css";

const SERVER_STATUS_URL = import.meta.env.VITE_CONNECTED_PLAYERS_API_URL;

const Navbar: React.FC = () => {
    const [playerCount, setPlayerCount] = useState<number | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
                console.log("Player count fetched:", json);
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
            const dropdown = document.querySelector('.profile');
            if (dropdown && !dropdown.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    return (
        <div className="navbar">
            <div className="readzone">
                <div className="left">
                    <img className="logo" src="/images/logo_white.png" alt="Logo" />
                    <div className="button desktop" onClick={() => window.location.href = "/"}>Accueil</div>
                    <div className="button desktop">Wiki</div>
                    <div className="button desktop">Nous soutenir</div>
                </div>
                <div className="right">
                    <FontAwesomeIcon className="mobile" icon={faBars} />
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
                                        <div className="item">Déconnexion</div>
                                    </>
                                ) : (
                                    <>
                                        <div className="item" onClick={() => window.location.href = "/login"}>Connexion</div>
                                        <div className="item" onClick={() => window.location.href = "/register"}>Inscription</div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="predownload desktop">
                        <div className="button download">
                            Commencer à jouer
                            <small>
                                {playerCount === null
                                    ? "Chargement..."
                                    : playerCount > 0
                                        ? `${playerCount} joueur${playerCount > 1 ? "s" : ""} connecté${playerCount > 1 ? "s" : ""}`
                                        : null}
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
