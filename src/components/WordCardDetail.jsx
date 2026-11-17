/**
 * ==============================================================================
 * FILE: WordCardDetail.jsx (Komponen Kartu Detail Kosakata & Aksi Interaktif)
 * ==============================================================================
 * 1. INI BUAT APA:
 *    Sebagai kartu informasi utama (Detail View) yang menampilkan penjelasan mendalam
 *    dari kosakata slang Jawa yang sedang aktif dipilih oleh pengguna.
 * 
 * 2. FUNGSINYA APA:
 *    - Menampilkan data lengkap kata:
 *      * Badge kategori tata bahasa dan asal dialek/wilayah
 *      * Judul kosakata besar disertai ikon emoji khas
 *      * Paragraf definisi / arti kata dalam bahasa Indonesia
 *      * Kotak kutipan contoh percakapan nyata (Tuladha / Contoh Kalimat)
 *      * Identitas pengusul (avatar lingkaran, nama, dan tanggal rilis)
 *    - Menyediakan 4 tombol aksi interaktif:
 *      * Laporkan kesalahan (Report issue)
 *      * Apresiasi / Like (Sinkron ke backend Laravel API)
 *      * Simpan Favorit (Menyimpan kata ke profil akun pengguna)
 *      * Bagikan (Menyalin arti kata dan contoh ke clipboard browser)
 *    - Menampilkan deretan kata-kata populer dengan jumlah likes tertinggi.
 * 
 * 3. AMBILNYA DARI MANA:
 *    - React: Library 'react'
 *    - useSlang: State context dari '../context/SlangContext'
 *    - Props: `word` (objek kata yang dipilih) dan `onBackToTop` (fungsi scroll ke atas)
 * ==============================================================================
 */

// AMBIL DARI: Library React ('react')
// BUAT APA & FUNGSINYA: Library pembuatan antarmuka React
import React from "react";

// AMBIL DARI: Berkas '../context/SlangContext'
// BUAT APA & FUNGSINYA: Mengambil fungsi like, report, favorite, data user, dan seluruh daftar kata
import { useSlang } from "../context/SlangContext";

