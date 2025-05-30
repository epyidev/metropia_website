import Block from "../components/Block";
import BlockTitle from "../components/BlockTitle";
import "./pagestyles/Home.css";

import FaqItem from "../components/FaqItem";
import PageWrapper from "../components/PageWrapper";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface HomeProps {}

const Home: React.FC<HomeProps> = ({}) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    document.title = "Metropia - Accueil";
  }, []);

  return (
    <PageWrapper>
      <div className="home">
        <div className="hero">
          <img className="background" src="/images/background.png"></img>
          <img className="logo" src="/images/logo_large.png"></img>
          <p className="description">
            Depuis plus de <strong>5 ans</strong>, Metropia fait vivre une <strong>Aventure Roleplay Riche</strong>, portée par la <strong>qualité</strong>, <strong>l'immersion</strong> et le <strong>plaisir de jouer ensemble.</strong>
          </p>
          <div className="mbutton stroked gold big" onClick={() => {
            navigate("/wiki/play");
          }}>
            Jouer
          </div>
        </div>
        <Block>
          <BlockTitle title="Qu’est-ce que Metropia ?" subtitle="Découvrez notre serveur" />
          <br />
          <br />
          <div className="columns">
            <div className="column">
              Metropia est un serveur de jeu de rôle médiéval-fantastique où vous incarnez un personnage et évoluez dans un monde vivant, comme si vous y étiez réellement. En foulant les terres légendaires de Metropia, vous ne suivez pas une histoire : vous l’écrivez.
              <br />
              <br />
              Chaque décision, chaque parole, chaque alliance ou trahison a un impact réel sur le monde. Que vous soyez un simple habitant, un mercenaire, un chevalier ou un futur souverain, vous tracez votre propre chemin.
              <br />
              Bâtissez un village, fondez un royaume, menez la guerre, lancez le commerce.
              <br />
              <br />
              Ici, rien n’est figé : l’histoire se vit, et elle dépend de vous.
            </div>
            <div className="column">
              <img src="/images/welcome.png" />
            </div>
          </div>
        </Block>
        <Block image="/images/map_background.png">
          <BlockTitle title="La légende de Metropia" subtitle="Mais qu’en est-il vraiment ?" />
          <br />
          <br />
          <div className="prelegend">
            <div className="legend">
              <p>Sur l’Archipel, un immense continent divisé en deux nations, il éxiste une légende qui se transmet de générations en générations depuis des siècles.</p>
              <p>
                C’est la légende de Metropia, une légende qui se dessine sous les traits d'une île...
                <br />
                <br />
                Une île lointaine...
                <br />
                <br />
                Baignée par un autre monde que celui des humains.
              </p>
              <p>C'est là, sur cette île, que s'épanouissent en harmonie de nombreuses créatures mystiques. Et c'est aussi là que quelques rares élus parmi les hommes se retrouvent, suite à des interventions divines, condamnés à y demeurer jusqu'à la fin de leur existence.</p>
            </div>
            <div className="mbutton stroked small" onClick={() => {
              navigate("/wiki/lore");
            }}>En savoir plus</div>
          </div>
        </Block>
        <Block>
          <BlockTitle title="F.A.Q" subtitle="Tu as une question ? Tu trouveras probablement ta réponse ici !" />
          <br />
          <br />
          <div className="list">
            <FaqItem question="Comment rejoindre le serveur ?" answer="Pour rejoindre Metropia, il vous suffit de télécharger notre launcher disponible sur notre site internet, puis de vous connecter. Notre serveur fonctionne en accès libre, ce qui signifie que vous n'avez pas besoin d'être sur liste blanche pour pouvoir jouer." />
            <FaqItem question="Le serveur dispose t-il d’un chat vocal ?" answer="Oui, le serveur intègre un système de chat vocal directement en jeu, vous n’avez donc pas besoin d’installer de logiciel tiers pour jouer. L’usage du micro est indispensable pour profiter pleinement de l’expérience. Toutefois, en cas d’imprévu vous empêchant d’utiliser votre voix, un chat RP écrit est disponible comme solution de secours." />
            <FaqItem question="Le serveur accepte t-il les versions crackées de Minecraft ?" answer="Non. Pour des raisons de sécurité, Metropia n’accepte que les joueurs disposant d’une version officielle de Minecraft. " />
            <FaqItem question="Dois-je changer mon skin Minecraft officiel pour jouer sur Metropia ?" answer="Non, ce n’est pas nécessaire. Metropia dispose de son propre système de gestion de skins. Lors de votre première connexion, vous serez invité à créer votre personnage RP à l’aide de notre customiseur de skin intégré en jeu. Votre skin Minecraft officiel ne sera donc pas utilisé sur le serveur, ce qui signifie que vous n’avez pas besoin de le modifier pour jouer." />
            <FaqItem question="Peut-on jouer sur Metropia sur Minecraft Bedrock ?" answer="Non, Metropia est uniquement disponible sur la version Java de Minecraft." />
            <FaqItem question="Y a-t-il un âge minimum pour jouer sur Metropia ?" answer="Il n’y a pas d’âge minimum strict pour rejoindre Metropia. Cependant, le serveur propose une expérience de roleplay médiéval-fantastique avec un certain degré de réalisme. Certaines scènes RP peuvent aborder des thèmes nécessitant une certaine maturité. Ainsi, bien qu’aucune limite ne soit imposée, nous déconseillons l’accès au serveur aux personnes de moins de 14 ans." />
            <FaqItem
              question="J’ai un problème avec l’installation du launcher, que faire ?"
              answer="Pas de panique ! En cas de souci lors de l’installation du launcher, notre équipe est là pour vous aider. Nous vous invitons à rejoindre notre serveur Discord pour poser vos questions. Avant cela, pensez à consulter la page dédiée aux problèmes d’installation les plus courants : vous y trouverez peut-être une solution rapide sans avoir à attendre une réponse personnalisée. Cela permet aussi de ne pas surcharger inutilement l’équipe d’assistance."
            />
          </div>
        </Block>
      </div>
    </PageWrapper>
  );
};

export default Home;
