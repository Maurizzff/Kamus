/**
 * ==============================================================================
 * FILE: Home.jsx (Halaman Bawaan Starter Template Ionic)
 * ==============================================================================
 * 1. INI BUAT APA:
 *    Sebagai berkas halaman contoh bawaan ketika proyek Ionic di-generate pertama kali.
 * 
 * 2. FUNGSINYA APA:
 *    - Menyediakan contoh struktur halaman IonPage, IonHeader, IonToolbar, dan IonContent.
 *    - Pada implementasi utama proyek KSBJ, perannya telah digantikan secara penuh oleh
 *      halaman `Dashboard.jsx`.
 * 
 * 3. AMBILNYA DARI MANA:
 *    - Library Ionic: '@ionic/react'
 *    - Komponen bantuan: '../components/ExploreContainer'
 * ==============================================================================
 */

import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import ExploreContainer from "../components/ExploreContainer";
import "./Tab1.css";

const Home = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Home page</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name="Home page" />
      </IonContent>
    </IonPage>
  );
};

export default Home;
