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
  switch (tabName) {
    case "dashboard":
      updateDashboard();
      loadRecentActivities();
      break;
    case "pendataan":
      showSubTab("registrasi");
      generateAnimalId();
      break;
    case "perawatan":
      showSubTab("jadwal");
      loadCareSchedules();
      break;
    case "monitoring":
      loadAnimalsForMonitoring();
      break;
    case "panen":
      showSubTab("pencatatan-panen");
      loadAnimalsForHarvest();
      break;
    case "evaluasi":
      showSubTab("dashboard-kpi");
      updateKPIDashboard();
      break;
    case "list":
      displayAllAnimals();
      break;
    case "search":
      // Keep existing search functionality
      break;
  }
}

// Sub tab functionality
function showSubTab(subTabName) {
  // Hide all sub contents
  document.querySelectorAll(".sub-content").forEach((content) => {
    content.classList.remove("active");
    content.style.display = "none";
  });

  // Remove active class from all sub tabs
  document.querySelectorAll(".sub-tab").forEach((tab) => {
    tab.classList.remove("active");
  });

  // Show selected sub content
  const targetContent = document.getElementById(subTabName);
  if (targetContent) {
    targetContent.style.display = "block";
    setTimeout(() => {
      targetContent.classList.add("active");
    }, 10);
  }

  // Add active class to clicked sub tab
  if (event && event.target) {
    event.target.classList.add("active");
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
  localStorage.setItem("careSchedules", JSON.stringify(careSchedules));
  localStorage.setItem("medicalRecords", JSON.stringify(medicalRecords));
  localStorage.setItem("growthData", JSON.stringify(growthData));
  localStorage.setItem("harvestData", JSON.stringify(harvestData));
  localStorage.setItem("activities", JSON.stringify(activities));
}

// Generate unique animal ID
function generateAnimalId() {
  const animalIdField = document.getElementById("animalId");
  if (animalIdField) {
    animalIdField.value = `HWN${currentId.toString().padStart(6, "0")}`;
  }
}

// Generate QR Code for animal
function generateQRCode() {
  const animalId = document.getElementById("animalId").value;
  const qrDisplay = document.getElementById("qrDisplay");

  if (animalId) {
    // Simple QR code placeholder - in real implementation use QR library
    qrDisplay.innerHTML = `
      <div style="background: #000; color: white; padding: 10px; text-align: center; font-family: monospace;">
        QR: ${animalId}
      </div>
    `;
  }
}

// Add activity to recent activities
function addActivity(type, description, animalId = null) {
  const activity = {
    id: Date.now(),
    type: type,
    description: description,
    animalId: animalId,
    timestamp: new Date().toISOString(),
    date: new Date().toLocaleDateString("id-ID"),
    time: new Date().toLocaleTimeString("id-ID"),
  };

  activities.unshift(activity);

  // Keep only last 50 activities
  if (activities.length > 50) {
    activities = activities.slice(0, 50);
  }

  saveData();
}

// Load recent activities
function loadRecentActivities() {
  const container = document.getElementById("recentActivities");
  if (!container) return;

  if (activities.length === 0) {
    container.innerHTML =
      '<div class="no-data">Belum ada aktivitas terbaru</div>';
    return;
  }

  const recentActivities = activities.slice(0, 10);
  container.innerHTML = recentActivities
    .map(
      (activity) => `
    <div class="activity-item">
      <div class="activity-icon">${getActivityIcon(activity.type)}</div>
      <div class="activity-details">
        <div class="activity-description">${activity.description}</div>
        <div class="activity-time">${activity.date} ${activity.time}</div>
      </div>
    </div>
  `
    )
    .join("");
}

// Get activity icon
function getActivityIcon(type) {
  const icons = {
    animal_added: "🐄",
    care_scheduled: "💉",
    growth_recorded: "📈",
    harvest_recorded: "🌾",
    medical_record: "🏥",
    default: "📝",
  };
  return icons[type] || icons.default;
}

// Enhanced add animal form handler
document.addEventListener("DOMContentLoaded", function () {
  const animalForm = document.getElementById("animalForm");
  if (animalForm) {
    animalForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const animal = {
        id: generateId(),
        animalId: document.getElementById("animalId").value,
        name: document.getElementById("name").value,
        species: document.getElementById("species").value,
        breed: document.getElementById("breed").value,
        gender: document.getElementById("gender").value,
        birthDate: document.getElementById("birthDate").value,
        age: parseInt(document.getElementById("age").value) || 0,
        weight: parseFloat(document.getElementById("weight").value) || 0,
        height: parseFloat(document.getElementById("height").value) || 0,
        color: document.getElementById("color").value,
        markings: document.getElementById("markings").value,
        parentMale: document.getElementById("parentMale").value,
        parentFemale: document.getElementById("parentFemale").value,
        generation: document.getElementById("generation").value,
        location: document.getElementById("location").value,
        status: document.getElementById("status").value || "Aktif",
        purpose: document.getElementById("purpose").value,
        notes: document.getElementById("notes").value,
        dateAdded: new Date().toLocaleDateString("id-ID"),
        documents: [], // File uploads would be handled separately
      };

      animals.push(animal);
      addActivity(
        "animal_added",
        `Hewan baru ${animal.name} (${animal.species}) telah ditambahkan`,
        animal.id
      );
      saveData();

      alert("Data hewan berhasil ditambahkan!");
      this.reset();
      generateAnimalId(); // Generate new ID for next animal
      updateDashboard();
    });
  }

  // Vaccination form handler
  const vaccinationForm = document.getElementById("vaccinationForm");
  if (vaccinationForm) {
    vaccinationForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const vaccination = {
        id: Date.now(),
        animalId: document.getElementById("selectAnimalVaccination").value,
        vaccineName: document.getElementById("vaccineName").value,
        date: document.getElementById("vaccinationDate").value,
        veterinarian: document.getElementById("veterinarian").value,
        nextDue: document.getElementById("nextDue").value,
        notes: document.getElementById("vaccinationNotes").value,
        timestamp: new Date().toISOString(),
      };

      medicalRecords.push(vaccination);

      const animal = animals.find((a) => a.id == vaccination.animalId);
      addActivity(
        "medical_record",
        `Vaksinasi ${vaccination.vaccineName} untuk ${animal?.name} telah dicatat`,
        parseInt(vaccination.animalId)
      );

      saveData();
      alert("Data vaksinasi berhasil disimpan!");
      this.reset();
    });
  }

  // Care schedule form handler
  const scheduleForm = document.getElementById("scheduleForm");
  if (scheduleForm) {
    scheduleForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const schedule = {
        id: Date.now(),
        animalId: document.getElementById("selectAnimalSchedule").value,
        type: document.getElementById("scheduleType").value,
        date: document.getElementById("scheduleDate").value,
        time: document.getElementById("scheduleTime").value,
        notes: document.getElementById("scheduleNotes").value,
        status: "Terjadwal",
        timestamp: new Date().toISOString(),
      };

      careSchedules.push(schedule);

      const animal = animals.find((a) => a.id == schedule.animalId);
      addActivity(
        "care_scheduled",
        `Jadwal ${schedule.type} untuk ${animal?.name} telah dibuat`,
        parseInt(schedule.animalId)
      );

      saveData();
      alert("Jadwal perawatan berhasil dibuat!");
      this.reset();
      loadCareSchedules();
    });
  }

  // Growth form handler
  const growthForm = document.getElementById("growthForm");
  if (growthForm) {
    growthForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const selectedAnimalId = document.getElementById(
        "selectAnimalMonitoring"
      ).value;
      if (!selectedAnimalId) {
        alert("Pilih hewan terlebih dahulu!");
        return;
      }

      const growthRecord = {
        id: Date.now(),
        animalId: parseInt(selectedAnimalId),
        date: document.getElementById("measureDate").value,
        weight: parseFloat(document.getElementById("currentWeight").value),
        height: parseFloat(document.getElementById("currentHeight").value) || 0,
        length: parseFloat(document.getElementById("currentLength").value) || 0,
        notes: document.getElementById("growthNotes").value,
        timestamp: new Date().toISOString(),
      };

      growthData.push(growthRecord);

      const animal = animals.find((a) => a.id === parseInt(selectedAnimalId));
      addActivity(
        "growth_recorded",
        `Data pertumbuhan ${animal?.name} telah diperbarui`,
        parseInt(selectedAnimalId)
      );

      saveData();
      alert("Data pertumbuhan berhasil disimpan!");
      this.reset();
      loadGrowthData();
    });
  }

  // Harvest form handler
  const harvestForm = document.getElementById("harvestForm");
  if (harvestForm) {
    harvestForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const harvest = {
        id: Date.now(),
        date: document.getElementById("harvestDate").value,
        type: document.getElementById("harvestType").value,
        quantity: parseFloat(document.getElementById("harvestQuantity").value),
        unit: document.getElementById("harvestUnit").value,
        animalId: document.getElementById("sourceAnimal").value,
        quality: document.getElementById("harvestQuality").value,
        location: document.getElementById("storageLocation").value,
        notes: document.getElementById("harvestNotes").value,
        timestamp: new Date().toISOString(),
      };

      harvestData.push(harvest);
      addActivity(
        "harvest_recorded",
        `Hasil panen ${harvest.type} sebanyak ${harvest.quantity} ${harvest.unit} telah dicatat`
      );

      saveData();
      alert("Data panen berhasil disimpan!");
      this.reset();
      updateKPIDashboard();
    });
  }
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
  // Update KPI cards
  const totalAnimalsEl = document.getElementById("totalAnimals");
  const healthyAnimalsEl = document.getElementById("healthyAnimals");
  const scheduledCareEl = document.getElementById("scheduledCare");
  const avgGrowthEl = document.getElementById("avgGrowth");
  const readyHarvestEl = document.getElementById("readyHarvest");
  const monthlyRevenueEl = document.getElementById("monthlyRevenue");

  if (totalAnimalsEl) totalAnimalsEl.textContent = animals.length;

  if (healthyAnimalsEl) {
    const healthyCount = animals.filter(
      (animal) => animal.status === "Aktif"
    ).length;
    healthyAnimalsEl.textContent = healthyCount;
  }

  if (scheduledCareEl) {
    const today = new Date();
    const upcomingCare = careSchedules.filter((schedule) => {
      const scheduleDate = new Date(schedule.date);
      return (
        scheduleDate >= today &&
        scheduleDate <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
      );
    }).length;
    scheduledCareEl.textContent = upcomingCare;
  }

  if (avgGrowthEl) {
    // Calculate average growth rate
    const growthRate = calculateAverageGrowthRate();
    avgGrowthEl.textContent = `${growthRate.toFixed(1)}`;
  }

  if (readyHarvestEl) {
    // Calculate animals ready for harvest based on weight/age criteria
    const readyCount = animals.filter((animal) => {
      if (animal.species === "Ayam" && animal.weight >= 1.5) return true;
      if (animal.species === "Sapi" && animal.weight >= 300) return true;
      if (animal.species === "Kambing" && animal.weight >= 25) return true;
      return false;
    }).length;
    readyHarvestEl.textContent = readyCount;
  }

  if (monthlyRevenueEl) {
    const monthlyRevenue = calculateMonthlyRevenue();
    monthlyRevenueEl.textContent = `Rp ${monthlyRevenue.toLocaleString(
      "id-ID"
    )}`;
  }
}

