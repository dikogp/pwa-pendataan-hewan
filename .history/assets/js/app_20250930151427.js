// Data storage
let animals = JSON.parse(localStorage.getItem("animals") || "[]");
let currentId = parseInt(localStorage.getItem("currentId") || "1");
let careSchedules = JSON.parse(localStorage.getItem("careSchedules") || "[]");
let medicalRecords = JSON.parse(localStorage.getItem("medicalRecords") || "[]");
let growthData = JSON.parse(localStorage.getItem("growthData") || "[]");
let harvestData = JSON.parse(localStorage.getItem("harvestData") || "[]");
let activities = JSON.parse(localStorage.getItem("activities") || "[]");

// Tab functionality
function showTab(tabName) {
  // Hide all tabs
  document.querySelectorAll(".tab-content").forEach((tab) => {
    tab.classList.remove("active");
  });
  document.querySelectorAll(".nav-tab").forEach((tab) => {
    tab.classList.remove("active");
  });

  // Show selected tab
  document.getElementById(tabName).classList.add("active");
  event.target.classList.add("active");

  // Load data for specific tabs
  if (tabName === "list") {
    displayAllAnimals();
  } else if (tabName === "dashboard") {
    updateDashboard();
  }
}

// Generate unique ID
function generateId() {
  return currentId++;
}

// Save data to localStorage
function saveData() {
  localStorage.setItem("animals", JSON.stringify(animals));
  localStorage.setItem("currentId", currentId.toString());
}

// Add animal form handler
document.getElementById("animalForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const animal = {
    id: generateId(),
    name: document.getElementById("name").value,
    species: document.getElementById("species").value,
    breed: document.getElementById("breed").value,
    gender: document.getElementById("gender").value,
    age: parseInt(document.getElementById("age").value) || 0,
    weight: parseFloat(document.getElementById("weight").value) || 0,
    color: document.getElementById("color").value,
    health: document.getElementById("health").value,
    location: document.getElementById("location").value,
    notes: document.getElementById("notes").value,
    dateAdded: new Date().toLocaleDateString("id-ID"),
  };

  animals.push(animal);
  saveData();

  alert("Data hewan berhasil ditambahkan!");
  this.reset();
  updateDashboard();
});

// Generate barcode
function generateBarcode(animalId) {
  const canvas = document.createElement("canvas");
  JsBarcode(canvas, animalId.toString().padStart(8, "0"), {
    format: "CODE128",
    width: 2,
    height: 100,
    displayValue: true,
  });
  return canvas;
}

// Display animal card
function displayAnimalCard(animal) {
  return `
            <div class="animal-card">
                <div class="animal-header">
                    <div>
                        <div class="animal-name">${animal.name}</div>
                        <div class="animal-species">${animal.species}</div>
                    </div>
                </div>
                
                <div class="animal-info">
                    <div class="info-item">
                        <div class="info-label">ID</div>
                        <div class="info-value">${animal.id
                          .toString()
                          .padStart(6, "0")}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Ras/Breed</div>
                        <div class="info-value">${animal.breed || "-"}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Jenis Kelamin</div>
                        <div class="info-value">${animal.gender}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Umur</div>
                        <div class="info-value">${animal.age || 0} bulan</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Berat</div>
                        <div class="info-value">${animal.weight || 0} kg</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Warna</div>
                        <div class="info-value">${animal.color || "-"}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Status Kesehatan</div>
                        <div class="info-value">${animal.health || "-"}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Lokasi</div>
                        <div class="info-value">${animal.location || "-"}</div>
                    </div>
                </div>
                
                ${
                  animal.notes
                    ? `<div class="info-item"><div class="info-label">Catatan</div><div class="info-value">${animal.notes}</div></div>`
                    : ""
                }
                
                <div class="barcode-container">
                    <h4>Barcode</h4>
                    <div id="barcode-${animal.id}"></div>
                    <button class="btn" onclick="downloadBarcode(${
                      animal.id
                    }, '${animal.name}')">Download Barcode</button>
                    <button class="btn btn-secondary" onclick="deleteAnimal(${
                      animal.id
                    })">Hapus</button>
                </div>
            </div>
        `;
}

