/**
 * ==============================================================================
 * FILE: UsulkanKataModal.jsx (Komponen Modal Dialog Formulir Pengajuan Kosakata)
 * ==============================================================================
 * 1. INI BUAT APA:
 *    Sebagai jendela sembulan (popup modal dialog) interaktif yang berisi formulir
 *    lengkap bagi pengguna untuk mengusulkan kosakata slang bahasa Jawa baru.
 * 
 * 2. FUNGSINYA APA:
 *    - Mengumpulkan data input kata:
 *      * Nama kata slang (wajib)
 *      * Pilihan emoji ekspresi
 *      * Kategori kata (Ungkapan, Kata Sifat, Kata Kerja, Kata Benda, Seruan)
 *      * Asal dialek / wilayah pulau Jawa
 *      * Definisi atau arti kata yang jelas (wajib)
 *      * Contoh kalimat dalam percakapan sehari-hari
 *      * Nama kontributor pengusul
 *    - Melakukan validasi kolom wajib (jika kosong, tampilkan alert error).
 *    - Memanggil fungsi `addWord(formData)` di SlangContext untuk dikirimkan ke
 *      database backend Laravel MySQL.
 *    - Menutup jendela modal dan mereset form jika pengajuan berhasil.
 * 
 * 3. AMBILNYA DARI MANA:
 *    - React: Library 'react' (useState)
 *    - useSlang: Custom hook dari '../context/SlangContext'
 * ==============================================================================
 */

// AMBIL DARI: Library React ('react')
// BUAT APA & FUNGSINYA: Mengimpor React dan useState untuk mengelola state input form lokal
import React, { useState } from "react";

// AMBIL DARI: Berkas '../context/SlangContext'
// BUAT APA & FUNGSINYA: Mengakses fungsi penambah kata `addWord`, status modal `isSuggestModalOpen`, dan data `user`
import { useSlang } from "../context/SlangContext";

// INI BUAT APA: Daftar pilihan opsi emoji ekspresi
// FUNGSINYA APA: Mempercantik visualisasi kata slang sesuai nuansa perasaan yang diwakili
// AMBILNYA DARI MANA: Array konstanta lokal
const EMOJI_OPTIONS = ["😎", "💔", "🥀", "😩", "🥴", "🥺", "🤪", "🕳️", "🤝", "🥰", "😵", "🗣️", "👍", "🤷‍♂️", "😏", "😂", "🤦‍♂️", "😢", "🔥", "✨"];

// INI BUAT APA: Klasifikasi jenis kata tata bahasa
// FUNGSINYA APA: Mengisi opsi dropdown pemilihan kategori kosakata
// AMBILNYA DARI MANA: Array konstanta lokal
const CATEGORIES = ["Ungkapan", "Kata Sifat", "Kata Kerja", "Kata Benda", "Seruan"];

// INI BUAT APA: Klasifikasi wilayah geografis dialek Jawa
// FUNGSINYA APA: Mengisi opsi dropdown asal daerah dialek kata
// AMBILNYA DARI MANA: Array konstanta lokal
const REGIONS = ["Umum Jawa", "Surabaya / Arekan", "Yogyakarta", "Solo / Surakarta", "Semarang", "Banyumasan / Ngapak"];

