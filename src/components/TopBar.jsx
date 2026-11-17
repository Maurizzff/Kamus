/**
 * ==============================================================================
 * FILE: TopBar.jsx (Komponen Navigasi Bar Bagian Atas / Header)
 * ==============================================================================
 * 1. INI BUAT APA:
 *    Sebagai navigasi bagian atas (Navbar) aplikasi KSBJ yang selalu melayang
 *    (sticky) di layar desktop maupun mobile.
 * 
 * 2. FUNGSINYA APA:
 *    - Menampilkan Logo dan Brand KSBJ (Kamus Slang Jawa).
 *    - Menyediakan tombol navigasi menu:
 *      * Dashboard (dengan indikator gembok bila belum login)
 *      * Kontributor & Profil
 *      * Tombol Status Login / Avatar User
 *      * Tombol CTA "+ Usulkan Kata"
 *    - Memproteksi klik pada fitur sensitif: jika belum login, otomatis dicegat
 *      dengan pesan peringatan dan diarahkan ke rute `/login`.
 * 
 * 3. AMBILNYA DARI MANA:
 *    - React: Library 'react'
 *    - Link, useLocation, useNavigate: Paket 'react-router-dom'
 *    - useSlang: Custom hook dari '../context/SlangContext'
 * ==============================================================================
 */

// AMBIL DARI: Library React ('react')
// BUAT APA & FUNGSINYA: Library inti pembuatan UI komponen
import React from "react";

// AMBIL DARI: node_modules 'react-router-dom'
// BUAT APA & FUNGSINYA:
//   - Link: Navigasi antar rute tanpa reload halaman
//   - useLocation: Mengetahui path URL browser yang sedang aktif
//   - useNavigate: Berpindah rute secara terprogram lewat kode JavaScript
import { Link, useLocation, useNavigate } from "react-router-dom";

// AMBIL DARI: File '../context/SlangContext'
// BUAT APA & FUNGSINYA: Mengambil data pengguna login, modal usul kata, dan pemanggil notifikasi
import { useSlang } from "../context/SlangContext";

