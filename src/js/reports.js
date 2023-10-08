const isLoggedIn = sessionStorage.getItem("isLoggedIn");

if (!isLoggedIn || isLoggedIn !== "true") {
  window.location.href = "login.html";
}

function logout() {
  sessionStorage.removeItem("isLoggedIn");
  sessionStorage.removeItem("Email");
  sessionStorage.removeItem("Role");

  window.location.href = "index.html";
}

function printTable() {
  const tableToPrint = document.querySelector(".table-wrapper table").cloneNode(true);

  const printWindow = window.open("", "", "width=600,height=600");
  printWindow.document.open();
  printWindow.document.write(
    "<html><head><title>Cetak Tabel</title>" +
      "<style>" +
      "@media print {" +
      "  /* Gaya cetak untuk tabel */" +
      "  table { width: 100%; border-collapse: collapse; }" +
      "  th, td { border: 1px solid #000; padding: 8px; text-align: left; }" +
      "  th { background-color: #f2f2f2; font-weight: bold; }" +
      "  tbody tr:nth-child(even) { background-color: #f2f2f2; }" +
      "}" +
      "</style>" +
      "</head><body>"
  );

  // Masukkan tabel yang akan dicetak ke dalam jendela pop-up
  printWindow.document.write(tableToPrint.outerHTML);
  printWindow.document.write("</body></html>");
  printWindow.document.close();

  // Lakukan pencetakan dalam jendela pop-up
  printWindow.print();
  printWindow.close();
}

function convertTimestampToHHMMSS(timestamp) {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  return hours + ":" + minutes + ":" + seconds;
}

function convertHHMMSSToSeconds(timeString) {
  const timeParts = timeString.split(":");
  const hours = parseInt(timeParts[0], 10);
  const minutes = parseInt(timeParts[1], 10);
  const seconds = parseInt(timeParts[2], 10);
  return hours * 3600 + minutes * 60 + seconds;
}

var totalWaktuInSeconds = 0; // Inisialisasi total waktu
var userCount = 0;

function addItemToTable(dataItem) {
  var dataTable = document.getElementById("data-table");
  var row = dataTable.insertRow();
  var namaCell = row.insertCell(0);
  var penggunaCell = row.insertCell(1);
  var waktuCell = row.insertCell(2);

  namaCell.textContent = dataItem["Nama"];
  penggunaCell.textContent = dataItem["Penggunaan"];
  var waktuText = convertTimestampToHHMMSS(dataItem["Waktu Pemakaian"]);
  waktuCell.textContent = waktuText;

  // Tambahkan waktu item ke total waktu dalam detik
  totalWaktuInSeconds += convertHHMMSSToSeconds(waktuText);
  userCount++;
  document.getElementById("user").textContent = userCount;
}

fetch("https://script.google.com/macros/s/AKfycbzP9rblOw1b9TVyDQQZkK1UTS9FNOf0U_oDX1f294ksOrx7ftDPozSxymmWdU-aAAsy/exec")
  .then((response) => response.json())
  .then((data) => {
    var dataArray = data.data;

    // Mengurutkan dataArray berdasarkan tanggal (dari yang terbaru ke yang terlama)
    dataArray.sort((a, b) => {
      const dateA = new Date(a["Timestamp"]);
      const dateB = new Date(b["Timestamp"]);
      return dateB - dateA;
    });

    // Mengisi tabel dengan data yang sudah diurutkan
    for (var i = 0; i < dataArray.length; i++) {
      var dataItem = dataArray[i];
      addItemToTable(dataItem);
    }

    // Setelah selesai iterasi, tampilkan total waktu
    var totalHours = Math.floor(totalWaktuInSeconds / 3600);
    var totalMinutes = Math.floor((totalWaktuInSeconds % 3600) / 60);
    var totalSeconds = totalWaktuInSeconds % 60;
    var totalWaktuFormatted = totalHours.toString().padStart(2, "0") + ":" + totalMinutes.toString().padStart(2, "0") + ":" + totalSeconds.toString().padStart(2, "0");

    // Mengisi elemen <span> dengan total waktu yang sudah di-format
    document.getElementById("Waktu").textContent = totalWaktuFormatted;

    // Hitung rata-rata
    var averageHours = Math.floor(totalHours / userCount);
    var averageMinutes = Math.floor(totalMinutes / userCount);
    var averageSeconds = Math.floor(totalSeconds / userCount);
    var averageWaktuFormatted = averageHours.toString().padStart(2, "0") + ":" + averageMinutes.toString().padStart(2, "0") + ":" + averageSeconds.toString().padStart(2, "0");

    document.getElementById("average").textContent = averageWaktuFormatted;
  })
  .catch((error) => console.error("Error:", error));
