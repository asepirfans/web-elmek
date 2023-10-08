function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); 
  const day = String(date.getDate()).padStart(2, "0");
  return `${day}-${month}-${year}`;
}

function addItemToTable(dataItem) {
  var dataTable = document.getElementById("data-table");
  var row = dataTable.insertRow();
  var namaCell = row.insertCell(0);
  var tanggalCell = row.insertCell(1);
  var statusCell = row.insertCell(2);

  namaCell.textContent = dataItem["Nama Pemohon"];
  tanggalCell.textContent = formatDate(dataItem["Tanggal"]);
  statusCell.textContent = dataItem["Status Verifikasi"];
}

fetch("https://script.google.com/macros/s/AKfycbzKkijtHQRINPIN-8uHW0754xbLfvQyBsqsvZu8Fd46usy14WZZO1IjBfB9xAfd7WnE/exec")
  .then((response) => response.json())
  .then((data) => {
    var dataArray = data.data;

    // Mengurutkan dataArray berdasarkan tanggal (dari yang terbaru ke yang terlama)
    dataArray.sort((a, b) => {
      const dateA = new Date(a["Timestamp"]);
      const dateB = new Date(b["Timestamp"]);
      return dateB - dateA;
    });

    for (var i = 0; i < dataArray.length; i++) {
      var dataItem = dataArray[i];
      addItemToTable(dataItem);
    }
  })
  .catch((error) => console.error("Error:", error));
