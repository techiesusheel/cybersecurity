let scannerInstance = null;
let isScanning = false;

function checkURL() {
  const url = document.getElementById("urlInput").value.trim();
  const resultBox = document.getElementById("resultBox");

  if (!url) {
    resultBox.innerHTML = "❌ Please enter a URL.";
    resultBox.className = "suspicious";
    return;
  }

  const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w-./?%&=]*)?$/;
  if (!urlPattern.test(url)) {
    resultBox.innerHTML = "❌ This is not a valid link.";
    resultBox.className = "suspicious";
    return;
  }

  const suspiciousWords = ["login", "verify", "update", "free", "offer", "bank", "paypal"];
  const suspiciousDomains = [".tk", ".ml", ".ga", ".cf", ".gq"];
  const suspiciousPatterns = ["--", "-secure", "account-", "signin", "click"];

  let isSuspicious = suspiciousWords.some(word => url.toLowerCase().includes(word)) ||
                     suspiciousDomains.some(domain => url.toLowerCase().endsWith(domain)) ||
                     suspiciousPatterns.some(pattern => url.toLowerCase().includes(pattern));

  if (isSuspicious) {
    resultBox.innerHTML = "⚠️ This link looks <span class='suspicious'>Suspicious</span>!";
    resultBox.className = "suspicious";
  } else {
    resultBox.innerHTML = "✅ This link looks <span class='safe'>Safe</span>.";
    resultBox.className = "safe";
  }
}

function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

// Toggle Camera Scanner
function toggleScanner() {
  const reader = document.getElementById("reader");

  if (!isScanning) {
    reader.style.display = "block";
    scannerInstance = new Html5Qrcode("reader");

    scannerInstance.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: 250
      },
      qrCodeMessage => {
        document.getElementById("urlInput").value = qrCodeMessage;
        checkURL();
        scannerInstance.stop();
        reader.style.display = "none";
        isScanning = false;
      },
      error => {}
    ).catch(err => {
      console.error("Error:", err);
    });

    isScanning = true;
  } else {
    scannerInstance.stop();
    reader.style.display = "none";
    isScanning = false;
  }
}

// Scan QR from image file
function scanFromFile(input) {
  if (input.files.length === 0) return;

  const file = input.files[0];
  const reader = new Html5Qrcode("reader");

  reader.scanFile(file, true)
    .then(qrCodeMessage => {
      document.getElementById("urlInput").value = qrCodeMessage;
      checkURL();
    })
    .catch(err => {
      alert("❌ QR Code not found in image.");
      console.error(err);
    });
}
