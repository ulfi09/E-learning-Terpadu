import {
  UserProfile,
  Course,
  ModuleItem,
  Assignment,
  Exam,
  AttendanceRecord,
  DiscussionThread,
} from '../types';

export const TEACHER_USER: UserProfile = {
  id: 'guru_budi_01',
  name: 'Budi Santoso, M.Kom',
  role: 'guru',
  email: 'budi.santoso@lentera.edu',
  avatarUrl: '/src/assets/images/avatar_teacher_male_1793791074714.jpg',
  identifier: '19850412.201001.1.003',
  department: 'Departemen Informatika & Sains Terapan',
};

export const STUDENT_USER: UserProfile = {
  id: 'siswa_nadia_01',
  name: 'Nadia Putri Pratama',
  role: 'siswa',
  email: 'nadia.putri@lentera.edu',
  avatarUrl: '/src/assets/images/avatar_student_female_1793791075915.jpg',
  identifier: '2024.12.088',
  className: 'XII MIPA 1 - Sains Komputasi',
};

export const PEER_STUDENTS: Array<{ id: string; name: string; nis: string; avatar: string; email: string; className: string; enrolledDate?: string; phone?: string }> = [
  { id: 'siswa_nadia_01', name: 'Nadia Putri Pratama', nis: '2024.12.088', avatar: '/src/assets/images/avatar_student_female_1793791075915.jpg', email: 'nadia.putri@lentera.edu', className: 'XII MIPA 1 - Sains Komputasi', enrolledDate: '15 Juli 2024', phone: '0812-3456-7890' },
  { id: 'siswa_ahmad_02', name: 'Ahmad Fauzi Rahman', nis: '2024.12.012', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80', email: 'ahmad.fauzi@lentera.edu', className: 'XII MIPA 1 - Sains Komputasi', enrolledDate: '15 Juli 2024', phone: '0813-9876-5432' },
  { id: 'siswa_dimas_03', name: 'Dimas Anggara Saputra', nis: '2024.12.045', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80', email: 'dimas.anggara@lentera.edu', className: 'XII MIPA 1 - Sains Komputasi', enrolledDate: '16 Juli 2024', phone: '0821-4567-8901' },
  { id: 'siswa_rina_04', name: 'Rina Wulandari', nis: '2024.12.094', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80', email: 'rina.wulandari@lentera.edu', className: 'XII MIPA 1 - Sains Komputasi', enrolledDate: '16 Juli 2024', phone: '0852-3456-7812' },
  { id: 'siswa_siti_05', name: 'Siti Rahmawati', nis: '2024.12.110', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80', email: 'siti.rahmawati@lentera.edu', className: 'XII MIPA 1 - Sains Komputasi', enrolledDate: '17 Juli 2024', phone: '0877-1234-5678' },
  { id: 'siswa_kevin_06', name: 'Kevin Alexander Tan', nis: '2024.12.067', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', email: 'kevin.alexander@lentera.edu', className: 'XII MIPA 1 - Sains Komputasi', enrolledDate: '17 Juli 2024', phone: '0896-7890-1234' },
];

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course_web_01',
    code: 'INF-301',
    title: 'Pemrograman Web Modern & Arsitektur Cloud',
    instructorName: 'Budi Santoso, M.Kom',
    instructorId: 'guru_budi_01',
    category: 'Teknologi Informasi',
    description: 'Mempelajari arsitektur full-stack modern, manajemen state reaktif, RESTful API, dan deployment cloud scalability.',
    coverImage: '/src/assets/images/course_stem_visual_1793791075256.jpg',
    themeColor: 'indigo',
    scheduleDay: 'Senin & Kamis',
    scheduleTime: '08:00 - 09:40 WIB',
    room: 'Lab Komputasi 3 & Virtual Cloud',
    credits: 4,
  },
  {
    id: 'course_math_02',
    code: 'MAT-202',
    title: 'Matematika Terapan & Kalkulus Diferensial',
    instructorName: 'Budi Santoso, M.Kom',
    instructorId: 'guru_budi_01',
    category: 'Matematika & Sains Terapan',
    description: 'Pendalaman konsep turunan fungsional, optimasi variabel ganda, limit barisan, dan aplikasi integral dalam komputasi.',
    coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
    themeColor: 'blue',
    scheduleDay: 'Selasa & Jumat',
    scheduleTime: '10:00 - 11:40 WIB',
    room: 'Ruang Teori R-204',
    credits: 4,
  },
  {
    id: 'course_phy_03',
    code: 'FIS-104',
    title: 'Fisika Komputasi & Mekanika Gelombang',
    instructorName: 'Dr. Aris Sudarsono, M.Si',
    instructorId: 'guru_aris_02',
    category: 'Sains Eksakta',
    description: 'Simulasi osilasi harmonik, superposisi medan elektromagnetik, dan pemodelan numerik persamaan difraksi gelombang.',
    coverImage: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80',
    themeColor: 'emerald',
    scheduleDay: 'Rabu',
    scheduleTime: '08:00 - 10:30 WIB',
    room: 'Laboratorium Fisika Modern',
    credits: 3,
  },
  {
    id: 'course_bio_04',
    code: 'BIO-205',
    title: 'Biologi Seluler & Rekayasa Genetika',
    instructorName: 'Ibu Maya Lestari, M.Si',
    instructorId: 'guru_maya_03',
    category: 'Biologi Modern',
    description: 'Studi mekanisme replikasi DNA, translasi protein seluler, manipulasi CRISPR-Cas9, dan etika bio-teknologi.',
    coverImage: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80',
    themeColor: 'teal',
    scheduleDay: 'Kamis',
    scheduleTime: '13:00 - 15:30 WIB',
    room: 'Laboratorium Bioteknologi',
    credits: 3,
  },
];

export const INITIAL_MODULES: ModuleItem[] = [
  {
    id: 'mod_web_01',
    courseId: 'course_web_01',
    title: 'Arsitektur Single Page Application (SPA) & Reactive State',
    chapter: 'Bab 1: Dasar Arsitektur Modern',
    description: 'Membedah siklus hidup komponen, paradigma declarative rendering, dan virtual DOM reconciliation.',
    contentType: 'pdf',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    fileSize: '4.2 MB',
    publishedAt: '2026-10-18',
    textContent: `# Bab 1: Arsitektur Single Page Application (SPA)

## 1. Konsep Dasar SPA
Aplikasi Halaman Tunggal (Single-Page Application) memuat satu dokumen HTML utama dan memperbarui konten secara dinamis tanpa perlu merefresh seluruh halaman web ke server.

### Keunggulan Utama:
- **Respon Cepat**: Setelah bundle aset awal dimuat, interaksi terasa instan dan natural seperti aplikasi native.
- **Pemisahan Logika (Separation of Concerns)**: Frontend murni berfokus pada rendering antarmuka pengguna (UI/UX), sedangkan backend bertindak sebagai penyedia data via API.
- **Efisiensi Bandwidth**: Hanya data berformat JSON mentah yang ditransmisikan setelah render pertama.

## 2. Reaktifitas dan State Management
State adalah representasi memori dari status aplikasi pada satu waktu tertentu. Ketika state bermutasi, antarmuka pengguna secara otomatis dirender ulang dengan komparasi diffing cerdas.

> "State mengalir ke bawah (props), aksi mengalir ke atas (events)."

### Best Practices:
1. Hindari redundansi data dalam state.
2. Turunkan nilai terhitung (computed values) dari state yang ada alih-alih menduplikatnya.
3. Pisahkan antara Client UI State (seperti modal terbuka/tertutup) dan Server Cache State.`,
    downloadUrl: '/downloads/materi_spa_arsitektur.pdf',
    attachmentFileName: 'Materi_Arsitektur_SPA.pdf',
    attachmentFileSize: '4.2 MB',
    downloadCount: 38,
    readByStudentIds: ['siswa_nadia_01', 'siswa_ahmad_02', 'siswa_rina_04'],
  },
  {
    id: 'mod_web_video_01',
    courseId: 'course_web_01',
    title: 'Video Kuliah: Membangun Full-Stack REST API & Web Security',
    chapter: 'Bab 2: Rekayasa Jaringan & API',
    description: 'Sesi video pembelajaran interaktif membahas perancangan arsitektur backend, autentikasi berbasis token JWT, CORS, dan enkripsi payload.',
    contentType: 'video',
    coverImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.youtube.com/embed/SqcY0GlETPk', // High quality web dev video embed
    fileSize: '28.4 MB (Video HD)',
    publishedAt: '2026-10-22',
    textContent: `# Video Kuliah: Membangun Full-Stack REST API & Web Security

## Panduan Menonton:
Tonton video pembelajaran berdurasi penuh di atas. Video ini mencakup demonstrasi langsung implementasi Express server, validasi schema request, dan pengamanan header HTTP.

### Poin Kunci Video:
1. **Struktur Route & Middleware**: Menempatkan authentication guard sebelum mengakses resource sensitif.
2. **Error Boundary**: Mencegah server crash dengan sentralisasi asynchronous error catcher.
3. **Penyimpanan Password**: Hashing dengan salt menggunakan bcrypt sebelum disimpan ke database.`,
    downloadUrl: '/downloads/materi_video_rest_api.pdf',
    attachmentFileName: 'Catatan_Kuliah_REST_Security.pdf',
    attachmentFileSize: '2.1 MB',
    downloadCount: 52,
    readByStudentIds: ['siswa_nadia_01', 'siswa_dimas_03'],
  },
  {
    id: 'mod_web_ppt_01',
    courseId: 'course_web_01',
    title: 'Slide Presentasi: Desain Sistem & Microservices Overview',
    chapter: 'Bab 3: Arsitektur Skala Besar',
    description: 'Slide materi kuliah dalam format Microsoft PowerPoint (.pptx) memuat diagram arsitektur load balancer, message queue, dan caching layer.',
    contentType: 'ppt',
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    fileSize: '6.8 MB (PPTX)',
    publishedAt: '2026-10-24',
    textContent: `# Slide Presentasi: Desain Sistem & Microservices Overview

Berkas slide kuliah resmi telah dilampirkan dalam format Microsoft PowerPoint (.pptx).

## Ringkasan Slide:
- **Slide 1-5**: Evolusi Monolitik ke Microservices
- **Slide 6-12**: Pola Komunikasi Sinkron vs Asinkron (RabbitMQ & Kafka)
- **Slide 13-18**: Database Sharding & Read Replicas
- **Slide 19-24**: Studi Kasus High-Availability Cloud Deployment

Silakan unduh slide presentasi melalui tombol di bawah untuk keperluan presentasi kelompok atau belajar mandiri.`,
    downloadUrl: '/downloads/slide_desain_sistem.pptx',
    attachmentFileName: 'Slide_Arsitektur_Microservices_Bab3.pptx',
    attachmentFileSize: '6.8 MB',
    downloadCount: 41,
    readByStudentIds: ['siswa_nadia_01'],
  },
  {
    id: 'mod_math_01',
    courseId: 'course_math_02',
    title: 'Turunan Fungsi Implisit & Masalah Nilai Maksimum-Minimum',
    chapter: 'Bab 3: Kalkulus Diferensial Lanjut',
    description: 'Metode derivatif bertingkat untuk optimasi algoritma kecerdasan buatan dan analisis sensitivitas gradien.',
    contentType: 'slide',
    coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
    fileSize: '5.5 MB',
    publishedAt: '2026-10-20',
    textContent: `# Bab 3: Turunan Implisit & Optimasi

## 1. Definisi Fungsi Implisit
Sebuah fungsi dikatakan implisit apabila variabel terikat $y$ tidak dipisahkan secara eksplisit di satu ruas persamaan (misal: $x^2 + y^2 = 25$).

## 2. Aturan Rantai (Chain Rule)
Ketika mendiferensiasikan suku yang memuat variabel $y$ terhadap $x$, kita selalu mengalikan dengan faktor $\\frac{dy}{dx}$.

Contoh:
$$\\frac{d}{dx}[y^3] = 3y^2 \\cdot \\frac{dy}{dx}$$

## 3. Titik Kritis & Uji Turunan Kedua
Untuk menemukan nilai maksimum atau minimum lokal:
1. Hitung titik stasioner di mana $f'(x) = 0$.
2. Jika $f''(c) > 0$, maka titik tersebut adalah minimum lokal.
3. Jika $f''(c) < 0$, maka titik tersebut adalah maksimum lokal.`,
    downloadUrl: '/downloads/kalkulus_turunan_implisit.pdf',
    attachmentFileName: 'Diktat_Kalkulus_Turunan_Implisit.pdf',
    attachmentFileSize: '5.5 MB',
    downloadCount: 42,
    readByStudentIds: ['siswa_nadia_01', 'siswa_dimas_03'],
  },
  {
    id: 'mod_phy_01',
    courseId: 'course_phy_03',
    title: 'Prinsip Superposisi Gelombang & Interferensi Celah Ganda',
    chapter: 'Bab 2: Optik Gelombang Komputasional',
    description: 'Eksperimen celah Thomas Young dan pemodelan matematis distribusi intensitas cahaya pada layar.',
    contentType: 'interactive',
    coverImage: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80',
    videoUrl: 'https://www.youtube.com/embed/5U2_01V4fvg',
    fileSize: '6.1 MB',
    publishedAt: '2026-10-28',
    textContent: `# Bab 2: Superposisi & Interferensi Gelombang

## 1. Eksperimen Celah Ganda Young
Cahaya monokromatik dengan panjang gelombang $\\lambda$ yang dilewatkan melalui dua celah sempit dengan jarak pisah $d$ akan membentuk pola garis terang dan gelap pada layar sejauh $L$.

### Formulasi Pola Terang (Interferensi Konstruktif):
$$d \\sin \\theta = m \\lambda, \\quad m = 0, 1, 2, \\dots$$

### Formulasi Pola Gelap (Interferensi Destruktif):
$$d \\sin \\theta = \\left(m + \\frac{1}{2}\\right) \\lambda$$`,
    downloadUrl: '/downloads/fisika_interferensi_gelombang.pdf',
    attachmentFileName: 'Modul_Eksperimen_Celah_Ganda.pdf',
    attachmentFileSize: '6.1 MB',
    downloadCount: 19,
    readByStudentIds: [],
  },
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'task_web_01',
    courseId: 'course_web_01',
    title: 'Implementasi Reactive State Management & Filter Data Terpadu',
    chapter: 'Bab 1: Arsitektur Modern',
    instructions: 'Buatlah implementasi komponen web responsif yang mengelola state lokal dan global. Pastikan terdapat fitur pencarian dinamis, penyaringan multi-kategori, dan pengurutan tanpa re-fetch data berulang. Tuliskan analisis efisiensi kompleksitas waktu rendering (O-notation) pada jawaban esai Anda.',
    assignedDate: '2026-10-28',
    deadline: '2026-11-06T23:59:00',
    maxScore: 100,
    weightPercentage: 20,
    allowedFormats: ['PDF', 'ZIP', 'DOCX'],
    submissions: [
      {
        id: 'sub_nadia_01',
        assignmentId: 'task_web_01',
        studentId: 'siswa_nadia_01',
        studentName: 'Nadia Putri Pratama',
        studentNis: '2024.12.088',
        submittedAt: '2026-11-02T14:32:00',
        status: 'graded',
        fileName: 'Tugas1_NadiaPutri_StateManagement.zip',
        fileSize: '3.4 MB',
        essayAnswer: 'Solusi menggunakan useMemo dan custom hook untuk meminimalkan komputasi ulang filter array. Kompleksitas pencarian dioptimalkan menjadi O(n) dengan index lookup.',
        studentNotes: 'Sudah diuji di Chrome & Firefox. Demo file index.html disertakan dalam arsip.',
        score: 95,
        feedback: 'Pekerjaan sangat rapi dan modular! Pembahasan O(n) terperinci dengan uji kasus edge yang baik. Pertahankan kualitas analisis seperti ini.',
        gradedAt: '2026-11-03T09:15:00',
      },
      {
        id: 'sub_ahmad_02',
        assignmentId: 'task_web_01',
        studentId: 'siswa_ahmad_02',
        studentName: 'Ahmad Fauzi Rahman',
        studentNis: '2024.12.012',
        submittedAt: '2026-11-03T18:10:00',
        status: 'submitted',
        fileName: 'AhmadFauzi_Tugas1_Web.zip',
        fileSize: '2.9 MB',
        essayAnswer: 'Mengimplementasikan event handler ter-debounce dengan lodash-equivalent native timer untuk mengurangi frekuensi filter.',
        studentNotes: 'Mohon masukan mengenai struktur foldernya, Pak.',
      },
    ],
  },
  {
    id: 'task_math_01',
    courseId: 'course_math_02',
    title: 'Analisis Optimasi Biaya Konstruksi Wadah Silinder',
    chapter: 'Bab 3: Optimasi Kalkulus',
    instructions: 'Sebuah tangki silinder terbuka di bagian atas harus memiliki volume tepat 1.000 liter (1 m³). Tentukan rasio jari-jari r dan tinggi h agar luas bahan logam minimum. Lampirkan lembar coretan langkah matematis dan grafik pendukung.',
    assignedDate: '2026-11-01',
    deadline: '2026-11-08T23:59:00',
    maxScore: 100,
    weightPercentage: 25,
    allowedFormats: ['PDF'],
    submissions: [
      {
        id: 'sub_nadia_math',
        assignmentId: 'task_math_01',
        studentId: 'siswa_nadia_01',
        studentName: 'Nadia Putri Pratama',
        studentNis: '2024.12.088',
        submittedAt: '2026-11-04T01:20:00',
        status: 'submitted',
        fileName: 'Analisis_Optimasi_Silinder_NadiaPutri.pdf',
        fileSize: '1.8 MB',
        essayAnswer: 'Didapatkan bahwa luas permukaan minimum tercapai ketika r = h = (1/π)^(1/3) ≈ 0.6827 meter. Pembuktian menggunakan uji turunan kedua menghasilkan nilai positif, memastikan titik minimum.',
        studentNotes: 'Dilengkapi grafik turunan fungsi luas permukaan menggunakan GeoGebra.',
      },
    ],
  },
  {
    id: 'task_web_02',
    courseId: 'course_web_01',
    title: 'Desain RESTful API & Keamanan Token Autentikasi',
    chapter: 'Bab 2: Integrasi Backend',
    instructions: 'Rancang spesifikasi OpenAPI / Swagger untuk modul e-learning sederhana yang memuat endpoint mata pelajaran, tugas, dan nilai. Sertakan diagram alur autentikasi JWT.',
    assignedDate: '2026-11-03',
    deadline: '2026-11-12T23:59:00',
    maxScore: 100,
    weightPercentage: 25,
    allowedFormats: ['PDF', 'JSON', 'ZIP'],
    submissions: [],
  },
];

export const INITIAL_EXAMS: Exam[] = [
  {
    id: 'exam_web_mid',
    courseId: 'course_web_01',
    title: 'Evaluasi Tengah Semester: Rekayasa Web & State Reaktif',
    description: 'Ujian komprehensif menguji pemahaman arsitektur frontend modern, konsep DOM reconciliation, manipulasi asynchronous, serta perancangan sistem.',
    durationMinutes: 30,
    deadline: '2026-11-10T18:00:00',
    passingScore: 75,
    isPublished: true,
    questions: [
      {
        id: 'q_web_1',
        type: 'multiple_choice',
        text: 'Manakah dari pernyataan berikut yang paling tepat menggambarkan keunggulan utama Virtual DOM dibanding manipulasi DOM langsung?',
        options: [
          { id: 'opt_a', text: 'Virtual DOM selalu menggunakan memori server untuk merender HTML secara instan.' },
          { id: 'opt_b', text: 'Virtual DOM melakukan batching komparasi perubahan (diffing) dan hanya memperbarui elemen riil yang berubah pada DOM browser.' },
          { id: 'opt_c', text: 'Virtual DOM menghapus kebutuhan terhadap file JavaScript dan CSS pada browser klien.' },
          { id: 'opt_d', text: 'Virtual DOM secara otomatis mengubah semua kode asinkron menjadi sinkron tanpa Promise.' },
        ],
        correctOptionId: 'opt_b',
        points: 20,
        explanation: 'Virtual DOM bekerja sebagai representasi memori ringan dari DOM riil. Dengan algoritma rekonsiliasi, hanya selisih mutasi terkecil yang diterapkan ke DOM browser riil.',
      },
      {
        id: 'q_web_2',
        type: 'multiple_choice',
        text: 'Dalam siklus arsitektur satu arah (Unidirectional Data Flow), bagaimana alur pembaruan state yang dianjurkan?',
        options: [
          { id: 'opt_a', text: 'State dikirim langsung dari komponen anak ke komponen induk melalui variabel global window.' },
          { id: 'opt_b', text: 'Komponen anak mengubah props yang diterima secara langsung tanpa memberitahu komponen induk.' },
          { id: 'opt_c', text: 'State mengalir ke bawah sebagai props, dan komponen anak memicu callback/event yang memperbarui state di induk.' },
          { id: 'opt_d', text: 'Browser memicu reload halaman secara berkala setiap 5 detik untuk mensinkronisasi data.' },
        ],
        correctOptionId: 'opt_c',
        points: 20,
        explanation: 'Prinsip data mengalir ke bawah (props down) dan aksi mengalir ke atas (events up) menjamin prediktabilitas aplikasi.',
      },
      {
        id: 'q_web_3',
        type: 'multiple_choice',
        text: 'Metode HTTP manakah yang dirancang bersifat Idempotent sesuai spesifikasi standar RFC 7231?',
        options: [
          { id: 'opt_a', text: 'Hanya POST' },
          { id: 'opt_b', text: 'GET, PUT, dan DELETE' },
          { id: 'opt_c', text: 'POST dan PATCH saja' },
          { id: 'opt_d', text: 'Tidak ada metode HTTP yang bersifat idempotent' },
        ],
        correctOptionId: 'opt_b',
        points: 20,
        explanation: 'Idempotent berarti pemanggilan berulang dengan parameter sama menghasilkan status sistem yang sama. GET, PUT, dan DELETE adalah idempotent, sedangkan POST tidak.',
      },
      {
        id: 'q_web_4',
        type: 'essay',
        text: 'Jelaskan perbedaan mendasar antara Client-Side Routing dan Server-Side Routing! Bagaimana browser History API memungkinkan navigasi tanpa reload halaman penuh?',
        points: 20,
        rubricGuidance: 'Menilai pemahaman tentang pushState/replaceState, penanganan event popstate, pencegahan reload browser default, dan konsekuensi fallback 404 pada web server.',
      },
      {
        id: 'q_web_5',
        type: 'essay',
        text: 'Berikan skenario nyata di mana terjadi Race Condition dalam pengambilan data asinkron pada antarmuka web, dan jelaskan dua strategi teknis untuk mencegahnya!',
        points: 20,
        rubricGuidance: 'Membahas kasus user mengetik di search bar cepat sehingga respon request lama datang setelah respon request terbaru; solusi: AbortController atau token id generasi request.',
      },
    ],
    submissions: [
      {
        id: 'sub_exam_nadia_01',
        examId: 'exam_web_mid',
        studentId: 'siswa_nadia_01',
        studentName: 'Nadia Putri Pratama',
        startedAt: '2026-11-03T10:00:00',
        submittedAt: '2026-11-03T10:24:30',
        answers: {
          q_web_1: 'opt_b',
          q_web_2: 'opt_c',
          q_web_3: 'opt_b',
          q_web_4: 'Server-side routing mengharuskan browser meminta file HTML utuh baru setiap kali URL berubah, yang menyebabkan jeda putih dan reload aset. Pada client-side routing, JavaScript mencegat klik link (e.preventDefault()), menggunakan history.pushState() untuk mengubah URL di address bar tanpa reload, lalu secara reaktif merender komponen view yang cocok dengan rute baru.',
          q_web_5: 'Contohnya live autocomplete pencarian: user mengetik "Apel" lalu cepat menambah "Apel Manis". Jika server merespon query kedua lebih cepat dari query pertama, hasil lama dapat menimpa hasil baru. Solusinya: menggunakan AbortController untuk membatalkan sinyal request sebelumnya saat request baru dikirim, atau mencatat ID timestamp request.',
        },
        flaggedDoubt: {},
        questionScores: {
          q_web_1: 20,
          q_web_2: 20,
          q_web_3: 20,
          q_web_4: 18,
          q_web_5: 19,
        },
        totalScore: 97,
        maxScore: 100,
        isGraded: true,
        teacherNotes: 'Pemahaman luar biasa tentang History API dan penanganan Race Condition menggunakan AbortController.',
      },
    ],
  },
  {
    id: 'exam_math_01',
    courseId: 'course_math_02',
    title: 'Kuis Harian 02: Turunan Parsial & Gradien Vektor',
    description: 'Kuis singkat berwaktu 15 menit untuk menguji keterampilan kalkulasi diferensial multivariat.',
    durationMinutes: 15,
    deadline: '2026-11-07T21:00:00',
    passingScore: 70,
    isPublished: true,
    questions: [
      {
        id: 'q_mat_1',
        type: 'multiple_choice',
        text: 'Diberikan fungsi f(x, y) = 3x^2 * y - 5y^3 + 2x. Berapakah nilai turunan parsial ∂f/∂x pada titik (1, 2)?',
        options: [
          { id: 'opt_a', text: '14' },
          { id: 'opt_b', text: '12' },
          { id: 'opt_c', text: '8' },
          { id: 'opt_d', text: '20' },
        ],
        correctOptionId: 'opt_a',
        points: 50,
        explanation: '∂f/∂x = 6xy + 2. Pada titik (1, 2): 6(1)(2) + 2 = 12 + 2 = 14.',
      },
      {
        id: 'q_mat_2',
        type: 'essay',
        text: 'Jelaskan arti fisis dan geometris dari vektor gradien ∇f pada suatu fungsi permukaan dua variabel!',
        points: 50,
        rubricGuidance: 'Gradien menunjuk ke arah kenaikan tercepat (steepest ascent) fungsi dan selalu tegak lurus (ortogonal) terhadap kurva tingkat (level curve).',
      },
    ],
    submissions: [],
  },
];

export const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    id: 'att_01',
    date: '2026-11-04',
    courseId: 'course_web_01',
    studentId: 'siswa_nadia_01',
    studentName: 'Nadia Putri Pratama',
    studentNis: '2024.12.088',
    status: 'hadir',
    time: '07:48 WIB',
    location: 'Lab Komputasi 3 (Kampus Pusat)',
    notes: 'Presensi biometrik & WiFi terverifikasi',
  },
  {
    id: 'att_02',
    date: '2026-11-04',
    courseId: 'course_web_01',
    studentId: 'siswa_ahmad_02',
    studentName: 'Ahmad Fauzi Rahman',
    studentNis: '2024.12.012',
    status: 'hadir',
    time: '07:55 WIB',
    location: 'Lab Komputasi 3',
  },
  {
    id: 'att_03',
    date: '2026-11-04',
    courseId: 'course_web_01',
    studentId: 'siswa_dimas_03',
    studentName: 'Dimas Anggara Saputra',
    studentNis: '2024.12.045',
    status: 'izin',
    time: '07:30 WIB',
    location: 'Online',
    notes: 'Mengikuti seleksi olimpiade sains tingkat provinsi',
  },
  {
    id: 'att_04',
    date: '2026-11-04',
    courseId: 'course_web_01',
    studentId: 'siswa_rina_04',
    studentName: 'Rina Wulandari',
    studentNis: '2024.12.094',
    status: 'hadir',
    time: '07:51 WIB',
    location: 'Lab Komputasi 3',
  },
  {
    id: 'att_05',
    date: '2026-11-04',
    courseId: 'course_web_01',
    studentId: 'siswa_siti_05',
    studentName: 'Siti Rahmawati',
    studentNis: '2024.12.110',
    status: 'sakit',
    time: '06:45 WIB',
    location: 'Rumah',
    notes: 'Surat dokter terlampir dalam arsip UKS',
  },
  {
    id: 'att_06',
    date: '2026-11-04',
    courseId: 'course_web_01',
    studentId: 'siswa_kevin_06',
    studentName: 'Kevin Alexander Tan',
    studentNis: '2024.12.067',
    status: 'hadir',
    time: '07:58 WIB',
    location: 'Lab Komputasi 3',
  },
  // Previous dates for Nadia to demonstrate attendance tracking history
  {
    id: 'att_nadia_prev_1',
    date: '2026-11-02',
    courseId: 'course_web_01',
    studentId: 'siswa_nadia_01',
    studentName: 'Nadia Putri Pratama',
    studentNis: '2024.12.088',
    status: 'hadir',
    time: '07:50 WIB',
    location: 'Lab Komputasi 3',
  },
  {
    id: 'att_nadia_prev_2',
    date: '2026-10-29',
    courseId: 'course_web_01',
    studentId: 'siswa_nadia_01',
    studentName: 'Nadia Putri Pratama',
    studentNis: '2024.12.088',
    status: 'hadir',
    time: '07:52 WIB',
    location: 'Lab Komputasi 3',
  },
  {
    id: 'att_nadia_prev_3',
    date: '2026-10-26',
    courseId: 'course_web_01',
    studentId: 'siswa_nadia_01',
    studentName: 'Nadia Putri Pratama',
    studentNis: '2024.12.088',
    status: 'hadir',
    time: '07:44 WIB',
    location: 'Lab Komputasi 3',
  },
];

