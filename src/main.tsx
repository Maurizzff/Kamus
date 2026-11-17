/**
 * ==============================================================================
 * FILE: main.tsx (Entry Point Aplikasi Frontend Ionic React)
 * ==============================================================================
 * 1. INI BUAT APA:
 *    Sebagai berkas utama (titik awal / entry point) eksekusi aplikasi Ionic React
 *    di sisi browser client.
 * 
 * 2. FUNGSINYA APA:
 *    - Mengambil elemen DOM ber-id 'root' dari file public/index.html.
 *    - Menginisialisasi React Root menggunakan createRoot (React 18/19).
 *    - Me-render komponen utama <App /> ke dalam browser di bawah mode ketat
 *      (React.StrictMode) guna mendeteksi potensi bug atau side-effect sedini mungkin.
 * 
 * 3. AMBILNYA DARI MANA:
 *    - React: Paket node_modules 'react'
 *    - createRoot: Paket node_modules 'react-dom/client'
 *    - App: Komponen utama lokal dari './App'
 *    - Elemen root: Tag <div id="root"></div> di dalam file 'index.html'
 * ==============================================================================
 */

// AMBIL DARI: node_modules 'react'
// BUAT APA & FUNGSINYA: Mengimpor library utama React untuk membangun antarmuka komponen UI
import React from 'react';

// AMBIL DARI: node_modules 'react-dom/client'
// BUAT APA & FUNGSINYA: Mengimpor API createRoot untuk merender virtual DOM React ke real DOM HTML
import { createRoot } from 'react-dom/client';

// AMBIL DARI: Berkas lokal './App.jsx'
// BUAT APA & FUNGSINYA: Mengimpor komponen induk yang berisi konfigurasi rute, context provider, dan navigasi
import App from './App';

// INI BUAT APA: Mencari elemen penampung utama HTML
// FUNGSINYA APA: Mengambil node DOM dengan id 'root' tempat seluruh UI aplikasi akan dimuat
// AMBILNYA DARI MANA: Dokumen HTML utama di index.html (<div id="root"></div>)
const container = document.getElementById('root');

// INI BUAT APA: Membuat root React DOM
// FUNGSINYA APA: Menginisialisasi virtual DOM tree modern React berbasis container
// AMBILNYA DARI MANA: Hasil pemanggilan method createRoot(container!) dari 'react-dom/client'
const root = createRoot(container!);

// INI BUAT APA: Menjalankan rendering awal aplikasi
// FUNGSINYA APA: Me-mount komponen <App /> ke layar browser dalam pembungkus StrictMode
// AMBILNYA DARI MANA: Komponen <App /> yang diimpor dari file App.jsx
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
