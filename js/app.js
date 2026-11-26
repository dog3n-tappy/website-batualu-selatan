/**
 * Logika Aplikasi Web Lembang Batualu Selatan, Tana Toraja
 * Pengembang: Full-Stack Senior Developer
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMobileMenu();
  initCounters();
  initAdministrationService();
  initLetterDirectory();
  initSocialDataCharts();
  initApbdChart();
  initSmoothScroll();
  initHeroCarousel();
});

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

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
   4. LAYANAN ADMINISTRASI MANDIRI & PRATINJAU SURAT RESMI (29 JENIS SURAT)
   ========================================================================== */
const LETTER_TYPES = {
  SKTM: {
    code: '470',
    label: 'Surat Keterangan Tidak Mampu',
    judul: 'SURAT KETERANGAN TIDAK MAMPU',
    perihal: 'Menerangkan bahwa nama dan keluarga yang bersangkutan merupakan warga Lembang Batualu Selatan yang tergolong keluarga kurang mampu untuk keperluan beasiswa pendidikan maupun keringanan biaya layanan sosial/kesehatan.'
  },
  SKU: {
    code: '503',
    label: 'Surat Keterangan Usaha',
    judul: 'SURAT KETERANGAN USAHA',
    perihal: 'Menerangkan bahwa nama yang bersangkutan adalah warga Lembang Batualu Selatan yang benar-benar memiliki kegiatan usaha aktif dan produktif di wilayah Lembang Batualu Selatan.'
  },
  SKUASA: {
    code: '470',
    label: 'Surat Kuasa',
    judul: 'SURAT KUASA',
    perihal: 'Menerangkan pelimpahan kuasa pengurusan administrasi atau kepentingan hukum/warga dari pemberi kuasa kepada penerima kuasa sesuai data dan ketentuan yang berlaku di Lembang Batualu Selatan.'
  },
  SKAW: {
    code: '474',
    label: 'Surat Keterangan Ahli Waris',
    judul: 'SURAT KETERANGAN AHLI WARIS',
    perihal: 'Menerangkan status kekerabatan dan penetapan ahli waris yang sah dari warga Lembang Batualu Selatan berdasarkan keterangan keluarga dan dokumen kependudukan yang berlaku.'
  },
  SKD: {
    code: '470',
    label: 'Surat Keterangan Domisili',
    judul: 'SURAT KETERANGAN DOMISILI',
    perihal: 'Menerangkan dengan sesungguhnya bahwa nama tersebut di atas benar berdomisili dan bertempat tinggal secara sah di wilayah Lembang Batualu Selatan.'
  },
  SKT: {
    code: '590',
    label: 'Surat Keterangan Tanah',
    judul: 'SURAT KETERANGAN TANAH',
    perihal: 'Menerangkan letak, batas, dan status penguasaan bidang tanah yang berada di wilayah administratif Lembang Batualu Selatan.'
  },
  SKJD: {
    code: '474',
    label: 'Surat Keterangan Janda/Duda',
    judul: 'SURAT KETERANGAN JANDA / DUDA',
    perihal: 'Menerangkan bahwa nama yang bersangkutan berstatus janda atau duda dan tercatat secara resmi sebagai warga Lembang Batualu Selatan.'
  },
  SKMATI: {
    code: '474',
    label: 'Surat Keterangan Kematian',
    judul: 'SURAT KETERANGAN KEMATIAN',
    perihal: 'Menerangkan peristiwa meninggal dunia warga yang tercatat di wilayah Lembang Batualu Selatan untuk keperluan pencatatan sipil dan administrasi keluarga.'
  },
  SKPP: {
    code: '475',
    label: 'Surat Keterangan Pindah Penduduk',
    judul: 'SURAT KETERANGAN PINDAH PENDUDUK',
    perihal: 'Menerangkan permohonan perpindahan domisili penduduk dari wilayah Lembang Batualu Selatan ke daerah tujuan sesuai ketentuan kependudukan.'
  },
  SKKERJA: {
    code: '560',
    label: 'Surat Keterangan Pekerjaan',
    judul: 'SURAT KETERANGAN PEKERJAAN',
    perihal: 'Menerangkan profesi dan aktivitas pekerjaan sehari-hari dari warga yang bersangkutan di wilayah Lembang Batualu Selatan.'
  },
  SKBM: {
    code: '474',
    label: 'Surat Keterangan Belum Menikah',
    judul: 'SURAT KETERANGAN BELUM MENIKAH',
    perihal: 'Menerangkan bahwa nama yang bersangkutan berstatus belum pernah menikah menurut catatan kependudukan di Lembang Batualu Selatan.'
  },
  SKOT: {
    code: '470',
    label: 'Surat Keluasan Orang Tua',
    judul: 'SURAT KELUASAN ORANG TUA',
    perihal: 'Menerangkan pernyataan izin atau persetujuan resmi orang tua/wali terhadap rencana kegiatan atau administrasi anak yang bersangkutan.'
  },
  SKPT: {
    code: '590',
    label: 'Surat Kepemilikan Tanah',
    judul: 'SURAT KEPEMILIKAN TANAH',
    perihal: 'Menerangkan riwayat dan pengakuan kepemilikan atas bidang tanah di wilayah Lembang Batualu Selatan sesuai data registrasi lembang.'
  },
  SPGS: {
    code: '590',
    label: 'Surat Pernyataan Gadai/Sawah',
    judul: 'SURAT PERNYATAAN GADAI / SAWAH',
    perihal: 'Menerangkan kesepakatan perjanjian gadai lahan/sawah antara pihak pemilik dan penerima gadai di wilayah Lembang Batualu Selatan.'
  },
  SIK: {
    code: '300',
    label: 'Surat Izin Keramaian',
    judul: 'SURAT IZIN KERAMAIAN',
    perihal: 'Memberikan keterangan pengantar izin penyelenggaraan kegiatan masyarakat atau acara keluarga dengan tetap menjaga ketertiban dan keamanan lingkungan.'
  },
  SIPH: {
    code: '524',
    label: 'Surat Izin Potong Hewan',
    judul: 'SURAT IZIN POTONG HEWAN',
    perihal: 'Menerangkan izin pemotongan hewan ternak untuk keperluan acara adat, keluarga, atau konsumsi masyarakat di wilayah Lembang Batualu Selatan.'
  },
  SREK: {
    code: '470',
    label: 'Surat Rekomendasi',
    judul: 'SURAT REKOMENDASI',
    perihal: 'Memberikan rekomendasi resmi Pemerintah Lembang Batualu Selatan atas permohonan kegiatan, bantuan, atau urusan administrasi pemohon.'
  },
  SKBN: {
    code: '470',
    label: 'Surat Keterangan Beda Nama',
    judul: 'SURAT KETERANGAN BEDA NAMA',
    perihal: 'Menerangkan bahwa perbedaan penulisan nama pada dokumen kependudukan/ijazah/sertifikat merujuk pada satu orang yang sama.'
  },
  SUND: {
    code: '005',
    label: 'Surat Undangan',
    judul: 'SURAT UNDANGAN RESMI',
    perihal: 'Menyampaikan undangan resmi Pemerintah Lembang Batualu Selatan untuk menghadiri rapat, musyawarah lembang, atau kegiatan kemasyarakatan.'
  },
  SKKB: {
    code: '300',
    label: 'Surat Keterangan Berkelakuan Baik',
    judul: 'SURAT KETERANGAN BERKELAKUAN BAIK',
    perihal: 'Menerangkan bahwa nama yang bersangkutan berkelakuan baik, menaati norma sosial/adat, dan tidak sedang tersangkut perkara hukum di lingkungan masyarakat.'
  },
  SKPOT: {
    code: '470',
    label: 'Surat Keterangan Penghasilan Orang Tua',
    judul: 'SURAT KETERANGAN PENGHASILAN ORANG TUA',
    perihal: 'Menerangkan perkiraan penghasilan bulanan orang tua/wali pemohon sebagai kelengkapan pengajuan beasiswa atau administrasi pendidikan.'
  },
  SKSI: {
    code: '474',
    label: 'Surat Keterangan Suami Istri',
    judul: 'SURAT KETERANGAN SUAMI ISTRI',
    perihal: 'Menerangkan bahwa kedua nama yang tercantum adalah benar pasangan suami istri sah yang berdomisili di wilayah Lembang Batualu Selatan.'
  },
  SKJB: {
    code: '590',
    label: 'Surat Keterangan Jual Beli',
    judul: 'SURAT KETERANGAN JUAL BELI',
    perihal: 'Menerangkan transaksi jual beli aset/tanah/harta benda yang diketahui oleh Pemerintah Lembang Batualu Selatan dan para saksi.'
  },
  SKKUBUR: {
    code: '474',
    label: 'Surat Keterangan Penguburan',
    judul: 'SURAT KETERANGAN PENGUBURAN',
    perihal: 'Menerangkan pelaksanaan pemakaman/penguburan jenazah warga di wilayah Lembang Batualu Selatan sesuai tata cara adat dan ketentuan yang berlaku.'
  },
  SKEST: {
    code: '590',
    label: 'Surat Kesepakatan Tanah',
    judul: 'SURAT KESEPAKATAN TANAH',
    perihal: 'Menerangkan kesepakatan batas, pembagian, atau penyelesaian urusan tanah antar pihak terkait di wilayah Lembang Batualu Selatan.'
  },
  SKHILANG: {
    code: '300',
    label: 'Surat Keterangan Hilang',
    judul: 'SURAT KETERANGAN HILANG',
    perihal: 'Menerangkan laporan kehilangan dokumen/barang milik warga sebagai surat pengantar pengurusan penerbitan ulang di instansi terkait.'
  },
  SKMETER: {
    code: '671',
    label: 'Surat Keterangan Meteran',
    judul: 'SURAT KETERANGAN METERAN',
    perihal: 'Menerangkan kepemilikan dan lokasi bangunan rumah tangga/usaha warga untuk keperluan pemasangan atau administrasi meteran listrik/air.'
  },
  SKBBM: {
    code: '541',
    label: 'Surat Keterangan Pengambilan Minyak BBM',
    judul: 'SURAT KETERANGAN PENGAMBILAN MINYAK BBM',
    perihal: 'Menerangkan kebutuhan bahan bakar minyak (BBM) bersubsidi untuk mendukung alat mesin pertanian, usaha mikro, atau operasional warga di Lembang Batualu Selatan.'
  },
  SKSPPT: {
    code: '973',
    label: 'Surat Keterangan SPPT',
    judul: 'SURAT KETERANGAN SPPT (PBB)',
    perihal: 'Menerangkan keterangan objek pajak/Surat Pemberitahuan Pajak Terutang (SPPT PBB) milik warga yang berada di wilayah Lembang Batualu Selatan.'
  }
};

