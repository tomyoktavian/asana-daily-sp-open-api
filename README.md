# Asana Daily Report

Aplikasi web untuk memantau dan melacak task Asana dengan mudah dan efisien. Menampilkan daftar task, total task completed, dan total story point menggunakan Asana Open API.

## 📸 Preview

![Dashboard - Dark Mode](/public/img/dark-banners.jpg)

## 🔌 VSCode Extension

Monitor task Asana langsung dari Visual Studio Code!

![Extension Preview](/public/img/extension-preview.jpg)

### Download Extension

Download VSCode Extension (`.vsix`) dari folder `public`:

📥 [Download dari GitHub](https://daily-sp-asana.vercel.app)

### Cara Install

1. Download file `.vsix` dari folder public
2. Buka VSCode
3. Tekan `Ctrl+Shift+P` (Windows/Linux) atau `Cmd+Shift+P` (Mac)
4. Ketik `Extensions: Install from VSIX`
5. Pilih file `.vsix` yang sudah didownload
6. Reload VSCode

### Fitur Extension

- ✅ Monitor story point hari ini & kemarin
- ✅ Filter task berdasarkan status (completed/incomplete)
- ✅ Date range picker (Hari Ini, Kemarin, Minggu 1-4)
- ✅ Refresh data real-time
- ✅ Dark mode support
- ✅ Link langsung ke web dashboard

## ✨ Fitur

- 🔐 **Autentikasi dengan Personal Access Token** - Login aman menggunakan Asana PAT
- 📊 **Story Point Tracking** - Monitor story point yang selesai hari ini dan kemarin
- 📋 **Task Management** - Lihat dan filter task berdasarkan status (selesai/belum selesai)
- 📅 **Date Range Picker** - Filter task berdasarkan tanggal dengan shortcuts (Hari Ini, Kemarin, Minggu 1-4, dll)
- 🌓 **Dark Mode** - Tema gelap dan terang dengan smooth transition

## 🚀 Instalasi

1. **Clone repository**

2. **Install dependencies**
```bash
bun install
```

3. **Setup environment variables**

Buat file `.env.local` di root project:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` dengan konfigurasi Anda:

```env
ASANA_PERSONAL_ACCESS_TOKEN=
ASANA_REDIRECT_URI=http://localhost:3000/api/auth/callback
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-change-this-in-production
```

> **Note**: `ASANA_PERSONAL_ACCESS_TOKEN` bisa dikosongkan jika menggunakan login via UI

Masukkan hasilnya ke `NEXTAUTH_SECRET` di `.env.local`

## 🎯 Cara Penggunaan

### Menggunakan Aplikasi

1. **Login**
   - Buka [http://localhost:3000](http://localhost:3000)
   - Masukkan Personal Access Token dari Asana
   - Klik "Masuk ke Dashboard"

2. **Dashboard**
   - Lihat Story Point hari ini dan kemarin
   - Filter task berdasarkan status (Selesai/Belum Selesai)
   - Filter task berdasarkan tanggal dengan Date Range Picker
   - Refresh data dengan tombol refresh
   - Toggle Dark Mode dengan tombol di pojok kanan atas

3. **Date Range Picker Shortcuts**
   - **Hari Ini** - Task hari ini
   - **Kemarin** - Task kemarin
   - **Minggu Ini** - Task minggu berjalan
   - **Minggu 1-4** - Task per minggu dalam bulan ini
   - **Custom** - Pilih range tanggal manual

## 📚 API Reference

Aplikasi ini menggunakan [Asana REST API](https://developers.asana.com/reference/tasks):

- **GET** `/api/tasks` - Mendapatkan daftar task dengan filter
- **GET** `/api/total-story-point` - Mendapatkan total story point
- **POST** `/api/auth/set-token` - Set Personal Access Token
- **POST** `/api/auth/logout` - Logout dan hapus cookie

### Query Parameters untuk `/api/tasks`:

```typescript
{
  completed: "true" | "false",
  completed_since: "YYYY-MM-DD",
  completed_before: "YYYY-MM-DD"
}
```

## 🔑 Mendapatkan Asana Personal Access Token

1. Login ke [Asana](https://app.asana.com/)
2. Klik foto profil → **Settings**
3. Pilih tab **Apps**
4. Scroll ke **Personal access tokens**
5. Klik **+ New token**
6. Beri nama token (contoh: "Daily Report App")
7. Klik **Create token**
8. Copy token dan simpan dengan aman

> ⚠️ **Penting**: Token hanya ditampilkan sekali. Simpan di tempat aman.

## 📦 Scripts yang Tersedia

```bash
# Development
bun dev          # Jalankan development server

# Production
bun run build    # Build aplikasi untuk production
bun start        # Jalankan production server

# Linting
bun lint         # Check code dengan ESLint
```

## 🤝 Contributing

Contributions, issues, dan feature requests are welcome!

## 👤 Author

<div align="center">
  <a href="https://github.com/tomyoktavian">
    <img src="https://github.com/tomyoktavian.png" width="100" style="border-radius: 50%;" alt="Tommy Oktavian"/>
  </a>
  <br/>
  <a href="https://github.com/tomyoktavian">@tomyoktavian</a>
</div>

<br/>

<p align="center">Built with Next.js and Asana API</p>

---

**Note**: Aplikasi ini menggunakan Asana Open API. Pastikan Anda memiliki akses ke workspace dan project yang ingin ditampilkan.