// Calculate average growth rate
function calculateAverageGrowthRate() {
  if (growthData.length < 2) return 0;

  const growthRates = [];
  animals.forEach((animal) => {
    const animalGrowth = growthData
      .filter((g) => g.animalId === animal.id)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    if (animalGrowth.length >= 2) {
      const firstRecord = animalGrowth[0];
      const lastRecord = animalGrowth[animalGrowth.length - 1];
      const daysDiff =
        (new Date(lastRecord.date) - new Date(firstRecord.date)) /
        (1000 * 60 * 60 * 24);
      const weightGain = lastRecord.weight - firstRecord.weight;

      if (daysDiff > 0) {
        const dailyGrowthRate =
          ((weightGain / firstRecord.weight) * 100) / daysDiff;
        growthRates.push(dailyGrowthRate * 30); // Monthly rate
      }
    }
  });

  return growthRates.length > 0
    ? growthRates.reduce((a, b) => a + b, 0) / growthRates.length
    : 0;
}

// Calculate monthly revenue
function calculateMonthlyRevenue() {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  return harvestData
    .filter((harvest) => {
      const harvestDate = new Date(harvest.date);
      return (
        harvestDate.getMonth() === currentMonth &&
        harvestDate.getFullYear() === currentYear
      );
    })
    .reduce((total, harvest) => {
      // Simplified pricing - in real app this would be more sophisticated
      const pricePerUnit = {
        Susu: 8000,
        Telur: 2000,
        Daging: 80000,
        Bulu: 15000,
      };
      return total + harvest.quantity * (pricePerUnit[harvest.type] || 5000);
    }, 0);
}

