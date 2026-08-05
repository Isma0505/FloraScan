# FloraScan AI — Pemindai Tumbuhan Cerdas | AI Plant Scanner

> Identifikasi bunga & tumbuhan apa pun dalam seketika menggunakan **Google Gemini 2.5 Flash Lite** Vision AI.

FloraScan AI adalah aplikasi web pemindai tumbuhan berbasis AI yang dapat mengenali bunga, daun, pohon, dan tumbuhan apa pun dari sebuah foto. Cukup unggah gambar atau gunakan kamera, dan AI akan mengidentifikasi tanaman lengkap dengan nama latin, habitat, manfaat, cara perawatan, hingga tingkat bahaya.

---

## Daftar Isi

- [Deskripsi Aplikasi](#deskripsi-aplikasi)
- [Fitur](#fitur)
- [Arsitektur Sistem](#arsitektur-sistem)
- [Tech Stack](#tech-stack)
- [Entity Relationship Diagram (ERD)](#entity-relationship-diagram-erd)
- [Use Case Diagram](#use-case-diagram)
- [Activity Diagram](#activity-diagram)
- [API Documentation](#api-documentation)
- [Struktur Folder](#struktur-folder)
- [Prompt Engineering](#prompt-engineering)
- [Cara Instalasi](#cara-instalasi)
- [Cara Menjalankan](#cara-menjalankan)
- [Cara Deployment](#cara-deployment)
- [Keamanan](#keamanan)
- [Lisensi](#lisensi)

---

## Deskripsi Aplikasi

**FloraScan AI** adalah aplikasi pemindai tumbuhan cerdas berbasis web yang memanfaatkan kekuatan **Google Gemini 2.5 Flash Lite** model vision AI. Aplikasi ini dirancang untuk para pecinta alam, peneliti botani, siswa, maupun pengguna umum yang ingin mengenal jenis tumbuhan di sekitar mereka.

### Tujuan Utama
- Mendeteksi bunga/tumbuhan dari gambar dengan akurasi tinggi
- Menampilkan informasi lengkap & ilmiah tentang tanaman (nama latin, habitat, manfaat, perawatan, tingkat bahaya)
- Menyimpan riwayat hasil scan (bisa disimpan maupun dihapus)
- Memungkinkan menandai tanaman favorit
- Mendukung mode gelap/terang & multi-bahasa (Indonesia/English)

---

## Fitur

### Fitur Utama
| Fitur | Deskripsi |
|-------|-----------|
| Upload Gambar | Unggah foto tumbuhan dari galeri (JPG/PNG/WEBP, maks 10 MB) |
| Kamera Real-time | Ambil foto langsung lewat kamera perangkat (depan/belakang) |
| Scan AI | Identifikasi tumbuhan menggunakan Gemini 2.5 Flash Lite |
| Hasil Lengkap | Nama, nama latin, kategori, habitat, manfaat, perawatan, tingkat bahaya, keyakinan |
| Riwayat | Simpan & kelola seluruh hasil pemindaian |
| Favorit | Tandai tanaman favorit untuk akses cepat |
| Pencarian | Cari riwayat berdasarkan nama tumbuhan |
| Filter | Saring riwayat: Semua / Favorit saja |
| Detail Modal | Lihat informasi lengkap setiap tanaman |

### Fitur Tambahan
- **Dark / Light Mode** — beralih tema gelap/terang/sistem
- **Multi-Bahasa** — Bahasa Indonesia & English
- **Mobile Friendly** — responsif penuh untuk semua perangkat
- **Share Hasil** — bagikan hasil identifikasi via Web Share API
- **Sticky Footer** — footer menempel di bawah pada halaman pendek
- **Animasi Halus** — transisi & micro-interactions dengan Framer Motion

---

## Arsitektur Sistem

```
┌──────────────────────────────────────────────┐
│                 Frontend (React)              │
│   Next.js 16 · TypeScript · Tailwind · shadcn  │
│         Zustand (state) · i18n (ID/EN)        │
└──────────────────┬───────────────────────────┘
                   │ REST API (fetch)
                   ▼
┌──────────────────────────────────────────────┐
│            Backend (Next.js Route Handlers)   │
│   /api/scan · /api/history · /api/history/:id │
└──────┬───────────────────────────────┬───────┘
       │                               │
       ▼                               ▼
┌──────────────┐              ┌────────────────┐
│  Gemini AI    │              │   SQLite DB     │
│  2.5 Flash     │              │  (Prisma ORM)   │
│  Lite Vision   │              │  ScanHistory    │
└──────────────┘              └────────────────┘
```

### AI Flow
```
Upload Foto
   │
   ▼
Resize Image (client + server, sharp)
   │
   ▼
Convert ke Base64
   │
   ▼
Kirim ke Gemini Vision API (gemini-2.5-flash-lite)
   │
   ▼
Validasi JSON Response (Zod-like schema)
   │
   ▼
Simpan ke Database (opsional, saat user Save)
   │
   ▼
Tampilkan Hasil Lengkap
```

---

## Tech Stack

### Frontend
- **Next.js 16** (App Router)
- **React 19** + **TypeScript 5**
- **Tailwind CSS 4** + **shadcn/ui** (New York style)
- **Framer Motion** (animasi)
- **Lucide React** (ikon)
- **next-themes** (dark/light mode)
- **Zustand** (state management + persist)

### Backend
- **Next.js Route Handlers** (REST API)
- **TypeScript**
- **Bun Runtime**

### Database
- **SQLite** (via Prisma ORM)

### AI
- **Google Gemini API** — model `gemini-2.5-flash-lite` (Vision)
- **@google/genai** SDK

### Library Pendukung
- **Zod** (validasi)
- **Sharp** (image processing)
- **Sonner** (toast notifications)

---

## Entity Relationship Diagram (ERD)

```
┌─────────────────────────────────────────────────┐
│                  ScanHistory                     │
├─────────────────────────────────────────────────┤
│ PK  id           String    @id @default(cuid()) │
│      imageThumb  String    (base64 thumbnail)    │
│      imageData   String    (base64 optimized)    │
│      plantName   String                          │
│      latinName   String                          │
│      category    String                          │
│      confidence   Float     (0-100)              │
│      habitat     String                          │
│      benefits    String    (JSON array)          │
│      care        String    (JSON array)          │
│      dangerLevel String    (Rendah/Sedang/Tinggi)│
│      description String                          │
│      detected    Boolean   @default(true)        │
│      isFavorite  Boolean   @default(false)       │
│      createdAt   DateTime  @default(now())       │
│      updatedAt   DateTime  @updatedAt             │
└─────────────────────────────────────────────────┘
        │ @@index([isFavorite])
        │ @@index([createdAt])
        ▼
   (single-table design — history & favorites
    managed via isFavorite flag)
```

> **Catatan:** Karena aplikasi ini tidak mewajibkan autentikasi server-side
> (API key Gemini disimpan lokal di browser pengguna), seluruh riwayat
> disimpan dalam satu tabel `ScanHistory`. Field `isFavorite` membedakan
> riwayat biasa vs favorit.

---

## Use Case Diagram

```
                    ┌────────────────────────┐
                    │      Pengguna          │
                    └───────────┬────────────┘
                                │
        ┌───────────┬───────────┼───────────┬───────────┐
        ▼           ▼           ▼           ▼           ▼
   ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
   │ Lihat   │ │ Pindai  │ │ Lihat   │ │ Kelola  │ │ Atur    │
   │ Beranda │ │Tumbuhan │ │ Riwayat │ │ Favorit │ │Setting  │
   └─────────┘ └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘
                    │           │           │           │
              ┌─────┴─────┐     │     ┌─────┴─────┐ ┌───┴────┐
              ▼           ▼     │     ▼           ▼ ▼        ▼
         ┌────────┐ ┌──────┐   │  Cari  Hapus  Tambah  API Key
         │ Upload │ │Kamera│   │  Riwayat       Favorit  Theme
         └────────┘ └──────┘   │                        Language
              │                 │
              ▼                 ▼
        ┌──────────┐      ┌──────────┐
        │ Hasil AI │      │ Detail   │
        │ (Gemini) │      │ Tanaman  │
        └──────────┘      └──────────┘
```

---

## Activity Diagram

### Alur Pemindaian Tumbuhan

```
     ┌─────────┐
     │  Mulai  │
     └────┬────┘
          ▼
   ┌──────────────┐    Tidak ada API Key
   │ Cek API Key? ├──────────────────► [Arahkan ke Settings]
   └──────┬───────┘
          │ Ada
          ▼
   ┌──────────────┐
   │ Pilih Sumber │
   │ ┌──────────┐ │
   │ │ Upload   │ │
   │ │ Kamera   │ │
   │ └──────────┘ │
   └──────┬───────┘
          ▼
   ┌──────────────┐
   │ Preview Foto │
   └──────┬───────┘
          ▼
   ┌──────────────┐
   │ Klik "Analisis"│
   └──────┬───────┘
          ▼
   ┌──────────────┐
   │ Resize Image │  (client → 1280px, server → 1024px via sharp)
   └──────┬───────┘
          ▼
   ┌──────────────┐
   │ POST /api/scan│
   └──────┬───────┘
          ▼
   ┌─────────────────────┐
   │ Gemini 2.5 Flash Lite│
   │ (Vision + JSON schema)│
   └──────┬───────────────┘
          ▼
   ┌──────────────┐     Gagal
   │ Validasi JSON ├──────────► [Tampilkan Error Toast]
   └──────┬───────┘
          │ Berhasil
          ▼
   ┌──────────────┐
   │ Tampilkan    │
   │ Hasil Lengkap│
   └──────┬───────┘
          ▼
   ┌──────────────┐
   │ Simpan?      │─── Ya ──► [POST /api/history]
   └──────┬───────┘                │
          │ Tidak                  ▼
          │                 ┌──────────────┐
          ▼                 │ Tersimpan ✓  │
   ┌─────────┐              └──────────────┘
   │  Selesai │
   └─────────┘
```

---

## API Documentation

Base URL: `/api`

### 1. Scan Tumbuhan

```http
POST /api/scan
```

**Request Body:**
```json
{
  "image": "data:image/jpeg;base64,...",   // base64 data URL
  "apiKey": "AIza...",                     // Gemini API key
  "locale": "id"                           // "id" | "en" (opsional)
}
```

**Response 200:**
```json
{
  "result": {
    "detected": true,
    "plantName": "Mawar Merah",
    "latinName": "Rosa gallica",
    "category": "Bunga",
    "confidence": 96.5,
    "habitat": "Asli Eropa dan Asia Barat...",
    "benefits": ["Hiasan taman", "Sumber minyak atsiri", "..."],
    "care": ["Siram teratur", "Cahaya 6-8 jam", "..."],
    "dangerLevel": "Rendah",
    "description": "Mawar merah adalah tanaman hias ikonik..."
  }
}
```

**Error Responses:**
| Status | Error | Keterangan |
|--------|-------|-----------|
| 400 | `INVALID_BODY` / `INVALID_IMAGE` | Body atau gambar tidak valid |
| 401 | `API_KEY_REQUIRED` / `API_KEY_INVALID` | API key hilang/invalid |
| 429 | `RATE_LIMITED` | Kuota Gemini tercapai |
| 500 | `SCAN_FAILED` | Gagal menganalisis |

---

### 2. Ambil Riwayat

```http
GET /api/history?favorites=1&q=rose
```

**Query Params (opsional):**
- `favorites=1` — hanya favorit
- `q=keyword` — cari berdasarkan nama/latin/kategori

**Response 200:**
```json
{
  "items": [
    {
      "id": "cms...",
      "imageThumb": "data:image/jpeg;base64,...",
      "imageData": "data:image/jpeg;base64,...",
      "plantName": "Mawar Merah",
      "latinName": "Rosa gallica",
      "category": "Bunga",
      "confidence": 96.5,
      "habitat": "...",
      "benefits": ["..."],
      "care": ["..."],
      "dangerLevel": "Rendah",
      "description": "...",
      "detected": true,
      "isFavorite": false,
      "createdAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 3. Simpan Riwayat

```http
POST /api/history
```

**Body:**
```json
{
  "image": "data:image/jpeg;base64,...",
  "result": { /* PlantResult object */ },
  "isFavorite": false
}
```

---

### 4. Update Riwayat (Toggle Favorit)

```http
PATCH /api/history/:id
```

**Body:**
```json
{ "isFavorite": true }
```

---

### 5. Hapus Riwayat

```http
DELETE /api/history/:id
```

---

### 6. Hapus Semua Riwayat

```http
DELETE /api/history-all
```

---

## Struktur Folder

```
my-project/
├── prisma/
│   └── schema.prisma              # Skema database (SQLite + ScanHistory)
├── db/
│   └── custom.db                  # File database SQLite
├── public/
│   ├── hero-plants.jpg            # Gambar hero (AI-generated)
│   ├── sample-rose.jpg            # Contoh foto tanaman
│   └── logo.svg
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout + ThemeProvider + Toaster
│   │   ├── page.tsx               # Halaman utama (view switcher)
│   │   ├── globals.css            # Tema hijau alami + animasi
│   │   └── api/
│   │       ├── scan/route.ts      # POST /api/scan (Gemini)
│   │       ├── history/
│   │       │   ├── route.ts       # GET + POST /api/history
│   │       │   └── [id]/route.ts # PATCH + DELETE /api/history/:id
│   │       └── history-all/route.ts # DELETE all
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components
│   │   ├── navbar.tsx             # Navigasi atas + tema/bahasa
│   │   ├── footer.tsx             # Footer sticky
│   │   ├── landing-hero.tsx       # Hero + Features + HowItWorks
│   │   ├── scanner-view.tsx       # Upload + Kamera + Analisis
│   │   ├── scan-result.tsx        # Kartu hasil identifikasi
│   │   ├── history-view.tsx       # Riwayat + Favorit + Detail modal
│   │   ├── settings-view.tsx     # API key + tema + bahasa
│   │   ├── botanical-deco.tsx     # Dekorasi daun + scan grid
│   │   └── theme-provider.tsx     # next-themes wrapper
│   ├── lib/
│   │   ├── gemini.ts              # Integrasi Gemini 2.5 Flash Lite
│   │   ├── image.ts               # Sharp image processing
│   │   ├── db.ts                  # Prisma client
│   │   ├── i18n.ts                # Translations ID/EN
│   │   ├── store.ts               # Zustand store (view, locale, apiKey)
│   │   └── utils.ts               # cn() helper
│   ├── hooks/
│   │   ├── use-toast.ts
│   │   └── use-mobile.ts
│   └── types/
│       └── index.ts               # PlantResult, ScanHistoryItem types
├── next.config.ts
├── tailwind.config.ts
├── components.json                # shadcn config
├── package.json
└── README.md
```

---

## Prompt Engineering

Model: **`gemini-2.5-flash-lite`** dengan `responseMimeType: "application/json"` dan `responseSchema` terstruktur.

### Format Output JSON
```json
{
  "detected": boolean,        // Apakah tumbuhan terdeteksi
  "plantName": string,        // Nama umum tumbuhan
  "latinName": string,        // Nama latin/ilmiah
  "category": string,         // Kategori (Bunga/Pohon/Sukulen/...)
  "confidence": number,       // 0-100
  "habitat": string,          // Habitat asli
  "benefits": string[],       // Array manfaat
  "care": string[],           // Array cara perawatan
  "dangerLevel": string,      // Rendah | Sedang | Tinggi
  "description": string       // Deskripsi singkat
}
```

### Instruksi Prompt
AI diberi peran sebagai **botanis ahli** dan diinstruksikan:
- Merespons dalam bahasa sesuai locale (id/en)
- Mengisi `detected: false` jika gambar bukan tumbuhan
- Memberikan nama latin binomial yang akurat (Genus species)
- `dangerLevel` harus persis: `Rendah` / `Sedang` / `Tinggi`
- 3-6 poin untuk manfaat & perawatan

---

## Cara Instalasi

### Prasyarat
- **Node.js 18+** atau **Bun** runtime
- **Google Gemini API Key** — dapatkan gratis di [Google AI Studio](https://aistudio.google.com/app/apikey)

### Langkah Instalasi (Windows)

```powershell
# 1. Clone / download project
git clone <repo-url>
cd my-project

# 2. Install dependencies (gunakan salah satu)
bun install
# atau
npm install

# 3. Setup environment variables
#    Buat file .env di root project:
#    DATABASE_URL="file:./db/custom.db"

# 4. Inisialisasi database
bun run db:push
# atau
npx prisma db push
```

### File `.env`
```env
DATABASE_URL="file:./db/custom.db"
```

---

## Cara Menjalankan

### Development

```powershell
# Jalankan dev server (port 3000)
bun run dev

# Aplikasi tersedia di http://localhost:3000
```

### Setup API Key Gemini

1. Buka aplikasi di browser
2. Klik **Pengaturan** (Settings) di navbar
3. Tempel **Gemini API Key** Anda di kolom "Kunci API Gemini"
4. Klik **Simpan Kunci API**
5. Kini Anda bisa mulai memindai tumbuhan!

> API key disimpan **lokal di browser** Anda (localStorage), tidak dikirim ke server kecuali saat melakukan scan.

### Perintah Lain

```powershell
bun run lint        # Cek kualitas kode (ESLint)
bun run db:push     # Push schema ke database
bun run db:generate # Generate Prisma Client
bun run db:reset    # Reset database (HATI-HATI!)
```

---

## Cara Deployment

### Build Production

```powershell
# Build aplikasi (output standalone)
bun run build

# Jalankan server production
bun run start
```

### Deployment Platform

Aplikasi ini menggunakan Next.js **standalone output**, sehingga dapat di-deploy ke:

- **Vercel** (rekomendasi) — `vercel deploy`
- **Netlify**
- **Docker** — copy folder `.next/standalone`
- **VPS** — jalankan `bun run start` dengan PM2 / systemd

### Environment Variables untuk Production

```env
DATABASE_URL="file:./db/custom.db"
# Tambahkan konfigurasi produksi lain sesuai kebutuhan
```

> **Penting:** API Key Gemini **tidak** disimpan di environment server.
> Setiap pengguna memasukkan API key-nya sendiri melalui UI Settings,
> yang disimpan di localStorage browser masing-masing.

---

## Keamanan

| Aspek | Implementasi |
|-------|-------------|
| **API Key Storage** | Disimpan lokal di browser (localStorage), bukan di server |
| **Validasi File** | Cek MIME type & ukuran (maks 10 MB, JPG/PNG/WEBP) |
| **Validasi Input** | Schema JSON response Gemini divalidasi & dinormalisasi |
| **Image Processing** | Resize & re-encode via Sharp (cegah payload berlebih) |
| **Error Handling** | API key tidak pernah di-log; error dinormalisasi |
| **CORS** | Same-origin (API route Next.js) |
| **Environment Variables** | `DATABASE_URL` via `.env`, tidak di-commit |

---

## Lisensi

MIT License © 2025 FloraScan AI

Dibuat dengan ❤️ dan **Gemini AI** untuk para pecinta alam.

---

### Tech Credits

- [Next.js 16](https://nextjs.org)
- [Google Gemini API](https://ai.google.dev)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Prisma](https://www.prisma.io)
- [Framer Motion](https://www.framer.com/motion/)
