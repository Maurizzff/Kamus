/**
 * ==============================================================================
 * FILE: NotFound.jsx (Halaman Error 404 / Kaca Ora Ditemokake)
 * ==============================================================================
 * 1. INI BUAT APA:
 *    Sebagai halaman penanganan error saat pengguna mengakses tautan atau URL
 *    yang tidak terdaftar pada konfigurasi rute di App.jsx (jalur rute '*').
 * 
 * 2. FUNGSINYA APA:
 *    - Menampilkan informasi visual angka '404' besar dan pesan ramah dalam bahasa
 *      Jawa ("Ngapunten lur, kaca utawa tautan sing sampeyan tuju ora ono").
 *    - Menyediakan tombol pemulihan untuk kembali ke halaman Dashboard utama.
 * 
 * 3. AMBILNYA DARI MANA:
 *    - React: Library 'react'
 *    - Link: Komponen navigasi dari 'react-router-dom'
 *    - Ionic: '@ionic/react' (IonPage, IonContent)
 *    - Komponen Lokal: TopBar dan BottomBar
 * ==============================================================================
 */

// AMBIL DARI: Library React ('react')
// BUAT APA & FUNGSINYA: Library inti pembuatan komponen React
import React from "react";

// AMBIL DARI: node_modules 'react-router-dom'
// BUAT APA & FUNGSINYA: Navigasi link kembali ke beranda
import { Link } from "react-router-dom";

// AMBIL DARI: node_modules '@ionic/react'
// BUAT APA & FUNGSINYA: Kontainer tampilan halaman standar Ionic
import { IonPage, IonContent } from "@ionic/react";

// AMBIL DARI: Folder '../components/'
// BUAT APA & FUNGSINYA: Menampilkan header dan navigasi tab bawah
import TopBar from "../components/TopBar";
import BottomBar from "../components/BottomBar";

const NotFound = () => {
  return (
    <IonPage>
      {/* Header Bar */}
      <TopBar />

      <IonContent fullscreen className="ksbj-content-padding">
        <div className="container py-5 text-center">
          {/* Kartu Pesan Error 404 */}
          <div className="card border-0 shadow-sm rounded-4 p-5 max-w-500 mx-auto">
            <div className="display-1 fw-bold text-primary mb-2">404</div>
            <h4 className="fw-bold mb-2">Kaca Ora Ditemokake (Halaman Tidak Ditemukan)</h4>
            <p className="text-muted mb-4">
              Ngapunten lur, kaca utawa tautan sing sampeyan tuju ora ono ing sistem KSBJ.
            </p>
            {/* Tombol Kembali ke Dashboard */}
            <Link to="/dashboard" className="btn btn-primary px-4 py-2 fw-bold rounded-pill mx-auto">
              <i className="bi bi-house-door-fill me-1"></i> Mbalik menyang Beranda
            </Link>
          </div>
        </div>
      </IonContent>

      {/* Navigasi Bawah */}
      <BottomBar />
    </IonPage>
  );
};

export default NotFound;
