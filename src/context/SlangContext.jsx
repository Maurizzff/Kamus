/**
 * ==============================================================================
 * FILE: SlangContext.jsx (Pusat State Management Global Aplikasi KSBJ)
 * ==============================================================================
 * 1. INI BUAT APA:
 *    Sebagai pusat kendali data (Single Source of Truth) aplikasi. Menggunakan
 *    fitur React Context API agar data kosakata, status login user, pencarian,
 *    dan fungsi interaksi dapat diakses oleh semua halaman & komponen tanpa
 *    harus mengoper props secara manual (prop drilling).
 * 
 * 2. FUNGSINYA APA:
 *    - Menyimpan daftar kosakata (`words`), data user aktif (`user`), dan kata
 *      yang sedang dipilih untuk dilihat definisinya (`selectedWord`).
 *    - Mengelola query pencarian (`searchQuery`) dan filter kategori (`selectedCategory`).
 *    - Melakukan sinkronisasi data dua arah dengan backend Laravel API:
 *      * Menarik data terbaru via `fetchWordsFromApi`
 *      * Menambah kata baru via `addWord`
 *      * Memberi like/apresiasi via `likeWord`
 *      * Menangani proses login, register, dan logout
 *    - Menyediakan fallback data lokal (localStorage / INITIAL_SLANG_WORDS) jika
 *      server Laravel sewaktu-waktu belum dijalankan / offline.
 *    - Mengatur notifikasi melayang (`toastMessage`) dan modal usulan kata.
 * 
 * 3. AMBILNYA DARI MANA:
 *    - React Context & Hooks: 'react' (createContext, useContext, useState, useEffect)
 *    - Dataset Offline Awal: '../data/slangData' (INITIAL_SLANG_WORDS, INITIAL_USER)
 *    - Fungsi API HTTP: '../services/api' (loginApi, getWordsApi, addWordApi, dll.)
 *    - localStorage: Penyimpanan lokal browser untuk cache user dan kata
 * ==============================================================================
 */

// AMBIL DARI: Library React ('react')
// BUAT APA & FUNGSINYA: Mengimpor tools pembuatan context, hooks state, dan lifecycle effect
import React, { createContext, useContext, useState, useEffect } from "react";

// AMBIL DARI: File lokal '../data/slangData.js'
// BUAT APA & FUNGSINYA: Data cadangan awal kosakata dan profil default jika server backend offline
import { INITIAL_SLANG_WORDS, INITIAL_USER } from "../data/slangData";

// AMBIL DARI: File lokal '../services/api.js'
// BUAT APA & FUNGSINYA: Fungsi-fungsi pemanggil API Laravel RESTful
import {
  loginApi,
  logoutApi,
  registerApi,
  getWordsApi,
  addWordApi,
  likeWordApi,
  setAuthToken,
  getAuthToken,
} from "../services/api";

// INI BUAT APA: Membuat objek wadah Context React
// FUNGSINYA APA: Menjadi saluran penghubung data global di seluruh pohon komponen
// AMBILNYA DARI MANA: Fungsi createContext() dari library 'react'
const SlangContext = createContext();

/**
 * INI BUAT APA: Helper pembuat inisial avatar profil pengguna
 * FUNGSINYA APA:
 *   - 1 kata (misal 'moriz' atau 'siti'): menghasilkan 1 huruf kapital ('M', 'S')
 *   - 2 kata atau lebih (misal 'joko boso'): menghasilkan 2 huruf inisial ('JB')
 * AMBILNYA DARI MANA: String nama atau username pengguna
 */
export const getInitials = (name) => {
  if (!name || typeof name !== "string") return "U";
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "U";
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }
  return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
};

/**
 * KOMPONEN PROVIDER: SlangProvider
 * INI BUAT APA: Komponen pembungkus (wrapper) yang menyediakan state ke seluruh komponen anak
 * FUNGSINYA APA: Menginisialisasi seluruh state, logic effect, dan fungsi handler
 * AMBILNYA DARI MANA: Dipasang di dalam file App.jsx membungkus <IonApp>
 */