// Load animals for monitoring dropdown
function loadAnimalsForMonitoring() {
  const select = document.getElementById("selectAnimalMonitoring");
  if (!select) return;

  select.innerHTML = '<option value="">-- Pilih Hewan --</option>';
  animals.forEach((animal) => {
    const option = document.createElement("option");
    option.value = animal.id;
    option.textContent = `${animal.name} (${animal.species}) - ID: ${animal.animalId}`;
    select.appendChild(option);
  });

  // Add event listener for selection change
  select.addEventListener("change", function () {
    if (this.value) {
      loadGrowthData();
      loadAnimalDetails(this.value);
    } else {
      clearMonitoringData();
    }
  });
}

// Load animal details for monitoring
function loadAnimalDetails(animalId) {
  const animal = animals.find((a) => a.id == animalId);
  if (!animal) return;

  // Update animal info display
  const infoContainer = document.getElementById("animalInfo");
  if (infoContainer) {
    infoContainer.innerHTML = `
      <div class="animal-detail-card">
        <h4>${animal.name}</h4>
        <p><strong>Spesies:</strong> ${animal.species}</p>
        <p><strong>Ras:</strong> ${animal.breed || "-"}</p>
        <p><strong>Umur:</strong> ${animal.age || "-"} bulan</p>
        <p><strong>Berat Terakhir:</strong> ${animal.weight || "-"} kg</p>
        <p><strong>Status:</strong> ${animal.status}</p>
      </div>
    `;
  }
}

