function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Tambahkan nol di depan jika bulan < 10
    const day = String(date.getDate()).padStart(2, "0"); // Tambahkan nol di depan jika tanggal < 10
    return `${day}-${month}-${year}`;
  }
  function addItemToTable(dataItem) {
      var dataTable = document.getElementById("data-table");
      var row = dataTable.insertRow();
      // var idCell = row.insertCell(0);
      var namaCell = row.insertCell(0);
      var tanggalCell = row.insertCell(1);
      var statusCell = row.insertCell(2);

      // idCell.textContent = dataItem["Timestamp"];
      namaCell.textContent = dataItem["Nama Pemohon"];
      tanggalCell.textContent = formatDate(dataItem["Tanggal"]);
      statusCell.textContent = dataItem["Status Verifikasi"];
  }

  // Pengambilan data dari URL JSON
  fetch("https://script.google.com/macros/s/AKfycbzKkijtHQRINPIN-8uHW0754xbLfvQyBsqsvZu8Fd46usy14WZZO1IjBfB9xAfd7WnE/exec") // Ganti 'URL_JSON' dengan URL yang benar
    .then((response) => response.json())
    .then((data) => {
      // Di sini Anda dapat mengakses dan menampilkan data sesuai kebutuhan Anda
      var dataArray = data.data;
      for (var i = 0; i < dataArray.length; i++) {
        var dataItem = dataArray[i];
        // Menampilkan data sesuai dengan ID yang diinputkan
        addItemToTable(dataItem);
      }
    })
    .catch((error) => console.error("Error:", error));