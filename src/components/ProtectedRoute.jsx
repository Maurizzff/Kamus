/**
 * ==============================================================================
 * FILE: ProtectedRoute.jsx (Komponen Route Guard / Pelindung Rute Privat)
 * ==============================================================================
 * 1. INI BUAT APA:
 *    Sebagai komponen pelindung gerbang (Route Guard / Middleware di sisi React)
 *    yang membungkus halaman-halaman yang membutuhkan hak akses login (seperti
 *    Dashboard dan Profil).
 * 
 * 2. FUNGSINYA APA:
 *    - Memeriksa status keberadaan sesi pengguna aktif (`user`).
 *    - Jika `user === null` (belum login):
 *      Otomatis memotong akses dan mengalihkan (redirect) pengunjung ke rute `/login`.
 *    - Jika `user` terautentikasi:
 *      Mengizinkan komponen anak (`children`) ditampilkan secara wajar.
 * 
 * 3. AMBILNYA DARI MANA:
 *    - React: Library 'react'
 *    - Navigate: Komponen redirect bawaan dari 'react-router-dom'
 *    - useSlang: Custom hook dari '../context/SlangContext' untuk membaca state `user`
 *    - children: Properti bawaan React yang berisi elemen halaman yang dibungkus
 * ==============================================================================
 */

// AMBIL DARI: Library React ('react')
// BUAT APA & FUNGSINYA: Fondasi pembuatan komponen fungsional React
import React from "react";

// AMBIL DARI: node_modules 'react-router-dom'
// BUAT APA & FUNGSINYA: Melakukan pengalihan rute (redirect) seketika tanpa interaksi klik
import { Navigate } from "react-router-dom";

// AMBIL DARI: Berkas '../context/SlangContext'
// BUAT APA & FUNGSINYA: Mengambil data pengguna login dari context global
import { useSlang } from "../context/SlangContext";

/**
 * KOMPONEN: ProtectedRoute
 * INI BUAT APA: Memvalidasi sesi pengguna sebelum menampilkan halaman privat
 * FUNGSINYA APA: Mengembalikan <Navigate to="/login" /> jika belum login, atau elemen anak jika sudah login
 * AMBILNYA DARI MANA: Membaca parameter props `children` (komponen halaman seperti <Dashboard /> atau <Profile />)
 */
const ProtectedRoute = ({ children }) => {
  // Ambil data user aktif dari global context
  const { user } = useSlang();

  // Jika tidak ada user yang sedang login, paksa redirect ke halaman Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Jika user valid, render komponen halaman anak
  return children;
};

export default ProtectedRoute;
