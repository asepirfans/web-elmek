function login() {
    var username = document.getElementById("username").value;
    // var password = document.getElementById("password").value;

    // Verifikasi apakah email ada dalam daftar yang diizinkan
    if (allowedEmails.includes(username)) {
        // Jika login berhasil, tampilkan dashboard dan sembunyikan form login
        document.getElementById("loginForm").style.display = "none";
        document.getElementById("dashboard").style.display = "block";
    } else {
        alert("Login gagal. Coba lagi.");
    }
}

function logout () {
    window.location.href = "login.html";
}