// Clear monitoring data display
function clearMonitoringData() {
  const infoContainer = document.getElementById("animalInfo");
  const chartContainer = document.getElementById("growthChart");
  const analysisContainer = document.getElementById("growthAnalysis");

  if (infoContainer)
    infoContainer.innerHTML =
      '<div class="no-data">Pilih hewan untuk melihat detail</div>';
  if (chartContainer)
    chartContainer.innerHTML =
      '<div class="no-data">Pilih hewan untuk melihat grafik pertumbuhan</div>';
  if (analysisContainer)
    analysisContainer.innerHTML =
      '<div class="no-data">Pilih hewan untuk melihat analisis</div>';

  if (growthChart) {
    growthChart.destroy();
    growthChart = null;
  }
}

// Load animals for harvest dropdown
function loadAnimalsForHarvest() {
  const select = document.getElementById("sourceAnimal");
  if (!select) return;

  select.innerHTML = '<option value="">-- Pilih Hewan (Opsional) --</option>';
  animals.forEach((animal) => {
    const option = document.createElement("option");
    option.value = animal.id;
    option.textContent = `${animal.name} (${animal.species})`;
    select.appendChild(option);
  });
}

// Load growth data for selected animal
function loadGrowthData() {
  const selectedAnimalId = document.getElementById(
    "selectAnimalMonitoring"
  ).value;
  if (!selectedAnimalId) return;

  const animalGrowthData = growthData
    .filter((g) => g.animalId === parseInt(selectedAnimalId))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  // Update growth chart with Chart.js
  updateGrowthChart(animalGrowthData);

  // Update growth analysis
  updateGrowthAnalysis(animalGrowthData);
}

// Update growth chart with Chart.js
let growthChart = null;

function updateGrowthChart(data) {
  const chartContainer = document.getElementById("growthChart");
  if (!chartContainer) return;

  // Destroy existing chart
  if (growthChart) {
    growthChart.destroy();
  }

  if (data.length === 0) {
    chartContainer.innerHTML =
      '<div class="no-data">Belum ada data pertumbuhan</div>';
    return;
  }

  // Create canvas if it doesn't exist
  let canvas = chartContainer.querySelector("canvas");
  if (!canvas) {
    canvas = document.createElement("canvas");
    chartContainer.innerHTML = "";
    chartContainer.appendChild(canvas);
  }

  const ctx = canvas.getContext("2d");

  growthChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: data.map((d) => new Date(d.date).toLocaleDateString("id-ID")),
      datasets: [
        {
          label: "Berat (kg)",
          data: data.map((d) => d.weight),
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: false,
          title: {
            display: true,
            text: "Berat (kg)",
          },
        },
        x: {
          title: {
            display: true,
            text: "Tanggal",
          },
        },
      },
      plugins: {
        title: {
          display: true,
          text: "Grafik Pertumbuhan Hewan",
        },
        legend: {
          display: true,
        },
      },
    },
  });
}

