/* ==========================================================
   SITTA UT - script.js
   Fungsi bantu yang dipakai SEMUA halaman (modularitas):
   session, greeting, modal, tabel, validasi, progress.
   Dimuat setelah data.js dan sebelum js khusus tiap halaman.
   ========================================================== */

const KUNCI_SESI = "sittaUserAktif";       // user yang sedang login
const KUNCI_PENGGUNA_BARU = "sittaPenggunaBaru"; // hasil pendaftaran

/* ---------- Session (localStorage) ---------- */
function ambilUserAktif() {
  try {
    return JSON.parse(localStorage.getItem(KUNCI_SESI));
  } catch (e) {
    return null;
  }
}

function simpanUserAktif(user) {
  localStorage.setItem(KUNCI_SESI, JSON.stringify(user));
}

// Dipanggil di halaman yang butuh login. Jika belum login -> ke login.html
function wajibLogin() {
  const user = ambilUserAktif();
  if (!user) {
    window.location.replace("login.html");
  }
  return user;
}

function pasangLogout() {
  const tombol = document.getElementById("btnLogout");
  if (!tombol) return;
  tombol.addEventListener("click", (e) => {
    e.preventDefault();
    if (confirm("Yakin ingin keluar dari SITTA?")) {
      localStorage.removeItem(KUNCI_SESI);
      window.location.href = "login.html";
    }
  });
}

/* ---------- Pengguna (data dosen + pendaftar baru) ---------- */
function ambilPenggunaBaru() {
  try {
    return JSON.parse(localStorage.getItem(KUNCI_PENGGUNA_BARU)) || [];
  } catch (e) {
    return [];
  }
}

function semuaPengguna() {
  return dataPengguna.concat(ambilPenggunaBaru());
}

/* ---------- Greeting berdasarkan jam lokal ---------- */
function waktuSapaan(tanggal = new Date()) {
  const jam = tanggal.getHours();
  if (jam >= 4 && jam < 11) return "pagi";
  if (jam >= 11 && jam < 15) return "siang";
  if (jam >= 15 && jam < 18) return "sore";
  return "malam";
}

function tampilkanIdentitas(user) {
  if (!user) return; // belum login: halaman sedang dialihkan ke login.html
  const sapa = document.getElementById("greeting");
  if (sapa) sapa.textContent = "Selamat " + waktuSapaan() + ", " + user.nama + "!";
  const info = document.getElementById("infoUser");
  if (info) info.textContent = user.role + " - " + user.lokasi;
}

/* ---------- Modal ---------- */
function bukaModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;
  modal.hidden = false;
  const fokus = modal.querySelector("input, select, button");
  if (fokus) fokus.focus();
}

function tutupModal(modal) {
  modal.hidden = true;
}

// Pasang perilaku tutup: tombol [data-tutup], klik latar gelap, tombol Escape
function aktifkanModal() {
  document.querySelectorAll(".modal").forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal || e.target.hasAttribute("data-tutup")) {
        tutupModal(modal);
      }
    });
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal:not([hidden])").forEach(tutupModal);
    }
  });
}

/* ---------- Tabel (DOM, memakai textContent agar aman dari XSS) ---------- */
function isiTabel(idTbody, baris) {
  const tbody = document.getElementById(idTbody);
  tbody.textContent = ""; // kosongkan dulu
  baris.forEach((kolom) => {
    const tr = document.createElement("tr");
    kolom.forEach((nilai) => {
      const td = document.createElement("td");
      td.textContent = nilai;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}

/* ---------- Validasi form ---------- */
function tampilkanError(input, pesan) {
  const span = document.getElementById("err-" + input.id);
  if (span) span.textContent = pesan;
  input.classList.add("invalid");
}

function bersihkanError(form) {
  form.querySelectorAll(".error").forEach((s) => (s.textContent = ""));
  form.querySelectorAll(".invalid").forEach((i) => i.classList.remove("invalid"));
}

const POLA_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ---------- Tracking: progress & status ---------- */
const JUMLAH_TAHAP_PENGIRIMAN = 6; // tahapan normal dari loket sampai diterima

function hitungProgress(data) {
  const langkah = data.perjalanan;
  const terakhir = langkah[langkah.length - 1].keterangan;
  if (terakhir.indexOf("Selesai Antar") === 0) return 100;
  return Math.min(99, Math.round((langkah.length / JUMLAH_TAHAP_PENGIRIMAN) * 100));
}

function kelasStatus(status) {
  if (status === "Dalam Perjalanan") return "badge-oranye";
  if (status === "Dikirim") return "badge-biru";
  if (status === "Selesai") return "badge-hijau";
  return "";
}

// Dataset dosen: kode paket = kodeLokasi di dataBahanAjar
function cariBahanDariPaket(kodePaket) {
  return dataBahanAjar.find((b) => b.kodeLokasi === kodePaket) || null;
}

function formatTanggalIndonesia(teks) {
  const t = new Date(teks.replace(" ", "T"));
  if (isNaN(t)) return teks;
  return t.toLocaleString("id-ID", { dateStyle: "medium", timeStyle: teks.length > 10 ? "short" : undefined });
}

/* ---------- Status stok ---------- */
function statusStok(stok) {
  if (stok < 200) return { teks: "Menipis", kelas: "badge-merah" };
  if (stok < 400) return { teks: "Cukup", kelas: "badge-oranye" };
  return { teks: "Aman", kelas: "badge-hijau" };
}
