import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import ExploreContainer from "../components/ExploreContainer";
import "./Tab1.css";

const Home = () => {
  const navigate = useNavigate();

  const buttonEnter = () => {
    (navigate("/Store"), { replace: true, state: { id: 5, name: "Nama Store" } });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Halaman Home</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <button className="" onClick={buttonEnter}>
          Go to Store
        </button>
      </IonContent>
    </IonPage>
  );
};

export default Home;
