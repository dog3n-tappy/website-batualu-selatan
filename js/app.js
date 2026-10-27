/**
 * Logika Aplikasi Web Lembang Batualu Selatan, Tana Toraja
 * Pengembang: Full-Stack Senior Developer
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMobileMenu();
  initCounters();
  initAdministrationService();
  initApbdChart();
  initComplaintSystem();
  initSmoothScroll();
  initHeroVideo();
});

/* ==========================================================================
   1. MANAJEMEN TEMA (DARK / LIGHT MODE)
   ========================================================================== */
function initThemeToggle() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  const html = document.documentElement;

  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    html.classList.add('dark');
    updateThemeIcon(true);
  } else {
    html.classList.remove('dark');
    updateThemeIcon(false);
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isDark = html.classList.toggle('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      updateThemeIcon(isDark);
      
      if (window.apbdChartInstance) {
        updateChartTheme(isDark);
      }
    });
  }

  function updateThemeIcon(isDark) {
    if (!themeIcon) return;
    if (isDark) {
      themeIcon.className = 'fas fa-sun text-amber-400 text-lg';
    } else {
      themeIcon.className = 'fas fa-moon text-slate-600 text-lg';
    }
  }
}

/* ==========================================================================
   2. NAVIGASI RESPONSIF & MOBILE DRAWER
   ========================================================================== */
function initMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNav');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', () => {
      const isHidden = mobileNav.classList.contains('hidden');
      if (isHidden) {
        mobileNav.classList.remove('hidden');
      } else {
        mobileNav.classList.add('hidden');
      }
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.add('hidden');
      });
    });
  }
}

function initSmoothScroll() {
  const navLinks = document.querySelectorAll('a[href^="#"]');
  navLinks.forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

/* ==========================================================================
   3. ANIMASI COUNTER STATISTIK DEMOGRAFI
   ========================================================================== */
function initCounters() {
  const counters = document.querySelectorAll('.counter-number');
  const speed = 35;
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counters.forEach(counter => {
          const target = +counter.getAttribute('data-target');
          const countTo = target;
          let current = 0;
          const step = Math.ceil(countTo / speed);

          const updateCount = () => {
            current += step;
            if (current < countTo) {
              counter.innerText = current.toLocaleString('id-ID');
              requestAnimationFrame(updateCount);
            } else {
              counter.innerText = countTo.toLocaleString('id-ID');
            }
          };

          updateCount();
        });
      }
    });
  }, { threshold: 0.25 });

  const statsSection = document.getElementById('statistik');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

/* ==========================================================================
   4. LAYANAN ADMINISTRASI MANDIRI & PRATINJAU SURAT RESMI
   ========================================================================== */
function initAdministrationService() {
  const letterForm = document.getElementById('letterRequestForm');
  const letterModal = document.getElementById('letterModal');
  const closeModalBtn = document.getElementById('closeLetterModalBtn');
  const printLetterBtn = document.getElementById('printLetterBtn');

  if (letterForm) {
    letterForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nama = document.getElementById('namaLengkap').value.trim();
      const nik = document.getElementById('nik').value.trim();
      const whatsapp = document.getElementById('whatsapp').value.trim();
      const jenisSurat = document.getElementById('jenisSurat').value;
      const keperluan = document.getElementById('keperluanSurat').value.trim();
      const fileInput = document.getElementById('berkasPendukung');

      if (!nama || !nik || !whatsapp || !jenisSurat) {
        alert('Mohon lengkapi semua bidang formulir yang diwajibkan.');
        return;
      }

      if (nik.length < 16) {
        alert('Nomor Induk Kependudukan (NIK) minimal 16 digit angka.');
        return;
      }

      generateLetterPreview({
        nama,
        nik,
        whatsapp,
        jenisSurat,
        keperluan: keperluan || 'Keperluan administrasi kependudukan pemohon.',
        berkasName: fileInput.files.length > 0 ? fileInput.files[0].name : 'KTP/KK Terverifikasi Digital'
      });

      if (letterModal) {
        letterModal.classList.remove('hidden');
        letterModal.classList.add('flex');
      }
    });
  }

  if (closeModalBtn && letterModal) {
    closeModalBtn.addEventListener('click', () => {
      letterModal.classList.add('hidden');
      letterModal.classList.remove('flex');
    });
  }

  if (printLetterBtn) {
    printLetterBtn.addEventListener('click', () => {
      window.print();
    });
  }
}

