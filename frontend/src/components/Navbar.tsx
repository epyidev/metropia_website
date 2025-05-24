import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import "./Navbar.css";

const SERVER_STATUS_URL = import.meta.env.VITE_CONNECTED_PLAYERS_API_URL;

const Navbar: React.FC = () => {
    const [playerCount, setPlayerCount] = useState<number | null>(null);

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

    return (
        <div className="navbar">
            <div className="readzone">
                <div className="left">
                    <img className="logo" src="/images/logo_white.png" alt="Logo" />
                    <div className="button desktop">Accueil</div>
                    <div className="button desktop">Wiki</div>
                    <div className="button desktop">Nous soutenir</div>
                </div>
                <div className="right">
                    <FontAwesomeIcon className="mobile" icon={faBars} />
                    <div className="desktop">
                        <div className="button profile">
                            Invité
                            <div className="arrow">▼</div>
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