// Display all animals
function displayAllAnimals() {
  const container = document.getElementById("animalList");

  if (animals.length === 0) {
    container.innerHTML =
      '<div class="no-data">Belum ada data hewan yang ditambahkan.</div>';
    return;
  }

  container.innerHTML = animals
    .map((animal) => displayAnimalCard(animal))
    .join("");

  // Generate barcodes after DOM is updated
  animals.forEach((animal) => {
    const barcodeContainer = document.getElementById(`barcode-${animal.id}`);
    if (barcodeContainer) {
      barcodeContainer.appendChild(generateBarcode(animal.id));
    }
  });
}

// Search functionality
document.getElementById("searchInput").addEventListener("input", function () {
  const query = this.value.toLowerCase();
  searchAnimals(query);
});

// Enhanced search function
function searchAnimals(query) {
  const results = animals.filter(
    (animal) =>
      animal.name.toLowerCase().includes(query) ||
      animal.species.toLowerCase().includes(query) ||
      animal.id.toString().includes(query) ||
      (animal.breed && animal.breed.toLowerCase().includes(query)) ||
      (animal.location && animal.location.toLowerCase().includes(query)) ||
      (animal.color && animal.color.toLowerCase().includes(query))
  );

  displaySearchResults(results, query);
}

// Display search results
function displaySearchResults(results, query = "") {
  const container = document.getElementById("searchResults");

  if (query === "") {
    container.innerHTML =
      '<div class="no-data">Masukkan kata kunci pencarian.</div>';
    return;
  }

  if (results.length === 0) {
    container.innerHTML =
      '<div class="no-data">Tidak ada hasil yang ditemukan.</div>';
    return;
  }

  container.innerHTML = `
            <div style="margin-bottom: 20px; padding: 15px; background: rgba(102, 126, 234, 0.1); border-radius: 10px; color: #333;">
                <strong>Ditemukan ${results.length} hasil</strong>
            </div>
            ${results.map((animal) => displayAnimalCard(animal)).join("")}
        `;

  // Generate barcodes for search results
  results.forEach((animal) => {
    const barcodeContainer = document.getElementById(`barcode-${animal.id}`);
    if (barcodeContainer) {
      barcodeContainer.appendChild(generateBarcode(animal.id));
    }
  });
}

// Switch search method
function switchSearchMethod(method) {
  // Update active button
  document.querySelectorAll(".search-method-btn").forEach((btn) => {
    btn.classList.remove("active");
  });
  event.target.classList.add("active");

  // Hide all search containers
  document.querySelectorAll(".search-container").forEach((container) => {
    container.style.display = "none";
  });

  // Show selected search container
  document.getElementById(method + "Search").style.display = "block";

  // Clear previous results
  document.getElementById("searchResults").innerHTML =
    '<div class="no-data">Pilih metode pencarian dan masukkan kata kunci.</div>';
}

// Search by ID
function searchById() {
  const idInput = document.getElementById("idInput");
  const searchId = parseInt(idInput.value);

  if (!searchId) {
    alert("Masukkan ID yang valid!");
    return;
  }

  const result = animals.find((animal) => animal.id === searchId);

  if (result) {
    displaySearchResults([result], searchId.toString());
  } else {
    document.getElementById(
      "searchResults"
    ).innerHTML = `<div class="no-data">Hewan dengan ID ${searchId} tidak ditemukan.</div>`;
  }
}

// Barcode scanner variables
let video = null;
let canvas = null;
let context = null;
let scanning = false;

// Start barcode scanner
async function startBarcodeScanner() {
  const scannerContainer = document.getElementById("scannerContainer");
  const scanResult = document.getElementById("scanResult");

  video = document.getElementById("video");
  canvas = document.getElementById("canvas");
  context = canvas.getContext("2d");

  try {
    // Request camera permission
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: "environment", // Use back camera if available
      },
    });

    video.srcObject = stream;
    video.play();
    scanning = true;

    scannerContainer.style.display = "block";
    scanResult.style.display = "none";

    // Start scanning process
    scanBarcode();
  } catch (error) {
    console.error("Error accessing camera:", error);
    document.getElementById(
      "searchResults"
    ).innerHTML = `<div class="camera-permission">
                    <strong>⚠️ Tidak dapat mengakses kamera</strong><br>
                    Pastikan Anda telah memberikan izin kamera atau gunakan input manual di bawah.
                </div>`;
  }
}