function generateLetterPreview(data) {
  const previewContainer = document.getElementById('printableArea');
  if (!previewContainer) return;

  const today = new Date();
  const dateFormatted = today.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const randomNum = Math.floor(100 + Math.random() * 900);
  const romanMonths = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
  const romanMonth = romanMonths[today.getMonth()];
  const nomorSurat = "470 / " + randomNum + " / LBS / " + romanMonth + " / " + today.getFullYear();

  let judulSurat = 'SURAT KETERANGAN';
  let perihalText = '';

  switch (data.jenisSurat) {
    case 'SKU':
      judulSurat = 'SURAT KETERANGAN USAHA (SKU)';
      perihalText = 'Menerangkan bahwa nama yang bersangkutan adalah warga Lembang Batualu Selatan yang benar-benar memiliki kegiatan usaha aktif dan produktif di wilayah kami.';
      break;
    case 'SKD':
      judulSurat = 'SURAT KETERANGAN DOMISILI (SKD)';
      perihalText = 'Menerangkan dengan sesungguhnya bahwa nama tersebut di bawah adalah benar berdomisili dan tercatat secara sah sebagai warga di Lembang Batualu Selatan.';
      break;
    case 'SPN':
      judulSurat = 'SURAT PENGANTAR NIKAH (MODEL N1-N4)';
      perihalText = 'Menerangkan bahwa yang bersangkutan berstatus warga Lembang Batualu Selatan dan telah memenuhi kelengkapan administrasi pengantar nikah ke KUA/Dukcapil.';
      break;
    case 'SKTM':
      judulSurat = 'SURAT KETERANGAN TIDAK MAMPU (SKTM)';
      perihalText = 'Menerangkan bahwa keluarga yang bersangkutan terdata dalam desil keluarga berpenghasilan rendah untuk keperluan beasiswa pendidikan/keringanan medis.';
      break;
    default:
      judulSurat = 'SURAT KETERANGAN ADMINISTRASI';
      perihalText = 'Menerangkan kelengkapan data administrasi kependudukan di wilayah Lembang Batualu Selatan.';
  }

  previewContainer.innerHTML = `
    <div class="border-b-4 border-double border-slate-900 pb-3 mb-6 text-center text-slate-900">
      <div class="flex items-center justify-center gap-4 mb-2">
        <div class="w-16 h-16 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-2xl shadow-inner">
          <i class="fas fa-landmark"></i>
        </div>
        <div>
          <h4 class="text-xs uppercase tracking-widest font-semibold text-slate-700">Pemerintah Kabupaten Tana Toraja</h4>
          <h4 class="text-xs uppercase tracking-widest font-semibold text-slate-700">Kecamatan Sangalla Selatan</h4>
          <h2 class="text-xl md:text-2xl font-extrabold uppercase tracking-wide text-emerald-950">Pemerintah Lembang Batualu Selatan</h2>
          <p class="text-[11px] text-slate-600">Alamat: Jl. Poros Batualu - Sangalla, Kode Pos 91881 | Surel: batualuselatan@tanatorajakab.go.id</p>
        </div>
      </div>
    </div>

    <div class="text-center mb-6">
      <h3 class="text-lg font-bold underline uppercase tracking-wide text-slate-900">` + judulSurat + `</h3>
      <p class="text-xs text-slate-700 mt-1 font-mono">Nomor: ` + nomorSurat + `</p>
    </div>

    <div class="text-slate-800 text-sm leading-relaxed space-y-4 mb-8">
      <p>Yang bertanda tangan di bawah ini, Kepala Lembang Batualu Selatan, Kecamatan Sangalla Selatan, Kabupaten Tana Toraja, dengan ini menerangkan bahwa:</p>
      
      <div class="ml-4 pl-4 border-l-2 border-emerald-600 space-y-1.5 py-1 text-xs md:text-sm">
        <div class="grid grid-cols-3">
          <span class="font-semibold text-slate-700">Nama Lengkap</span>
          <span class="col-span-2 font-bold uppercase">: ` + data.nama + `</span>
        </div>
        <div class="grid grid-cols-3">
          <span class="font-semibold text-slate-700">NIK</span>
          <span class="col-span-2 font-mono">: ` + data.nik + `</span>
        </div>
        <div class="grid grid-cols-3">
          <span class="font-semibold text-slate-700">Nomor WhatsApp</span>
          <span class="col-span-2">: ` + data.whatsapp + `</span>
        </div>
        <div class="grid grid-cols-3">
          <span class="font-semibold text-slate-700">Domisili</span>
          <span class="col-span-2">: Lembang Batualu Selatan, Kec. Sangalla Selatan, Tana Toraja</span>
        </div>
        <div class="grid grid-cols-3">
          <span class="font-semibold text-slate-700">Lampiran Berkas</span>
          <span class="col-span-2 italic text-emerald-700">: ` + data.berkasName + ` (Terunggah Digital)</span>
        </div>
      </div>

      <p class="text-xs md:text-sm">` + perihalText + `</p>
      <p class="text-xs md:text-sm"><span class="font-semibold">Maksud / Keperluan:</span> ` + data.keperluan + `</p>
      
      <p class="text-xs md:text-sm">Demikian surat keterangan ini dibuat dengan sebenar-benarnya untuk dapat dipergunakan sebagaimana mestinya oleh pihak berkepentingan.</p>
    </div>

    <div class="grid grid-cols-2 text-xs md:text-sm text-slate-800 pt-4">
      <div class="text-center flex flex-col items-center">
        <p class="font-semibold mb-2">Validasi Digital</p>
        <div class="w-20 h-20 border border-dashed border-slate-300 rounded flex items-center justify-center bg-slate-50">
          <i class="fas fa-qrcode text-3xl text-slate-600"></i>
        </div>
        <p class="mt-2 text-[10px] text-slate-500 font-mono">ID: LBS-AUTOSIGN-` + data.nik.slice(-4) + `</p>
      </div>

      <div class="text-center flex flex-col items-center justify-between">
        <div>
          <p>Batualu Selatan, ` + dateFormatted + `</p>
          <p class="font-semibold">Kepala Lembang Batualu Selatan</p>
        </div>

        <div class="my-2">
          <div class="w-20 h-20 rounded-full border-2 border-emerald-700 border-dashed text-emerald-700 flex items-center justify-center text-[9px] uppercase font-bold text-center rotate-[-10deg] opacity-80">
            Pemerintah Lembang<br>Batualu Selatan
          </div>
        </div>

        <div>
          <p class="font-bold underline uppercase">Pradyan Rizky Londong Allo</p>
          <p class="text-[11px] text-slate-600">NIP. 19780512 200502 2 004</p>
        </div>
      </div>
    </div>
  `;
}

