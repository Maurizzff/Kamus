/**
 * ==============================================================================
 * FILE: api.js (Service Helper Komunikasi HTTP ke Backend Laravel RESTful API)
 * ==============================================================================
 * 1. INI BUAT APA:
 *    Sebagai jembatan komunikasi jaringan (network bridge) antara Frontend Ionic React
 *    dengan Backend Laravel 12 API yang berjalan di port 8000.
 * 
 * 2. FUNGSINYA APA:
 *    - Menyimpan dan mengambil Bearer Token Sanctum dari browser localStorage.
 *    - Membungkus native Fetch API dalam fungsi generik `apiRequest` lengkap dengan
 *      header JSON dan header Authorization Bearer Token otomatis.
 *    - Menyediakan fungsi-fungsi spesifik pemanggilan endpoint:
 *      * loginApi: Mengirim username & password ke backend
 *      * registerApi: Mendaftarkan akun baru ke database MySQL
 *      * logoutApi: Menghapus token aktif di database backend
 *      * getWordsApi: Mengambil daftar kata slang (mendukung search & filter)
 *      * getWordDetailApi: Mengambil detail satu kata slang
 *      * addWordApi: Mengirim usulan kata slang baru (POST)
 *      * likeWordApi: Menambah jumlah apresiasi/like pada kata tertentu
 *      * getUserProfileApi: Mengambil biodata user yang sedang login
 * 
 * 3. AMBILNYA DARI MANA:
 *    - API_BASE_URL: URL server Laravel backend ('http://127.0.0.1:8000/api')
 *    - localStorage: Web Storage API bawaan browser untuk persistensi token
 *    - Fetch API: Fungsi bawaan JavaScript modern (`window.fetch`) untuk HTTP Request
 * ==============================================================================
 */

// INI BUAT APA: Alamat dasar (Base URL) backend API Laravel
// FUNGSINYA APA: Titik awalan URL untuk setiap panggilan endpoint REST API
// AMBILNYA DARI MANA: Server backend lokal Laravel yang dijalankan via 'php artisan serve'
const API_BASE_URL = "http://127.0.0.1:8000/api";

/**
 * INI BUAT APA: Mengambil token autentikasi Laravel Sanctum yang tersimpan
 * FUNGSINYA APA: Mengembalikan string token Bearer dari storage browser (atau null jika belum login)
 * AMBILNYA DARI MANA: Membaca kunci 'ksbj_token' dari localStorage browser
 */
export const getAuthToken = () => {
  try {
    return localStorage.getItem("ksbj_token");
  } catch {
    return null;
  }
};

/**
 * INI BUAT APA: Menyimpan atau menghapus token autentikasi di browser
 * FUNGSINYA APA: Menulis token ke storage saat login berhasil, atau menghapusnya saat logout
 * AMBILNYA DARI MANA: Menerima parameter `token` hasil respon login dari backend Laravel
 */
export const setAuthToken = (token) => {
  try {
    if (token) {
      localStorage.setItem("ksbj_token", token);
    } else {
      localStorage.removeItem("ksbj_token");
    }
  } catch (err) {
    console.error("Failed to save auth token", err);
  }
};

/**
 * INI BUAT APA: Wrapper generik untuk menjalankan HTTP Request menggunakan fetch()
 * FUNGSINYA APA:
 *   - Menyisipkan header Content-Type & Accept: application/json
 *   - Menyisipkan header Authorization: Bearer {token} bila user sedang login
 *   - Menyeragamkan penanganan response JSON dan deteksi status error HTTP (401, 422, 500)
 * AMBILNYA DARI MANA:
 *   - Parameter: endpoint (misal '/words'), method ('GET'/'POST'), data (payload request)
 *   - Mengakses API_BASE_URL dan getAuthToken()
 */
export const apiRequest = async (endpoint, method = "GET", data = null) => {
  // Ambil token tersimpan untuk dimasukkan ke header permintaan
  const token = getAuthToken();

  const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
  };

  // Jika token tersedia di browser, sertakan dalam format standar Bearer Token Sanctum
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  // Jika ada payload data dan bukan metode GET, konversi objek JavaScript menjadi string JSON
  if (data && method !== "GET") {
    config.body = JSON.stringify(data);
  }

  try {
    // Eksekusi HTTP Request ke Laravel
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const json = await response.json().catch(() => ({}));

    // Cek apakah server mengembalikan status sukses (200-299)
    if (!response.ok) {
      throw new Error(json.message || `Request gagal dengan status ${response.status}`);
    }

    return json;
  } catch (error) {
    console.warn(`[KSBJ API Warning] ${endpoint}:`, error.message);
    throw error;
  }
};

