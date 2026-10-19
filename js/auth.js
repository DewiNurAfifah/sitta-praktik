/* ==========================================================
   SITTA UT - auth.js  (khusus login.html)
   Isi: validasi login, alert error, modal Lupa Password & Daftar
   ========================================================== */

// Jika sudah login, tidak perlu ke halaman login lagi
if (ambilUserAktif()) {
  window.location.replace("dashboard.html");
}

const formLogin = document.getElementById("formLogin");
const inputEmail = document.getElementById("email");
const inputPassword = document.getElementById("password");

/* ---------- LOGIN ---------- */
formLogin.addEventListener("submit", function (e) {
  e.preventDefault(); // cegah halaman reload
  bersihkanError(formLogin);

  const email = inputEmail.value.trim().toLowerCase();
  const password = inputPassword.value;
  let valid = true;

  if (email === "") {
    tampilkanError(inputEmail, "Email wajib diisi.");
    valid = false;
  } else if (!POLA_EMAIL.test(email)) {
    tampilkanError(inputEmail, "Format email tidak valid.");
    valid = false;
  }

  if (password === "") {
    tampilkanError(inputPassword, "Password wajib diisi.");
    valid = false;
  }

  if (!valid) return;

  // Cocokkan dengan data pengguna (data.js + pendaftar baru)
  const user = semuaPengguna().find(
    (u) => u.email.toLowerCase() === email && u.password === password
  );

  if (!user) {
    alert("Email/password yang anda masukkan salah");
    inputPassword.value = "";
    inputPassword.focus();
    return;
  }

  simpanUserAktif(user);
  window.location.href = "dashboard.html";
});

// Tombol Lihat/Sembunyikan password
document.getElementById("btnLihat").addEventListener("click", function () {
  const tersembunyi = inputPassword.type === "password";
  inputPassword.type = tersembunyi ? "text" : "password";
  this.textContent = tersembunyi ? "Sembunyi" : "Lihat";
});

/* ---------- MODAL: buka ---------- */
aktifkanModal();
document.getElementById("btnLupa").addEventListener("click", () => bukaModal("modalLupa"));
document.getElementById("btnDaftar").addEventListener("click", () => bukaModal("modalDaftar"));

/* ---------- LUPA PASSWORD ---------- */
const formLupa = document.getElementById("formLupa");
formLupa.addEventListener("submit", function (e) {
  e.preventDefault();
  bersihkanError(formLupa);
  const input = document.getElementById("lupaEmail");
  const email = input.value.trim().toLowerCase();

  if (email === "") {
    tampilkanError(input, "Email wajib diisi.");
    return;
  }
  if (!POLA_EMAIL.test(email)) {
    tampilkanError(input, "Format email tidak valid.");
    return;
  }
  const ada = semuaPengguna().some((u) => u.email.toLowerCase() === email);
  if (!ada) {
    tampilkanError(input, "Email tidak terdaftar di SITTA.");
    return;
  }

  alert("Instruksi reset password telah dikirim ke " + email + " (simulasi).");
  formLupa.reset();
  tutupModal(document.getElementById("modalLupa"));
});

/* ---------- DAFTAR ---------- */
const formDaftar = document.getElementById("formDaftar");
formDaftar.addEventListener("submit", function (e) {
  e.preventDefault();
  bersihkanError(formDaftar);

  const nama = document.getElementById("regNama");
  const email = document.getElementById("regEmail");
  const role = document.getElementById("regRole");
  const lokasi = document.getElementById("regLokasi");
  const pass = document.getElementById("regPassword");
  const konfirmasi = document.getElementById("regKonfirmasi");
  let valid = true;

  if (nama.value.trim().length < 3) {
    tampilkanError(nama, "Nama minimal 3 karakter.");
    valid = false;
  }
  if (!POLA_EMAIL.test(email.value.trim())) {
    tampilkanError(email, "Format email tidak valid.");
    valid = false;
  } else if (semuaPengguna().some((u) => u.email.toLowerCase() === email.value.trim().toLowerCase())) {
    tampilkanError(email, "Email sudah terdaftar.");
    valid = false;
  }
  if (role.value === "") {
    tampilkanError(role, "Pilih salah satu peran.");
    valid = false;
  }
  if (lokasi.value.trim() === "") {
    tampilkanError(lokasi, "Lokasi wajib diisi.");
    valid = false;
  }
  if (pass.value.length < 6) {
    tampilkanError(pass, "Password minimal 6 karakter.");
    valid = false;
  }
  if (konfirmasi.value !== pass.value) {
    tampilkanError(konfirmasi, "Konfirmasi password tidak sama.");
    valid = false;
  }

  if (!valid) return;

  const baru = ambilPenggunaBaru();
  baru.push({
    id: dataPengguna.length + baru.length + 1,
    nama: nama.value.trim(),
    email: email.value.trim().toLowerCase(),
    password: pass.value,
    role: role.value,
    lokasi: lokasi.value.trim()
  });
  localStorage.setItem(KUNCI_PENGGUNA_BARU, JSON.stringify(baru));

  alert("Pendaftaran berhasil! Silakan login.");
  inputEmail.value = email.value.trim().toLowerCase(); // isi otomatis
  formDaftar.reset();
  tutupModal(document.getElementById("modalDaftar"));
  inputPassword.focus();
});
