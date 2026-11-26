/* ==========================================================================
   Wisata Candi Borobudur — Interactive JavaScript Controller
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initScrollUI();
  initScrollReveal();
  initCounters();
  initCosmologyExplorer();
  initZoneExplorer();
  initGalleryFilterAndLightbox();
  initTicketCalculatorAndBooking();
});

/* 1. Navbar Scroll State, Progress Bar & Back-to-Top */
function initScrollUI() {
  const navbar = document.querySelector(".navbar-borobudur");
  const progressBar = document.querySelector(".scroll-progress");
  const backTopBtn = document.getElementById("backToTop");

  const onScroll = () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min((scrollY / docHeight) * 100, 100) : 0;

    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }
    if (navbar) {
      navbar.classList.toggle("scrolled", scrollY > 36);
    }
    if (backTopBtn) {
      backTopBtn.classList.toggle("show", scrollY > 380);
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (backTopBtn) {
    backTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}

/* 2. IntersectionObserver Scroll Reveal */
function initScrollReveal() {
  const elements = document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale");
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  elements.forEach((el) => observer.observe(el));
}

/* 3. Animated Number Counters */
function initCounters() {
  const counters = document.querySelectorAll("[data-count]");
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute("data-count"), 10);
    const suffix = el.getAttribute("data-suffix") || "";
    const duration = 1500;
    const startTime = performance.now();

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = current.toLocaleString("id-ID") + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  };

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  counters.forEach((c) => observer.observe(c));
}

/* 4. Interactive Cosmology Explorer (Beranda & Tentang) */
function initCosmologyExplorer() {
  const pills = document.querySelectorAll("[data-cosmology]");
  const titleEl = document.getElementById("cosmoTitle");
  const subtitleEl = document.getElementById("cosmoSubtitle");
  const descEl = document.getElementById("cosmoDesc");
  const statsEl = document.getElementById("cosmoStats");
  const imgEl = document.getElementById("cosmoImg");

  if (!pills.length || !titleEl) return;

  const data = {
    kamadhatu: {
      title: "Kamadhatu — Alam Nafsu Duniawi",
      subtitle: "Tingkat Dasar • Kaki Candi",
      desc: "Melambangkan dunia yang masih terikat oleh hawa nafsu dan hukum sebab-akibat (karma). Pada bagian kaki candi tersembunyi 160 panel relief Karmawibhangga yang menggambarkan perilaku manusia serta konsekuensinya.",
      stats: "160 Panel Relief • Pondasi Utama",
      img: "img/relief.png"
    },
    rupadhatu: {
      title: "Rupadhatu — Alam Rupa & Peralihan",
      subtitle: "Empat Teras Persegi • Lorong Relief",
      desc: "Menggambarkan manusia yang telah membebaskan diri dari ikatan nafsu duniawi, namun masih terikat pada rupa dan bentuk. Terdiri dari empat teras persegi yang dipenuhi 1.300+ relief naratif Lalitavistara dan Jataka.",
      stats: "4 Teras Persegi • 432 Arca Buddha",
      img: "img/candi.jpeg"
    },
    arupadhatu: {
      title: "Arupadhatu — Alam Tanpa Bentuk",
      subtitle: "Tiga Teras Melingkar & Stupa Induk",
      desc: "Tingkatan tertinggi menuju pencerahan sempurna (Nirwana). Terdiri dari tiga teras melingkar tanpa ukiran relief, menaungi 72 stupa berlubang dan satu Stupa Induk megah di puncaknya.",
      stats: "72 Stupa Berlubang • 1 Stupa Induk",
      img: "img/stupa.jpg.jpeg"
    }
  };

  pills.forEach((pill) => {
    pill.addEventListener("click", () => {
      const key = pill.getAttribute("data-cosmology");
      const item = data[key];
      if (!item) return;

      pills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");

      titleEl.textContent = item.title;
      subtitleEl.textContent = item.subtitle;
      descEl.textContent = item.desc;
      if (statsEl) statsEl.textContent = item.stats;
      if (imgEl) {
        imgEl.style.opacity = "0.25";
        setTimeout(() => {
          imgEl.src = item.img;
          imgEl.alt = item.title;
          imgEl.style.opacity = "1";
        }, 160);
      }
    });
  });
}

/* 5. Daya Tarik Zone Filter */
function initZoneExplorer() {
  const filterBtns = document.querySelectorAll("[data-zone-filter]");
  const zoneCards = document.querySelectorAll("[data-zone-category]");
  if (!filterBtns.length || !zoneCards.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-zone-filter");
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      zoneCards.forEach((card) => {
        const cat = card.getAttribute("data-zone-category");
        const show = filter === "all" || cat === filter;
        card.classList.toggle("d-none", !show);
      });
    });
  });
}

