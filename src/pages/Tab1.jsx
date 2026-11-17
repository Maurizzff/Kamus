/**
 * ==============================================================================
 * FILE: Tab1.jsx (Halaman Bawaan Starter Tab Template Ionic)
 * ==============================================================================
 * 1. INI BUAT APA:
 *    Sebagai berkas halaman tab template bawaan Ionic React.
 * 
 * 2. FUNGSINYA APA:
 *    - Menyediakan contoh struktur navigasi tab default. Pada proyek KSBJ ini,
 *      seluruh fungsionalitas dan navigasi tab dikelola oleh BottomBar dan Dashboard.
 * 
 * 3. AMBILNYA DARI MANA:
 *    - Library Ionic: '@ionic/react'
 *    - Komponen bantuan: '../components/ExploreContainer'
 * ==============================================================================
 */

import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import ExploreContainer from "../components/ExploreContainer";
import "./Tab1.css";

const Tab1 = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 1</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <div>Tap to enter</div>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 1</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Tab 1 page" />
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