const TopBar = () => {
  // INI BUAT APA: Mengambil state dan fungsi global dari Context
  // FUNGSINYA APA: Mengetahui siapa user yang login, membuka modal, menampilkan pesan notifikasi, dan hitung inisial
  // AMBILNYA DARI MANA: useSlang() hook
  const { user, setIsSuggestModalOpen, showToast, getInitials } = useSlang();

  // INI BUAT APA: Mengambil objek lokasi URL saat ini
  // FUNGSINYA APA: Untuk menandai menu navigasi mana yang sedang aktif (active state highlight)
  // AMBILNYA DARI MANA: Hook useLocation() dari react-router-dom
  const location = useLocation();

  // INI BUAT APA: Fungsi redirect programatik
  // FUNGSINYA APA: Mengarahkan browser ke halaman tujuan (misal navigate('/login'))
  // AMBILNYA DARI MANA: Hook useNavigate() dari react-router-dom
  const navigate = useNavigate();

  // INI BUAT APA: Helper pengecekan rute aktif
  // FUNGSINYA APA: Mengembalikan true jika URL browser sama persis dengan target path
  // AMBILNYA DARI MANA: Membandingkan location.pathname
  const isActive = (path) => location.pathname === path;

  /**
   * INI BUAT APA: Pengecekan autentikasi saat tombol menu diklik
   * FUNGSINYA APA: Jika user belum login, batalkan navigasi, munculkan toast peringatan, dan arahkan ke /login
   * AMBILNYA DARI MANA: Parameter targetPath (rute tujuan) dan featureName (nama fitur yang dicegat)
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
   * INI BUAT APA: Handler klik tombol "+ Usulkan Kata"
   * FUNGSINYA APA: Memastikan user sudah login sebelum membuka modal formulir usulan kosakata
   * AMBILNYA DARI MANA: Memeriksa state user dari SlangContext
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
    <header className="ksbj-topbar py-3 shadow-sm">
      <div className="container-xl d-flex align-items-center justify-content-between">
        {/* BRAND / LOGO KSBJ */}
        {/* FUNGSINYA: Mengarahkan ke /dashboard jika sudah login, atau ke /login jika belum */}
        <Link to={user ? "/dashboard" : "/login"} className="ksbj-brand">
          <span className="ksbj-brand-badge">KSBJ</span>
          <span className="fw-bold tracking-tight">Kamus Slang Jawa</span>
        </Link>

        {/* NAVIGASI DESKTOP (Tampil di layar sedang & besar md ke atas) */}
        <nav className="d-none d-md-flex align-items-center gap-2">
          {/* Menu 1: Dashboard (Dilindungi Gembok bila belum login) */}
          <button
            onClick={() => handleRequireAuth("/dashboard", "Dashboard")}
            className={`btn border-0 ksbj-nav-link ${
              (isActive("/dashboard") || isActive("/")) && user ? "active" : ""
            }`}
          >
            <i className={`bi ${user ? "bi-speedometer2" : "bi-lock-fill text-muted"}`}></i> Dashboard
          </button>

          {/* Menu 2: Kontributor & Profil */}
          <button
            onClick={() => handleRequireAuth("/profile", "Profil")}
            className={`btn border-0 ksbj-nav-link ${isActive("/profile") && user ? "active" : ""}`}
          >
            <i className={`bi ${user ? "bi-people" : "bi-lock-fill text-muted"}`}></i> Kontributor & Profil
          </button>

          {/* Menu 3: Status Login / User Profile Badge */}
          {user ? (
            <Link
              to="/profile"
              className="ksbj-nav-link d-flex align-items-center gap-2 text-dark"
            >
              <div
                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                style={{ width: "32px", height: "32px", fontSize: "0.85rem" }}
              >
                {getInitials ? getInitials(user.name || user.username) : (user.avatarText || "U")}
              </div>
              <span className="d-none d-lg-inline fw-semibold">{user.name}</span>
            </Link>
          ) : (
            <Link
              to="/login"
              className={`ksbj-nav-link ${isActive("/login") ? "active" : ""}`}
            >
              <i className="bi bi-box-arrow-in-right"></i> Login
            </Link>
          )}

          {/* Menu 4: Tombol Tambah Usulan Kata Baru */}
          <button
            onClick={handleSuggestClick}
            className="btn btn-primary fw-semibold px-3 py-2 ms-2 rounded-3 shadow-sm d-flex align-items-center gap-2"
          >
            <i className="bi bi-plus-lg"></i> Usulkan Kata
          </button>
        </nav>

        {/* AKSI CEPAT TAMPILAN MOBILE (Layar smartphone di bawah md) */}
        <div className="d-flex d-md-none align-items-center gap-2">
          <button
            onClick={() => handleRequireAuth("/dashboard", "Dashboard")}
            className={`btn btn-sm ${
              (isActive("/dashboard") || isActive("/")) && user ? "btn-primary" : "btn-light border"
            } px-2 py-1 rounded-2`}
            title="Dashboard"
          >
            <i className={`bi ${user ? "bi-speedometer2" : "bi-lock-fill text-muted"}`}></i>
          </button>

          <button
            onClick={handleSuggestClick}
            className="btn btn-sm btn-primary fw-semibold px-2 py-1 rounded-2 shadow-sm d-flex align-items-center gap-1"
            style={{ fontSize: "0.85rem" }}
          >
            <i className="bi bi-plus-circle"></i> Usul Kata
          </button>

          {user ? (
            <Link to="/profile" className="text-decoration-none">
              <div
                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold"
                style={{ width: "32px", height: "32px", fontSize: "0.8rem" }}
              >
                {getInitials ? getInitials(user.name || user.username) : (user.avatarText || "U")}
              </div>
            </Link>
          ) : (
            <Link to="/login" className="btn btn-sm btn-outline-secondary px-2 py-1">
              <i className="bi bi-person"></i>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