export const INITIAL_DISCUSSIONS: DiscussionThread[] = [
  {
    id: 'disc_01',
    courseId: 'course_web_01',
    title: 'Bagaimana mengatasi issue Memory Leak pada useEffect setInterval di React?',
    content: 'Selamat sore rekan-rekan dan Pak Budi. Saat membuat countdown timer untuk kuis, saya perhatikan angka timer berjalan semakin cepat ketika berpindah tab browser. Apakah ini disebabkan oleh timer yang belum di-cleanup secara sempurna saat unmount?',
    authorId: 'siswa_nadia_01',
    authorName: 'Nadia Putri Pratama',
    authorRole: 'siswa',
    authorAvatar: '/src/assets/images/avatar_student_female_1793791075915.jpg',
    createdAt: '2026-11-03T11:20:00',
    isPinned: true,
    isResolved: true,
    upvotes: 14,
    upvotedByUserIds: ['guru_budi_01', 'siswa_ahmad_02', 'siswa_rina_04'],
    replies: [
      {
        id: 'reply_guru_01',
        threadId: 'disc_01',
        authorId: 'guru_budi_01',
        authorName: 'Budi Santoso, M.Kom',
        authorRole: 'guru',
        authorAvatar: '/src/assets/images/avatar_teacher_male_1793791074714.jpg',
        content: 'Tepat sekali, Nadia. Setiap kali komponen di-mount atau dependency array memicu re-run, setInterval baru akan diinisialisasi di memori. Jika fungsi return cleanup `clearInterval(timerId)` dihilangkan, interval lama akan tetap hidup di background thread browser. Selalu pastikan Anda me-return cleanup function pada useEffect yang memanggil timer atau websocket subscription!',
        createdAt: '2026-11-03T12:05:00',
        isBestAnswer: true,
        upvotes: 9,
        upvotedByUserIds: ['siswa_nadia_01', 'siswa_dimas_03'],
      },
      {
        id: 'reply_siswa_02',
        threadId: 'disc_01',
        authorId: 'siswa_ahmad_02',
        authorName: 'Ahmad Fauzi Rahman',
        authorRole: 'siswa',
        authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
        content: 'Terima kasih penjelasannya Pak Budi, saya kemarin juga sempat bingung kenapa CPU usage browser naik drastis saat testing ujian.',
        createdAt: '2026-11-03T13:40:00',
        isBestAnswer: false,
        upvotes: 3,
        upvotedByUserIds: [],
      },
    ],
  },
  {
    id: 'disc_02',
    courseId: 'course_math_02',
    title: 'Tips membayangkan visual kurva tingkat (Level Curves) dalam 3D?',
    content: 'Apakah ada analogi praktis untuk memahami kontur kurva tingkat seperti yang ada di peta topografi gunung ketika kita menganalisis gradien diferensial?',
    authorId: 'siswa_dimas_03',
    authorName: 'Dimas Anggara Saputra',
    authorRole: 'siswa',
    authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=120&q=80',
    createdAt: '2026-11-02T16:15:00',
    isPinned: false,
    isResolved: false,
    upvotes: 8,
    upvotedByUserIds: ['siswa_nadia_01'],
    replies: [
      {
        id: 'reply_nadia_03',
        threadId: 'disc_02',
        authorId: 'siswa_nadia_01',
        authorName: 'Nadia Putri Pratama',
        authorRole: 'siswa',
        authorAvatar: '/src/assets/images/avatar_student_female_1793791075915.jpg',
        content: 'Hai Dimas! Analogi peta topografi justru sangat akurat. Bayangkan kurva tingkat adalah garis ketinggian tetap (misal 500 mdpl). Jika garis-garis tersebut sangat rapat, artinya lereng bukit sangat curam—vektor gradien di titik itu memiliki panjang (magnitudo) yang besar dan arahnya selalu tegak lurus menaiki lereng.',
        createdAt: '2026-11-02T17:00:00',
        isBestAnswer: false,
        upvotes: 6,
        upvotedByUserIds: ['guru_budi_01', 'siswa_dimas_03'],
      },
    ],
  },
];
