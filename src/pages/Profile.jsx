/**
 * ==============================================================================
 * FILE: Profile.jsx (Halaman Profil Kontributor, Kata Usulan & Favorit)
 * ==============================================================================
 * 1. INI BUAT APA:
 *    Sebagai halaman profil pribadi pengguna/kontributor di aplikasi KSBJ.
 * 
 * 2. FUNGSINYA APA:
 *    - Proteksi Rute (Auth Guard): Memastikan hanya pengguna yang sudah login
 *      yang dapat mengakses halaman ini (jika belum, otomatis dilempar ke /login).
 *    - Menampilkan Kartu Profil Lengkap:
 *      * Avatar lingkaran dengan inisial nama
 *      * Nama lengkap, username, badge peran (role), dan wilayah asal
 *      * Biodata singkat dan tanggal bergabung
 *    - Menampilkan Bilah Statistik (Stats Bar):
 *      * Jumlah kata yang telah diusulkan
 *      * Total poin reputasi komunitas
 *      * Total kata yang disimpan sebagai favorit
 *    - Menyediakan 3 Tab Navigasi Konten:
 *      1. Tab "Kata Diusulkan": Menampilkan seluruh kata yang diajukan oleh user.
 *      2. Tab "Favorit Tersimpan": Menampilkan daftar kata yang dibintangi user,
 *         lengkap dengan tombol untuk menghapus dari favorit.
 *      3. Tab "Pedoman Slang": Berisi panduan ragam dialek bahasa Jawa dan etika kontribusi.
 * 
 * 3. AMBILNYA DARI MANA:
 *    - React: Library 'react' (useState)
 *    - Router: 'react-router-dom' (Link, useNavigate, Navigate)
 *    - Ionic: '@ionic/react' (IonPage, IonContent)
 *    - Global State: useSlang() dari '../context/SlangContext'
 * ==============================================================================
 */

// AMBIL DARI: Library React ('react')
// BUAT APA & FUNGSINYA: Library pembuatan antarmuka dan pengelolaan state tab lokal
import React, { useState } from "react";

// AMBIL DARI: node_modules 'react-router-dom'
// BUAT APA & FUNGSINYA: Navigasi link, perpindahan rute programatik, dan route guard redirect
import { Link, useNavigate, Navigate } from "react-router-dom";

// AMBIL DARI: node_modules '@ionic/react'
// BUAT APA & FUNGSINYA: Kontainer struktur halaman standar Ionic Framework
import { IonPage, IonContent } from "@ionic/react";

// AMBIL DARI: Folder '../components/'
// BUAT APA & FUNGSINYA: Komponen header atas, navigasi bawah, modal pengajuan kata, dan alert toast
import TopBar from "../components/TopBar";
import BottomBar from "../components/BottomBar";
import UsulkanKataModal from "../components/UsulkanKataModal";
import ToastAlert from "../components/ToastAlert";

// AMBIL DARI: Berkas '../context/SlangContext'
// BUAT APA & FUNGSINYA: Mengambil data pengguna login, daftar kata, aksi logout, toggle favorit, dll.
import { useSlang } from "../context/SlangContext";

