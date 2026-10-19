/* ==========================================================
   SITTA UT - stok.js  (khusus stok.html)
   Isi: tampil data dataBahanAjar secara dinamis,
        tambah baris baru (DOM), edit stok, hapus baris, cari,
        validasi form
   ========================================================== */

const user = wajibLogin();
tampilkanIdentitas(user);
pasangLogout();
aktifkanModal();

const tbStok = document.getElementById("tbStok");
let itemSedangDiedit = null; // null = mode tambah, objek = mode edit

/* ---------- Membuat satu baris tabel dari satu objek bahan ajar ---------- */
function buatBaris(item) {
  const tr = document.createElement("tr");

  // kolom teks biasa
  [item.kodeBarang, item.kodeLokasi, item.namaBarang, item.jenisBarang, item.edisi, item.stok].forEach((nilai) => {
    const td = document.createElement("td");
    td.textContent = nilai;
    tr.appendChild(td);
  });

  // kolom status stok (badge)
  const st = statusStok(item.stok);
  const tdStatus = document.createElement("td");
  const badge = document.createElement("span");
  badge.className = "badge " + st.kelas;
  badge.textContent = st.teks;
  tdStatus.appendChild(badge);
  tr.appendChild(tdStatus);

  // kolom cover (gambar; jika kosong/gagal dimuat tampilkan kotak abu-abu)
  const tdCover = document.createElement("td");
  if (item.cover) {
    const img = document.createElement("img");
    img.className = "cover";
    img.src = item.cover;
    img.alt = "Cover " + item.namaBarang;
    img.addEventListener("error", () => tdCover.replaceChildren(buatCoverKosong()));
    tdCover.appendChild(img);
  } else {
    tdCover.appendChild(buatCoverKosong());
  }
  tr.appendChild(tdCover);

  // kolom aksi (Edit & Hapus)
  const tdAksi = document.createElement("td");
  tdAksi.className = "aksi";

  const btnEdit = document.createElement("button");
  btnEdit.type = "button";
  btnEdit.className = "btn btn-hijau btn-kecil";
  btnEdit.textContent = "Edit";
  btnEdit.addEventListener("click", () => bukaFormEdit(item, tr));

  const btnHapus = document.createElement("button");
  btnHapus.type = "button";
  btnHapus.className = "btn btn-bahaya btn-kecil";
  btnHapus.textContent = "Hapus";
  btnHapus.addEventListener("click", () => {
    if (confirm("Hapus " + item.namaBarang + " (" + item.kodeLokasi + ") dari daftar?")) {
      const posisi = dataBahanAjar.indexOf(item);
      if (posisi > -1) dataBahanAjar.splice(posisi, 1);
      tr.remove();
      perbaruiRingkasan();
    }
  });

  tdAksi.appendChild(btnEdit);
  tdAksi.appendChild(document.createTextNode(" "));
  tdAksi.appendChild(btnHapus);
  tr.appendChild(tdAksi);

  return tr;
}

function buatCoverKosong() {
  const kotak = document.createElement("span");
  kotak.className = "cover-kosong";
  kotak.textContent = "No cover";
  return kotak;
}

/* ---------- Tampilkan semua data awal ---------- */
function tampilkanSemua() {
  tbStok.textContent = "";
  dataBahanAjar.forEach((item) => tbStok.appendChild(buatBaris(item)));
  perbaruiRingkasan();
}

function perbaruiRingkasan() {
  const total = dataBahanAjar.reduce((j, b) => j + b.stok, 0);
  document.getElementById("ringkasan").textContent =
    "Total Stok: " + total.toLocaleString("id-ID") + " | Total Jenis Buku: " + dataBahanAjar.length;
}

tampilkanSemua();

/* ---------- Pencarian (menyembunyikan baris yang tidak cocok) ---------- */
document.getElementById("cari").addEventListener("input", function () {
  const kata = this.value.trim().toLowerCase();
  Array.from(tbStok.rows).forEach((baris) => {
    baris.hidden = kata !== "" && !baris.textContent.toLowerCase().includes(kata);
  });
});

/* ---------- Modal tambah / edit ---------- */
const formTambah = document.getElementById("formTambah");
const f = {
  kodeLokasi: document.getElementById("kodeLokasi"),
  kodeBarang: document.getElementById("kodeBarang"),
  namaBarang: document.getElementById("namaBarang"),
  jenisBarang: document.getElementById("jenisBarang"),
  edisi: document.getElementById("edisi"),
  stok: document.getElementById("stok")
};
let barisSedangDiedit = null;

function siapkanModeTambah() {
  itemSedangDiedit = null;
  barisSedangDiedit = null;
  formTambah.reset();
  bersihkanError(formTambah);
  f.kodeLokasi.readOnly = false;
  f.kodeBarang.readOnly = false;
  document.getElementById("jdl-tambah").textContent = "Tambah Stok Baru";
  document.getElementById("infoMode").textContent = "";
  document.getElementById("btnSimpan").textContent = "Simpan";
}