/* ==========================================================================
   5. TRANSPARANSI APBD DESA (CHART.JS)
   ========================================================================== */
function initApbdChart() {
  const chartCanvas = document.getElementById('apbdChart');
  if (!chartCanvas) return;

  const isDarkMode = document.documentElement.classList.contains('dark');
  const textColor = isDarkMode ? '#cbd5e1' : '#334155';

  const dataAlokasi = {
    labels: [
      'Penyelenggaraan Pemerintahan (Rp 450 Jt)',
      'Pelaksanaan Pembangunan (Rp 650 Jt)',
      'Pembinaan Kemasyarakatan (Rp 180 Jt)',
      'Pemberdayaan Masyarakat (Rp 150 Jt)',
      'Penanggulangan Bencana & Mendesak (Rp 75 Jt)'
    ],
    datasets: [{
      label: 'Alokasi APBD Lembang 2026',
      data: [450, 650, 180, 150, 75],
      backgroundColor: [
        '#059669',
        '#10b981',
        '#d97706',
        '#0284c7',
        '#dc2626'
      ],
      hoverOffset: 6,
      borderWidth: 2,
      borderColor: isDarkMode ? '#1e293b' : '#ffffff'
    }]
  };

  const config = {
    type: 'doughnut',
    data: dataAlokasi,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: textColor,
            font: {
              family: "'Plus Jakarta Sans', sans-serif",
              size: 11
            },
            padding: 12
          }
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const value = context.parsed;
              const total = 1505;
              const percentage = ((value / total) * 100).toFixed(1);
              return ' Rp ' + value + '.000.000 (' + percentage + '%)';
            }
          }
        }
      },
      cutout: '60%'
    }
  };

  window.apbdChartInstance = new Chart(chartCanvas, config);
}