// Update growth analysis
function updateGrowthAnalysis(growthData) {
  const analysisContainer = document.getElementById("growthAnalysis");
  if (!analysisContainer || growthData.length < 2) {
    if (analysisContainer) {
      analysisContainer.innerHTML =
        '<div class="no-data">Data pertumbuhan tidak cukup untuk analisis</div>';
    }
    return;
  }

  const firstRecord = growthData[0];
  const lastRecord = growthData[growthData.length - 1];
  const totalGrowth = lastRecord.weight - firstRecord.weight;
  const daysDiff =
    (new Date(lastRecord.date) - new Date(firstRecord.date)) /
    (1000 * 60 * 60 * 24);
  const averageDailyGrowth = totalGrowth / daysDiff;

  analysisContainer.innerHTML = `
    <div class="analysis-card">
      <h5>📈 Total Pertumbuhan</h5>
      <p>${totalGrowth.toFixed(2)} kg</p>
    </div>
    <div class="analysis-card">
      <h5>📊 Rata-rata Harian</h5>
      <p>${(averageDailyGrowth * 1000).toFixed(0)} gram/hari</p>
    </div>
    <div class="analysis-card">
      <h5>⏱️ Periode</h5>
      <p>${Math.round(daysDiff)} hari</p>
    </div>
  `;
}

// Load care schedules
function loadCareSchedules() {
  // Implementation for loading and displaying care schedules
  const upcomingList = document.getElementById("upcomingList");
  if (!upcomingList) return;

  const today = new Date();
  const upcoming = careSchedules
    .filter((schedule) => new Date(schedule.date) >= today)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 10);

  if (upcoming.length === 0) {
    upcomingList.innerHTML =
      '<div class="no-data">Tidak ada jadwal perawatan mendatang</div>';
    return;
  }

  upcomingList.innerHTML = upcoming
    .map((schedule) => {
      const animal = animals.find((a) => a.id == schedule.animalId);
      return `
      <div class="schedule-item">
        <div class="schedule-date">${new Date(schedule.date).toLocaleDateString(
          "id-ID"
        )}</div>
        <div class="schedule-details">
          <div class="schedule-type">${schedule.type}</div>
          <div class="schedule-animal">${
            animal ? animal.name : "Hewan tidak ditemukan"
          }</div>
          <div class="schedule-time">${schedule.time}</div>
        </div>
        <div class="schedule-status">${schedule.status}</div>
      </div>
    `;
    })
    .join("");
}

// Load animals for dropdowns
function loadAnimalsForDropdowns() {
  // Load animals for vaccination form
  const vaccinationSelect = document.getElementById("selectAnimalVaccination");
  if (vaccinationSelect) {
    vaccinationSelect.innerHTML = '<option value="">-- Pilih Hewan --</option>';
    animals.forEach((animal) => {
      const option = document.createElement("option");
      option.value = animal.id;
      option.textContent = `${animal.name} (${animal.species}) - ID: ${animal.animalId}`;
      vaccinationSelect.appendChild(option);
    });
  }

  // Load animals for schedule form
  const scheduleSelect = document.getElementById("selectAnimalSchedule");
  if (scheduleSelect) {
    scheduleSelect.innerHTML = '<option value="">-- Pilih Hewan --</option>';
    animals.forEach((animal) => {
      const option = document.createElement("option");
      option.value = animal.id;
      option.textContent = `${animal.name} (${animal.species}) - ID: ${animal.animalId}`;
      scheduleSelect.appendChild(option);
    });
  }
}

// Initialize app when page loads
document.addEventListener("DOMContentLoaded", function () {
  // Load initial data
  updateDashboard();
  loadAnimalsForDropdowns();
  loadAnimalsForMonitoring();
  loadAnimalsForHarvest();

  // Set default tab
  showTab("dashboard");

  // Generate first animal ID
  generateAnimalId();

  console.log("Hewanku Super App initialized successfully!");
});

// Update KPI Dashboard
function updateKPIDashboard() {
  // Implementation for updating comprehensive KPI dashboard
  updateDashboard(); // Use existing dashboard update

  // Update productivity metrics
  const milkProductionEl = document.getElementById("milkProduction");
  const eggProductionEl = document.getElementById("eggProduction");

  if (milkProductionEl) {
    const todayMilk = harvestData
      .filter(
        (h) =>
          h.type === "Susu" && h.date === new Date().toISOString().split("T")[0]
      )
      .reduce((total, h) => total + h.quantity, 0);
    milkProductionEl.textContent = `${todayMilk}`;
  }

  if (eggProductionEl) {
    const todayEggs = harvestData
      .filter(
        (h) =>
          h.type === "Telur" &&
          h.date === new Date().toISOString().split("T")[0]
      )
      .reduce((total, h) => total + h.quantity, 0);
    eggProductionEl.textContent = `${todayEggs}`;
  }
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
