// Internationalization (i18n) — Indonesian & English

export type Locale = "id" | "en";

export const locales: Locale[] = ["id", "en"];

export type Dict = typeof translations.id;

export const translations = {
  id: {
    // Brand
    brand: "FloraScan AI",
    tagline: "Pemindai Tumbuhan Cerdas",

    // Nav
    nav: {
      home: "Beranda",
      scanner: "Pindai",
      history: "Riwayat",
      favorites: "Favorit",
      settings: "Pengaturan",
    },

    // Hero
    hero: {
      badge: "Didukung Gemini 2.5 Flash Lite",
      title: "Identifikasi Tumbuhan Apa Pun dalam Sekejap",
      subtitle:
        "Unggah foto atau gunakan kamera, biarkan AI mengenali bunga, daun, dan tumbuhan di sekitarmu — lengkap dengan nama latin, habitat, manfaat, hingga cara perawatan.",
      ctaScan: "Mulai Memindai",
      ctaLearn: "Pelajari Cara Kerja",
      stat1: "Spesies Terdeteksi",
      stat2: "Akurasi AI",
      stat3: "Respons Cepat",
    },

    // Features
    features: {
      title: "Mengapa FloraScan AI?",
      subtitle:
        "Teknologi vision AI terkini untuk para pecinta tumbuhan, peneliti, dan pembelajar.",
      f1Title: "Deteksi Akurat",
      f1Desc:
        "Model Gemini 2.5 Flash Lite menganalisis visual dengan presisi tinggi.",
      f2Title: "Informasi Lengkap",
      f2Desc:
        "Nama latin, habitat, manfaat, perawatan, hingga tingkat bahaya.",
      f3Title: "Riwayat & Favorit",
      f3Desc:
        "Simpan hasil pemindaian dan tandai tanaman favoritmu.",
      f4Title: "Multi-Bahasa",
      f4Desc:
        "Antarmuka ramah dalam Bahasa Indonesia & English.",
      f5Title: "Mode Gelap",
      f5Desc:
        "Nyaman dipakai siang maupun malam dengan mode gelap/terang.",
      f6Title: "Mobile Friendly",
      f6Desc:
        "Pindai langsung dari kamera ponselmu, di mana pun kamu berada.",
    },

    // How it works
    how: {
      title: "Cara Kerja",
      step1Title: "Unggah / Ambil Foto",
      step1Desc: "Pilih gambar dari galeri atau ambil langsung lewat kamera.",
      step2Title: "AI Menganalisis",
      step2Desc:
        "Gemini Vision memproses gambar dan mengidentifikasi tanaman.",
      step3Title: "Lihat Hasil",
      step3Desc:
        "Dapatkan informasi lengkap dan simpan ke riwayat bila perlu.",
    },

    // Scanner
    scanner: {
      title: "Pindai Tumbuhan",
      subtitle: "Unggah foto tumbuhan untuk diidentifikasi AI",
      upload: "Unggah Gambar",
      uploadHint: "Klik untuk memilih atau seret gambar ke sini",
      camera: "Buka Kamera",
      capture: "Ambil Foto",
      switchCamera: "Ganti Kamera",
      closeCamera: "Tutup Kamera",
      retake: "Ambil Ulang",
      analyze: "Analisis dengan AI",
      analyzing: "Sedang Menganalisis…",
      analyzingHint: "AI sedang mengenali tumbuhan dari gambarmu",
      dropHere: "Lepaskan gambar di sini",
      formats: "Format: JPG, PNG, WEBP • Maks 10 MB",
      noImage: "Belum ada gambar. Unggah atau ambil foto terlebih dahulu.",
      needApiKeyTitle: "Kunci API Gemini Diperlukan",
      needApiKeyDesc:
        "Untuk mulai memindai, masukkan kunci API Gemini kamu di pengaturan. Model: gemini-2.5-flash-lite.",
      goToSettings: "Buka Pengaturan",
      getApiKey: "Dapatkan Kunci API",
    },

    // Result
    result: {
      title: "Hasil Identifikasi",
      confidence: "Tingkat Keyakinan",
      plantName: "Nama Tumbuhan",
      latinName: "Nama Latin",
      category: "Kategori",
      habitat: "Habitat",
      benefits: "Manfaat",
      care: "Cara Perawatan",
      dangerLevel: "Tingkat Bahaya",
      description: "Deskripsi",
      saveHistory: "Simpan ke Riwayat",
      saved: "Tersimpan di Riwayat",
      favorite: "Tambah Favorit",
      unfavorited: "Hapus Favorit",
      share: "Bagikan",
      shared: "Tautan disalin",
      rescan: "Pindai Lagi",
      notDetected: "Tumbuhan Tidak Dikenali",
      notDetectedDesc:
        "AI tidak dapat mengenali tumbuhan dari gambar ini. Coba foto lain dengan sudut & pencahayaan lebih jelas.",
      low: "Rendah",
      medium: "Sedang",
      high: "Tinggi",
    },

    // History
    history: {
      title: "Riwayat Pemindaian",
      subtitle: "Semua tanaman yang pernah kamu pindai",
      empty: "Belum ada riwayat",
      emptyDesc: "Mulai pindai tumbuhan untuk mengisi riwayatmu.",
      startScan: "Mulai Pindai",
      search: "Cari nama tumbuhan…",
      all: "Semua",
      favoritesOnly: "Favorit",
      delete: "Hapus",
      view: "Lihat Detail",
      confirmDelete: "Hapus riwayat ini?",
      confirmDeleteDesc: "Tindakan ini tidak dapat dibatalkan.",
      cancel: "Batal",
      confirm: "Hapus",
      deleted: "Riwayat dihapus",
    },

    // Favorites
    favorites: {
      title: "Tanaman Favorit",
      subtitle: "Koleksi tumbuhan yang kamu tandai",
      empty: "Belum ada favorit",
      emptyDesc: "Tandai tanaman favorit dari hasil pemindaian.",
    },

    // Settings
    settings: {
      title: "Pengaturan",
      subtitle: "Kelola preferensi aplikasi & kunci API",
      apiKeyTitle: "Kunci API Gemini",
      apiKeyDesc:
        "Diperlukan untuk mengakses model Gemini 2.5 Flash Lite. Disimpan lokal di peramban kamu.",
      apiKeyPlaceholder: "Tempel kunci API Gemini di sini…",
      saveApiKey: "Simpan Kunci API",
      apiKeySaved: "Kunci API tersimpan",
      apiKeyClear: "Hapus Kunci",
      getApiKey: "Dapatkan Kunci API Gratis",
      haveKey: "Kunci API aktif",
      noKey: "Belum ada kunci API",
      appearance: "Tampilan",
      appearanceDesc: "Pilih tema gelap atau terang",
      light: "Terang",
      dark: "Gelap",
      system: "Sistem",
      language: "Bahasa",
      languageDesc: "Pilih bahasa antarmuka",
      indonesian: "Bahasa Indonesia",
      english: "English",
      data: "Data",
      dataDesc: "Kelola data riwayat pemindaian",
      clearAll: "Hapus Semua Riwayat",
      confirmClearAll: "Hapus semua riwayat?",
      confirmClearAllDesc:
        "Seluruh data riwayat dan favorit akan dihapus permanen.",
      about: "Tentang",
      aboutDesc:
        "FloraScan AI adalah aplikasi pemindai tumbuhan berbasis Gemini AI Vision.",
      version: "Versi",
    },

    // Footer
    footer: {
      tagline:
        "Pemindai tumbuhan cerdas berbasis AI Gemini. Dibuat untuk para pecinta alam.",
      links: "Tautan",
      product: "Produk",
      resources: "Sumber Daya",
      rights: "Hak cipta dilindungi.",
      madeWith: "Dibuat dengan",
      andGemini: "dan Gemini AI",
    },

    // Toasts
    toast: {
      apiKeyRequired: "Mohon masukkan kunci API Gemini terlebih dahulu",
      scanError: "Gagal menganalisis gambar. Periksa kunci API & coba lagi.",
      locationUnsupported:
        "API Gemini tidak tersedia di wilayah ini. Coba jaringan/wilayah lain.",
      saved: "Berhasil disimpan ke riwayat",
      saveError: "Gagal menyimpan riwayat",
      deleted: "Riwayat dihapus",
      deleteError: "Gagal menghapus",
      favorited: "Ditambahkan ke favorit",
      unfavorited: "Dihapus dari favorit",
      copied: "Disalin ke papan klip",
      loadError: "Gagal memuat data",
      imageTooLarge: "Ukuran gambar terlalu besar. Maks 10 MB.",
      invalidImage: "File tidak valid. Gunakan JPG, PNG, atau WEBP.",
    },

    common: {
      loading: "Memuat…",
      close: "Tutup",
      back: "Kembali",
      save: "Simpan",
      cancel: "Batal",
      delete: "Hapus",
      retry: "Coba Lagi",
      error: "Terjadi kesalahan",
    },
  },

  en: {
    brand: "FloraScan AI",
    tagline: "Smart Plant Scanner",

    nav: {
      home: "Home",
      scanner: "Scan",
      history: "History",
      favorites: "Favorites",
      settings: "Settings",
    },

    hero: {
      badge: "Powered by Gemini 2.5 Flash Lite",
      title: "Identify Any Plant in an Instant",
      subtitle:
        "Upload a photo or use your camera — let AI recognize flowers, leaves, and plants around you, complete with latin name, habitat, benefits, and care tips.",
      ctaScan: "Start Scanning",
      ctaLearn: "See How It Works",
      stat1: "Detected Species",
      stat2: "AI Accuracy",
      stat3: "Fast Response",
    },

    features: {
      title: "Why FloraScan AI?",
      subtitle:
        "State-of-the-art vision AI for plant lovers, researchers, and learners.",
      f1Title: "Accurate Detection",
      f1Desc: "Gemini 2.5 Flash Lite analyzes visuals with high precision.",
      f2Title: "Complete Info",
      f2Desc:
        "Latin name, habitat, benefits, care, and toxicity level included.",
      f3Title: "History & Favorites",
      f3Desc: "Save your scans and bookmark your favorite plants.",
      f4Title: "Multi-Language",
      f4Desc: "Friendly interface in both Indonesian & English.",
      f5Title: "Dark Mode",
      f5Desc: "Comfortable day or night with light/dark themes.",
      f6Title: "Mobile Friendly",
      f6Desc: "Scan right from your phone's camera, wherever you are.",
    },

    how: {
      title: "How It Works",
      step1Title: "Upload / Capture",
      step1Desc: "Choose from gallery or take a photo with your camera.",
      step2Title: "AI Analyzes",
      step2Desc: "Gemini Vision processes the image and identifies the plant.",
      step3Title: "View Results",
      step3Desc: "Get full information and save to history if needed.",
    },

    scanner: {
      title: "Scan Plant",
      subtitle: "Upload a plant photo to identify with AI",
      upload: "Upload Image",
      uploadHint: "Click to choose or drag an image here",
      camera: "Open Camera",
      capture: "Capture",
      switchCamera: "Switch Camera",
      closeCamera: "Close Camera",
      retake: "Retake",
      analyze: "Analyze with AI",
      analyzing: "Analyzing…",
      analyzingHint: "AI is recognizing the plant from your image",
      dropHere: "Drop the image here",
      formats: "Format: JPG, PNG, WEBP • Max 10 MB",
      noImage: "No image yet. Upload or capture a photo first.",
      needApiKeyTitle: "Gemini API Key Required",
      needApiKeyDesc:
        "To start scanning, enter your Gemini API key in settings. Model: gemini-2.5-flash-lite.",
      goToSettings: "Open Settings",
      getApiKey: "Get API Key",
    },

    result: {
      title: "Identification Result",
      confidence: "Confidence",
      plantName: "Plant Name",
      latinName: "Latin Name",
      category: "Category",
      habitat: "Habitat",
      benefits: "Benefits",
      care: "Care Instructions",
      dangerLevel: "Toxicity Level",
      description: "Description",
      saveHistory: "Save to History",
      saved: "Saved to History",
      favorite: "Add to Favorites",
      unfavorited: "Remove Favorite",
      share: "Share",
      shared: "Link copied",
      rescan: "Scan Again",
      notDetected: "Plant Not Recognized",
      notDetectedDesc:
        "AI could not recognize the plant from this image. Try another photo with a clearer angle & lighting.",
      low: "Low",
      medium: "Medium",
      high: "High",
    },

    history: {
      title: "Scan History",
      subtitle: "All plants you've ever scanned",
      empty: "No history yet",
      emptyDesc: "Start scanning plants to fill your history.",
      startScan: "Start Scanning",
      search: "Search plant name…",
      all: "All",
      favoritesOnly: "Favorites",
      delete: "Delete",
      view: "View Details",
      confirmDelete: "Delete this entry?",
      confirmDeleteDesc: "This action cannot be undone.",
      cancel: "Cancel",
      confirm: "Delete",
      deleted: "History deleted",
    },

    favorites: {
      title: "Favorite Plants",
      subtitle: "Plants you've bookmarked",
      empty: "No favorites yet",
      emptyDesc: "Mark your favorite plants from scan results.",
    },

    settings: {
      title: "Settings",
      subtitle: "Manage app preferences & API key",
      apiKeyTitle: "Gemini API Key",
      apiKeyDesc:
        "Required to access the Gemini 2.5 Flash Lite model. Stored locally in your browser.",
      apiKeyPlaceholder: "Paste your Gemini API key here…",
      saveApiKey: "Save API Key",
      apiKeySaved: "API key saved",
      apiKeyClear: "Clear Key",
      getApiKey: "Get a Free API Key",
      haveKey: "API key active",
      noKey: "No API key yet",
      appearance: "Appearance",
      appearanceDesc: "Choose dark or light theme",
      light: "Light",
      dark: "Dark",
      system: "System",
      language: "Language",
      languageDesc: "Choose interface language",
      indonesian: "Bahasa Indonesia",
      english: "English",
      data: "Data",
      dataDesc: "Manage your scan history data",
      clearAll: "Clear All History",
      confirmClearAll: "Clear all history?",
      confirmClearAllDesc:
        "All history and favorites data will be permanently deleted.",
      about: "About",
      aboutDesc:
        "FloraScan AI is a plant scanner app built on Gemini AI Vision.",
      version: "Version",
    },

    footer: {
      tagline:
        "Smart plant scanner powered by Gemini AI. Built for nature lovers.",
      links: "Links",
      product: "Product",
      resources: "Resources",
      rights: "All rights reserved.",
      madeWith: "Built with",
      andGemini: "and Gemini AI",
    },

    toast: {
      apiKeyRequired: "Please enter your Gemini API key first",
      scanError: "Failed to analyze image. Check your API key & try again.",
      locationUnsupported:
        "Gemini API is not available in this region. Try a different network/region.",
      saved: "Successfully saved to history",
      saveError: "Failed to save history",
      deleted: "History deleted",
      deleteError: "Failed to delete",
      favorited: "Added to favorites",
      unfavorited: "Removed from favorites",
      copied: "Copied to clipboard",
      loadError: "Failed to load data",
      imageTooLarge: "Image is too large. Max 10 MB.",
      invalidImage: "Invalid file. Use JPG, PNG, or WEBP.",
    },

    common: {
      loading: "Loading…",
      close: "Close",
      back: "Back",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      retry: "Try Again",
      error: "Something went wrong",
    },
  },
} as const;
