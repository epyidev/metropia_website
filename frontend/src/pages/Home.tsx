import Block from "../components/Block";
import BlockTitle from "../components/BlockTitle";
import Navbar from "../components/Navbar";
import "./pagestyles/Home.css";

const Home: React.FC = () => {
  return (
    <div className="home">
      <Navbar />
      <div className="hero">
        <img className="background" src="/images/background.png"></img>
        <img className="logo" src="/images/logo_large.png"></img>
        <p className="description">
          Depuis plus de <strong>5 ans</strong>, Metropia fait vivre une <strong>Aventure Roleplay Riche</strong>, portée par la <strong>qualité</strong>, <strong>l'immersion</strong> et le <strong>plaisir de jouer ensemble.</strong>
        </p>
        <div className="mbutton stroked gold big">Jouer</div>
      </div>
      <Block>
        <BlockTitle title="Qu’est-ce que Metropia ?" subtitle="Découvrez notre serveur" />
				<br/>
				<br/>
        <div className="columns">
          <div className="column">
            Metropia est un serveur de jeu de rôle médiéval-fantastique où vous incarnez un personnage et évoluez dans un monde vivant, comme si vous y étiez réellement. En foulant les terres légendaires de Metropia, vous ne suivez pas une histoire : vous l’écrivez. 
						<br/>
						<br/>
						Chaque décision, chaque parole, chaque alliance ou trahison a un impact réel sur le monde. Que vous soyez un simple habitant, un mercenaire, un chevalier ou un futur souverain, vous tracez votre propre chemin. 
						<br/>
						Bâtissez un village, fondez un royaume, menez la guerre, lancez le commerce.
						<br/>
						<br/>
						Ici, rien n’est figé : l’histoire se vit, et elle dépend de vous.
          </div>
          <div className="column">
						<img src="/images/welcome.png"/>
					</div>
        </div>
      </Block>
    </div>
  );
};

export default Home;
