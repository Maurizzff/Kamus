import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";

import ExploreContainer from "../components/ExploreContainer";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  const buttonEnter = () => {
    navigate("/", { replace: true });
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div>
          <h1>04 Not Found</h1>
          <br />
          <button classname="" onClick={(e) => buttonEnter(e)}>
            Enter
          </button>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default NotFound;