function updateChartTheme(isDark) {
  if (!window.apbdChartInstance) return;
  const textColor = isDark ? '#cbd5e1' : '#334155';
  const borderColor = isDark ? '#1e293b' : '#ffffff';

  window.apbdChartInstance.options.plugins.legend.labels.color = textColor;
  window.apbdChartInstance.data.datasets[0].borderColor = borderColor;
  window.apbdChartInstance.update();
}

/* ==========================================================================
   6. PUSAT PENGADUAN WARGA & PELACAKAN TIKET
   ========================================================================== */
function initComplaintSystem() {
  const complaintForm = document.getElementById('complaintForm');
  const anonymousToggle = document.getElementById('anonymousToggle');
  const pelaporNameInput = document.getElementById('pelaporName');
  const checkTicketForm = document.getElementById('checkTicketForm');
  const ticketResultBox = document.getElementById('ticketResultBox');

  if (anonymousToggle && pelaporNameInput) {
    anonymousToggle.addEventListener('change', () => {
      if (anonymousToggle.checked) {
        pelaporNameInput.value = 'Warga Peduli (Anonim)';
        pelaporNameInput.disabled = true;
      } else {
        pelaporNameInput.value = '';
        pelaporNameInput.disabled = false;
      }
    });
  }

  if (complaintForm) {
    complaintForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nama = anonymousToggle && anonymousToggle.checked ? 'Warga Peduli (Anonim)' : (pelaporNameInput.value.trim() || 'Warga');
      const kategori = document.getElementById('complaintCategory').value;
      const judul = document.getElementById('complaintTitle').value.trim();
      const deskripsi = document.getElementById('complaintDescription').value.trim();

      if (!judul || !deskripsi) {
        alert('Mohon isi judul dan rincian laporan pengaduan.');
        return;
      }

      const currentYear = new Date().getFullYear();
      const randomTicketNum = Math.floor(1000 + Math.random() * 9000);
      const ticketId = 'LBS-' + currentYear + '-' + randomTicketNum;

      const existingReports = JSON.parse(localStorage.getItem('desa_reports') || '[]');
      const newReport = {
        id: ticketId,
        nama,
        kategori,
        judul,
        deskripsi,
        tanggal: new Date().toLocaleDateString('id-ID'),
        status: 'Diproses'
      };

      existingReports.unshift(newReport);
      localStorage.setItem('desa_reports', JSON.stringify(existingReports));

      alert('Laporan Anda berhasil dicatat!\n\nNomor Tiket Anda: ' + ticketId + '\nSimpan nomor tiket ini untuk melacak status penanganan.');

      complaintForm.reset();
      if (anonymousToggle) anonymousToggle.checked = false;
      if (pelaporNameInput) pelaporNameInput.disabled = false;

      const ticketInput = document.getElementById('searchTicketNumber');
      if (ticketInput) {
        ticketInput.value = ticketId;
        searchTicketStatus(ticketId);
      }
    });
  }

  if (checkTicketForm) {
    checkTicketForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const ticketNumber = document.getElementById('searchTicketNumber').value.trim();
      if (!ticketNumber) {
        alert('Silakan masukkan nomor tiket pengaduan.');
        return;
      }
      searchTicketStatus(ticketNumber);
    });
  }

  function searchTicketStatus(ticketId) {
    if (!ticketResultBox) return;

    const reports = JSON.parse(localStorage.getItem('desa_reports') || '[]');
    const found = reports.find(r => r.id.toUpperCase() === ticketId.toUpperCase());

    ticketResultBox.classList.remove('hidden');

    if (found) {
      ticketResultBox.innerHTML = `
        <div class="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-emerald-500 shadow-md">
          <div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700 pb-3 mb-3">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Tiket Terdaftar</span>
              <h4 class="text-lg font-bold text-slate-800 dark:text-white">` + found.id + `</h4>
            </div>
            <span class="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
              <i class="fas fa-spinner fa-spin mr-1"></i> Sedang Ditindaklanjuti
            </span>
          </div>

          <p class="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">` + found.judul + `</p>
          <p class="text-xs text-slate-500 dark:text-slate-400 mb-3">Kategori: ` + found.kategori + ` | Diajukan pada: ` + found.tanggal + `</p>
          <p class="text-xs text-slate-600 dark:text-slate-300 italic bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg mb-4">"` + found.deskripsi + `"</p>

          <div class="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-500">
            <div class="relative">
              <div class="absolute -left-[21px] top-0 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100 dark:ring-emerald-900"></div>
              <p class="text-xs font-bold text-slate-800 dark:text-white">1. Laporan Diterima Sistem</p>
              <p class="text-[11px] text-slate-500 dark:text-slate-400">Laporan warga telah masuk dalam antrean desk layanan pengaduan Lembang Batualu Selatan.</p>
            </div>
            <div class="relative">
              <div class="absolute -left-[21px] top-0 w-3 h-3 rounded-full bg-emerald-500 ring-4 ring-emerald-100 dark:ring-emerald-900"></div>
              <p class="text-xs font-bold text-slate-800 dark:text-white">2. Verifikasi Lapangan & Koordinasi Perangkat</p>
              <p class="text-[11px] text-slate-500 dark:text-slate-400">Petugas Lembang melakukan konfirmasi lokasi dan urgensi kebutuhan warga.</p>
            </div>
            <div class="relative">
              <div class="absolute -left-[21px] top-0 w-3 h-3 rounded-full bg-slate-300 dark:bg-slate-600"></div>
              <p class="text-xs font-medium text-slate-400 dark:text-slate-500">3. Penyelesaian & Solusi Selesai</p>
              <p class="text-[11px] text-slate-400 dark:text-slate-500">Tindakan penanganan rampung dilaksanakan dan diarsipkan resmi.</p>
            </div>
          </div>
        </div>
      `;
    } else {
      ticketResultBox.innerHTML = `
        <div class="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-sm">
          <i class="fas fa-exclamation-triangle mr-2"></i>
          Nomor tiket <strong>` + ticketId + `</strong> belum ditemukan di sistem lokal. Pastikan format nomor telah sesuai (contoh: <code>LBS-2026-XXXX</code>) atau ajukan laporan baru melalui formulir di samping.
        </div>
      `;
    }
  }
}


