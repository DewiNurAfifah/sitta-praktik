/* ==========================================================
   SITTA UT - tracking.js  (khusus tracking.html)
   Isi: validasi nomor DO, pencarian di dataTracking,
        progress bar, timeline perjalanan
   ========================================================== */

const user = wajibLogin();
tampilkanIdentitas(user);
pasangLogout();

const formTracking = document.getElementById("formTracking");
const inputDO = document.getElementById("nomorDO");
const panelHasil = document.getElementById("hasil");

formTracking.addEventListener("submit", function (e) {
  e.preventDefault();
  bersihkanError(formTracking);

  const nomor = inputDO.value.trim();

  // 1) validasi input
  if (nomor === "") {
    tampilkanError(inputDO, "Nomor Delivery Order wajib diisi.");
    panelHasil.hidden = true;
    return;
  }
  if (!/^\d{6,}$/.test(nomor)) {
    tampilkanError(inputDO, "Nomor DO hanya berisi angka (minimal 6 digit).");
    panelHasil.hidden = true;
    return;
  }

  // 2) cari data: dataTracking adalah objek dengan kunci = nomor DO
  const data = dataTracking[nomor];
  if (!data) {
    alert("Nomor DO " + nomor + " tidak ditemukan.");
    panelHasil.hidden = true;
    return;
  }

  tampilkanHasil(nomor, data);
});

// Tombol contoh nomor DO
document.querySelectorAll(".chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    inputDO.value = chip.dataset.do;
    formTracking.requestSubmit();
  });
});

function tampilkanHasil(nomor, d) {
  const progress = hitungProgress(d);
  const bahan = cariBahanDariPaket(d.paket);

  document.getElementById("hNomor").textContent = nomor;
  document.getElementById("hNama").textContent = d.nama;
  document.getElementById("hEkspedisi").textContent = d.ekspedisi;
  document.getElementById("hTanggal").textContent = formatTanggalIndonesia(d.tanggalKirim);
  document.getElementById("hPaket").textContent = bahan ? d.paket + " - " + bahan.namaBarang : d.paket;
  document.getElementById("hTotal").textContent = d.total;

  const badge = document.getElementById("hStatus");
  badge.textContent = d.status;
  badge.className = "badge " + kelasStatus(d.status);

  // progress bar (lebar diatur lewat style.width)
  const bar = document.getElementById("hBar");
  bar.style.width = "0%";                         // reset agar animasi ulang
  bar.className = "progress-bar" + (progress === 100 ? " selesai" : "");
  bar.textContent = progress + "%";
  document.getElementById("trackProgress").setAttribute("aria-valuenow", progress);
  requestAnimationFrame(() => requestAnimationFrame(() => (bar.style.width = progress + "%")));

  // timeline: buat <li> satu per satu dengan DOM
  const daftar = document.getElementById("hPerjalanan");
  daftar.textContent = "";
  d.perjalanan.forEach((langkah) => {
    const li = document.createElement("li");
    const waktu = document.createElement("time");
    waktu.textContent = formatTanggalIndonesia(langkah.waktu);
    const ket = document.createElement("span");
    ket.textContent = langkah.keterangan;
    li.appendChild(waktu);
    li.appendChild(ket);
    daftar.appendChild(li);
  });

  panelHasil.hidden = false;
  panelHasil.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ==========================================================
   Daftar semua DO + ringkasan status (tampil sejak halaman dibuka)
   ========================================================== */
function tampilkanDaftarDO() {
  const tbody = document.getElementById("tbSemuaDO");
  tbody.textContent = "";
  const semua = Object.keys(dataTracking);
  let selesai = 0;

  semua.forEach((nomor) => {
    const d = dataTracking[nomor];
    const progress = hitungProgress(d);
    if (progress === 100) selesai++;
    const bahan = cariBahanDariPaket(d.paket);

    const tr = document.createElement("tr");
    tr.className = "klik";
    tr.title = "Klik untuk melihat detail";

    [nomor, d.nama].forEach((teks) => {
      const td = document.createElement("td");
      td.textContent = teks;
      tr.appendChild(td);
    });

    const tdStatus = document.createElement("td");
    const badge = document.createElement("span");
    badge.className = "badge " + kelasStatus(d.status);
    badge.textContent = d.status;
    tdStatus.appendChild(badge);
    tr.appendChild(tdStatus);

    const tdBar = document.createElement("td");
    const track = document.createElement("div");
    track.className = "progress";
    const bar = document.createElement("div");
    bar.className = "progress-bar" + (progress === 100 ? " selesai" : "");
    bar.style.width = progress + "%";
    bar.textContent = progress + "%";
    track.appendChild(bar);
    tdBar.appendChild(track);
    tr.appendChild(tdBar);

    [d.ekspedisi, d.tanggalKirim, bahan ? bahan.namaBarang : d.paket, d.total].forEach((teks) => {
      const td = document.createElement("td");
      td.textContent = teks;
      tr.appendChild(td);
    });

    tr.addEventListener("click", () => {
      inputDO.value = nomor;
      formTracking.requestSubmit();
    });
    tbody.appendChild(tr);
  });

  document.getElementById("sTotal").textContent = "Total DO: " + semua.length;
  document.getElementById("sKirim").textContent = "Dalam Pengiriman: " + (semua.length - selesai);
  document.getElementById("sSelesai").textContent = "Selesai Diantar: " + selesai;
}

tampilkanDaftarDO();