const UsulkanKataModal = () => {
  // Ambil state dan fungsi handler dari context
  const { isSuggestModalOpen, setIsSuggestModalOpen, addWord, user } = useSlang();

  // INI BUAT APA: State penampung nilai form input pengguna
  // FUNGSINYA APA: Mengontrol two-way data binding pada seluruh input form modal
  // AMBILNYA DARI MANA: Inisialisasi awal objek state lokal React
  const [form, setForm] = useState({
    word: "",
    emoji: "😎",
    category: "Ungkapan",
    region: "Umum Jawa",
    definition: "",
    example: "",
    proposerName: user ? user.name : ""
  });

  // INI BUAT APA: State pesan error validasi form
  // FUNGSINYA APA: Menampilkan alert merah jika ada kolom penting yang belum diisi
  // AMBILNYA DARI MANA: Diisi saat validasi di handleSubmit gagal
  const [error, setError] = useState("");

  // Jika status modal ditutup, jangan render elemen apapun ke DOM
  if (!isSuggestModalOpen) return null;

  /**
   * INI BUAT APA: Handler tombol pengiriman form 'Kirim Usulan'
   * FUNGSINYA APA:
   *   1. Mencegah reload halaman browser (e.preventDefault())
   *   2. Memeriksa kelengkapan kata dan definisi
   *   3. Mengirimkan objek data ke addWord()
   *   4. Mengosongkan form kembali dan menutup jendela modal
   * AMBILNYA DARI MANA: Event submit form HTML
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validasi kata slang
    if (!form.word.trim()) {
      setError("Silakan masukkan kosakata slang!");
      return;
    }
    // Validasi definisi arti
    if (!form.definition.trim()) {
      setError("Silakan berikan definisi atau arti kosakata tersebut!");
      return;
    }

    // Eksekusi fungsi penambahan kata ke context & backend Laravel API
    addWord({
      ...form,
      proposerName: user ? user.name : (form.proposerName.trim() || "Kontributor Tamu")
    });

    // Reset isi form dan bersihkan pesan error
    setForm({
      word: "",
      emoji: "😎",
      category: "Ungkapan",
      region: "Umum Jawa",
      definition: "",
      example: "",
      proposerName: user ? user.name : ""
    });
    setError("");

    // Tutup dialog modal
    setIsSuggestModalOpen(false);
  };

  return (
    // Backdrop gelap di belakang modal, klik di luar akan menutup modal
    <div className="ksbj-modal-backdrop" onClick={() => setIsSuggestModalOpen(false)}>
      {/* Konten Kotak Dialog Modal (Mencegah klik di dalam menutup modal) */}
      <div
        className="ksbj-modal-content p-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Modal */}
        <div className="d-flex align-items-center justify-content-between pb-3 mb-3 border-bottom">
          <div className="d-flex align-items-center gap-2">
            <span className="badge bg-primary bg-opacity-10 text-primary p-2 rounded-circle">
              <i className="bi bi-chat-heart-fill fs-5"></i>
            </span>
            <div>
              <h5 className="mb-0 fw-bold">Usulkan Kata Slang Jawa</h5>
              <small className="text-muted">Bantu perkaya kosakata bahasa gaul Jawa terupdate</small>
            </div>
          </div>
          {/* Tombol Silang (X) Penutup */}
          <button
            type="button"
            className="btn-close"
            onClick={() => setIsSuggestModalOpen(false)}
            aria-label="Tutup"
          ></button>
        </div>

        {/* Notifikasi Peringatan Jika Validasi Gagal */}
        {error && (
          <div className="alert alert-danger py-2 px-3 small d-flex align-items-center gap-2">
            <i className="bi bi-exclamation-triangle-fill"></i> {error}
          </div>
        )}

        {/* Form Pengajuan Kosakata Baru */}
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            {/* Input 1: Kosakata Slang (Wajib) */}
            <div className="col-8">
              <label className="form-label small fw-bold text-secondary">
                Kosakata Slang <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Misal: Mletre, Cidro, Sambat..."
                value={form.word}
                onChange={(e) => setForm({ ...form, word: e.target.value })}
                required
              />
            </div>

            {/* Input 2: Pilihan Emoji */}
            <div className="col-4">
              <label className="form-label small fw-bold text-secondary">Emoji</label>
              <select
                className="form-select"
                value={form.emoji}
                onChange={(e) => setForm({ ...form, emoji: e.target.value })}
              >
                {EMOJI_OPTIONS.map((em) => (
                  <option key={em} value={em}>
                    {em}
                  </option>
                ))}
              </select>
            </div>

            {/* Input 3: Kategori Kata */}
            <div className="col-6">
              <label className="form-label small fw-bold text-secondary">Kategori Kata</label>
              <select
                className="form-select"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Input 4: Wilayah / Asal Dialek */}
            <div className="col-6">
              <label className="form-label small fw-bold text-secondary">Asal / Wilayah</label>
              <select
                className="form-select"
                value={form.region}
                onChange={(e) => setForm({ ...form, region: e.target.value })}
              >
                {REGIONS.map((reg) => (
                  <option key={reg} value={reg}>
                    {reg}
                  </option>
                ))}
              </select>
            </div>

            {/* Input 5: Definisi / Arti Kata (Wajib) */}
            <div className="col-12">
              <label className="form-label small fw-bold text-secondary">
                Definisi / Arti Kata <span className="text-danger">*</span>
              </label>
              <textarea
                className="form-control"
                rows="3"
                placeholder="Jelaskan arti, makna, dan konteks penggunaan kata slang ini..."
                value={form.definition}
                onChange={(e) => setForm({ ...form, definition: e.target.value })}
                required
              ></textarea>
            </div>

            {/* Input 6: Contoh Kalimat Penggunaan (Opsional) */}
            <div className="col-12">
              <label className="form-label small fw-bold text-secondary">Contoh Kalimat (Opsional)</label>
              <textarea
                className="form-control"
                rows="2"
                placeholder="Contoh: 'Ojo sambat terus lur, ayo semangat kerjo!'"
                value={form.example}
                onChange={(e) => setForm({ ...form, example: e.target.value })}
              ></textarea>
            </div>

            {/* Input 7: Nama Pengusul (Otomatis terisi jika login, manual jika tamu) */}
            {!user && (
              <div className="col-12">
                <label className="form-label small fw-bold text-secondary">Nama Sampeyan (Opsional)</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Misal: Cak Slamet / Anonim"
                  value={form.proposerName}
                  onChange={(e) => setForm({ ...form, proposerName: e.target.value })}
                />
              </div>
            )}
          </div>

          {/* Tombol Aksi Batal dan Kirim */}
          <div className="d-flex justify-content-end gap-2 mt-4 pt-3 border-top">
            <button
              type="button"
              className="btn btn-light px-3 fw-semibold"
              onClick={() => setIsSuggestModalOpen(false)}
            >
              Batal
            </button>
            <button type="submit" className="btn btn-primary px-4 fw-bold shadow-sm">
              <i className="bi bi-send-check me-1"></i> Kirim Usulan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UsulkanKataModal;