function initLetterDirectory() {
  const container = document.getElementById('letterDirectoryList');
  const filterInput = document.getElementById('filterSuratInput');
  const selectEl = document.getElementById('jenisSurat');
  if (!container || !selectEl) return;

  const entries = Object.entries(LETTER_TYPES);

  function renderDirectory(query = '') {
    const q = query.trim().toLowerCase();
    const filtered = entries.filter(([, item]) => item.label.toLowerCase().includes(q));

    if (filtered.length === 0) {
      container.innerHTML = '<p class="text-xs text-slate-400 italic py-2">Jenis surat tidak ditemukan.</p>';
      return;
    }

    container.innerHTML = filtered.map(([key, item]) => {
      const isSelected = selectEl.value === key;
      const activeClass = isSelected
        ? 'bg-emerald-600 text-white border-emerald-600'
        : 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-300';

      return `<button type="button" data-letter-key="${key}" class="letter-chip px-2.5 py-1.5 rounded-lg border text-[11px] font-medium text-left transition ${activeClass}">${escapeHtml(item.label)}</button>`;
    }).join('');

    container.querySelectorAll('.letter-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-letter-key');
        selectEl.value = key;
        renderDirectory(filterInput ? filterInput.value : '');
        selectEl.focus();
      });
    });
  }

  renderDirectory();

  if (filterInput) {
    filterInput.addEventListener('input', () => {
      renderDirectory(filterInput.value);
    });
  }

  selectEl.addEventListener('change', () => {
    renderDirectory(filterInput ? filterInput.value : '');
  });
}

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
      const dusunSelect = document.getElementById('dusunPemohon');
      const dusun = dusunSelect ? dusunSelect.value : 'Lembang Batualu Selatan';
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
        dusun,
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

  const letterInfo = LETTER_TYPES[data.jenisSurat] || {
    code: '470',
    judul: 'SURAT KETERANGAN ADMINISTRASI',
    perihal: 'Menerangkan kelengkapan data administrasi kependudukan di wilayah Lembang Batualu Selatan.'
  };

  const randomNum = Math.floor(100 + Math.random() * 900);
  const romanMonths = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
  const romanMonth = romanMonths[today.getMonth()];
  const nomorSurat = `${letterInfo.code} / ${randomNum} / LBS / ${romanMonth} / ${today.getFullYear()}`;
  const domisiliText = data.dusun && data.dusun !== 'Lembang Batualu Selatan'
    ? `${data.dusun}, Lembang Batualu Selatan, Kec. Sangalla Selatan, Tana Toraja`
    : 'Lembang Batualu Selatan, Kec. Sangalla Selatan, Tana Toraja';

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
      <h3 class="text-lg font-bold underline uppercase tracking-wide text-slate-900">${escapeHtml(letterInfo.judul)}</h3>
      <p class="text-xs text-slate-700 mt-1 font-mono">Nomor: ${escapeHtml(nomorSurat)}</p>
    </div>

    <div class="text-slate-800 text-sm leading-relaxed space-y-4 mb-8">
      <p>Yang bertanda tangan di bawah ini, Kepala Lembang Batualu Selatan, Kecamatan Sangalla Selatan, Kabupaten Tana Toraja, dengan ini menerangkan bahwa:</p>
      
      <div class="ml-4 pl-4 border-l-2 border-emerald-600 space-y-1.5 py-1 text-xs md:text-sm">
        <div class="grid grid-cols-3">
          <span class="font-semibold text-slate-700">Nama Lengkap</span>
          <span class="col-span-2 font-bold uppercase">: ${escapeHtml(data.nama)}</span>
        </div>
        <div class="grid grid-cols-3">
          <span class="font-semibold text-slate-700">NIK</span>
          <span class="col-span-2 font-mono">: ${escapeHtml(data.nik)}</span>
        </div>
        <div class="grid grid-cols-3">
          <span class="font-semibold text-slate-700">Nomor WhatsApp</span>
          <span class="col-span-2">: ${escapeHtml(data.whatsapp)}</span>
        </div>
        <div class="grid grid-cols-3">
          <span class="font-semibold text-slate-700">Domisili</span>
          <span class="col-span-2">: ${escapeHtml(domisiliText)}</span>
        </div>
        <div class="grid grid-cols-3">
          <span class="font-semibold text-slate-700">Lampiran Berkas</span>
          <span class="col-span-2 italic text-emerald-700">: ${escapeHtml(data.berkasName)} (Terunggah Digital)</span>
        </div>
      </div>

      <p class="text-xs md:text-sm">${escapeHtml(letterInfo.perihal)}</p>
      <p class="text-xs md:text-sm"><span class="font-semibold">Maksud / Keperluan:</span> ${escapeHtml(data.keperluan)}</p>
      
      <p class="text-xs md:text-sm">Demikian surat keterangan ini dibuat dengan sebenar-benarnya untuk dapat dipergunakan sebagaimana mestinya oleh pihak berkepentingan.</p>
    </div>

    <div class="grid grid-cols-2 text-xs md:text-sm text-slate-800 pt-4">
      <div class="text-center flex flex-col items-center">
        <p class="font-semibold mb-2">Validasi Digital</p>
        <div class="w-20 h-20 border border-dashed border-slate-300 rounded flex items-center justify-center bg-slate-50">
          <i class="fas fa-qrcode text-3xl text-slate-600"></i>
        </div>
        <p class="mt-2 text-[10px] text-slate-500 font-mono">ID: LBS-AUTOSIGN-${escapeHtml(data.nik.slice(-4))}</p>
      </div>

      <div class="text-center flex flex-col items-center justify-between">
        <div>
          <p>Batualu Selatan, ${escapeHtml(dateFormatted)}</p>
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
   4B. GRAFIK DATA SOSIAL BUDAYA 2026 (DEMOGRAFI UMUR & PENDIDIKAN)
   ========================================================================== */