const WordCardDetail = ({ word, onBackToTop }) => {
  // Ambil data dan aksi dari global context
  const { setSelectedWordId, likeWord, reportWord, toggleFavorite, user, words } = useSlang();

  // Jika belum ada kata yang dipilih, jangan render apapun
  if (!word) return null;

  // INI BUAT APA: Mengetahui apakah kata ini sudah ditandai bintang favorit oleh user
  // FUNGSINYA APA: Mengubah warna tombol bintang menjadi kuning aktif ('btn-warning')
  // AMBILNYA DARI MANA: Pengecekan array user.favoriteWords
  const isFavorite = user?.favoriteWords?.includes(word.id);

  // INI BUAT APA: Menghitung 8 kata terpopuler berdasarkan total like
  // FUNGSINYA APA: Menampilkan rekomendasi kata trending di bagian bawah kartu
  // AMBILNYA DARI MANA: Mengurutkan (sort descending) array `words` dari SlangContext
  const popularWords = [...words]
    .sort((a, b) => (b.likes || 0) - (a.likes || 0))
    .slice(0, 8);

  /**
   * INI BUAT APA: Membagikan definisi kata ke aplikasi lain
   * FUNGSINYA APA: Mengopi teks definisi dan contoh ke clipboard perangkat (Clipboard API)
   * AMBILNYA DARI MANA: API browser bawaan `navigator.clipboard.writeText`
   */
  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `Kamus Slang Jawa: "${word.word}" ${word.emoji}\nDefinisi: ${word.definition}\nContoh: "${word.example || '-'}"`
      );
      alert("Arti kata berhasil disalin ke clipboard!");
    }
  };

  return (
    <div className="word-detail-container">
      {/* Tombol Navigasi Kembali ke Daftar Atas */}
      <div className="mb-3">
        <button
          onClick={onBackToTop}
          className="btn btn-link text-decoration-none text-secondary p-0 fw-semibold d-inline-flex align-items-center gap-1"
        >
          <i className="bi bi-arrow-left"></i> Semua kata
        </button>
      </div>

      {/* KARTU UTAMA DETAIL KOSAKATA */}
      <div className="ksbj-detail-card mb-4">
        {/* Badge Kategori & Asal Wilayah */}
        <div>
          <span className="ksbj-category-pill">
            <i className="bi bi-tag-fill me-1"></i> {word.category}
          </span>
          {word.region && (
            <span className="badge bg-light text-secondary border ms-2 py-1 px-2 rounded-pill">
              📍 {word.region}
            </span>
          )}
        </div>

        {/* Judul Kosakata & Emoji */}
        <h1 className="ksbj-word-heading">
          {word.word} <span className="ms-1">{word.emoji}</span>
        </h1>

        {/* Paragraf Definisi / Arti Kata */}
        <div className="mb-4">
          <div className="ksbj-definition-title">Definisi</div>
          <p className="ksbj-definition-text">{word.definition}</p>
        </div>

        {/* Kotak Contoh Kalimat (Tuladha) */}
        {word.example && (
          <div className="ksbj-example-box">
            <div className="small fw-bold text-primary mb-1">
              <i className="bi bi-chat-quote-fill me-1"></i> Tuladha / Contoh Kalimat:
            </div>
            <div className="fst-italic text-dark">"{word.example}"</div>
          </div>
        )}

        {/* Deretan Tombol Aksi Interaktif */}
        <div className="d-flex flex-wrap align-items-center gap-2 mb-4 pt-2">
          {/* Aksi 1: Laporkan Kesalahan */}
          <button
            onClick={() => reportWord(word.id)}
            className="btn btn-primary fw-semibold px-3 py-2 rounded-3 shadow-sm d-flex align-items-center gap-2"
          >
            <i className="bi bi-flag"></i> Laporkan kesalahan
          </button>

          {/* Aksi 2: Berikan Apresiasi / Like */}
          <button
            onClick={() => likeWord(word.id)}
            className="btn btn-outline-secondary fw-semibold px-3 py-2 rounded-3 d-flex align-items-center gap-2"
          >
            <i className="bi bi-heart-fill text-danger"></i> Apresiasi ({word.likes || 0})
          </button>

          {/* Aksi 3: Simpan ke Favorit Pengguna */}
          <button
            onClick={() => toggleFavorite(word.id)}
            className={`btn ${isFavorite ? "btn-warning text-dark fw-bold" : "btn-outline-secondary"} px-3 py-2 rounded-3 d-flex align-items-center gap-2`}
          >
            <i className={`bi ${isFavorite ? "bi-star-fill text-dark" : "bi-star"}`}></i>
            {isFavorite ? "Tersimpan" : "Simpan"}
          </button>

          {/* Aksi 4: Salin / Bagikan ke Clipboard */}
          <button
            onClick={handleShare}
            className="btn btn-outline-secondary px-3 py-2 rounded-3 d-flex align-items-center gap-1"
            title="Bagikan arti kata"
          >
            <i className="bi bi-share"></i>
          </button>
        </div>

        {/* Bagian Identitas Kontributor Pengusul */}
        <div className="border-top pt-4">
          <div className="small text-muted fw-semibold mb-2">Diusulkan oleh</div>
          <div className="d-flex align-items-center gap-3">
            {/* Lingkaran Avatar Pengusul */}
            <div className="ksbj-contributor-circle">
              {word.proposedBy?.avatarText || "KT"}
            </div>
            {/* Nama & Tanggal Usulan */}
            <div>
              <div className="fw-bold text-dark">{word.proposedBy?.name || "Kontributor Anonim"}</div>
              <small className="text-muted">Pada {word.proposedBy?.date || "Terbaru"}</small>
            </div>
          </div>
        </div>
      </div>

      {/* Bagian Rekomendasi Kata Populer */}
      <div className="mt-4">
        <h6 className="fw-bold text-secondary mb-3">
          <i className="bi bi-fire text-danger me-1"></i> Kata Populer
        </h6>
        <div className="d-flex flex-wrap gap-2">
          {popularWords.map((popWord) => (
            <button
              key={popWord.id}
              onClick={() => {
                setSelectedWordId(popWord.id);
                onBackToTop();
              }}
              className={`ksbj-word-badge ${popWord.id === word.id ? "active" : ""}`}
            >
              <span>{popWord.word}</span>
              <span>{popWord.emoji}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WordCardDetail;
