const isLoggedIn = sessionStorage.getItem("isLoggedIn");

if (!isLoggedIn || isLoggedIn !== "true") {
  window.location.href = "login.html";
}

const role = document.getElementById("role");
role.textContent = sessionStorage.getItem("Role");

function logout() {
  sessionStorage.removeItem("isLoggedIn");
  sessionStorage.removeItem("Email");
  sessionStorage.removeItem("Role");

  window.location.href = "index.html";
}

// Fungsi untuk mengirim perubahan ke Google Apps Script
function sendChangesToAppsScript(id, kaLab, ppcAE) {
  const requestBody = {
    id: id,
    kaLab: kaLab,
    ppcAE: ppcAE,
  };

  fetch("https://backend-elmek.vercel.app/api/konfirmasi", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  })
    .then((response) => response.json())
    .then((responseData) => {
      if (responseData.success) {
        console.log("Perubahan berhasil dikirim ke Google Apps Script");
      } else {
        console.error("Gagal mengirim perubahan:", responseData.error);
      }
    })
    .catch((error) => {
      console.error("Error mengirim perubahan:", error);
    });
}

// Fungsi untuk mengambil dan mengisi data tabel
function fetchDataAndPopulateTable() {
  fetch("https://script.google.com/macros/s/AKfycby-CsqtaPza5rlpxO8Bpcem4peBxv19AmqjJMMZHKR3E0rFN2aumKexSqjT9PwLRm99/exec")
    .then((response) => response.json())
    .then((data) => {
      // Manipulasi data di sini untuk mengisi tabel
      populateTable(data.data);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

// Variabel untuk menyimpan jumlah total data
let totalData = 0;
let totalVerify = 0;
let totalReject = 0;
let totalProcess = 0;

// Fungsi untuk mengisi tabel dengan data
function populateTable(data) {
  const tableBody = document.getElementById("data-table");

  // Hapus semua baris tabel sebelum mengisi kembali
  tableBody.innerHTML = "";

  // Reset jumlah total data
  totalData = 0;
  totalVerify = 0;
  totalReject = 0;
  totalProcess = 0;

  // Loop melalui data dan tambahkan baris baru untuk setiap entri
  // Cek Role dari sessionStorage
  const userRole = sessionStorage.getItem("Role");

  data.forEach((entry) => {
    const row = document.createElement("tr");

    // Kolom Nama
    const namaCell = document.createElement("td");
    namaCell.textContent = entry["Nama Pemohon"];
    row.appendChild(namaCell);

    // Kolom Status Verifikasi
    const statusVerifikasiCell = document.createElement("td");
    statusVerifikasiCell.textContent = entry["Status Verifikasi"];
    row.appendChild(statusVerifikasiCell);

    // Kolom Action
    const actionCell = document.createElement("td");

    // Buat tombol Konfirmasi dengan event handler yang berbeda sesuai peran pengguna
    const konfirmasiButton = document.createElement("button");
    konfirmasiButton.textContent = "Konfirmasi";
    konfirmasiButton.classList.add("done");
    konfirmasiButton.addEventListener("click", () => {
      if (userRole === "Ka Lab") {
        entry["Ka Lab"] = "Setuju";
      } else if (userRole === "PPC" || userRole === "PLP") {
        entry["PLP/PPC"] = "Setuju";
      }
      Swal.fire("Success!", "You clicked the button!", "success");
      sendChangesToAppsScript(entry.Id, entry["PLP/PPC"], entry["Ka Lab"]);
    });
    actionCell.appendChild(konfirmasiButton);

    if (userRole === "Ka Lab" || userRole === "PPC" || userRole === "PLP") {
      const tolakButton = document.createElement("button");
      tolakButton.textContent = "Tolak";
      tolakButton.classList.add("reject");
      tolakButton.addEventListener("click", () => {
        if (userRole === "Ka Lab") {
          entry["Ka Lab"] = "Tolak";
        } else if (userRole === "PPC" || userRole === "PLP") {
          entry["PLP/PPC"] = "Tolak";
        }
        Swal.fire({
          title: "Apakah Anda yakin akan menolak ini?",
          text: "Jika ya, penolakan akan berhasil.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Ya, tolak!",
        }).then((result) => {
          if (result.isConfirmed) {
            // Panggil fungsi untuk menampilkan modal input alasan penolakan di sini
            showRejectReasonModal(entry.Id);
            sendChangesToAppsScript(entry.Id, entry["PLP/PPC"], entry["Ka Lab"]);
          }
        });
      });
      actionCell.appendChild(tolakButton);
    }

    row.appendChild(actionCell);

    tableBody.appendChild(row);

    if (entry["Status Verifikasi"] === "Disetujui") {
      totalVerify++;
    } else if (entry["Status Verifikasi"] === "Ditolak") {
      totalReject++;
    } else {
      totalProcess++;
    }

    totalData++;
  });

  updateTotalDataDisplay();
}

function updateTotalDataDisplay() {
  const totalDataElement = document.getElementById("user");
  const totalVerifyElement = document.getElementById("setuju");
  const totalRejectElement = document.getElementById("tolak");
  const totalProcessElement = document.getElementById("proses");
  totalDataElement.textContent = totalData;
  totalVerifyElement.textContent = totalVerify;
  totalRejectElement.textContent = totalReject;
  totalProcessElement.textContent = totalProcess;
}

// Fetch data dan isi tabel saat halaman pertama kali dimuat
fetchDataAndPopulateTable();

setInterval(fetchDataAndPopulateTable, 1000);

// Fungsi untuk menampilkan modal input alasan penolakan
function showRejectReasonModal(entryId) {
  Swal.fire({
    title: "Masukkan Alasan Penolakan",
    input: "text",
    inputPlaceholder: "Masukkan alasan penolakan di sini...",
    showCancelButton: true,
    confirmButtonText: "Kirim",
    cancelButtonText: "Batal",
    inputValidator: (value) => {
      if (!value) {
        return "Harap masukkan alasan penolakan.";
      }
    },
  }).then((result) => {
    if (result.isConfirmed) {
      // Kirim alasan penolakan ke server di sini
      const rejectReason = result.value;
      sendRejectReasonToServer(entryId, rejectReason);
    }
  });
}

// Fungsi untuk mengirim alasan penolakan ke server
// Fungsi untuk mengirim alasan penolakan ke server
function sendRejectReasonToServer(entryId, rejectReason) {
  // Data yang akan dikirim ke server
  const requestData = {
    entryId: entryId,
    rejectReason: rejectReason,
  };

  // URL Google Apps Script yang akan menangani permintaan
  const scriptUrl = "https://backend-elmek.vercel.app/api/tolak";

  // Buat objek pengaturan untuk permintaan POST
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  };

  // Kirim permintaan ke server Google Apps Script
  fetch(scriptUrl, requestOptions)
    .then((response) => response.json())
    .then((responseData) => {
      if (responseData.success) {
        console.log("Alasan penolakan berhasil dikirim ke server.");
        // Anda dapat memperbarui tampilan tabel atau melakukan tindakan lain di sini jika diperlukan
      } else {
        console.error("Gagal mengirim alasan penolakan ke server:", responseData.error);
      }
    })
    .catch((error) => {
      console.error("Error mengirim alasan penolakan ke server:", error);
    });
}
