/**
 * ==============================================================================
 * FILE: App.jsx (Komponen Root Navigasi & Routing Aplikasi KSBJ)
 * ==============================================================================
 * 1. INI BUAT APA:
 *    Sebagai komponen induk (Root Component) yang mengatur routing (pindah-pindah
 *    halaman), memuat stylesheet CSS global (Bootstrap, Ionic, Custom CSS), serta
 *    membungkus seluruh komponen aplikasi dengan SlangProvider (Global State).
 * 
 * 2. FUNGSINYA APA:
 *    - Mengonfigurasi mode Ionic ke 'md' (Material Design) agar tampilan konsisten.
 *    - Membatasi akses rute halaman rahasia (seperti Dashboard & Profile) agar
 *      hanya bisa dibuka jika pengguna sudah login menggunakan <ProtectedRoute>.
 *    - Mengatur navigasi rute:
 *      * '/' dan '/dashboard' -> Halaman Dashboard (Wajib Login)
 *      * '/login' -> Halaman Autentikasi Masuk/Daftar (Publik)
 *      * '/profile' -> Halaman Profil Kontributor & Riwayat (Wajib Login)
 *      * '*' -> Halaman 404 Not Found jika URL tidak dikenali
 * 
 * 3. AMBILNYA DARI MANA:
 *    - React: Paket 'react'
 *    - Route: Paket 'react-router-dom'
 *    - IonApp, IonRouterOutlet, setupIonicReact: Paket '@ionic/react'
 *    - IonReactRouter: Paket '@ionic/react-router'
 *    - Bootstrap & Icons: Paket 'bootstrap' dan 'bootstrap-icons'
 *    - Halaman & Komponen: Berkas lokal di folder './pages/' dan './components/'
 *    - SlangProvider: State context lokal dari './context/SlangContext'
 * ==============================================================================
 */

// AMBIL DARI: node_modules 'react'
// BUAT APA & FUNGSINYA: Fondasi utama pembuatan komponen React JSX
import React from "react";

// AMBIL DARI: node_modules 'react-router-dom'
// BUAT APA & FUNGSINYA: Komponen penentu jalur rute halaman berdasarkan URL browser
import { Route } from "react-router-dom";

// AMBIL DARI: node_modules '@ionic/react'
// BUAT APA & FUNGSINYA: Komponen kontainer utama aplikasi mobile/web Ionic & fungsi inisialisasi framework Ionic
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";

// AMBIL DARI: node_modules '@ionic/react-router'
// BUAT APA & FUNGSINYA: Router khusus Ionic yang mengintegrasikan React Router dengan transisi halaman khas mobile
import { IonReactRouter } from "@ionic/react-router";

/* ==============================================================================
 * STYLESHEET GLOBAL & ICON
 * AMBIL DARI: node_modules dan folder lokal ./theme/
 * ============================================================================== */
// AMBIL DARI: node_modules 'bootstrap'
// BUAT APA: Framework styling CSS modern
// FUNGSINYA: Menyediakan utility grid responsif, kartu, badge, tombol, dan form input
import "bootstrap/dist/css/bootstrap.min.css";

// AMBIL DARI: node_modules 'bootstrap-icons'
// BUAT APA: Kumpulan ikon vektor
// FUNGSINYA: Menampilkan simbol ikon seperti gembok, profil, speedometer, hati, bintang, dll.
import "bootstrap-icons/font/bootstrap-icons.css";

/* Core CSS Ionic Framework */
import "@ionic/react/css/core.css";

/* Basic CSS Ionic untuk normalisasi struktur layout */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS Utils Ionic untuk padding, flexbox, dan display */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Variabel Tema dan Kustomisasi CSS KSBJ */
// AMBIL DARI: ./theme/variables.css (Warna dasar Ionic)
import "./theme/variables.css";
// AMBIL DARI: ./theme/custom.css (Styling khusus identitas KSBJ bernuansa modern & responsif)
import "./theme/custom.css";

/* ==============================================================================
 * KOMPONEN HALAMAN (PAGES)
 * AMBIL DARI: Folder lokal ./pages/
 * ============================================================================== */
// INI BUAT APA: Halaman Utama Kamus Slang Jawa & Panel Statistik
// FUNGSINYA APA: Menampilkan kotak pencarian kata, filter pil, chip kata, serta detail definisi kata
import Dashboard from "./pages/Dashboard";

// INI BUAT APA: Halaman Autentikasi Akun
// FUNGSINYA APA: Mengelola form login pengguna, form register, serta tombol demo cepat
import Login from "./pages/Login";

// INI BUAT APA: Halaman Profil Kontributor
// FUNGSINYA APA: Menampilkan biodata user, total poin, kata yang diusulkan, dan daftar kata favorit
import Profile from "./pages/Profile";

// INI BUAT APA: Halaman Error 404
// FUNGSINYA APA: Ditampilkan saat user mengakses alamat URL yang tidak terdaftar
import NotFound from "./pages/NotFound";

/* ==============================================================================
 * KOMPONEN KEAMANAN RUTE & GLOBAL CONTEXT
 * ============================================================================== */
// AMBIL DARI: ./components/ProtectedRoute.jsx
// INI BUAT APA: Satpam penjaga rute (Route Guard)
// FUNGSINYA APA: Menolak akses dan me-redirect otomatis ke /login jika user belum terautentikasi
import ProtectedRoute from "./components/ProtectedRoute";

// AMBIL DARI: ./context/SlangContext.jsx
// INI BUAT APA: Pembungkus context state global
// FUNGSINYA APA: Menyediakan data kata slang, user aktif, token login, dan fungsi API ke seluruh komponen anak
import { SlangProvider } from "./context/SlangContext";

// INI BUAT APA: Konfigurasi awal framework Ionic
// FUNGSINYA APA: Mengatur tampilan seragam menggunakan style Material Design ('md') di perangkat desktop maupun Android/iOS
// AMBILNYA DARI MANA: Fungsi setupIonicReact dari library @ionic/react
setupIonicReact({
  mode: "md"
});

/**
 * KOMPONEN UTAMA: App
 * INI BUAT APA: Wadah utama perakitan komponen aplikasi KSBJ
 * FUNGSINYA APA: Memetakan rute URL browser ke komponen halaman yang sesuai
 * AMBILNYA DARI MANA: Dijalankan pertama kali oleh main.tsx
 */
const App = () => (
  // Membungkus seluruh aplikasi dengan provider context agar semua page bisa akses data kamus
  <SlangProvider>
    {/* Wadah aplikasi standar Ionic */}
    <IonApp>
      {/* Pengatur navigasi berbasis React Router */}
      <IonReactRouter>
        {/* Tempat merender komponen halaman sesuai rute yang aktif */}
        <IonRouterOutlet>
          
          {/* RUTE 1: Halaman Default '/' -> Diberi proteksi ProtectedRoute (wajib login) */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* RUTE 2: Halaman '/dashboard' -> Diberi proteksi ProtectedRoute (wajib login) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* RUTE 3: Halaman '/login' -> Terbuka untuk umum (publik) tanpa login */}
          <Route path="/login" element={<Login />} />

          {/* RUTE 4: Halaman '/profile' -> Diberi proteksi ProtectedRoute (wajib login) */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* RUTE 5: Rute wildcard '*' -> Menangkap semua URL yang tidak terdaftar (404) */}
          <Route path="*" element={<NotFound />} />

        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  </SlangProvider>
);

export default App;
