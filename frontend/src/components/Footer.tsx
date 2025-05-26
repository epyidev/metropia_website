import "./Footer.css";

interface FooterProps {}

const Footer: React.FC<FooterProps> = () => {
    return (
        <div className="footer">
            <div className="readzone">
                <p className="info copyright">Copyright 2019-2025 © Metropia</p>
                <a href="https://lets-pop.fr/" target="_blank" className="info powered">Powered by <img src="/images/logo_letspop.png" alt="Let's PoP !" /></a>
            </div>
        </div>
    );
};

export default Footer;
