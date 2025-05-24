import "./Navbar.css";

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = ({}) => {
    return (
        <div className="navbar">
            <div className="readzone">
                <img src="../images/logo_white.png"></img>
            </div>
        </div>
    );
};

export default Navbar;
