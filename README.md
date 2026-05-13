# 📡 CrawlGen Intelligence | Premium News Crawler & Dashboard

**CrawlGen Intelligence** adalah sistem *news crawler* modern yang dirancang untuk mengumpulkan, memproses, dan menyajikan berita dari berbagai sumber media besar di Indonesia secara *real-time*. Dilengkapi dengan dashboard admin berbasis **Shadcn UI** dan penyimpanan data **MySQL**.

---

## ✨ Fitur Utama

- 🎨 **Modern Dashboard**: Antarmuka premium yang bersih, responsif, dan elegan menggunakan standar desain Shadcn UI.
- ⚙️ **Dynamic Source Management**: Tambah, edit, dan hapus sumber berita (RSS/Crawler) langsung dari dashboard tanpa sentuh kode.
- ⌨️ **Key-Value Config Editor**: Input konfigurasi kategori dan selector CSS yang ramah pengguna, bebas *syntax error* JSON.
- 🕵️ **Full Content Crawler**: Tidak hanya mengambil RSS, CrawlGen Intelligence dilengkapi mesin untuk menarik konten utuh dari halaman berita.
- 🔄 **Hot-Reloadable**: Perubahan konfigurasi di database langsung diterapkan ke mesin crawler tanpa perlu restart server.
- 📊 **Real-time Analytics**: Pantau jumlah artikel yang berhasil ditarik dan status kesehatan sistem secara langsung.
- 📖 **Swagger API Docs**: Dokumentasi API interaktif yang terintegrasi (tersedia di `/api-docs`).

---

## 🛠️ Tech Stack

- **Backend**: [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
- **Database**: [MySQL](https://www.mysql.com/) (Penyimpanan konfigurasi & metadata)
- **Frontend**: Vanilla JS, HTML5, CSS3 (Shadcn-inspired Design System)
- **Icons**: [Lucide Icons](https://lucide.dev/)
- **API Documentation**: [Swagger/OpenAPI](https://swagger.io/)

---

## 🚀 Memulai

### 1. Prasyarat
- Node.js versi 16 atau lebih baru.
- MySQL Server sudah berjalan.

### 2. Persiapan Database
Buat database bernama `crawlgen` dan jalankan script migrasi (jika tersedia) atau gunakan `seed.js` untuk inisialisasi data awal:
```bash
node seed.js
```

### 3. Instalasi
Clone repository ini dan install dependensinya:
```bash
npm install
```

### 4. Menjalankan Aplikasi
Jalankan server utama:
```bash
node server.js
```
Buka browser dan akses dashboard di: `http://localhost:3000`

---

## 📂 Struktur Proyek

```text
├── dashboard/          # Frontend Dashboard (HTML, CSS, JS)
├── src/
│   ├── crawlers/       # Logika crawler spesifik tiap media
│   ├── utils/          # Helper (DB connection, Detail crawler, dll)
│   ├── config/         # Konfigurasi statis (fallback)
│   └── factory.js      # Crawler initialization logic
├── server.js           # API Server & Backend Logic
└── seed.js             # Script migrasi data ke MySQL
```

---

## 📡 Daftar Sumber Berita Terintegrasi

CrawlGen Intelligence mendukung berbagai media besar Indonesia, antara lain:
- **Antara News**, **CNN Indonesia**, **CNBC Indonesia**, **Republika**, **Tempo**, **SindoNews**, **OkeZone**, **Suara**, **Merdeka**, **Tribun**, dan banyak lagi.

*Semua sumber di atas dapat dikonfigurasi ulang secara dinamis melalui menu **Manage Sources**.*

---

## 📝 Lisensi
Proyek ini dikembangkan untuk keperluan internal dan riset. Silakan gunakan dengan bijak.

---
**CrawlGen Intelligence** - *Gathering intelligence, one agent at a time.*