const Profile = () => {
  // Ambil state dan aksi dari global context
  const { user, words, logout, setSelectedWordId, toggleFavorite, setIsSuggestModalOpen, getInitials } = useSlang();
  const navigate = useNavigate();

  // ----------------------------------------------------------------------------
  // AUTH GUARD: Validasi Akses Profil
  // INI BUAT APA: Memastikan hanya user yang sah yang bisa melihat data profil
  // FUNGSINYA APA: Mengalihkan pengunjung ke /login jika state user adalah null
  // AMBILNYA DARI MANA: State `user` dari SlangContext
  // ----------------------------------------------------------------------------
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // INI BUAT APA: Tab aktif pada halaman profil
  // FUNGSINYA APA: Beralih antara tab 'contributed', 'favorites', dan 'about'
  // AMBILNYA DARI MANA: State lokal React (useState)
  const [activeTab, setActiveTab] = useState("contributed");

  // ----------------------------------------------------------------------------
  // COMPUTED: Menyaring Kosakata Milik Pengguna
  // INI BUAT APA: Mengambil daftar kata yang diajukan oleh pengguna yang sedang aktif
  // FUNGSINYA APA: Mencocokkan nama pengusul dengan nama user
  // AMBILNYA DARI MANA: Array `words` dari SlangContext
  // ----------------------------------------------------------------------------
  const userWords = words.filter(
    (w) =>
      w.proposedBy?.name === user?.name ||
      w.proposedBy?.name?.toLowerCase().includes("joko")
  );

  // ----------------------------------------------------------------------------
  // COMPUTED: Menyaring Kosakata Favorit Pengguna
  // INI BUAT APA: Mengambil daftar kata yang disimpan di daftar bintang favorit
  // FUNGSINYA APA: Mencocokkan id kata dengan array `user.favoriteWords`
  // AMBILNYA DARI MANA: Array `words` dan `user.favoriteWords`
  // ----------------------------------------------------------------------------
  const favoriteWords = words.filter((w) =>
    user?.favoriteWords?.includes(w.id)
  );

  /**
   * INI BUAT APA: Handler tombol "Deleng Arti" pada kartu kata
   * FUNGSINYA APA: Memilih kata yang diklik lalu mengarahkan browser ke halaman Dashboard
   * AMBILNYA DARI MANA: Parameter `id` kata
   */
  const handleSelectWord = (id) => {
    setSelectedWordId(id);
    navigate("/dashboard");
  };

  return (
    <IonPage>
      {/* Header Bar */}
      <TopBar />

      <IonContent fullscreen className="ksbj-content-padding">
        <main className="container-xl py-4">
          
          {/* ====================================================================
           * KARTU HEADER PROFIL KONTRIBUTOR
           * ==================================================================== */}
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
            {/* Banner Gradien Biru */}
            <div
              className="p-4 p-md-5 text-white"
              style={{
                background: "linear-gradient(135deg, #0d6efd 0%, #084298 100%)"
              }}
            >
              <div className="d-flex flex-column flex-md-row align-items-center align-items-md-start gap-4">
                {/* Avatar Lingkaran Inisial */}
                <div
                  className="rounded-circle bg-white text-primary d-flex align-items-center justify-content-center fw-bold shadow"
                  style={{ width: "90px", height: "90px", fontSize: "2.2rem" }}
                >
                  {getInitials ? getInitials(user.name || user.username) : (user.avatarText || "U")}
                </div>

                {/* Informasi Data Diri Pengguna */}
                <div className="text-center text-md-start flex-grow-1">
                  <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-md-start gap-2 mb-1">
                    <h3 className="fw-bold mb-0 text-white">{user.name}</h3>
                    {/* Badge Peran Komunitas */}
                    <span className="badge bg-warning text-dark fw-bold px-2 py-1 rounded-pill">
                      <i className="bi bi-award-fill me-1"></i> {user.role || "Sultan Slang"}
                    </span>
                  </div>
                  {/* Username & Wilayah */}
                  <div className="text-white-50 small mb-2">
                    @{user.username} • <i className="bi bi-geo-alt-fill text-warning"></i> {user.region || "Surakarta / Surabaya"}
                  </div>
                  {/* Bio Deskripsi */}
                  <p className="text-white-75 small mb-3 max-w-600">
                    {user.bio}
                  </p>
                  {/* Tanggal Bergabung */}
                  <div className="text-white-50 small">
                    <i className="bi bi-calendar3 me-1"></i> Gabung wiwit: {user.joinedDate || "Oktober 2026"}
                  </div>
                </div>

                {/* Tombol Aksi Profil */}
                <div className="d-flex flex-column gap-2 mt-3 mt-md-0">
                  {/* Tombol Buka Modal Usul Kata */}
                  <button
                    onClick={() => setIsSuggestModalOpen(true)}
                    className="btn btn-warning text-dark fw-bold px-3 py-2 rounded-3 shadow-sm d-flex align-items-center justify-content-center gap-1"
                  >
                    <i className="bi bi-plus-circle-fill"></i> Usul Kata Anyar
                  </button>
                  {/* Tombol Keluar (Logout) */}
                  <button
                    onClick={logout}
                    className="btn btn-outline-light px-3 py-2 rounded-3 d-flex align-items-center justify-content-center gap-1"
                  >
                    <i className="bi bi-box-arrow-right"></i> Metu (Logout)
                  </button>
                </div>
              </div>
            </div>

            {/* Bilah Ringkasan Statistik (Stats Bar) */}
            <div className="bg-light p-3 border-top">
              <div className="row text-center g-2">
                <div className="col-4 border-end">
                  <div className="fs-4 fw-bold text-primary">{userWords.length}</div>
                  <div className="small text-muted fw-semibold">Kata Diusulkan</div>
                </div>
                <div className="col-4 border-end">
                  <div className="fs-4 fw-bold text-success">{user.reputationPoints || 2480}</div>
                  <div className="small text-muted fw-semibold">Poin Reputasi</div>
                </div>
                <div className="col-4">
                  <div className="fs-4 fw-bold text-warning">{favoriteWords.length}</div>
                  <div className="small text-muted fw-semibold">Kata Favorit</div>
                </div>
              </div>
            </div>
          </div>

          {/* ====================================================================
           * NAVIGASI TAB HALAMAN PROFIL
           * ==================================================================== */}
          <div className="d-flex gap-2 border-bottom mb-4">
            <button
              onClick={() => setActiveTab("contributed")}
              className={`btn rounded-0 border-0 pb-3 fw-bold ${
                activeTab === "contributed"
                  ? "text-primary border-bottom border-primary border-3"
                  : "text-muted"
              }`}
            >
              <i className="bi bi-journal-check me-1"></i> Kata Diusulkan ({userWords.length})
            </button>
            <button
              onClick={() => setActiveTab("favorites")}
              className={`btn rounded-0 border-0 pb-3 fw-bold ${
                activeTab === "favorites"
                  ? "text-primary border-bottom border-primary border-3"
                  : "text-muted"
              }`}
            >
              <i className="bi bi-star-fill text-warning me-1"></i> Favorit Tersimpan ({favoriteWords.length})
            </button>
            <button
              onClick={() => setActiveTab("about")}
              className={`btn rounded-0 border-0 pb-3 fw-bold ${
                activeTab === "about"
                  ? "text-primary border-bottom border-primary border-3"
                  : "text-muted"
              }`}
            >
              <i className="bi bi-info-circle me-1"></i> Pedoman Slang
            </button>
          </div>

          {/* ====================================================================
           * KONTEN TAB 1: KATA YANG DIUSULKAN OLEH USER
           * ==================================================================== */}
          {activeTab === "contributed" && (
            <div>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0">Daftar Kosakata Usulan Sampeyan</h5>
                <button
                  onClick={() => setIsSuggestModalOpen(true)}
                  className="btn btn-sm btn-outline-primary rounded-pill px-3"
                >
                  <i className="bi bi-plus-lg me-1"></i> Tambah Kosakata
                </button>
              </div>

              {userWords.length === 0 ? (
                <div className="card border-0 bg-light p-4 text-center rounded-3">
                  <p className="text-muted mb-2">Sampeyan durung nate ngusulake kata slang.</p>
                  <button
                    onClick={() => setIsSuggestModalOpen(true)}
                    className="btn btn-primary btn-sm mx-auto"
                  >
                    Mulai Usulkan Sekarang
                  </button>
                </div>
              ) : (
                <div className="row g-3">
                  {userWords.map((item) => (
                    <div key={item.id} className="col-12 col-md-6">
                      <div className="card border shadow-sm rounded-3 p-3 h-100 hover-card">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <span className="badge bg-primary bg-opacity-10 text-primary mb-1">
                              {item.category}
                            </span>
                            <h5 className="fw-bold mb-0">
                              {item.word} {item.emoji}
                            </h5>
                          </div>
                          <span className="badge bg-light text-secondary border">
                            <i className="bi bi-heart-fill text-danger me-1"></i> {item.likes || 0}
                          </span>
                        </div>
                        <p className="small text-muted flex-grow-1 text-truncate-2 mb-3">
                          {item.definition}
                        </p>
                        <div className="d-flex justify-content-between align-items-center border-top pt-2">
                          <small className="text-muted">
                            <i className="bi bi-clock me-1"></i> {item.proposedBy?.date || "Baru"}
                          </small>
                          <button
                            onClick={() => handleSelectWord(item.id)}
                            className="btn btn-sm btn-primary px-3 rounded-2"
                          >
                            Deleng Arti <i className="bi bi-arrow-right"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ====================================================================
           * KONTEN TAB 2: KOSAKATA FAVORIT TERSIMPAN
           * ==================================================================== */}
          {activeTab === "favorites" && (
            <div>
              <h5 className="fw-bold mb-3">Kosakata Slang Favorit</h5>
              {favoriteWords.length === 0 ? (
                <div className="card border-0 bg-light p-4 text-center rounded-3">
                  <i className="bi bi-star text-muted fs-2 mb-2"></i>
                  <p className="text-muted mb-2">Durung ono kata sing disimpen minangka favorit.</p>
                  <Link to="/dashboard" className="btn btn-primary btn-sm mx-auto">
                    Cari Kata di Kamus
                  </Link>
                </div>
              ) : (
                <div className="row g-3">
                  {favoriteWords.map((item) => (
                    <div key={item.id} className="col-12 col-md-6">
                      <div className="card border shadow-sm rounded-3 p-3 h-100">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <span className="badge bg-primary bg-opacity-10 text-primary mb-1">
                              {item.category}
                            </span>
                            <h5 className="fw-bold mb-0">
                              {item.word} {item.emoji}
                            </h5>
                          </div>
                          {/* Tombol Hapus dari Favorit */}
                          <button
                            onClick={() => toggleFavorite(item.id)}
                            className="btn btn-sm text-danger border-0 p-0"
                            title="Hapus dari favorit"
                          >
                            <i className="bi bi-trash fs-5"></i>
                          </button>
                        </div>
                        <p className="small text-muted flex-grow-1 text-truncate-2 mb-3">
                          {item.definition}
                        </p>
                        <div className="d-flex justify-content-between align-items-center border-top pt-2">
                          <small className="text-muted">📍 {item.region || "Umum"}</small>
                          <button
                            onClick={() => handleSelectWord(item.id)}
                            className="btn btn-sm btn-outline-primary px-3 rounded-2"
                          >
                            Deleng Detail <i className="bi bi-arrow-right"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ====================================================================
           * KONTEN TAB 3: PEDOMAN & ETIKA KONTRIBUSI SLANG
           * ==================================================================== */}
          {activeTab === "about" && (
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h5 className="fw-bold text-dark mb-3">
                <i className="bi bi-book-half text-primary me-2"></i> Pedoman Slang Basa Jawa
              </h5>
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="border rounded-3 p-3 h-100 bg-light">
                    <h6 className="fw-bold text-primary">1. Ragam Dialek Boso Jowo</h6>
                    <p className="small text-muted mb-0">
                      Bahasa Jawa memiliki keberagaman ragam dialek yang sangat kaya: dialek Arekan (Surabaya, Malang dengan bahasa walikannya), Mataraman (Solo, Jogja, Madiun), hingga Banyumasan (Ngapak).
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="border rounded-3 p-3 h-100 bg-light">
                    <h6 className="fw-bold text-primary">2. Etika Kontribusi Komunitas</h6>
                    <p className="small text-muted mb-0">
                      Semua kontributor diharapkan menyertakan definisi yang jelas, akurat, dan contoh penggunaan yang santun agar bisa menjadi referensi edukatif bagi pelajar dan generasi muda.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </IonContent>

      {/* Komponen Modal dan Alert Bawah */}
      <UsulkanKataModal />
      <ToastAlert />
      <BottomBar />
    </IonPage>
  );
};

export default Profile;
