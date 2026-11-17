/**
 * ==============================================================================
 * FILE: Login.jsx (Halaman Autentikasi Pengguna: Masuk & Daftar Akun)
 * ==============================================================================
 * 1. INI BUAT APA:
 *    Sebagai pintu gerbang autentikasi utama (Authentication Gateway) aplikasi KSBJ.
 * 
 * 2. FUNGSINYA APA:
 *    - Menampilkan Banner Peringatan Wajib Login: Mengedukasi pengguna bahwa
 *      Dashboard dikunci sampai login berhasil dilakukan.
 *    - Mode Masuk (Login): Menerima username/email dan kata sandi untuk diverifikasi
 *      oleh Backend Laravel Sanctum (POST /api/login).
 *    - Mode Daftar Baru (Register): Menerima nama lengkap, username, email, dan
 *      password untuk disimpan ke tabel `users` di database MySQL (POST /api/register).
 *    - Status Sudah Login: Jika user sudah login, menampilkan kartu identitas akun
 *      beserta tombol pintas ke Profil, Dashboard, atau tombol Logout.
 *    - Tombol Uji Coba Cepat (Quick Demo): Tombol 1-klik untuk login instan sebagai
 *      'Mas Joko' atau 'Mbak Siti' demi kemudahan demonstrasi saat presentasi.
 * 
 * 3. AMBILNYA DARI MANA:
 *    - React: Library 'react' (useState)
 *    - Router: 'react-router-dom' (useNavigate, Link)
 *    - Ionic: '@ionic/react' (IonPage, IonContent)
 *    - Global State: useSlang() dari '../context/SlangContext'
 * ==============================================================================
 */

// AMBIL DARI: Library React ('react')
// BUAT APA & FUNGSINYA: Library inti pembuatan komponen dan hook state lokal
import React, { useState } from "react";

// AMBIL DARI: node_modules 'react-router-dom'
// BUAT APA & FUNGSINYA: useNavigate untuk redirect halaman setelah login, Link untuk navigasi tautan
import { useNavigate, Link } from "react-router-dom";

// AMBIL DARI: node_modules '@ionic/react'
// BUAT APA & FUNGSINYA: Kontainer tampilan halaman standar Ionic
import { IonPage, IonContent } from "@ionic/react";

// AMBIL DARI: Folder '../components/'
// BUAT APA & FUNGSINYA: Navigasi atas, navigasi bawah, modal form kata, dan alert notifikasi
import TopBar from "../components/TopBar";
import BottomBar from "../components/BottomBar";
import UsulkanKataModal from "../components/UsulkanKataModal";
import ToastAlert from "../components/ToastAlert";

// AMBIL DARI: Berkas '../context/SlangContext'
// BUAT APA & FUNGSINYA: Mengambil data user, fungsi login, register, logout, dan showToast
import { useSlang } from "../context/SlangContext";