/* ==============================================================================
 * SPESIFIKASI FUNGSI PANGGILAN ENDPOINT API
 * ============================================================================== */

/**
 * INI BUAT APA: Melakukan proses masuk akun (Login)
 * FUNGSINYA APA: Mengirim username dan password ke endpoint POST /api/login di backend
 * AMBILNYA DARI MANA: Nilai input username & password dari form di halaman Login.jsx
 */
export const loginApi = async (username, password) => {
  return await apiRequest("/login", "POST", { username, password });
};

/**
 * INI BUAT APA: Melakukan pendaftaran akun pengguna baru (Register)
 * FUNGSINYA APA: Mengirim form pendaftaran (nama, email, username, password) ke POST /api/register
 * AMBILNYA DARI MANA: Data objek form pendaftaran dari state di halaman Login.jsx
 */
export const registerApi = async (formData) => {
  return await apiRequest("/register", "POST", formData);
};

/**
 * INI BUAT APA: Mengakhiri sesi login (Logout)
 * FUNGSINYA APA: Meminta backend mencabut/menghapus token akses Sanctum di POST /api/logout
 * AMBILNYA DARI MANA: Dipicu oleh tombol logout di TopBar, BottomBar, atau Profile
 */
export const logoutApi = async () => {
  return await apiRequest("/logout", "POST");
};

/**
 * INI BUAT APA: Menarik daftar seluruh kosakata slang dari database
 * FUNGSINYA APA: Mengirim permintaan GET /api/words dengan query pencarian (search) dan filter kategori
 * AMBILNYA DARI MANA: Parameter search (kata kunci input pencarian) dan category (pil kategori terpilih)
 */
export const getWordsApi = async (search = "", category = "Semua") => {
  let query = [];
  if (search) query.push(`search=${encodeURIComponent(search)}`);
  if (category && category !== "Semua") query.push(`category=${encodeURIComponent(category)}`);

  const qs = query.length > 0 ? `?${query.join("&")}` : "";
  return await apiRequest(`/words${qs}`, "GET");
};

/**
 * INI BUAT APA: Mengambil rincian informasi satu kata slang tertentu
 * FUNGSINYA APA: Mengakses endpoint GET /api/words/{slugOrId} untuk memuat definisi lengkap
 * AMBILNYA DARI MANA: Parameter slugOrId kata yang diklik oleh user di tampilan kamus
 */
export const getWordDetailApi = async (slugOrId) => {
  return await apiRequest(`/words/${slugOrId}`, "GET");
};

/**
 * INI BUAT APA: Menyimpan usulan kosakata slang baru ke database MySQL
 * FUNGSINYA APA: Mengirim data usulan kata melalui POST /api/words ke Laravel Controller
 * AMBILNYA DARI MANA: Form modal UsulkanKataModal.jsx (kata, kategori, daerah, arti, contoh)
 */
export const addWordApi = async (wordData) => {
  return await apiRequest("/words", "POST", wordData);
};

/**
 * INI BUAT APA: Memberikan apresiasi / Like pada suatu kata slang
 * FUNGSINYA APA: Mengirim perintah penambahan 1 count like ke POST /api/words/{slugOrId}/like
 * AMBILNYA DARI MANA: Tombol 'Apresiasi' di komponen WordCardDetail.jsx
 */
export const likeWordApi = async (slugOrId) => {
  return await apiRequest(`/words/${slugOrId}/like`, "POST");
};

/**
 * INI BUAT APA: Mengambil profil lengkap user yang sedang aktif
 * FUNGSINYA APA: Mengakses data diri pengguna dari endpoint terproteksi GET /api/user
 * AMBILNYA DARI MANA: Identitas token Bearer yang dikirimkan di header Authorization
 */
export const getUserProfileApi = async () => {
  return await apiRequest("/user", "GET");
};