function initSocialDataCharts() {
  const isDark = document.documentElement.classList.contains('dark');
  const textColor = isDark ? '#cbd5e1' : '#334155';
  const gridColor = isDark ? 'rgba(148, 163, 184, 0.12)' : 'rgba(148, 163, 184, 0.25)';

  const ageCanvas = document.getElementById('ageChart');
  if (ageCanvas) {
    window.ageChartInstance = new Chart(ageCanvas, {
      type: 'bar',
      data: {
        labels: ['0-23 Bln', '24-50 Bln', '5-6 Thn', '7-12 Thn', '13-15 Thn', '16-18 Thn', '19-45 Thn', '46-59 Thn', '>=60 Thn', '>=70 Thn'],
        datasets: [{
          label: 'Jumlah Jiwa',
          data: [13, 66, 40, 163, 87, 128, 705, 313, 165, 119],
          backgroundColor: '#10b981',
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => ` ${ctx.parsed.y} Jiwa`
            }
          }
        },
        scales: {
          x: {
            ticks: { color: textColor, font: { size: 10 } },
            grid: { display: false }
          },
          y: {
            beginAtZero: true,
            ticks: { color: textColor, font: { size: 10 } },
            grid: { color: gridColor }
          }
        }
      }
    });
  }

  const eduCanvas = document.getElementById('educationChart');
  if (eduCanvas) {
    window.educationChartInstance = new Chart(eduCanvas, {
      type: 'bar',
      data: {
        labels: ['Tidak Tamat SD', 'Tamat SD', 'Tamat SLTP', 'Tamat SLTA', 'Akademi/PT'],
        datasets: [
          {
            label: 'Laki-Laki (L)',
            data: [266, 122, 82, 389, 106],
            backgroundColor: '#0284c7',
            borderRadius: 5
          },
          {
            label: 'Perempuan (P)',
            data: [244, 133, 73, 378, 114],
            backgroundColor: '#10b981',
            borderRadius: 5
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: textColor, font: { size: 11 } }
          }
        },
        scales: {
          x: {
            ticks: { color: textColor, font: { size: 10 } },
            grid: { display: false }
          },
          y: {
            beginAtZero: true,
            ticks: { color: textColor, font: { size: 10 } },
            grid: { color: gridColor }
          }
        }
      }
    });
  }
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
  const textColor = isDark ? '#cbd5e1' : '#334155';
  const borderColor = isDark ? '#1e293b' : '#ffffff';
  const gridColor = isDark ? 'rgba(148, 163, 184, 0.12)' : 'rgba(148, 163, 184, 0.25)';

  if (window.apbdChartInstance) {
    window.apbdChartInstance.options.plugins.legend.labels.color = textColor;
    window.apbdChartInstance.data.datasets[0].borderColor = borderColor;
    window.apbdChartInstance.update();
  }

  [window.ageChartInstance, window.educationChartInstance].forEach(chart => {
    if (!chart) return;
    if (chart.options.plugins && chart.options.plugins.legend && chart.options.plugins.legend.labels) {
      chart.options.plugins.legend.labels.color = textColor;
    }
    if (chart.options.scales && chart.options.scales.x) {
      chart.options.scales.x.ticks.color = textColor;
    }
    if (chart.options.scales && chart.options.scales.y) {
      chart.options.scales.y.ticks.color = textColor;
      chart.options.scales.y.grid.color = gridColor;
    }
    chart.update();
  });
}

