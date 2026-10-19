/* ==========================================================
   SITTA UT - dashboard.js  (khusus dashboard.html)
   Isi: greeting, ringkasan angka, modal Laporan & Histori
   ========================================================== */

const user = wajibLogin();      // tendang ke login jika belum login
tampilkanIdentitas(user);       // greeting + role + lokasi
pasangLogout();
aktifkanModal();

document.getElementById("tanggalHariIni").textContent =
  new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

/* ---------- Ringkasan angka ---------- */
const daftarDO = Object.keys(dataTracking);
const totalStok = dataBahanAjar.reduce((jumlah, b) => jumlah + b.stok, 0);
const sedangKirim = daftarDO.filter((no) => hitungProgress(dataTracking[no]) < 100).length;

document.getElementById("statJenis").textContent = dataBahanAjar.length;
document.getElementById("statStok").textContent = totalStok.toLocaleString("id-ID");
document.getElementById("statDO").textContent = daftarDO.length;
document.getElementById("statKirim").textContent = sedangKirim;

/* ---------- Laporan: Monitoring Progress DO ---------- */
document.getElementById("btnMonitoring").addEventListener("click", () => {
  const tbody = document.getElementById("tbMonitoring");
  tbody.textContent = "";

  daftarDO.forEach((no) => {
    const d = dataTracking[no];
    const progress = hitungProgress(d);
    const tr = document.createElement("tr");

    [no, d.nama, d.ekspedisi].forEach((teks) => {
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
    tdBar.style.minWidth = "160px";
    const track = document.createElement("div");
    track.className = "progress";
    const bar = document.createElement("div");
    bar.className = "progress-bar" + (progress === 100 ? " selesai" : "");
    bar.style.width = progress + "%";
    bar.textContent = progress + "%";
    track.appendChild(bar);
    tdBar.appendChild(track);
    tr.appendChild(tdBar);

    tbody.appendChild(tr);
  });
  bukaModal("modalMonitoring");
});

/* ---------- Laporan: Rekap Bahan Ajar ---------- */
document.getElementById("btnRekap").addEventListener("click", () => {
  const tbody = document.getElementById("tbRekap");
  tbody.textContent = "";

  dataBahanAjar.forEach((b) => {
    const tr = document.createElement("tr");
    [b.kodeBarang, b.namaBarang, b.jenisBarang, b.edisi, b.stok.toLocaleString("id-ID")].forEach((teks) => {
      const td = document.createElement("td");
      td.textContent = teks;
      tr.appendChild(td);
    });
    const st = statusStok(b.stok);
    const tdStatus = document.createElement("td");
    const badge = document.createElement("span");
    badge.className = "badge " + st.kelas;
    badge.textContent = st.teks;
    tdStatus.appendChild(badge);
    tr.appendChild(tdStatus);
    tbody.appendChild(tr);
  });

  document.getElementById("rekapTotal").textContent = totalStok.toLocaleString("id-ID");
  bukaModal("modalRekap");
});

/* ---------- Histori Transaksi ---------- */
document.getElementById("btnHistori").addEventListener("click", () => {
  const baris = daftarDO.map((no) => {
    const d = dataTracking[no];
    const bahan = cariBahanDariPaket(d.paket);
    return [
      d.tanggalKirim,
      no,
      d.nama,
      bahan ? bahan.namaBarang + " (" + d.paket + ")" : d.paket,
      d.total
    ];
  });
  isiTabel("tbHistori", baris);
  bukaModal("modalHistori");
});