document.getElementById("btnTambah").addEventListener("click", () => {
  siapkanModeTambah();
  bukaModal("modalTambah");
});

function bukaFormEdit(item, tr) {
  siapkanModeTambah();
  itemSedangDiedit = item;
  barisSedangDiedit = tr;
  f.kodeLokasi.value = item.kodeLokasi;
  f.kodeBarang.value = item.kodeBarang;
  f.namaBarang.value = item.namaBarang;
  f.jenisBarang.value = item.jenisBarang;
  f.edisi.value = item.edisi;
  f.stok.value = item.stok;
  f.kodeLokasi.readOnly = true;   // kode tidak boleh diubah saat edit
  f.kodeBarang.readOnly = true;
  document.getElementById("jdl-tambah").textContent = "Edit Stok";
  document.getElementById("infoMode").textContent = "Kode lokasi dan kode barang tidak dapat diubah.";
  document.getElementById("btnSimpan").textContent = "Simpan Perubahan";
  bukaModal("modalTambah");
}

formTambah.addEventListener("submit", function (e) {
  e.preventDefault();
  bersihkanError(formTambah);

  const kodeLokasi = f.kodeLokasi.value.trim().toUpperCase();
  const kodeBarang = f.kodeBarang.value.trim().toUpperCase();
  let valid = true;

  if (!/^0[A-Z0-9]{3,8}$/.test(kodeLokasi)) {
    tampilkanError(f.kodeLokasi, "Diawali angka 0, 4-9 karakter huruf/angka (mis. 0BDG01).");
    valid = false;
  }
  if (!/^[A-Z]{4}\d{4}$/.test(kodeBarang)) {
    tampilkanError(f.kodeBarang, "Format: 4 huruf + 4 angka (mis. EKMA4116).");
    valid = false;
  }
  if (f.namaBarang.value.trim().length < 3) {
    tampilkanError(f.namaBarang, "Nama barang minimal 3 karakter.");
    valid = false;
  }
  if (f.jenisBarang.value === "") {
    tampilkanError(f.jenisBarang, "Pilih jenis barang.");
    valid = false;
  }
  if (f.edisi.value === "" || !Number.isInteger(Number(f.edisi.value)) || Number(f.edisi.value) < 1) {
    tampilkanError(f.edisi, "Edisi harus bilangan bulat minimal 1.");
    valid = false;
  }
  if (f.stok.value === "" || !Number.isInteger(Number(f.stok.value)) || Number(f.stok.value) < 0) {
    tampilkanError(f.stok, "Stok harus bilangan bulat 0 atau lebih.");
    valid = false;
  }

  // cegah data ganda (hanya saat menambah)
  if (valid && !itemSedangDiedit &&
      dataBahanAjar.some((b) => b.kodeLokasi === kodeLokasi && b.kodeBarang === kodeBarang)) {
    tampilkanError(f.kodeBarang, "Kombinasi kode lokasi & kode barang sudah ada.");
    valid = false;
  }

  if (!valid) {
    alert("Data belum lengkap/benar. Periksa kolom yang ditandai merah.");
    return;
  }

  if (itemSedangDiedit) {
    // ----- MODE EDIT: ubah objek, ganti baris lama dengan baris baru -----
    itemSedangDiedit.namaBarang = f.namaBarang.value.trim();
    itemSedangDiedit.jenisBarang = f.jenisBarang.value;
    itemSedangDiedit.edisi = String(Number(f.edisi.value));
    itemSedangDiedit.stok = Number(f.stok.value);
    const barisBaru = buatBaris(itemSedangDiedit);
    barisBaru.classList.add("baris-baru");
    barisSedangDiedit.replaceWith(barisBaru);
    perbaruiRingkasan();
    tutupModal(document.getElementById("modalTambah"));
    alert("Data stok berhasil diperbarui.");
    return;
  }

  // ----- MODE TAMBAH: objek baru -> array -> baris baru lewat DOM -----
  const baru = {
    kodeLokasi: kodeLokasi,
    kodeBarang: kodeBarang,
    namaBarang: f.namaBarang.value.trim(),
    jenisBarang: f.jenisBarang.value,
    edisi: String(Number(f.edisi.value)),
    stok: Number(f.stok.value),
    cover: ""
  };
  dataBahanAjar.push(baru);

  const baris = buatBaris(baru);
  baris.classList.add("baris-baru");
  tbStok.appendChild(baris);
  perbaruiRingkasan();

  tutupModal(document.getElementById("modalTambah"));
  baris.scrollIntoView({ behavior: "smooth", block: "center" });
  alert("Stok baru berhasil ditambahkan.");
});