export const SlangProvider = ({ children }) => {
  // ----------------------------------------------------------------------------
  // STATE 1: DAFTAR KOSAKATA SLANG (words)
  // INI BUAT APA: Menyimpan seluruh array kata slang yang aktif ditampilkan di aplikasi
  // FUNGSINYA APA: Sumber data untuk list kata, pencarian, pagination, dan kartu detail
  // AMBILNYA DARI MANA: Pertama dibaca dari localStorage 'ksbj_words', jika kosong ambil dari INITIAL_SLANG_WORDS
  // ----------------------------------------------------------------------------
  const [words, setWords] = useState(() => {
    try {
      const saved = localStorage.getItem("ksbj_words");
      return saved ? JSON.parse(saved) : INITIAL_SLANG_WORDS;
    } catch {
      return INITIAL_SLANG_WORDS;
    }
  });

  // ----------------------------------------------------------------------------
  // STATE 2: PENGGUNA YANG SEDANG LOGIN (user)
  // INI BUAT APA: Menyimpan data sesi user yang sedang aktif
  // FUNGSINYA APA: Mengontrol hak akses (Proteksi Rute), jika bernilai null maka user dialihkan ke /login
  // AMBILNYA DARI MANA: Membaca cache sesi 'ksbj_user' dari localStorage browser
  // ----------------------------------------------------------------------------
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("ksbj_user");
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      if (parsed) {
        // Otomatis perbarui avatarText sesuai aturan inisial terbaru
        parsed.avatarText = getInitials(parsed.name || parsed.username);
      }
      return parsed;
    } catch {
      return null;
    }
  });

  // ----------------------------------------------------------------------------
  // STATE 3: KATA TERPILIH (selectedWordId)
  // INI BUAT APA: Menyimpan ID kata slang yang sedang dibuka penjelasannya
  // FUNGSINYA APA: Menentukan kata mana yang ditampilkan di kartu besar WordCardDetail
  // AMBILNYA DARI MANA: Default bernilai 'ambyar', berubah ketika user mengklik chip kata
  // ----------------------------------------------------------------------------
  const [selectedWordId, setSelectedWordId] = useState("ambyar");

  // ----------------------------------------------------------------------------
  // STATE 4 & 5: FILTER & PENCARIAN (searchQuery, selectedCategory)
  // INI BUAT APA: Menyimpan input teks pencarian dan pil kategori yang aktif
  // FUNGSINYA APA: Menyaring daftar kata yang ditampilkan pada Dashboard
  // AMBILNYA DARI MANA: Input form pencarian dan tombol kategori di halaman Dashboard.jsx
  // ----------------------------------------------------------------------------
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");

  // ----------------------------------------------------------------------------
  // STATE 6: MODAL STATUS (isSuggestModalOpen)
  // INI BUAT APA: Menentukan apakah popup form usulan kata sedang tampil atau tertutup
  // FUNGSINYA APA: Mengontrol visibilitas dialog modal UsulkanKataModal
  // AMBILNYA DARI MANA: Dikontrol tombol '+ Usulkan Kata' di TopBar, BottomBar, & Dashboard
  // ----------------------------------------------------------------------------
  const [isSuggestModalOpen, setIsSuggestModalOpen] = useState(false);

  // ----------------------------------------------------------------------------
  // STATE 7: NOTIFIKASI TOAST (toastMessage)
  // INI BUAT APA: Menyimpan pesan teks feedback sementara untuk pengguna
  // FUNGSINYA APA: Memberikan alert mengambang (floating toast) saat aksi berhasil
  // AMBILNYA DARI MANA: Dipicu oleh pemanggilan fungsi showToast(pesan)
  // ----------------------------------------------------------------------------
  const [toastMessage, setToastMessage] = useState(null);

  /**
   * INI BUAT APA: Menampilkan notifikasi melayang ke layar
   * FUNGSINYA APA: Mengisi state toastMessage lalu otomatis menghilangkannya setelah 4 detik
   * AMBILNYA DARI MANA: Menerima argumen string pesan dari berbagai aksi interaktif
   */
  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  /**
   * INI BUAT APA: Menarik data kosakata dari server Laravel Backend
   * FUNGSINYA APA: Memanggil getWordsApi() dan memperbarui state `words` dengan data real MySQL
   * AMBILNYA DARI MANA: Endpoint GET /api/words via service api.js
   */
  const fetchWordsFromApi = async () => {
    try {
      const res = await getWordsApi(searchQuery, selectedCategory);
      if (res && res.data && res.data.length > 0) {
        setWords(res.data);
      }
    } catch (err) {
      console.warn("Using cached/local slang data as fallback. Laravel server may be offline.");
    }
  };

  // ----------------------------------------------------------------------------
  // EFFECT 1: REAKTIF MENGAMBIL DATA KATA DARI API
  // INI BUAT APA: Memuat data kosakata secara otomatis
  // FUNGSINYA APA: Memanggil fetchWordsFromApi setiap kali user login atau kata kunci pencarian berubah
  // AMBILNYA DARI MANA: Bergantung pada dependency [user, searchQuery, selectedCategory]
  // ----------------------------------------------------------------------------
  useEffect(() => {
    if (user) {
      fetchWordsFromApi();
    }
  }, [user, searchQuery, selectedCategory]);

  // ----------------------------------------------------------------------------
  // EFFECT 2: PERSISTENSI KATA KE LOCAL STORAGE
  // INI BUAT APA: Menyimpan cache kata slang di memori browser
  // FUNGSINYA APA: Memastikan data tetap tersimpan saat halaman di-refresh (F5)
  // AMBILNYA DARI MANA: Membaca perubahan state `words`
  // ----------------------------------------------------------------------------
  useEffect(() => {
    try {
      localStorage.setItem("ksbj_words", JSON.stringify(words));
    } catch (err) {
      console.error("Failed to save words", err);
    }
  }, [words]);

  // ----------------------------------------------------------------------------
  // EFFECT 3: PERSISTENSI SESI PENGGUNA (USER)
  // INI BUAT APA: Menyimpan atau membersihkan data profil login user di localStorage
  // FUNGSINYA APA: Menjaga status login tetap bertahan, atau mencabut token saat logout
  // AMBILNYA DARI MANA: Membaca perubahan state `user`
  // ----------------------------------------------------------------------------
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem("ksbj_user", JSON.stringify(user));
      } else {
        localStorage.removeItem("ksbj_user");
        setAuthToken(null);
      }
    } catch (err) {
      console.error("Failed to save user", err);
    }
  }, [user]);

  /**
   * INI BUAT APA: Menambahkan usulan kata slang baru
   * FUNGSINYA APA:
   *   1. Mengirim data kata ke backend Laravel API (POST /api/words)
   *   2. Menyimpan hasil respon ke daftar kata (`words`) paling atas (unshift)
   *   3. Mengarahkan kartu terpilih ke kata baru tersebut
   *   4. Menambah poin reputasi kontributor
   *   5. Jika server offline, otomatis beralih ke fallback penyimpanan lokal
   * AMBILNYA DARI MANA: Data objek form dari komponen UsulkanKataModal.jsx
   */
  const addWord = async (newWordData) => {
    try {
      // 1. Kirim ke backend Laravel API
      const res = await addWordApi({
        word: newWordData.word,
        emoji: newWordData.emoji || "✨",
        category: newWordData.category || "Ungkapan",
        region: newWordData.region || "Jawa",
        definition: newWordData.definition,
        example: newWordData.example,
        proposerName: user ? user.name : (newWordData.proposerName || "Kontributor Tamu"),
      });

      const savedWord = res.data;
      setWords((prev) => [savedWord, ...prev]);
      setSelectedWordId(savedWord.id);
      showToast(`Kosakata "${savedWord.word}" kasil kasimpen ing database MySQL! Matur nuwun!`);

      // Tambahkan poin reputasi kontributor jika user login
      if (user) {
        setUser((prevUser) => ({
          ...prevUser,
          contributedCount: (prevUser.contributedCount || 0) + 1,
          reputationPoints: (prevUser.reputationPoints || 100) + 50,
        }));
      }
      return savedWord;
    } catch (error) {
      // Cadangan fallback bila server Laravel API offline
      console.warn("API error while adding word, falling back to local state:", error.message);
      const slug = newWordData.word.toLowerCase().replace(/[^a-z0-9]/g, "-");
      const fallbackWord = {
        id: slug + "-" + Date.now().toString().slice(-4),
        word: newWordData.word.trim(),
        emoji: newWordData.emoji || "✨",
        category: newWordData.category || "Ungkapan",
        region: newWordData.region || "Jawa",
        definition: newWordData.definition.trim(),
        example: newWordData.example ? newWordData.example.trim() : "",
        proposedBy: {
          name: user ? user.name : (newWordData.proposerName || "Kontributor Tamu"),
          date: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
          avatarText: user ? user.avatarText : "KT",
        },
        likes: 1,
        tags: [newWordData.word.toLowerCase(), newWordData.category.toLowerCase(), "slang"],
      };

      setWords((prev) => [fallbackWord, ...prev]);
      setSelectedWordId(fallbackWord.id);
      showToast(`Kosakata "${fallbackWord.word}" berhasil diusulkan! (Mode Offline)`);
      return fallbackWord;
    }
  };

  /**
   * INI BUAT APA: Menambah jumlah apresiasi / Like pada kata slang
   * FUNGSINYA APA:
   *   - Melakukan Optimistic UI update (angka like langsung naik di layar tanpa menunggu jaringan)
   *   - Mengirim request penambahan like ke backend POST /api/words/{id}/like
   * AMBILNYA DARI MANA: Parameter `id` kata dari tombol apresiasi di WordCardDetail.jsx
   */
  const likeWord = async (id) => {
    // Optimistic UI update agar animasi terasa cepat seketika
    setWords((prev) =>
      prev.map((w) => (w.id === id ? { ...w, likes: (w.likes || 0) + 1 } : w))
    );
    showToast("Matur nuwun atas apresiasinya! 👍");

    try {
      await likeWordApi(id);
    } catch (err) {
      console.warn("Like API sync warning:", err.message);
    }
  };

  /**
   * INI BUAT APA: Menampung aksi laporan kesalahan kata dari pengguna
   * FUNGSINYA APA: Memunculkan konfirmasi penerimaan laporan peninjauan definisi
   * AMBILNYA DARI MANA: Tombol 'Laporkan kesalahan' di WordCardDetail.jsx
   */
  const reportWord = (id) => {
    showToast("Laporan telah diterima. Tim admin KSBJ akan meninjau definisi kata ini.");
  };

  /**
   * INI BUAT APA: Mengaktifkan/menonaktifkan kata favorit untuk user yang sedang aktif
   * FUNGSINYA APA: Menambah ID kata ke array `favoriteWords` atau menghapusnya jika sudah ada
   * AMBILNYA DARI MANA: Parameter `wordId` dari tombol bintang simpan favorit
   */
  const toggleFavorite = (wordId) => {
    if (!user) {
      showToast("Silakan login terlebih dahulu untuk menyimpan kata favorit!");
      return;
    }
    const currentFavs = user.favoriteWords || [];
    let updated;
    if (currentFavs.includes(wordId)) {
      updated = currentFavs.filter((id) => id !== wordId);
      showToast("Kata dihapus dari favorit.");
    } else {
      updated = [...currentFavs, wordId];
      showToast("Kata ditambahkan ke daftar favorit! ⭐");
    }
    setUser({ ...user, favoriteWords: updated });
  };

  /**
   * INI BUAT APA: Menangani autentikasi masuk (Login)
   * FUNGSINYA APA:
   *   - Memanggil `loginApi` ke backend Laravel
   *   - Menyimpan Bearer Token Sanctum yang diterima
   *   - Menyimpan objek data user ke state `user`
   *   - Menyediakan fallback data demo jika backend belum dijalankan
   * AMBILNYA DARI MANA: Parameter `emailOrUsername` & `password` dari halaman Login.jsx
   */
  const login = async (emailOrUsername, password) => {
    try {
      const res = await loginApi(emailOrUsername, password);
      // Simpan Token Sanctum jika ada
      if (res.token) {
        setAuthToken(res.token);
      }
      const userData = {
        ...res.user,
        avatarText: getInitials(res.user.name || res.user.username),
      };
      setUser(userData);
      showToast(`Sugeng rawuh, ${res.user.name}! Berhasil masuk via Laravel API.`);
      return true;
    } catch (error) {
      console.warn("API Login failed, testing offline demo fallback:", error.message);

      // Fallback demo lancar saat pengujian jika server backend belum di-run
      const rawName = emailOrUsername.includes("@") ? emailOrUsername.split("@")[0] : emailOrUsername;
      const isKnownJoko = rawName.toLowerCase() === "joko_boso" || rawName.toLowerCase() === "joko";
      const isKnownSiti = rawName.toLowerCase() === "siti_arekan" || rawName.toLowerCase() === "siti";
      const displayName = isKnownJoko ? "Joko Sudiro" : isKnownSiti ? "Siti Rahmawati" : rawName;

      const loggedUser = {
        id: "user-" + rawName.toLowerCase(),
        name: displayName,
        username: rawName.toLowerCase(),
        email: emailOrUsername.includes("@") ? emailOrUsername : `${rawName}@jawa.id`,
        bio: isKnownJoko
          ? INITIAL_USER.bio
          : "Pecinta dialek bahasa gaul dan slang Jawa.",
        role: isKnownJoko ? INITIAL_USER.role : "Kontributor",
        region: isKnownJoko ? INITIAL_USER.region : "Jawa",
        avatarText: getInitials(displayName),
        contributedCount: isKnownJoko ? INITIAL_USER.contributedCount : 0,
        reputationPoints: isKnownJoko ? INITIAL_USER.reputationPoints : 100,
        joinedDate: "Terbaru",
        favoriteWords: isKnownJoko ? INITIAL_USER.favoriteWords : [],
      };
      setUser(loggedUser);
      showToast(`Sugeng rawuh, ${loggedUser.name}! (Catatan: Pastikan 'php artisan serve' aktif untuk integrasi penuh).`);
      return true;
    }
  };

  /**
   * INI BUAT APA: Menangani registrasi akun baru
   * FUNGSINYA APA:
   *   - Memanggil `registerApi` untuk membuat user baru di database MySQL backend (POST /api/register)
   *   - Jika server Laravel offline (misal php artisan serve belum dinyalakan), otomatis
   *     mengaktifkan fallback akun lokal agar pengujian aplikasi tetap berjalan lancar tanpa error "failed to fetch"
   * AMBILNYA DARI MANA: Objek `formData` (nama, username, email, password) dari form Login.jsx
   */
  const register = async (formData) => {
    try {
      const res = await registerApi(formData);
      if (res.token) {
        setAuthToken(res.token);
      }
      const userData = {
        ...res.user,
        avatarText: getInitials(res.user.name || res.user.username),
      };
      setUser(userData);
      showToast("Registrasi berhasil! Akun tersimpan di database MySQL.");
      return true;
    } catch (error) {
      console.warn("Register API failed, using offline fallback:", error.message);

      // Fallback akun lokal agar pengujian tetap bisa berjalan saat backend Laravel belum dinyalakan
      const cleanUsername = (formData.username || "pengguna").toLowerCase().replace(/\s+/g, "_");
      const cleanName = formData.name || formData.username || "Kontributor";
      const newUser = {
        id: "user-" + cleanUsername,
        name: cleanName,
        username: cleanUsername,
        email: formData.email || `${cleanUsername}@jawa.id`,
        bio: "Anggota anyar komunitas Kamus Slang Basa Jawa.",
        role: "Kontributor Anyar",
        region: "Jawa",
        avatarText: getInitials(cleanName),
        contributedCount: 0,
        reputationPoints: 50,
        joinedDate: "Dina iki",
        favoriteWords: [],
      };

      setUser(newUser);
      showToast(`Sugeng rawuh, ${newUser.name}! Akun kasil digawe (Catatan: Jalankan 'php artisan serve' kanggo nyimpen ing database MySQL).`);
      return true;
    }
  };

  /**
   * INI BUAT APA: Menangani keluar dari akun (Logout)
   * FUNGSINYA APA: Menghapus token di backend, mengosongkan state user, dan menghapus cache localStorage
   * AMBILNYA DARI MANA: Tombol logout di TopBar, BottomBar, atau halaman Profile.jsx
   */
  const logout = async () => {
    try {
      await logoutApi();
    } catch (err) {
      console.warn("Logout error:", err.message);
    }
    setUser(null);
    setAuthToken(null);
    try {
      localStorage.removeItem("ksbj_user");
      localStorage.removeItem("ksbj_token");
    } catch (err) {
      console.error(err);
    }
    showToast("Sampeyan wis metu (berhasil logout).");
  };

  // INI BUAT APA: Menghitung objek kata terpilih
  // FUNGSINYA APA: Mencari objek lengkap dari array `words` berdasarkan `selectedWordId`
  // AMBILNYA DARI MANA: Pencarian pada array `words`
  const selectedWord = words.find((w) => w.id === selectedWordId) || words[0];

  return (
    // INI BUAT APA: Komponen Provider Context
    // FUNGSINYA APA: Membagikan nilai variabel dan fungsi handler ke seluruh child component
    // AMBILNYA DARI MANA: SlangContext.Provider
    <SlangContext.Provider
      value={{
        words,
        user,
        selectedWordId,
        setSelectedWordId,
        selectedWord,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        isSuggestModalOpen,
        setIsSuggestModalOpen,
        toastMessage,
        showToast,
        addWord,
        likeWord,
        reportWord,
        toggleFavorite,
        login,
        register,
        logout,
        fetchWordsFromApi,
        getInitials,
      }}
    >
      {children}
    </SlangContext.Provider>
  );
};

/**
 * CUSTOM HOOK: useSlang()
 * INI BUAT APA: Shortcut untuk mempermudah pemanggilan SlangContext di komponen manapun
 * FUNGSINYA APA: Membungkus useContext(SlangContext) sehingga komponen tinggal memanggil useSlang()
 * AMBILNYA DARI MANA: useContext hook dari React
 */
export const useSlang = () => useContext(SlangContext);