/* 6. Galeri Filter & Lightbox Modal */
function initGalleryFilterAndLightbox() {
  const filterBtns = document.querySelectorAll("[data-gallery-filter]");
  const items = Array.from(document.querySelectorAll(".gallery-item-col"));
  const modalEl = document.getElementById("galleryLightbox");

  if (filterBtns.length && items.length) {
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const filter = btn.getAttribute("data-gallery-filter");
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        items.forEach((item) => {
          const cat = item.getAttribute("data-category");
          const match = filter === "all" || cat === filter;
          item.classList.toggle("d-none", !match);
        });
      });
    });
  }

  if (!modalEl || !items.length) return;

  const modal = new bootstrap.Modal(modalEl);
  const lbImg = document.getElementById("lightboxImg");
  const lbTitle = document.getElementById("lightboxTitle");
  const lbDesc = document.getElementById("lightboxDesc");
  const prevBtn = document.getElementById("lightboxPrev");
  const nextBtn = document.getElementById("lightboxNext");
  let currentIndex = 0;

  const getVisibleCards = () =>
    items
      .filter((col) => !col.classList.contains("d-none"))
      .map((col) => col.querySelector(".gallery-card"));

  const showAt = (idx) => {
    const visible = getVisibleCards();
    if (!visible.length) return;
    currentIndex = (idx + visible.length) % visible.length;
    const card = visible[currentIndex];
    lbImg.src = card.getAttribute("data-src");
    lbImg.alt = card.getAttribute("data-title");
    lbTitle.textContent = card.getAttribute("data-title");
    lbDesc.textContent = card.getAttribute("data-desc");
  };

  items.forEach((col) => {
    const card = col.querySelector(".gallery-card");
    if (!card) return;
    card.addEventListener("click", () => {
      const visible = getVisibleCards();
      const idx = visible.indexOf(card);
      showAt(idx >= 0 ? idx : 0);
      modal.show();
    });
  });

  if (prevBtn) prevBtn.addEventListener("click", () => showAt(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener("click", () => showAt(currentIndex + 1));

  document.addEventListener("keydown", (e) => {
    if (!modalEl.classList.contains("show")) return;
    if (e.key === "ArrowLeft") showAt(currentIndex - 1);
    if (e.key === "ArrowRight") showAt(currentIndex + 1);
  });
}

/* 7. Live Ticket Calculator & Booking Form (Tiket Page) */
function initTicketCalculatorAndBooking() {
  const tierCards = document.querySelectorAll(".ticket-tier[data-package]");
  const packageSelect = document.getElementById("paketSelect");
  const qtyInput = document.getElementById("jumlahInput");
  const guideCheck = document.getElementById("pemanduCheck");
  const dateInput = document.getElementById("tanggalInput");
  const summaryPackage = document.getElementById("summaryPackage");
  const summaryQty = document.getElementById("summaryQty");
  const summaryTotal = document.getElementById("summaryTotal");
  const bookingForm = document.getElementById("bookingForm");

  if (!packageSelect || !qtyInput) return;

  // Set min date to today
  if (dateInput) {
    const today = new Date().toISOString().split("T")[0];
    dateInput.min = today;
    if (!dateInput.value) dateInput.value = today;
  }

  const prices = {
    "Wisata Candi": 50000,
    "Heritage Tour": 100000,
    "Morning Experience": 150000
  };

  const updateCalculation = () => {
    const pkg = packageSelect.value || "Heritage Tour";
    const qty = Math.max(1, Math.min(30, parseInt(qtyInput.value || "1", 10)));
    const unitPrice = prices[pkg] || 100000;
    const guideFee = guideCheck && guideCheck.checked ? 75000 : 0;
    const total = unitPrice * qty + guideFee;

    if (summaryPackage) summaryPackage.textContent = pkg;
    if (summaryQty) summaryQty.textContent = `${qty} Orang${guideFee ? " + Pemandu Privat" : ""}`;
    if (summaryTotal) summaryTotal.textContent = `Rp${total.toLocaleString("id-ID")}`;

    tierCards.forEach((card) => {
      card.classList.toggle("selected-tier", card.getAttribute("data-package") === pkg);
    });
  };

  tierCards.forEach((card) => {
    card.addEventListener("click", () => {
      const pkg = card.getAttribute("data-package");
      packageSelect.value = pkg;
      updateCalculation();
      document.getElementById("formPemesanan")?.scrollIntoView({ behavior: "smooth" });
    });
  });

  packageSelect.addEventListener("change", updateCalculation);
  qtyInput.addEventListener("input", updateCalculation);
  if (guideCheck) guideCheck.addEventListener("change", updateCalculation);

  // Check URL query param ?paket=...
  const params = new URLSearchParams(window.location.search);
  const urlPkg = params.get("paket");
  if (urlPkg && prices[urlPkg]) {
    packageSelect.value = urlPkg;
  }
  updateCalculation();

  const STORAGE_KEY = "borobudur_reservations_v1";
  const tbody = document.getElementById("crudTableBody");
  const emptyState = document.getElementById("crudEmptyState");
  const countBadge = document.getElementById("crudCountBadge");
  const searchInput = document.getElementById("crudSearchInput");
  const seedDemoBtn = document.getElementById("seedDemoBtn");
  const clearAllBtn = document.getElementById("clearAllBtn");
  const editBanner = document.getElementById("editModeBanner");
  const editCodeLabel = document.getElementById("editCodeLabel");
  const cancelEditBtn = document.getElementById("cancelEditBtn");
  const submitBtn = document.getElementById("submitBookingBtn");
  const pemanduCheck = guideCheck;
  let editingId = null;

  const escapeHtml = (str) =>
    String(str).replace(/[&<>"']/g, (ch) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    }[ch]));

  const loadBookings = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const saveBookings = (list) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  };

  const openEticketModal = (item) => {
    document.getElementById("eticketCode").textContent = item.code;
    document.getElementById("eticketName").textContent = item.nama;
    document.getElementById("eticketEmail").textContent = item.email;
    document.getElementById("eticketDate").textContent = `${item.tanggal} (${item.sesi})`;
    document.getElementById("eticketPkg").textContent = `${item.paket} • ${item.jumlah} Orang${item.pemandu ? " + Pemandu" : ""}`;
    document.getElementById("eticketTotal").textContent = item.totalText;
    new bootstrap.Modal(document.getElementById("eticketModal")).show();
  };

  const exitEditMode = () => {
    editingId = null;
    if (editBanner) editBanner.classList.add("d-none");
    if (editBanner) editBanner.classList.remove("d-flex");
    if (submitBtn) submitBtn.textContent = "Buat Simulasi E-Tiket Sekarang";
  };

  const renderBookings = () => {
    if (!tbody) return;
    const all = loadBookings();
    const q = (searchInput?.value || "").trim().toLowerCase();
    const filtered = q
      ? all.filter(
          (b) =>
            b.nama.toLowerCase().includes(q) ||
            b.code.toLowerCase().includes(q) ||
            b.paket.toLowerCase().includes(q)
        )
      : all;

    if (countBadge) countBadge.textContent = `${all.length} Data`;
    if (emptyState) emptyState.classList.toggle("d-none", filtered.length > 0);

    tbody.innerHTML = filtered
      .map(
        (item) => `
      <tr>
        <td class="ps-4 fw-bold text-bronze font-monospace small">${escapeHtml(item.code)}</td>
        <td>
          <div class="fw-semibold">${escapeHtml(item.nama)}</div>
          <small class="text-muted">${escapeHtml(item.email)}</small>
        </td>
        <td>
          <div class="fw-semibold small">${escapeHtml(item.paket)} (${escapeHtml(item.jumlah)} org${item.pemandu ? " + Pemandu" : ""})</div>
          <small class="text-muted">${escapeHtml(item.tanggal)} • ${escapeHtml(item.sesi)}</small>
        </td>
        <td class="fw-bold text-bronze">${escapeHtml(item.totalText)}</td>
        <td class="pe-4 text-end">
          <div class="btn-group btn-group-sm" role="group">
            <button type="button" class="btn btn-outline-secondary" data-action="view" data-id="${escapeHtml(item.id)}">E-Tiket</button>
            <button type="button" class="btn btn-outline-primary" data-action="edit" data-id="${escapeHtml(item.id)}">Edit</button>
            <button type="button" class="btn btn-outline-danger" data-action="delete" data-id="${escapeHtml(item.id)}">Hapus</button>
          </div>
        </td>
      </tr>`
      )
      .join("");
  };

  if (tbody) {
    tbody.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-action]");
      if (!btn) return;
      const action = btn.getAttribute("data-action");
      const id = btn.getAttribute("data-id");
      const list = loadBookings();
      const target = list.find((b) => b.id === id);

      if (action === "view" && target) {
        openEticketModal(target);
      } else if (action === "edit" && target) {
        editingId = target.id;
        document.getElementById("namaInput").value = target.nama;
        document.getElementById("emailInput").value = target.email;
        dateInput.value = target.tanggal;
        document.getElementById("sesiSelect").value = target.sesi;
        packageSelect.value = target.paket;
        qtyInput.value = target.jumlah;
        if (pemanduCheck) pemanduCheck.checked = Boolean(target.pemandu);
        document.getElementById("catatanInput").value = target.catatan || "";
        updateCalculation();

        if (editBanner && editCodeLabel) {
          editCodeLabel.textContent = target.code;
          editBanner.classList.remove("d-none");
          editBanner.classList.add("d-flex");
        }
        if (submitBtn) submitBtn.textContent = "Simpan Perubahan Data";
        document.getElementById("formPemesanan")?.scrollIntoView({ behavior: "smooth" });
      } else if (action === "delete") {
        const updated = list.filter((b) => b.id !== id);
        saveBookings(updated);
        if (editingId === id) {
          exitEditMode();
          bookingForm.reset();
        }
        renderBookings();
      }
    });
  }

  if (cancelEditBtn) {
    cancelEditBtn.addEventListener("click", () => {
      exitEditMode();
      bookingForm.reset();
      if (dateInput) dateInput.value = new Date().toISOString().split("T")[0];
      updateCalculation();
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", renderBookings);
  }

  if (seedDemoBtn) {
    seedDemoBtn.addEventListener("click", () => {
      const current = loadBookings();
      const today = new Date().toISOString().split("T")[0];
      const samples = [
        {
          id: "demo-" + Date.now() + "-1",
          code: "BRB-74K9M",
          nama: "Jeivel Sumendap",
          email: "jeivel@example.com",
          tanggal: today,
          sesi: "05.00 WIB (Sunrise)",
          paket: "Morning Experience",
          jumlah: 2,
          pemandu: true,
          catatan: "Persiapan foto sunrise",
          totalText: "Rp375.000"
        },
        {
          id: "demo-" + Date.now() + "-2",
          code: "BRB-29P4X",
          nama: "Rina Kartika",
          email: "rina.k@example.com",
          tanggal: today,
          sesi: "08.30 WIB (Pagi)",
          paket: "Heritage Tour",
          jumlah: 4,
          pemandu: false,
          catatan: "Rombongan keluarga",
          totalText: "Rp400.000"
        }
      ];
      saveBookings([...samples, ...current]);
      renderBookings();
    });
  }

  if (clearAllBtn) {
    clearAllBtn.addEventListener("click", () => {
      if (!loadBookings().length) return;
      saveBookings([]);
      exitEditMode();
      renderBookings();
    });
  }

  renderBookings();

  if (bookingForm) {
    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!bookingForm.checkValidity()) {
        bookingForm.classList.add("was-validated");
        return;
      }

      const nama = document.getElementById("namaInput").value.trim();
      const email = document.getElementById("emailInput").value.trim();
      const tanggal = dateInput.value;
      const sesi = document.getElementById("sesiSelect").value;
      const paket = packageSelect.value;
      const jumlah = parseInt(qtyInput.value, 10);
      const pemandu = pemanduCheck ? pemanduCheck.checked : false;
      const catatan = document.getElementById("catatanInput").value.trim();
      const totalText = summaryTotal.textContent;

      const list = loadBookings();

      if (editingId) {
        const idx = list.findIndex((b) => b.id === editingId);
        if (idx !== -1) {
          list[idx] = {
            ...list[idx],
            nama,
            email,
            tanggal,
            sesi,
            paket,
            jumlah,
            pemandu,
            catatan,
            totalText
          };
          saveBookings(list);
          exitEditMode();
          renderBookings();
          openEticketModal(list[idx]);
        }
      } else {
        const newItem = {
          id: "id-" + Date.now(),
          code: "BRB-" + Math.random().toString(36).substring(2, 7).toUpperCase(),
          nama,
          email,
          tanggal,
          sesi,
          paket,
          jumlah,
          pemandu,
          catatan,
          totalText
        };
        list.unshift(newItem);
        saveBookings(list);
        renderBookings();
        openEticketModal(newItem);
      }

      bookingForm.reset();
      bookingForm.classList.remove("was-validated");
      if (dateInput) dateInput.value = new Date().toISOString().split("T")[0];
      updateCalculation();
    });
  }
}
