/**
 * ==============================================================================
 * FILE: BottomBar.jsx (Komponen Navigasi Bar Bawah Khas Mobile Tab)
 * ==============================================================================
 * 1. INI BUAT APA:
 *    Sebagai bilah navigasi tab bawah (Bottom Navigation Bar) yang memudahkan
 *    pengguna mobile berpindah menu utama dengan sentuhan ibu jari.
 * 
 * 2. FUNGSINYA APA:
 *    - Menyediakan 4 tombol navigasi utama:
 *      * Tab Dashboard (Protected - ikon speedometer atau gembok terkunci)
 *      * Tab Usulkan (Tombol aksi cepat pembuka modal pengajuan kata)
 *      * Tab Profil (Protected - profil kontributor & riwayat kata)
 *      * Tab Akun / Login (Indikator status autentikasi)
 *    - Melakukan pencegahan otomatis (auth guard) saat tab diklik jika user belum login.
 * 
 * 3. AMBILNYA DARI MANA:
 *    - React: Library 'react'
 *    - Link, useLocation, useNavigate: Paket 'react-router-dom'
 *    - useSlang: State Context dari '../context/SlangContext'
 * ==============================================================================
 */

// AMBIL DARI: Library React ('react')
// BUAT APA & FUNGSINYA: Library inti pembuatan UI komponen
import React from "react";

// AMBIL DARI: node_modules 'react-router-dom'
// BUAT APA & FUNGSINYA: Navigasi link dan hook pembacaan rute aktif
import { Link, useLocation, useNavigate } from "react-router-dom";

// AMBIL DARI: Berkas '../context/SlangContext'
// BUAT APA & FUNGSINYA: Mengambil data user login, fungsi toast notifikasi, dan kontrol modal
import { useSlang } from "../context/SlangContext";

const BottomBar = () => {
  // INI BUAT APA: Mengambil state dan method dari Context Global
  // FUNGSINYA APA: Mengetahui status user aktif dan fungsi pembuka modal usul kata
  // AMBILNYA DARI MANA: useSlang() hook
  const { user, setIsSuggestModalOpen, showToast } = useSlang();

  // INI BUAT APA: Membaca URL browser yang sedang aktif
  // FUNGSINYA APA: Menentukan tab mana yang harus menyala (highlight aktif)
  // AMBILNYA DARI MANA: Hook useLocation() dari react-router-dom
  const location = useLocation();

  // INI BUAT APA: Fungsi pengalih halaman otomatis
  // FUNGSINYA APA: Mengarahkan browser ke rute target
  // AMBILNYA DARI MANA: Hook useNavigate() dari react-router-dom
  const navigate = useNavigate();

  // INI BUAT APA: Helper pembanding rute
  // FUNGSINYA APA: Mengembalikan true jika URL saat ini cocok dengan path tab
  // AMBILNYA DARI MANA: location.pathname
  const isCurrent = (path) => location.pathname === path;

  /**
   * INI BUAT APA: Validasi login sebelum mengizinkan tab dibuka
   * FUNGSINYA APA: Jika user null, munculkan notifikasi peringatan dan paksa pindah ke /login
   * AMBILNYA DARI MANA: Parameter targetPath (rute) dan featureName (nama label tab)
   */
  const handleRequireAuth = (targetPath, featureName) => {
    if (!user) {
      showToast(`Sampeyan kudu login dhisik kanggo mbukak ${featureName}!`);
      navigate("/login");
    } else {
      navigate(targetPath);
    }
  };

  /**
   * INI BUAT APA: Handler tombol 'Usulkan' di BottomBar
   * FUNGSINYA APA: Memastikan hanya user yang sudah login yang bisa membuka modal formulir usul kata
   * AMBILNYA DARI MANA: Memeriksa variabel `user` dari Context
   */
  const handleSuggestClick = () => {
    if (!user) {
      showToast("Sampeyan kudu login dhisik kanggo ngusulake kata anyar!");
      navigate("/login");
    } else {
      setIsSuggestModalOpen(true);
    }
  };

  return (
    <nav className="ksbj-bottom-bar">
      {/* TAB 1: DASHBOARD (Wajib Login) */}
      <button
        onClick={() => handleRequireAuth("/dashboard", "Dashboard")}
        className={`ksbj-bottom-item btn border-0 bg-transparent ${
          (isCurrent("/dashboard") || isCurrent("/")) && user ? "active" : ""
        }`}
      >
        <i className={`bi ${user ? "bi-speedometer2" : "bi-lock-fill text-muted"}`}></i>
        <span>Dashboard</span>
      </button>

      {/* TAB 2: USULKAN KATA (Aksi Cepat) */}
      <button
        onClick={handleSuggestClick}
        className="ksbj-bottom-item btn border-0 bg-transparent"
        style={{ color: "#0d6efd" }}
      >
        <i className="bi bi-plus-circle-fill text-primary" style={{ fontSize: "1.45rem" }}></i>
        <span className="fw-bold">Usulkan</span>
      </button>

      {/* TAB 3: PROFIL KONTRIBUTOR (Wajib Login) */}
      <button
        onClick={() => handleRequireAuth("/profile", "Profil")}
        className={`ksbj-bottom-item btn border-0 bg-transparent ${
          isCurrent("/profile") && user ? "active" : ""
        }`}
      >
        <i className={`bi ${user ? "bi-person-badge" : "bi-lock-fill text-muted"}`}></i>
        <span>Profil</span>
      </button>

      {/* TAB 4: AKUN / STATUS LOGIN */}
      <Link
        to="/login"
        className={`ksbj-bottom-item ${isCurrent("/login") ? "active" : ""}`}
      >
        <i className={`bi ${user ? "bi-shield-check" : "bi-box-arrow-in-right"}`}></i>
        <span>{user ? "Akun" : "Login"}</span>
      </Link>
    </nav>
  );
};

export default BottomBar;
