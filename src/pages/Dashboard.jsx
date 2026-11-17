/**
 * ==============================================================================
 * FILE: Dashboard.jsx (Halaman Utama Dashboard & Direktori Kamus Slang Jawa)
 * ==============================================================================
 * 1. INI BUAT APA:
 *    Sebagai halaman sentral utama aplikasi KSBJ yang menyajikan antarmuka pencarian
 *    kamus lengkap, kartu penjelasan kata interaktif, serta panel visualisasi
 *    statistik dan tabel analitik data kosakata.
 * 
 * 2. FUNGSINYA APA:
 *    - Proteksi Akses (Auth Guard): Menolak dan mengalihkan langsung ke `/login`
 *      jika pengunjung belum login (tidak boleh preview dashboard tanpa sesi).
 *    - Menyediakan 2 Mode Tampilan (View Switcher):
 *      1. Mode "Tampilan Kamus": Meniru persis antarmuka publik referensi (Search bar,
 *         kategori pil, badge kata slang ber-emoji, pagination dinamis, dan detail kata).
 *      2. Mode "Panel Statistik": Menampilkan metrik ringkasan, 5 kata terpopuler,
 *         grafik persentase sebaran dialek pulau Jawa, dan tabel manajemen kosakata.
 *    - Fitur Pencarian Realtime: Menyaring berdasarkan nama kata, definisi, maupun tag.
 *    - Paginasi Dinamis: Memecah daftar kata menjadi per 14 kata per halaman.
 * 
 * 3. AMBILNYA DARI MANA:
 *    - React & Hooks: 'react' (useState, useRef)
 *    - Navigate: 'react-router-dom'
 *    - Komponen Ionic: '@ionic/react' (IonPage, IonContent)
 *    - Komponen Lokal: TopBar, BottomBar, WordCardDetail, UsulkanKataModal, ToastAlert
 *    - Global State: useSlang() dari '../context/SlangContext'
 * ==============================================================================
 */

// AMBIL DARI: Library React ('react')
// BUAT APA & FUNGSINYA: Library inti pembuatan komponen, hook state lokal, dan referensi DOM
import React, { useState, useRef } from "react";

// AMBIL DARI: node_modules 'react-router-dom'
// BUAT APA & FUNGSINYA: Komponen pengalih rute otomatis jika validasi login gagal
import { Navigate } from "react-router-dom";

// AMBIL DARI: node_modules '@ionic/react'
// BUAT APA & FUNGSINYA: Kontainer halaman standar Ionic (IonPage) dan area scroll konten (IonContent)
import { IonPage, IonContent } from "@ionic/react";

// AMBIL DARI: Folder '../components/'
// BUAT APA & FUNGSINYA: Komponen navigasi atas, navigasi bawah, kartu detail, modal usulan, dan toast notifikasi
import TopBar from "../components/TopBar";
import BottomBar from "../components/BottomBar";
import WordCardDetail from "../components/WordCardDetail";
import UsulkanKataModal from "../components/UsulkanKataModal";
import ToastAlert from "../components/ToastAlert";

// AMBIL DARI: Berkas '../context/SlangContext'
// BUAT APA & FUNGSINYA: Mengambil data kata global, user aktif, kata terpilih, dan query pencarian
import { useSlang } from "../context/SlangContext";

// INI BUAT APA: Batasan jumlah kata per halaman
// FUNGSINYA APA: Mengatur paginasi agar tampilan chip kata tetap rapi dan tidak terlalu panjang
// AMBILNYA DARI MANA: Konstanta konfigurasi lokal
const ITEMS_PER_PAGE = 14;