/* ==========================================================================
   6. KONTROL HERO IMAGE CAROUSEL
   ========================================================================== */
function initHeroCarousel() {
  const bgSlides = document.querySelectorAll('.hero-bg-slide');
  const cardSlides = document.querySelectorAll('.hero-card-slide');
  const dots = document.querySelectorAll('.hero-dot');
  const prevBtn = document.getElementById('heroPrevBtn');
  const nextBtn = document.getElementById('heroNextBtn');
  const toggleBtn = document.getElementById('toggleHeroCarouselBtn');
  const toggleIcon = document.getElementById('toggleHeroCarouselIcon');
  const toggleText = document.getElementById('toggleHeroCarouselText');
  const slideBadge = document.getElementById('heroSlideBadge');
  const slideTitle = document.getElementById('heroSlideTitle');
  const slideDesc = document.getElementById('heroSlideDesc');
  const slideCounter = document.getElementById('heroSlideCounter');

  if (cardSlides.length === 0) return;

  const slidesMeta = [
    {
      badge: 'Pesona Alam',
      title: 'Panorama Lembang Batualu Selatan',
      desc: 'Hamparan sawah terasering dan pegunungan sejuk Tana Toraja.'
    },
    {
      badge: 'Pembangunan Lembang',
      title: 'Peningkatan Infrastruktur Jalan',
      desc: 'Pembangunan akses jalan lembang untuk mobilitas dan ekonomi warga.'
    },
    {
      badge: 'Pelayanan Sosial',
      title: 'Penyaluran Bantuan Masyarakat',
      desc: 'Distribusi bantuan pangan langsung bersama warga Batualu Selatan.'
    }
  ];

  let currentIndex = 0;
  let isPlaying = true;
  let intervalId = null;

  function showSlide(index) {
    currentIndex = (index + cardSlides.length) % cardSlides.length;

    bgSlides.forEach((img, idx) => {
      img.classList.toggle('opacity-100', idx === currentIndex);
      img.classList.toggle('opacity-0', idx !== currentIndex);
    });

    cardSlides.forEach((img, idx) => {
      img.classList.toggle('opacity-100', idx === currentIndex);
      img.classList.toggle('opacity-0', idx !== currentIndex);
    });

    dots.forEach((dot, idx) => {
      if (idx === currentIndex) {
        dot.className = 'hero-dot w-5 h-2 rounded-full bg-emerald-400 transition-all';
      } else {
        dot.className = 'hero-dot w-2 h-2 rounded-full bg-white/40 hover:bg-white/70 transition-all';
      }
    });

    const meta = slidesMeta[currentIndex] || slidesMeta[0];
    if (slideBadge) {
      slideBadge.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-emerald-300"></span> ${escapeHtml(meta.badge)}`;
    }
    if (slideTitle) slideTitle.textContent = meta.title;
    if (slideDesc) slideDesc.textContent = meta.desc;
    if (slideCounter) slideCounter.textContent = `${currentIndex + 1}/${cardSlides.length}`;
  }

  function startAutoSlide() {
    stopAutoSlide();
    intervalId = setInterval(() => {
      showSlide(currentIndex + 1);
    }, 5000);
  }

  function stopAutoSlide() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      showSlide(currentIndex - 1);
      if (isPlaying) startAutoSlide();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      showSlide(currentIndex + 1);
      if (isPlaying) startAutoSlide();
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const targetIdx = Number(dot.getAttribute('data-slide'));
      if (!Number.isNaN(targetIdx)) {
        showSlide(targetIdx);
        if (isPlaying) startAutoSlide();
      }
    });
  });

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      if (isPlaying) {
        stopAutoSlide();
        isPlaying = false;
        if (toggleIcon) toggleIcon.className = 'fas fa-play text-[11px] text-emerald-400';
        if (toggleText) toggleText.textContent = 'Putar Slide';
      } else {
        isPlaying = true;
        startAutoSlide();
        if (toggleIcon) toggleIcon.className = 'fas fa-pause text-[11px] text-emerald-400';
        if (toggleText) toggleText.textContent = 'Jeda Slide';
      }
    });
  }

  showSlide(0);
  startAutoSlide();
}