/* ==========================================================================
   7. KONTROL VIDEO HERO BACKGROUND SINEMATIK
   ========================================================================== */
function initHeroVideo() {
  const bgVideo = document.getElementById('heroVideo');
  const miniVideo = document.getElementById('heroMiniVideo');
  const toggleBtn = document.getElementById('toggleHeroVideoBtn');
  const toggleIcon = document.getElementById('toggleHeroVideoIcon');
  const toggleText = document.getElementById('toggleHeroVideoText');

  if (!bgVideo || !toggleBtn) return;

  // Pastikan autoplay berjalan lancar di semua peramban
  const ensurePlay = () => {
    if (bgVideo.paused) {
      bgVideo.play().catch(() => {});
    }
    if (miniVideo && miniVideo.paused) {
      miniVideo.play().catch(() => {});
    }
  };
  
  ensurePlay();
  window.addEventListener('touchstart', ensurePlay, { once: true });
  window.addEventListener('click', ensurePlay, { once: true });

  let isPlaying = true;

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isPlaying) {
      bgVideo.pause();
      if (miniVideo) miniVideo.pause();
      if (toggleIcon) toggleIcon.className = 'fas fa-play text-[11px] text-emerald-400';
      if (toggleText) toggleText.innerText = 'Putar Video';
      isPlaying = false;
    } else {
      bgVideo.play().catch(() => {});
      if (miniVideo) miniVideo.play().catch(() => {});
      if (toggleIcon) toggleIcon.className = 'fas fa-pause text-[11px] text-emerald-400';
      if (toggleText) toggleText.innerText = 'Jeda Video';
      isPlaying = true;
    }
  });
}