const Dashboard = () => {
  // Ambil state dan mutator dari global context
  const {
    user,
    words,
    selectedWord,
    selectedWordId,
    setSelectedWordId,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    setIsSuggestModalOpen
  } = useSlang();

  // ----------------------------------------------------------------------------
  // AUTH GUARD: Validasi Hak Akses Halaman
  // INI BUAT APA: Memastikan hanya user yang sudah login yang bisa membuka Dashboard
  // FUNGSINYA APA: Mengembalikan <Navigate to="/login" /> jika user bernilai null
  // AMBILNYA DARI MANA: State `user` dari SlangContext
  // ----------------------------------------------------------------------------
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // INI BUAT APA: Mengatur tab aktif pada view switcher dashboard
  // FUNGSINYA APA: Beralih antara mode 'kamus' dan mode 'statistik'
  // AMBILNYA DARI MANA: State lokal React (useState)
  const [activeDashboardTab, setActiveDashboardTab] = useState("kamus");

  // INI BUAT APA: Halaman paginasi yang sedang aktif
  // FUNGSINYA APA: Mengontrol offset array pemotongan kata (slice)
  // AMBILNYA DARI MANA: State lokal React, default halaman 1
  const [currentPage, setCurrentPage] = useState(1);

  // INI BUAT APA: Referensi elemen DOM kartu detail
  // FUNGSINYA APA: Melakukan auto-scroll yang halus ke kartu detail saat pengguna mengklik chip kata
  // AMBILNYA DARI MANA: useRef hook dari React
  const detailRef = useRef(null);

  // ----------------------------------------------------------------------------
  // PERHITUNGAN STATISTIK & METRIK (Computed Data)
  // ----------------------------------------------------------------------------
  // Menghitung akumulasi total apresiasi/likes dari seluruh kata di database
  const totalLikes = words.reduce((acc, curr) => acc + (curr.likes || 0), 0);
  
  // Mengambil 5 kata dengan jumlah like terbanyak
  const topLikedWords = [...words].sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 5);

  // ----------------------------------------------------------------------------
  // LOGIKA PENYARINGAN KOSAKATA (Filter & Search)
  // INI BUAT APA: Menyaring daftar kata berdasarkan input pencarian dan pil kategori
  // FUNGSINYA APA: Mencocokkan teks query ke properti word, definition, dan tags
  // AMBILNYA DARI MANA: Array `words`, `searchQuery`, dan `selectedCategory`
  // ----------------------------------------------------------------------------
  const filteredWords = words.filter((w) => {
    const matchesSearch =
      w.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (w.tags && w.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesCategory =
      selectedCategory === "Semua" || w.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // ----------------------------------------------------------------------------
  // LOGIKA PAGINASI (PAGINATION)
  // INI BUAT APA: Membagi array hasil pencarian menjadi beberapa halaman
  // FUNGSINYA APA: Menghitung total lembar halaman dan kata yang tampil saat ini
  // AMBILNYA DARI MANA: Math.ceil(filteredWords.length / ITEMS_PER_PAGE)
  // ----------------------------------------------------------------------------
  const totalPages = Math.max(1, Math.ceil(filteredWords.length / ITEMS_PER_PAGE));
  const displayedWords = filteredWords.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  /**
   * INI BUAT APA: Handler saat chip kata diklik oleh pengguna
   * FUNGSINYA APA: Memilih ID kata baru, memastikan berada di tab kamus, dan scroll otomatis ke kartu detail
   * AMBILNYA DARI MANA: Parameter `id` kata yang diklik
   */
  const handleSelectWord = (id) => {
    setSelectedWordId(id);
    setActiveDashboardTab("kamus");
    if (detailRef.current) {
      detailRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  /**
   * INI BUAT APA: Handler tombol submit pencarian
   * FUNGSINYA APA: Mencegah reload, mengembalikan halaman ke 1, dan memilih kata pertama dari hasil pencarian
   * AMBILNYA DARI MANA: Form submission event
   */
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setActiveDashboardTab("kamus");
    if (filteredWords.length > 0) {
      setSelectedWordId(filteredWords[0].id);
    }
  };

  /**
   * INI BUAT APA: Scroll halaman kembali ke posisi paling atas
   * FUNGSINYA APA: Memudahkan navigasi setelah user membaca detail kata di bawah
   * AMBILNYA DARI MANA: window.scrollTo
   */
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <IonPage>
      {/* Bilah Header Atas */}
      <TopBar />

      <IonContent fullscreen className="ksbj-content-padding">
        <main className="container-xl py-3">
          
          {/* ====================================================================
           * BAGIAN 1: KARTU METRIK & STATISTIK RINGKASAN
           * INI BUAT APA: Menyajikan highlight angka statistik direktori kamus
           * FUNGSINYA APA: Memberikan gambaran singkat total kata, apresiasi, dan trending
           * ==================================================================== */}
          <section className="mb-4">
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-2 mb-3">
              <div>
                <h5 className="fw-bold mb-0 text-dark">
                  <i className="bi bi-speedometer2 text-primary me-2"></i> Dashboard KSBJ
                </h5>
                <small className="text-muted">Pusat data & direktori kosakata slang bahasa Jawa</small>
              </div>

              {/* View Switcher Toggle (Pengalih Mode Tampilan) */}
              <div className="btn-group shadow-sm" role="group">
                <button
                  type="button"
                  onClick={() => setActiveDashboardTab("kamus")}
                  className={`btn btn-sm ${
                    activeDashboardTab === "kamus" ? "btn-primary fw-bold" : "btn-light border"
                  }`}
                >
                  <i className="bi bi-book me-1"></i> Tampilan Kamus
                </button>
                <button
                  type="button"
                  onClick={() => setActiveDashboardTab("statistik")}
                  className={`btn btn-sm ${
                    activeDashboardTab === "statistik" ? "btn-primary fw-bold" : "btn-light border"
                  }`}
                >
                  <i className="bi bi-bar-chart-line me-1"></i> Panel Statistik
                </button>
              </div>
            </div>

            {/* Grid 4 Kartu Metrik Counter */}
            <div className="row g-3">
              {/* Metrik 1: Total Kosakata */}
              <div className="col-6 col-md-3">
                <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100 border-start border-primary border-4">
                  <div className="text-muted small fw-semibold">Total Kosakata</div>
                  <div className="d-flex align-items-baseline gap-2 mt-1">
                    <span className="fs-3 fw-bold text-dark">{words.length}</span>
                    <span className="badge bg-primary bg-opacity-10 text-primary small">Kata Aktif</span>
                  </div>
                </div>
              </div>

              {/* Metrik 2: Total Apresiasi (Likes) */}
              <div className="col-6 col-md-3">
                <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100 border-start border-danger border-4">
                  <div className="text-muted small fw-semibold">Total Apresiasi</div>
                  <div className="d-flex align-items-baseline gap-2 mt-1">
                    <span className="fs-3 fw-bold text-danger">{totalLikes.toLocaleString()}</span>
                    <span className="badge bg-danger bg-opacity-10 text-danger small">Likes</span>
                  </div>
                </div>
              </div>

              {/* Metrik 3: Kontributor Aktif */}
              <div className="col-6 col-md-3">
                <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100 border-start border-success border-4">
                  <div className="text-muted small fw-semibold">Kontributor Aktif</div>
                  <div className="d-flex align-items-baseline gap-2 mt-1">
                    <span className="fs-3 fw-bold text-success">128</span>
                    <span className="badge bg-success bg-opacity-10 text-success small">Arek Jowo</span>
                  </div>
                </div>
              </div>

              {/* Metrik 4: Kosakata Trending */}
              <div className="col-6 col-md-3">
                <div className="card border-0 shadow-sm rounded-3 p-3 bg-white h-100 border-start border-warning border-4">
                  <div className="text-muted small fw-semibold">Kata Trending</div>
                  <div className="d-flex align-items-baseline gap-2 mt-1">
                    <span className="fs-5 fw-bold text-dark text-truncate">
                      {topLikedWords[0]?.word || "Ambyar"} {topLikedWords[0]?.emoji || "💔"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ====================================================================
           * TAB 1: TAMPILAN KAMUS (DESAIN IDENTIK DENGAN REFERENSI TAMPILAN)
           * ==================================================================== */}
          {activeDashboardTab === "kamus" && (
            <>
              {/* Header Hero Title */}
              <section className="ksbj-hero">
                <h1 className="ksbj-hero-title">Kamus Besar Bahasa Jawa Slang</h1>
                <p className="ksbj-hero-subtitle">
                  Kamus online berisi kosakata slang bahasa Jawa terupdate loh ya. Dari dialek Arekan, Mataraman, hingga Ngapak!
                </p>

                {/* Form Kotak Pencarian */}
                <form onSubmit={handleSearchSubmit} className="ksbj-search-wrapper mb-4">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control ksbj-search-input"
                      placeholder="Cari kata atau istilah slang Jawa..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      aria-label="Cari kata atau istilah..."
                    />
                    <button className="btn btn-primary ksbj-search-btn" type="submit">
                      <i className="bi bi-search me-1"></i> Cari
                    </button>
                  </div>
                </form>

                {/* Filter Kategori Pil */}
                <div className="d-flex flex-wrap justify-content-center gap-2 mb-2">
                  {["Semua", "Ungkapan", "Kata Sifat", "Kata Kerja", "Kata Benda", "Seruan"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setCurrentPage(1);
                      }}
                      className={`btn btn-sm ${
                        selectedCategory === cat ? "btn-dark text-white fw-bold" : "btn-light border text-secondary"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </section>

              {/* Kontainer Daftar Chip Semua Kosakata Slang Jawa */}
              <section className="bg-white rounded-4 p-4 border shadow-sm mb-4">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3 pb-2 border-bottom">
                  <div>
                    <h4 className="fw-bold mb-1 text-dark">Semua Kosakata Slang Jawa</h4>
                    <p className="text-muted small mb-0">Kosakata diurutkan dari yang terbaru loh ya.</p>
                  </div>
                  <div className="text-muted small mt-2 mt-md-0">
                    Menampilkan <span className="fw-bold text-primary">{filteredWords.length}</span> kata
                  </div>
                </div>

                {/* Grid Badge Kosakata */}
                {displayedWords.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="bi bi-search fs-1 text-muted"></i>
                    <h6 className="mt-3 text-secondary">Kosakata ora ditemokake (tidak ditemukan)</h6>
                    <p className="text-muted small">Coba cari dengan kata kunci lain atau usulkan kata baru!</p>
                    <button
                      onClick={() => setIsSuggestModalOpen(true)}
                      className="btn btn-primary btn-sm rounded-pill px-3"
                    >
                      <i className="bi bi-plus-circle me-1"></i> Usulkan Kata Ini
                    </button>
                  </div>
                ) : (
                  <div className="d-flex flex-wrap gap-2 py-2">
                    {displayedWords.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleSelectWord(item.id)}
                        className={`ksbj-word-badge ${selectedWordId === item.id ? "active" : ""}`}
                        title={`Klik untuk melihat arti ${item.word}`}
                      >
                        <span>{item.word}</span>
                        <span>{item.emoji}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Navigasi Paginasi Halaman */}
                {totalPages > 1 && (
                  <div className="d-flex justify-content-center align-items-center gap-1 mt-4 pt-3 border-top flex-wrap">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className="btn btn-sm btn-outline-secondary px-3 py-1 rounded-2"
                    >
                      Sebelumnya
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                      <button
                        key={pg}
                        onClick={() => setCurrentPage(pg)}
                        className={`btn btn-sm px-3 py-1 rounded-2 ${
                          currentPage === pg ? "btn-primary fw-bold" : "btn-light border"
                        }`}
                      >
                        {pg}
                      </button>
                    ))}

                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      className="btn btn-sm btn-outline-secondary px-3 py-1 rounded-2"
                    >
                      Selanjutnya
                    </button>
                  </div>
                )}
              </section>

              {/* Seksi Detail Kata Interaktif (WordCardDetail) */}
              <section ref={detailRef} className="my-5">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <h5 className="fw-bold text-dark mb-0">
                    <i className="bi bi-sparkles text-primary me-2"></i> Kata Hari Ini & Penjelasan Detail
                  </h5>
                  <span className="badge bg-primary bg-opacity-10 text-primary py-1 px-3 rounded-pill fw-semibold">
                    Fitur Interaktif
                  </span>
                </div>

                <WordCardDetail word={selectedWord} onBackToTop={scrollToTop} />
              </section>
            </>
          )}

          {/* ====================================================================
           * TAB 2: PANEL STATISTIK & ANALISIS DATA KOSAKATA
           * ==================================================================== */}
          {activeDashboardTab === "statistik" && (
            <section className="my-3">
              <div className="row g-4 mb-4">
                {/* Kolom 1: Peringkat 5 Kosakata Terpopuler */}
                <div className="col-12 col-lg-6">
                  <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
                    <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                      <i className="bi bi-fire text-danger"></i> 5 Kosakata Terpopuler
                    </h5>
                    <div className="list-group list-group-flush">
                      {topLikedWords.map((item, index) => (
                        <div
                          key={item.id}
                          className="list-group-item d-flex justify-content-between align-items-center px-0 py-3 border-bottom"
                        >
                          <div className="d-flex align-items-center gap-3">
                            <span
                              className={`badge rounded-circle p-2 ${
                                index === 0
                                  ? "bg-warning text-dark fw-bold"
                                  : index === 1
                                  ? "bg-secondary text-white"
                                  : "bg-light text-dark border"
                              }`}
                              style={{ width: "30px", height: "30px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                            >
                              {index + 1}
                            </span>
                            <div>
                              <div className="fw-bold">
                                {item.word} {item.emoji}
                              </div>
                              <small className="text-muted">{item.category} • {item.region}</small>
                            </div>
                          </div>
                          <div className="d-flex align-items-center gap-2">
                            <span className="badge bg-danger bg-opacity-10 text-danger fw-bold">
                              <i className="bi bi-heart-fill me-1"></i> {item.likes}
                            </span>
                            <button
                              onClick={() => handleSelectWord(item.id)}
                              className="btn btn-sm btn-outline-primary rounded-2 px-2 py-1"
                            >
                              Buka
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Kolom 2: Persentase Sebaran Dialek Pulau Jawa */}
                <div className="col-12 col-lg-6">
                  <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
                    <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                      <i className="bi bi-pie-chart-fill text-primary"></i> Sebaran Dialek Jawa
                    </h5>
                    <p className="text-muted small">
                      Kosakata dikelompokkan berdasarkan wilayah dan kekhasan dialek di pulau Jawa.
                    </p>
                    <div className="d-flex flex-column gap-3 mt-2">
                      <div>
                        <div className="d-flex justify-content-between small fw-bold mb-1">
                          <span>Jawa Timur & Arekan (Surabaya, Malang)</span>
                          <span className="text-primary">40%</span>
                        </div>
                        <div className="progress" style={{ height: "8px" }}>
                          <div className="progress-bar bg-primary" style={{ width: "40%" }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="d-flex justify-content-between small fw-bold mb-1">
                          <span>Mataraman (Surakarta, Yogyakarta)</span>
                          <span className="text-success">35%</span>
                        </div>
                        <div className="progress" style={{ height: "8px" }}>
                          <div className="progress-bar bg-success" style={{ width: "35%" }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="d-flex justify-content-between small fw-bold mb-1">
                          <span>Umum Jawa & Slang Populer</span>
                          <span className="text-warning">20%</span>
                        </div>
                        <div className="progress" style={{ height: "8px" }}>
                          <div className="progress-bar bg-warning" style={{ width: "20%" }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="d-flex justify-content-between small fw-bold mb-1">
                          <span>Banyumasan / Ngapak</span>
                          <span className="text-info">5%</span>
                        </div>
                        <div className="progress" style={{ height: "8px" }}>
                          <div className="progress-bar bg-info" style={{ width: "5%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabel Manajemen Seluruh Kosakata Slang */}
              <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="fw-bold mb-0">Tabel Seluruh Kosakata Slang</h5>
                  <button
                    onClick={() => setIsSuggestModalOpen(true)}
                    className="btn btn-sm btn-primary rounded-pill px-3 fw-semibold"
                  >
                    <i className="bi bi-plus-lg me-1"></i> Usulkan Kata
                  </button>
                </div>
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Kata</th>
                        <th>Kategori</th>
                        <th>Wilayah</th>
                        <th>Definisi Singkat</th>
                        <th>Apresiasi</th>
                        <th>Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {words.map((item) => (
                        <tr key={item.id}>
                          <td className="fw-bold text-dark">
                            {item.word} {item.emoji}
                          </td>
                          <td>
                            <span className="badge bg-primary bg-opacity-10 text-primary">
                              {item.category}
                            </span>
                          </td>
                          <td className="small text-muted">{item.region}</td>
                          <td className="small text-muted text-truncate" style={{ maxWidth: "250px" }}>
                            {item.definition}
                          </td>
                          <td className="small fw-semibold text-danger">
                            <i className="bi bi-heart-fill me-1"></i> {item.likes}
                          </td>
                          <td>
                            <button
                              onClick={() => handleSelectWord(item.id)}
                              className="btn btn-sm btn-outline-primary py-0 px-2 rounded-2"
                            >
                              Lihat
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* Banner Ajakan Berkontribusi */}
          <section className="bg-light rounded-4 p-4 border text-center my-4">
            <h5 className="fw-bold mb-2">Punya Istilah Slang Jawa yang Belum Ada?</h5>
            <p className="text-muted small max-w-500 mx-auto mb-3">
              Bantu generasi muda mengenal kekayaan bahasa gaul dan ungkapan lokal Jawa Timur, Jawa Tengah, dan Yogyakarta.
            </p>
            <button
              onClick={() => setIsSuggestModalOpen(true)}
              className="btn btn-primary px-4 py-2 fw-semibold rounded-pill shadow-sm"
            >
              <i className="bi bi-patch-plus me-1"></i> Usulkan Kata Slang Sekarang
            </button>
          </section>
        </main>
      </IonContent>

      {/* Komponen Modal dan Alert Bawah */}
      <UsulkanKataModal />
      <ToastAlert />
      <BottomBar />
    </IonPage>
  );
};

export default Dashboard;
