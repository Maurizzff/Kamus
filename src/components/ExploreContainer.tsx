/**
 * ==============================================================================
 * FILE: ExploreContainer.tsx (Komponen Bawaan Starter Template Ionic)
 * ==============================================================================
 * 1. INI BUAT APA:
 *    Sebagai komponen placeholder bawaan (default boilerplate) yang digenerate
 *    saat pembuatan awal proyek template Ionic React.
 * 
 * 2. FUNGSINYA APA:
 *    - Menampilkan kotak eksplorasi komponen UI dan tautan ke dokumentasi Ionic.
 * 
 * 3. AMBILNYA DARI MANA:
 *    - Diimpor dari template starter Ionic
 *    - Menerima properti `name` (string)
 * ==============================================================================
 */

// AMBIL DARI: Berkas styling lokal './ExploreContainer.css'
// BUAT APA & FUNGSINYA: Memberikan posisi tengah vertikal & teks terpusat
import './ExploreContainer.css';

// INI BUAT APA: Tipe data props TypeScript
// FUNGSINYA APA: Memvalidasi bahwa komponen menerima properti nama bertipe string
// AMBILNYA DARI MANA: Fitur static typing TypeScript
interface ContainerProps {
  name: string;
}

// INI BUAT APA: Komponen fungsional React dengan TypeScript (React.FC)
// FUNGSINYA APA: Menampilkan pesan eksplorasi komponen UI Ionic
// AMBILNYA DARI MANA: Parameter props `{ name }`
const ExploreContainer: React.FC<ContainerProps> = ({ name }) => {
  return (
    <div className="container">
      <strong>{name}</strong>
      <p>Explore <a target="_blank" rel="noopener noreferrer" href="https://ionicframework.com/docs/components">UI Components</a></p>
    </div>
  );
};

export default ExploreContainer;
