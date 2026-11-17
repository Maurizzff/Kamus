/**
 * ==============================================================================
 * FILE: ToastAlert.jsx (Komponen Notifikasi Mengambang / Floating Toast Alert)
 * ==============================================================================
 * 1. INI BUAT APA:
 *    Sebagai komponen visual umpan balik (feedback) melayang di bagian bawah layar
 *    untuk mengabari pengguna bahwa suatu aksi telah berhasil atau membutuhkan perhatian.
 * 
 * 2. FUNGSINYA APA:
 *    - Membaca pesan teks yang tersimpan di state `toastMessage` pada SlangContext.
 *    - Jika `toastMessage === null`, komponen tidak akan me-render apapun (return null).
 *    - Jika ada pesan, menampilkan kapsul pill bernuansa dark yang elegan dengan
 *      ikon seru kuning (`bi-info-circle-fill`).
 * 
 * 3. AMBILNYA DARI MANA:
 *    - React: Library 'react'
 *    - useSlang: State context dari '../context/SlangContext' (mengambil nilai `toastMessage`)
 *    - Styling CSS: Kelas `.ksbj-floating-toast` dari '../theme/custom.css' & Bootstrap
 * ==============================================================================
 */

// AMBIL DARI: Library React ('react')
// BUAT APA & FUNGSINYA: Library pembuatan komponen antarmuka React
import React from "react";

// AMBIL DARI: Berkas '../context/SlangContext'
// BUAT APA & FUNGSINYA: Mengakses variabel string `toastMessage` dari context global
import { useSlang } from "../context/SlangContext";

const ToastAlert = () => {
  // Ambil teks pesan toast saat ini dari context
  const { toastMessage } = useSlang();

  // Jika tidak ada notifikasi yang aktif, sembunyikan komponen dari layar
  if (!toastMessage) return null;

  return (
    // Wadah melayang dengan posisi fixed di tengah bawah layar
    <div className="ksbj-floating-toast">
      <div className="alert alert-dark bg-dark text-white border-0 py-2 px-3 rounded-pill shadow-lg d-flex align-items-center gap-2">
        {/* Ikon penanda informasi */}
        <i className="bi bi-info-circle-fill text-warning fs-5"></i>
        {/* Konten teks notifikasi dinamis */}
        <span className="small fw-semibold">{toastMessage}</span>
      </div>
    </div>
  );
};

export default ToastAlert;
