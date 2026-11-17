/**
 * ==============================================================================
 * FILE: slangData.js (Dataset Awal & Data Cadangan Offline Kosakata Slang Jawa)
 * ==============================================================================
 * 1. INI BUAT APA:
 *    Sebagai berkas dataset bawaan (mock & seed data) yang memuat kosakata gaul/slang
 *    bahasa Jawa terlengkap beserta profil kontributor awal.
 * 
 * 2. FUNGSINYA APA:
 *    - Menyediakan data awal instan saat aplikasi pertama kali dijalankan di frontend.
 *    - Berfungsi sebagai cadangan offline (offline fallback) apabila server backend
 *      Laravel atau koneksi jaringan sedang terputus / belum dinyalakan.
 *    - Menjadi acuan struktur data (schema prototype) untuk model database SlangWord di Laravel.
 * 
 * 3. AMBILNYA DARI MANA:
 *    - Di-export secara konstanta (INITIAL_SLANG_WORDS dan INITIAL_USER)
 *    - Diimpor dan dikonsumsi oleh SlangContext.jsx
 * ==============================================================================
 */

// INI BUAT APA: Array kumpulan objek kosakata slang bahasa Jawa
// FUNGSINYA APA: Menyediakan list kata lengkap dengan emoji, kategori, wilayah, definisi, contoh, pengusul, dan likes
// AMBILNYA DARI MANA: Didefinisikan secara statis sebagai konstanta array objek
export const INITIAL_SLANG_WORDS = [
  {
    id: "ambyar",
    word: "Ambyar",
    emoji: "💔",
    category: "Ungkapan",
    region: "Solo / Jogja",
    definition: "Keadaan di mana hati, perasaan, rencana, atau suatu hal hancur berkeping-keping hingga tak tersisa. Sering dipakai untuk menggambarkan patah hati yang teramat parah.",
    example: "Loro ati iki lur, weruh mantan rabi karo kancaku dewe, rasane langsung ambyar tenan!",
    proposedBy: {
      name: "Sobat Ambyar Solo",
      date: "12 Oktober 2026",
      avatarText: "SA"
    },
    likes: 1240,
    tags: ["ambyar", "loro ati", "patah hati", "cidro", "sambat"]
  },
  {
    id: "mbois",
    word: "Mbois",
    emoji: "😎",
    category: "Kata Sifat",
    region: "Surabaya / Malang",
    definition: "Keren, bergaya, modis, atau sangat memukau (slang khas Arek Jawa Timur, sering disandingkan dengan 'Mbois Ilakes' / kebalikan dari sebutan khas walikan Malang).",
    example: "Gayamu saiki mbois pol rek, numpak vespa matic anyar nganggo jaket levis!",
    proposedBy: {
      name: "Bambang Mbois",
      date: "10 Oktober 2026",
      avatarText: "BM"
    },
    likes: 980,
    tags: ["mbois", "keren", "arek suroboyo", "malang", "kalcer"]
  },
  {
    id: "rungkad",
    word: "Rungkad",
    emoji: "🥀",
    category: "Kata Sifat",
    region: "Jawa Tengah & Timur",
    definition: "Tumbang, roboh, hancur lebur sampai ke akar-akarnya, atau kondisi keuangan/mental yang sedang bangkrut total.",
    example: "Minggu iki rungkad entek-entekan lur, dompet tipis tur ora iso tuku kopi sachet acan.",
    proposedBy: {
      name: "Cak Lontong",
      date: "8 Oktober 2026",
      avatarText: "CL"
    },
    likes: 1150,
    tags: ["rungkad", "ambyar", "bokek", "rugi", "tumbang"]
  },
  {
    id: "sambat",
    word: "Sambat",
    emoji: "😩",
    category: "Kata Kerja",
    region: "Umum Jawa",
    definition: "Mengeluh atau mencurahkan kepenatan beban hidup, lelahnya rutinitas, maupun pekerjaan kepada orang lain ataupun media sosial.",
    example: "Kerjo yo kerjo mas, ning ojo lali sambat ben ora njebluk utekmu.",
    proposedBy: {
      name: "Giyarto Sleman",
      date: "6 Oktober 2026",
      avatarText: "GS"
    },
    likes: 875,
    tags: ["sambat", "ngeluh", "capek", "healing", "curhat"]
  },
  {
    id: "mletre",
    word: "Mletre",
    emoji: "🥴",
    category: "Kata Sifat",
    region: "Jawa Tengah / DIY",
    definition: "Kondisi hilang kendali akibat mabuk, teler, atau bertingkah konyol dan banyak tingkah yang tak beraturan.",
    example: "Bengi iki bocah-bocah podo mletre bar nongkrong nganti subuh ning angkringan.",
    proposedBy: {
      name: "Mas Joko",
      date: "5 Oktober 2026",
      avatarText: "JO"
    },
    likes: 642,
    tags: ["mletre", "teler", "kocak", "tongkrongan", "ngelu"]
  },
  {
    id: "cidro",
    word: "Cidro",
    emoji: "🥺",
    category: "Kata Kerja",
    region: "Surakarta / Jogja",
    definition: "Mengingkari janji suci, mengkhianati komitmen, atau menyakiti pasangan yang sudah tulus berkorban.",
    example: "Dek, kowe biyen janji ora bakal cidro, saiki kok malah ninggal tatu?",
    proposedBy: {
      name: "Didi Kempot Fans",
      date: "3 Oktober 2026",
      avatarText: "DK"
    },
    likes: 910,
    tags: ["cidro", "janji", "pengkhianat", "loro ati", "ambyar"]
  },
  {
    id: "ndlogok",
    word: "Ndlogok",
    emoji: "🤪",
    category: "Seruan",
    region: "Yogyakarta",
    definition: "Kata umpatan akrab khas Yogyakarta yang digunakan untuk mengekspresikan keheranan, rasa konyol, atau ledekan sayang antar kawan dekat.",
    example: "Halah ndlogok kowe iki, jarene arep mangkat jam pitu malah nembe tangi turu!",
    proposedBy: {
      name: "Aditya Malioboro",
      date: "2 Oktober 2026",
      avatarText: "AM"
    },
    likes: 720,
    tags: ["ndlogok", "jogja", "guyon", "slang", "konco"]
  },
  {
    id: "suwung",
    word: "Suwung",
    emoji: "🕳️",
    category: "Kata Sifat",
    region: "Umum Jawa",
    definition: "Kondisi hati atau pikiran yang hampa, sepi, kosong, dan tidak memiliki gairah untuk melakukan aktivitas apapun.",
    example: "Malam minggu kok hawane suwung banget ya, ora ono sing nge-chat babar blas.",
    proposedBy: {
      name: "Rina Kartika",
      date: "30 September 2026",
      avatarText: "RK"
    },
    likes: 540,
    tags: ["suwung", "kosong", "gabut", "sepi", "hampa"]
  },
  {
    id: "bolo",
    word: "Bolo",
    emoji: "🤝",
    category: "Kata Benda",
    region: "Jawa Timur & Tengah",
    definition: "Teman akrab, kawan seperjuangan, konco kenthel, atau sekutu satu kubu. Ungkapan 'Bolo Dewe' berarti kawan sendiri.",
    example: "Tenang wae rek, Mas Budi iku bolo dewe, mesti diwenehi diskon khusus!",
    proposedBy: {
      name: "Cak Agus",
      date: "28 September 2026",
      avatarText: "CA"
    },
    likes: 830,
    tags: ["bolo", "konco", "kawan", "bolo dewe", "solid"]
  },
  {
    id: "ndusel",
    word: "Ndusel",
    emoji: "🥰",
    category: "Kata Kerja",
    region: "Umum Jawa",
    definition: "Tindakan menempelkan kepala, pipi, atau tubuh secara manja ke orang tersayang, bantal, atau selimut hangat.",
    example: "Yen hawa adem udan ngene iki pancen paling wenak ndusel karo guling ning kamar.",
    proposedBy: {
      name: "Dewi Lestari",
      date: "25 September 2026",
      avatarText: "DL"
    },
    likes: 760,
    tags: ["ndusel", "manja", "mesra", "adem", "guling"]
  },
  {
    id: "modar",
    word: "Modar",
    emoji: "😵",
    category: "Seruan",
    region: "Jawa Kasar / Gaul",
    definition: "Secara harfiah berarti mati, namun dalam slang sehari-hari digunakan untuk mengekspresikan kelelahan luar biasa atau situasi buntu.",
    example: "Lembur telung dino berturut-turut, modar tenan awakku rasane ameh copot!",
    proposedBy: {
      name: "Kuncoro Tech",
      date: "22 September 2026",
      avatarText: "KT"
    },
    likes: 670,
    tags: ["modar", "kesel", "mati gaya", "capek", "seruan"]
  },
  {
    id: "cangkeman",
    word: "Cangkeman",
    emoji: "🗣️",
    category: "Kata Sifat",
    region: "Jawa Timur & Tengah",
    definition: "Sifat orang yang terlalu banyak omong kosong, suka membual, cerewet, atau ikut campur urusan orang lain.",
    example: "Ojo kakehan cangkeman, yen wani langsung buktikno ning lapangan saiki!",
    proposedBy: {
      name: "Gatot Kaca",
      date: "20 September 2026",
      avatarText: "GK"
    },
    likes: 512,
    tags: ["cangkeman", "banyak omong", "nyocot", "bacot"]
  },
  {
    id: "pancen-oye",
    word: "Pancen Oye",
    emoji: "👍",
    category: "Ungkapan",
    region: "Umum Jawa",
    definition: "Ungkapan penegasan bahwa sesuatu hal itu memang benar-benar mantap, paten, hebat, dan tak diragukan lagi mutunya.",
    example: "Rawon Nguling ning kene pancen oye rek, bumbune medok daginge empuk!",
    proposedBy: {
      name: "Kulineran Jowo",
      date: "18 September 2026",
      avatarText: "KJ"
    },
    likes: 690,
    tags: ["pancen oye", "mantap", "jempolan", "jos", "top"]
  },
  {
    id: "sak-karepmu",
    word: "Sak Karepmu",
    emoji: "🤷‍♂️",
    category: "Ungkapan",
    region: "Umum Jawa",
    definition: "Terserah maumu, ungkapan pasrah atau sedikit kesal ketika lawan bicara susah diatur atau keras kepala.",
    example: "Wis dikandhani bola-bali panggah ngeyel, yo wis sak karepmu wae lah!",
    proposedBy: {
      name: "Mbak Yuni",
      date: "15 September 2026",
      avatarText: "MY"
    },
    likes: 810,
    tags: ["sak karepmu", "terserah", "pasrah", "ngeyel"]
  },
  {
    id: "gatheli",
    word: "Gatheli",
    emoji: "😏",
    category: "Kata Sifat",
    region: "Surabaya",
    definition: "Slang khas Suroboyoan untuk menggambarkan tingkah yang menjengkelkan, tengil, nakal, atau menggelitik tawa antar kawan karib.",
    example: "Raine gatheli pol bocah iku, wis ngerti aku luwe malah pamer sate kambing!",
    proposedBy: {
      name: "Arek Wonokromo",
      date: "12 September 2026",
      avatarText: "AW"
    },
    likes: 930,
    tags: ["gatheli", "suroboyo", "tengil", "guyon", "akrab"]
  },
  {
    id: "guyon",
    word: "Guyon",
    emoji: "😂",
    category: "Kata Kerja",
    region: "Umum Jawa",
    definition: "Bercanda, melucu, atau bersenda gurau yang bertujuan untuk mencairkan suasana tanpa niat menyinggung hati.",
    example: "Ojo dilebokne ati mas, mau iku mung guyon waton ben ora spaneng.",
    proposedBy: {
      name: "Pak RT Guyub",
      date: "10 September 2026",
      avatarText: "PR"
    },
    likes: 855,
    tags: ["guyon", "canda", "dagelan", "humor", "santai"]
  },
  {
    id: "wis-kadung",
    word: "Wis Kadung",
    emoji: "🤦‍♂️",
    category: "Ungkapan",
    region: "Umum Jawa",
    definition: "Sudah terlanjur, kondisi di mana sebuah perbuatan atau keputusan sudah terlanjur terjadi dan tak dapat ditarik kembali.",
    example: "Wis kadung tresno ning ditinggal lungo, ampun Gusti paringono sabar.",
    proposedBy: {
      name: "Mas Dwi Solo",
      date: "8 September 2026",
      avatarText: "MD"
    },
    likes: 620,
    tags: ["wis kadung", "terlanjur", "nasi sudah jadi bubur", "pasrah"]
  },
  {
    id: "ngenes",
    word: "Ngenes",
    emoji: "😢",
    category: "Kata Sifat",
    region: "Umum Jawa",
    definition: "Perasaan sedih, iba, prihatin, atau miris ketika menyaksikan penderitaan orang lain atau meratapi nasib diri sendiri.",
    example: "Delok simbah dodolan koran pas udan deres kok rasane ngenes tenan atiku.",
    proposedBy: {
      name: "Sri Rahayu",
      date: "5 September 2026",
      avatarText: "SR"
    },
    likes: 590,
    tags: ["ngenes", "prihatin", "sedih", "iba", "haru"]
  }
];

// INI BUAT APA: Objek profil pengguna default (Mas Joko)
// FUNGSINYA APA: Digunakan untuk demonstrasi cepat akun kontributor senior di frontend & mode fallback
// AMBILNYA DARI MANA: Didefinisikan secara statis sebagai contoh data user terautentikasi
export const INITIAL_USER = {
  id: "user-joko",
  name: "Joko Sudiro",
  username: "joko_boso",
  email: "joko.slang@jawa.id",
  bio: "Pecinta dialek Jawa Mataraman & Suroboyoan. Aktif ngumpulake kosakata slang Jawa anyar wiwit 2023.",
  role: "Sultan Slang (Kontributor Senior)",
  region: "Surakarta & Surabaya",
  avatarText: "JS",
  contributedCount: 12,
  reputationPoints: 2480,
  joinedDate: "Agustus 2023",
  favoriteWords: ["ambyar", "mbois", "rungkad", "pancen-oye"]
};