const Login = () => {
  // Ambil state dan aksi autentikasi dari global context
  const { user, login, register, logout, showToast, getInitials } = useSlang();
  const navigate = useNavigate();

  // INI BUAT APA: Pengalih mode antara Masuk (false) dan Daftar Baru (true)
  // FUNGSINYA APA: Mengubah form yang tampil di layar
  // AMBILNYA DARI MANA: State lokal React (useState)
  const [isRegister, setIsRegister] = useState(false);

  // INI BUAT APA: Objek data input formulir
  // FUNGSINYA APA: Menampung input username, password, email, nama, dan opsi ingat saya
  // AMBILNYA DARI MANA: State lokal React, dikosongkan secara default agar pengguna mengisi sendiri
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    name: "",
    remember: false
  });

  // INI BUAT APA: Kontrol visibilitas kata sandi
  // FUNGSINYA APA: Mengubah tipe input antara 'password' (bintang) dan 'text' (terlihat)
  // AMBILNYA DARI MANA: State lokal React (useState)
  const [showPassword, setShowPassword] = useState(false);

  // INI BUAT APA: Pengalih tab antara Masuk dan Daftar Baru
  // FUNGSINYA APA: Mengubah state `isRegister` dan mengosongkan kolom input formulir
  // AMBILNYA DARI MANA: Tombol navigasi tab di atas form
  const handleSwitchTab = (toRegister) => {
    setIsRegister(toRegister);
    setFormData({
      name: "",
      username: "",
      email: "",
      password: "",
      remember: false
    });
  };

  /**
   * INI BUAT APA: Handler pengiriman formulir autentikasi (Submit)
   * FUNGSINYA APA:
   *   - Jika mode Daftar: Validasi kelengkapan lalu panggil register(formData)
   *   - Jika mode Masuk: Validasi username & password lalu panggil login()
   *   - Jika berhasil, otomatis mengarahkan ke halaman '/dashboard'
   * AMBILNYA DARI MANA: Form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isRegister) {
      if (!formData.name || !formData.username || !formData.email || !formData.password) {
        showToast("Harap isi seluruh kolom pendaftaran!");
        return;
      }
      const ok = await register(formData);
      if (ok) {
        navigate("/dashboard");
      }
    } else {
      if (!formData.username || !formData.password) {
        showToast("Harap isi username dan kata sandi!");
        return;
      }
      const ok = await login(formData.username, formData.password);
      if (ok) {
        navigate("/dashboard");
      }
    }
  };

  /**
   * INI BUAT APA: Fitur login cepat 1-klik untuk demonstrasi / pengujian
   * FUNGSINYA APA: Menjalankan login otomatis dengan akun demo yang sudah di-seed di database
   * AMBILNYA DARI MANA: Parameter nama dan username akun demo
   */
  const handleQuickLogin = async (name, username) => {
    const ok = await login(username, "password123");
    if (ok) {
      navigate("/dashboard");
    }
  };

  return (
    <IonPage>
      {/* Header Bar */}
      <TopBar />

      <IonContent fullscreen className="ksbj-content-padding">
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-12 col-sm-10 col-md-8 col-lg-5">
              
              {/* KARTU FORMULIR AUTENTIKASI */}
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                {/* Header Kartu */}
                <div className="bg-primary text-white p-4 text-center">
                  <div className="d-inline-flex p-3 bg-white bg-opacity-25 rounded-circle mb-3">
                    <i className="bi bi-shield-lock-fill fs-2"></i>
                  </div>
                  <h4 className="fw-bold mb-1">
                    {user ? "Status Akun KSBJ" : isRegister ? "Daftar Akun KSBJ" : "Masuk ke KSBJ"}
                  </h4>
                  <p className="small mb-0 text-white-50">
                    Kamus Besar Bahasa Jawa Slang Community
                  </p>
                </div>

                <div className="card-body p-4 p-md-5">
                  {user ? (
                    /* JIKA PENGGUNA SUDAH LOGIN */
                    <div className="text-center py-2">
                      <div
                        className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold mx-auto mb-3"
                        style={{ width: "68px", height: "68px", fontSize: "1.6rem" }}
                      >
                        {getInitials ? getInitials(user.name || user.username) : (user.avatarText || "U")}
                      </div>
                      <h5 className="fw-bold mb-1">{user.name}</h5>
                      <span className="badge bg-primary bg-opacity-10 text-primary mb-3">
                        {user.role || "Kontributor"}
                      </span>
                      <p className="text-muted small mb-4">
                        Sampeyan wis login minangka <strong>{user.username}</strong> ({user.email}).
                      </p>

                      <div className="d-grid gap-2">
                        <Link to="/profile" className="btn btn-primary py-2 fw-semibold rounded-3 shadow-sm">
                          <i className="bi bi-person-circle me-1"></i> Buka Halaman Profil
                        </Link>
                        <Link to="/dashboard" className="btn btn-light border py-2 fw-semibold rounded-3">
                          <i className="bi bi-journal-text me-1"></i> Ke Halaman Kamus
                        </Link>
                        <button
                          onClick={logout}
                          className="btn btn-outline-danger py-2 fw-semibold rounded-3 mt-2"
                        >
                          <i className="bi bi-box-arrow-right me-1"></i> Keluar (Logout)
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* JIKA PENGGUNA BELUM LOGIN (TAMPILKAN FORM) */
                    <>
                      {/* Banner Pemberitahuan Wajib Login */}
                      <div className="alert alert-warning py-2 px-3 small d-flex align-items-center gap-2 mb-3 rounded-3 border-warning">
                        <i className="bi bi-shield-lock-fill text-warning fs-5 flex-shrink-0"></i>
                        <div>
                          <strong>Wajib Login:</strong> Sampeyan kudu login dhisik kanggo mbukak & ndeleng Dashboard Kamus Slang Jawa!
                        </div>
                      </div>

                      {/* Tab Pilihan: Masuk vs Daftar Baru */}
                      <div className="d-flex border-bottom mb-4">
                        <button
                          type="button"
                          className={`btn flex-fill pb-2 rounded-0 border-0 fw-semibold ${
                            !isRegister ? "text-primary border-bottom border-primary border-3" : "text-muted"
                          }`}
                          onClick={() => handleSwitchTab(false)}
                        >
                          <i className="bi bi-box-arrow-in-right me-1"></i> Masuk
                        </button>
                        <button
                          type="button"
                          className={`btn flex-fill pb-2 rounded-0 border-0 fw-semibold ${
                            isRegister ? "text-primary border-bottom border-primary border-3" : "text-muted"
                          }`}
                          onClick={() => handleSwitchTab(true)}
                        >
                          <i className="bi bi-person-plus me-1"></i> Daftar Baru
                        </button>
                      </div>

                      {/* Formulir Input */}
                      {/* autoComplete="off" mencegah browser mengisi otomatis (autofill) username & password */}
                      <form onSubmit={handleSubmit} autoComplete="off">
                        {/* Kolom Nama Lengkap (Khusus Mode Daftar Baru) */}
                        {isRegister && (
                          <div className="mb-3">
                            <label className="form-label small fw-bold text-secondary">
                              Nama Lengkap
                            </label>
                            <div className="input-group">
                              <span className="input-group-text bg-light border-end-0">
                                <i className="bi bi-person text-muted"></i>
                              </span>
                              <input
                                type="text"
                                className="form-control border-start-0"
                                placeholder="Contoh: Joko Sudiro"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required={isRegister}
                                autoComplete="off"
                              />
                            </div>
                          </div>
                        )}

                        {/* Kolom Username */}
                        <div className="mb-3">
                          <label className="form-label small fw-bold text-secondary">
                            {isRegister ? "Username Akun" : "Username / Email"}
                          </label>
                          <div className="input-group">
                            <span className="input-group-text bg-light border-end-0">
                              <i className="bi bi-at text-muted"></i>
                            </span>
                            <input
                              type="text"
                              className="form-control border-start-0"
                              placeholder={isRegister ? "Contoh: mauriz_boso" : "Masukkan email utawa username"}
                              value={formData.username}
                              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                              required
                              autoComplete="off"
                            />
                          </div>
                        </div>

                        {/* Kolom Email (Khusus Mode Daftar Baru) */}
                        {isRegister && (
                          <div className="mb-3">
                            <label className="form-label small fw-bold text-secondary">
                              Alamat Email
                            </label>
                            <div className="input-group">
                              <span className="input-group-text bg-light border-end-0">
                                <i className="bi bi-envelope text-muted"></i>
                              </span>
                              <input
                                type="email"
                                className="form-control border-start-0"
                                placeholder="Contoh: mauriz@jawa.id"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required={isRegister}
                              />
                            </div>
                          </div>
                        )}

                        {/* Kolom Kata Sandi */}
                        <div className="mb-3">
                          <label className="form-label small fw-bold text-secondary">
                            Kata Sandi (Password)
                          </label>
                          <div className="input-group">
                            <span className="input-group-text bg-light border-end-0">
                              <i className="bi bi-key text-muted"></i>
                            </span>
                            <input
                              type={showPassword ? "text" : "password"}
                              className="form-control border-start-0 border-end-0"
                              placeholder="Kata sandi akun"
                              value={formData.password}
                              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                              required
                            />
                            {/* Tombol Lihat/Sembunyikan Sandi */}
                            <button
                              type="button"
                              className="btn btn-light border border-start-0 text-muted"
                              onClick={() => setShowPassword(!showPassword)}
                              aria-label="Toggle password"
                            >
                              <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                            </button>
                          </div>
                        </div>

                        {/* Baris Ingat Saya & Lupa Sandi */}
                        <div className="d-flex justify-content-between align-items-center mb-4 small">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="rememberCheck"
                              checked={formData.remember}
                              onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
                            />
                            <label className="form-check-label text-muted" htmlFor="rememberCheck">
                              Eling aku (Ingat saya)
                            </label>
                          </div>
                          <span className="text-primary text-decoration-none" style={{ cursor: "pointer" }}>
                            Lali sandi?
                          </span>
                        </div>

                        {/* Tombol Submit Utama */}
                        <button type="submit" className="btn btn-primary w-100 py-2 fw-bold rounded-3 shadow-sm mb-3">
                          <i className="bi bi-box-arrow-in-right me-1"></i>{" "}
                          {isRegister ? "Gawe Akun Saiki" : "Mlebu Saiki (Masuk)"}
                        </button>
                      </form>

                      {/* Tombol Akses Cepat untuk Pengujian / Demo Presentasi */}
                      <div className="mt-4 pt-3 border-top text-center">
                        <small className="text-muted d-block mb-2">⚡ Akses Cepat untuk Pengujian / Demo:</small>
                        <div className="d-flex justify-content-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleQuickLogin("Mas Joko", "joko_boso")}
                            className="btn btn-sm btn-outline-primary rounded-pill px-3 py-1"
                          >
                            <i className="bi bi-person-fill"></i> Mas Joko (Kontributor)
                          </button>
                          <button
                            type="button"
                            onClick={() => handleQuickLogin("Mbak Siti", "siti_arekan")}
                            className="btn btn-sm btn-outline-secondary rounded-pill px-3 py-1"
                          >
                            <i className="bi bi-person-fill"></i> Mbak Siti
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Status Kunci Dashboard */}
              <div className="text-center mt-3">
                {user ? (
                  <Link to="/dashboard" className="text-decoration-none text-primary small fw-semibold">
                    <i className="bi bi-arrow-right me-1"></i> Menyang Dashboard Kamus
                  </Link>
                ) : (
                  <span className="badge bg-light text-secondary border px-3 py-2 rounded-pill small fw-semibold">
                    <i className="bi bi-lock-fill text-warning me-1"></i> Dashboard dikunci sampai sampeyan login
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </IonContent>

      {/* Komponen Modal dan Alert Bawah */}
      <UsulkanKataModal />
      <ToastAlert />
      <BottomBar />
    </IonPage>
  );
};

export default Login;
