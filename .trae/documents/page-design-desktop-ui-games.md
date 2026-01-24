# Page Design Spec — Desktop UI + Games

## Global Styles (Desktop-first)
- **Typography**: IBM Plex Sans (Heading semibold, Body regular)
- **Color tokens (flat, no gradient)**
  - Primary: #2563EB
  - Secondary: #9333EA
  - Accent: #F59E0B
  - Neutral background: #F9FAFB (light) / near-black surface untuk dark
  - Text: #111827 (light) / light text untuk dark; muted #6B7280
  - Error: #DC2626, Success: #16A34A
- **Spacing & layout**: 8px grid, min padding 16px, max content width 1280px untuk konten dalam window (jika ada halaman bertipe form/list)
- **Theme**: light/dark via CSS variables (atau class `dark`), semua komponen membaca token yang sama
- **Buttons**: rounded-2xl, solid background; hover: sedikit gelap/terang (tanpa gradient)
- **Cards/Surfaces**: rounded-2xl, border halus, shadow-sm
- **Inputs**: rounded-lg, focus ring jelas (kontras)
- **Icons**: Lucide React

## Komponen Global (reusable)
1. **WindowFrame**
   - Struktur: Titlebar + Content area
   - State: focused/unfocused (mengubah shadow/border)
2. **WindowTitlebar**
   - Kiri: App icon + title
   - Kanan: WindowControls (minimize/maximize/close)
3. **WindowControls (theme-adaptive)**
   - Tombol: Minimize, Maximize/Restore, Close
   - Perilaku adaptif:
     - **Light theme**: ikon/foreground gelap di surface terang, hover memiliki background netral kontras.
     - **Dark theme**: ikon/foreground terang di surface gelap, hover memiliki background netral gelap.
   - State:
     - Hover
     - Active/pressed
     - Disabled (jika window tidak mendukung aksi tertentu)
4. **DesktopIcon**
   - Berisi: icon + label
   - State: default, hover, selected (outline/indicator)
5. **DraggableLayer**
   - Mengelola drag pointer/mouse/keyboard (minimal pointer/mouse)
   - Snap-to-grid berbasis 8px (atau step tertentu) agar rapi

---

## Page 1 — Desktop (Home)
### Layout
- Full viewport.
- **Desktop area** menggunakan positioning (absolute) untuk ikon supaya bisa bebas dipindah.
- Window yang terbuka ditumpuk (z-index) dan dapat difokuskan.

### Meta Information
- Title: "Desktop"
- Description: "Desktop untuk membuka app, atur ikon, dan window controls."
- Open Graph: title + description sederhana.

### Page Structure
1. **Desktop Background/Surface**
   - Light: neutral background (#F9FAFB)
   - Dark: surface gelap
2. **Icon Layer**
   - Kumpulan DesktopIcon (Games, Settings, dan app lain yang sudah ada)
3. **Window Layer**
   - Kumpulan WindowFrame untuk app yang sedang terbuka

### Sections & Components
- **DesktopIcon grid/placement**
  - Default placement: kolom kiri atas (atau layout awal yang sudah ada)
  - Drag behavior:
    - Saat drag: ikon “mengambang” (shadow tipis), pointer capture.
    - Saat drop: posisi disimpan.
  - Persist:
    - Key per ikon (mis. `games`, `settings`).
    - Menyimpan `x/y` dalam client storage.
    - Saat load: jika posisi tersimpan, gunakan itu; jika tidak, gunakan default.
- **WindowFrame + WindowControls**
  - Titlebar tinggi ~40–48px.
  - WindowControls berada di kanan atas titlebar.
  - Tombol close memiliki affordance lebih kuat (warna error saat hover) namun tetap flat.
  - Kontras harus aman pada light/dark.

---

## Page 2 — Games
### Layout
- Berjalan di dalam WindowFrame.
- Layout hybrid: kiri panel list, kanan area game.
  - Kiri: fixed width 240–280px.
  - Kanan: fleksibel, memuat area game.

### Meta Information
- Title: "Games"
- Description: "Mainkan 5 mini game: Snake, Pacman, Dino, Tic-tac-toe, Memory."
- Open Graph: title + description.

### Page Structure
1. **Games Sidebar**
2. **Game Stage (Area bermain)**
3. **Game Toolbar (kontrol minimal)**

### Sections & Components
- **Games Sidebar**
  - List item: Snake, Pacman, Dino, Tic-tac-toe, Memory
  - Item aktif: highlight (primary)
- **Game Stage**
  - Mengisi area kanan.
  - Untuk game canvas-based: area canvas dipusatkan, dengan padding.
  - Untuk game DOM-based (tic-tac-toe/memory): grid berada di center.
  - Menyediakan state kosong: “Pilih game untuk mulai”.
- **Game Toolbar**
  - Tombol minimal:
    - Start (jika game belum mulai)
    - Restart
    - Back to list
  - Petunjuk kontrol singkat sesuai game (contoh: "Arrow keys untuk bergerak")

### Responsiveness
- Pada layar lebih sempit: sidebar menjadi collapsible (drawer) dan game stage jadi full width.

---

## Page 3 — Settings (Appearance)
### Layout
- Berjalan di dalam WindowFrame.
- Layout dua kolom: sidebar settings + konten.

### Meta Information
- Title: "Settings — Appearance"
- Description: "Atur tema light/dark dan preview."
- Open Graph: title + description.

### Page Structure
1. **Settings Sidebar**: menu item minimal “Appearance”
2. **Appearance Content**
   - Toggle/segmented control: Light / Dark (dan/atau System bila sudah ada)
   - Preview area: contoh Titlebar + WindowControls untuk memastikan adaptif

### Sections & Components
- **Theme control**
  - Aksi: pilih theme → apply global tokens
  - Persist: simpan preferensi theme (atau gunakan mekanisme theme persistence yang sudah ada)
- **Preview WindowControls**
  - Menampilkan 3 tombol (min/max/close) dan memperlihatkan style untuk theme aktif

### Interaction States
- Toggle: hover/focus jelas
- Transisi theme: 150–250ms (background/text) agar nyaman, tanpa animasi berat