// Stop barcode scanner
function stopBarcodeScanner() {
  scanning = false;

  if (video && video.srcObject) {
    const tracks = video.srcObject.getTracks();
    tracks.forEach((track) => track.stop());
    video.srcObject = null;
  }

  document.getElementById("scannerContainer").style.display = "none";
  document.getElementById("scanResult").style.display = "none";
}

// Scan barcode from video
function scanBarcode() {
  if (!scanning || !video) return;

  // Set canvas size to match video
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // Draw video frame to canvas
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Get image data
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

  // Try to decode barcode (simplified - in real app you'd use a proper barcode library)
  // For demo purposes, we'll use a timeout to simulate scanning

  // Continue scanning
  if (scanning) {
    requestAnimationFrame(scanBarcode);
  }
}

// Search by barcode (manual input)
function searchByBarcode() {
  const barcodeInput = document.getElementById("barcodeInput");
  let barcodeValue = barcodeInput.value.trim();

  if (!barcodeValue) {
    alert("Masukkan kode barcode!");
    return;
  }

  // If barcode is 8 digits, treat as ID with leading zeros
  if (barcodeValue.length === 8 && /^\d+$/.test(barcodeValue)) {
    const searchId = parseInt(barcodeValue);
    const result = animals.find((animal) => animal.id === searchId);

    if (result) {
      displaySearchResults([result], barcodeValue);

      // Show scan result
      const scanResult = document.getElementById("scanResult");
      scanResult.innerHTML = `
                    <div style="color: #28a745;">
                        <strong>✅ Barcode berhasil dipindai!</strong><br>
                        Kode: ${barcodeValue}<br>
                        Ditemukan: ${result.name}
                    </div>
                `;
      scanResult.style.display = "block";
    } else {
      document.getElementById(
        "searchResults"
      ).innerHTML = `<div class="no-data">Hewan dengan barcode ${barcodeValue} tidak ditemukan.</div>`;

      const scanResult = document.getElementById("scanResult");
      scanResult.innerHTML = `
                    <div style="color: #dc3545;">
                        <strong>❌ Barcode tidak ditemukan</strong><br>
                        Kode: ${barcodeValue}
                    </div>
                `;
      scanResult.style.display = "block";
    }
  } else {
    alert("Format barcode tidak valid! Gunakan 8 digit angka.");
  }

  barcodeInput.value = "";
}

// ID Input enter key handler
document.getElementById("idInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    searchById();
  }
});

// Barcode Input enter key handler
document
  .getElementById("barcodeInput")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      searchByBarcode();
    }
  });

// Download barcode
function downloadBarcode(animalId, animalName) {
  const canvas = generateBarcode(animalId);
  const link = document.createElement("a");
  link.download = `barcode-${animalName}-${animalId}.png`;
  link.href = canvas.toDataURL();
  link.click();
}

// Delete animal
function deleteAnimal(animalId) {
  if (confirm("Apakah Anda yakin ingin menghapus data hewan ini?")) {
    animals = animals.filter((animal) => animal.id !== animalId);
    saveData();
    displayAllAnimals();
    updateDashboard();
    alert("Data hewan berhasil dihapus!");
  }
}

// Update dashboard statistics
function updateDashboard() {
  document.getElementById("totalAnimals").textContent = animals.length;

  const species = [...new Set(animals.map((animal) => animal.species))];
  document.getElementById("totalSpecies").textContent = species.length;

  const maleCount = animals.filter(
    (animal) => animal.gender === "Jantan"
  ).length;
  document.getElementById("totalMale").textContent = maleCount;

  const femaleCount = animals.filter(
    (animal) => animal.gender === "Betina"
  ).length;
  document.getElementById("totalFemale").textContent = femaleCount;
}

// Initialize app
document.addEventListener("DOMContentLoaded", function () {
  updateDashboard();

  // Register service worker for PWA
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("./sw.js")
      .then(function (registration) {
        console.log(
          "Service Worker registered successfully:",
          registration.scope
        );
      })
      .catch(function (error) {
        console.log("Service Worker registration failed:", error);
      });
  }
});
