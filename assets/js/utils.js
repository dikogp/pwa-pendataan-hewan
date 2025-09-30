// Utility functions for search functionality

// Clear search input
function clearSearch() {
  const searchInput = document.getElementById("searchInput");
  searchInput.value = "";
  document.getElementById("searchResults").innerHTML =
    '<div class="no-data">Masukkan kata kunci pencarian.</div>';

  // Hide clear button
  document.querySelector(".search-clear").style.display = "none";
}

// Quick search with predefined terms
function quickSearch(term) {
  const searchInput = document.getElementById("searchInput");
  searchInput.value = term;
  searchAnimals(term.toLowerCase());

  // Show clear button
  document.querySelector(".search-clear").style.display = "flex";
}

// Enhanced search method switching
function switchSearchMethod(method) {
  // Update active button
  document.querySelectorAll(".search-method-card").forEach((card) => {
    card.classList.remove("active");
  });
  event.target.classList.add("active");

  // Hide all search containers
  document.querySelectorAll(".search-container").forEach((container) => {
    container.classList.remove("active");
    container.style.display = "none";
  });

  // Show selected search container
  const targetContainer = document.getElementById(method + "Search");
  targetContainer.style.display = "block";
  setTimeout(() => {
    targetContainer.classList.add("active");
  }, 10);

  // Clear previous results
  document.getElementById("searchResults").innerHTML =
    '<div class="no-data">Pilih metode pencarian dan masukkan kata kunci.</div>';

  // Update last ID example for ID search
  if (method === "id") {
    const lastId =
      animals.length > 0 ? Math.max(...animals.map((a) => a.id)) : 0;
    document.getElementById("lastIdExample").textContent = lastId || "-";
  }
}

// Format animal data for display
function formatAnimalData(animal) {
  return {
    ...animal,
    formattedId: animal.id.toString().padStart(6, "0"),
    barcodeId: animal.id.toString().padStart(8, "0"),
    displayAge: animal.age ? `${animal.age} bulan` : "-",
    displayWeight: animal.weight ? `${animal.weight} kg` : "-",
    displayHealth: animal.health || "Tidak ditentukan",
    displayBreed: animal.breed || "-",
    displayColor: animal.color || "-",
    displayLocation: animal.location || "-",
    displayNotes: animal.notes || "",
  };
}

// Enhanced animal card display with better formatting
function createAnimalCardHTML(animal) {
  const formattedAnimal = formatAnimalData(animal);

  return `
    <div class="animal-card" data-animal-id="${animal.id}">
      <div class="animal-header">
        <div>
          <div class="animal-name">${formattedAnimal.name}</div>
          <div class="animal-species">${formattedAnimal.species}</div>
        </div>
        <div class="animal-id-badge">
          ID: ${formattedAnimal.formattedId}
        </div>
      </div>
      
      <div class="animal-info">
        <div class="info-item">
          <div class="info-label">Ras/Breed</div>
          <div class="info-value">${formattedAnimal.displayBreed}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Jenis Kelamin</div>
          <div class="info-value">${formattedAnimal.gender}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Umur</div>
          <div class="info-value">${formattedAnimal.displayAge}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Berat</div>
          <div class="info-value">${formattedAnimal.displayWeight}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Warna</div>
          <div class="info-value">${formattedAnimal.displayColor}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Status Kesehatan</div>
          <div class="info-value status-${
            formattedAnimal.health?.toLowerCase() || "unknown"
          }">
            ${formattedAnimal.displayHealth}
          </div>
        </div>
        <div class="info-item">
          <div class="info-label">Lokasi</div>
          <div class="info-value">${formattedAnimal.displayLocation}</div>
        </div>
        ${
          formattedAnimal.displayNotes
            ? `
        <div class="info-item full-width">
          <div class="info-label">Catatan</div>
          <div class="info-value">${formattedAnimal.displayNotes}</div>
        </div>
        `
            : ""
        }
        <div class="info-item">
          <div class="info-label">Tanggal Ditambahkan</div>
          <div class="info-value">${formattedAnimal.dateAdded}</div>
        </div>
      </div>
      
      <div class="barcode-container">
        <h4>Barcode</h4>
        <div id="barcode-${animal.id}" class="barcode-display"></div>
        <div class="animal-actions">
          <button class="btn btn-primary" onclick="downloadBarcode(${
            animal.id
          }, '${formattedAnimal.name}')">
            📥 Download Barcode
          </button>
          <button class="btn btn-secondary" onclick="deleteAnimal(${
            animal.id
          })">
            🗑️ Hapus Data
          </button>
        </div>
      </div>
    </div>
  `;
}

// Export data functionality
function exportData() {
  if (animals.length === 0) {
    alert("Tidak ada data untuk diekspor!");
    return;
  }

  const dataStr = JSON.stringify(animals, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(dataBlob);
  link.download = `data-hewan-${new Date().toISOString().split("T")[0]}.json`;
  link.click();
}

// Import data functionality
function importData() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json";

  input.onchange = function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const importedData = JSON.parse(e.target.result);

        if (Array.isArray(importedData)) {
          if (
            confirm(
              `Akan mengimpor ${importedData.length} data hewan. Lanjutkan?`
            )
          ) {
            animals = [...animals, ...importedData];

            // Update current ID to avoid conflicts
            const maxId = Math.max(...animals.map((a) => a.id), currentId);
            currentId = maxId + 1;

            saveData();
            updateDashboard();
            alert(`Berhasil mengimpor ${importedData.length} data hewan!`);
          }
        } else {
          alert("Format file tidak valid!");
        }
      } catch (error) {
        alert("Error membaca file: " + error.message);
      }
    };

    reader.readAsText(file);
  };

  input.click();
}

// Print functionality
function printAnimalList() {
  if (animals.length === 0) {
    alert("Tidak ada data untuk dicetak!");
    return;
  }

  const printWindow = window.open("", "_blank");
  const printContent = `
    <html>
      <head>
        <title>Daftar Hewan - ${new Date().toLocaleDateString("id-ID")}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .animal-item { 
            border: 1px solid #ddd; 
            margin-bottom: 20px; 
            padding: 15px; 
            border-radius: 5px; 
          }
          .animal-name { font-size: 18px; font-weight: bold; }
          .animal-details { margin-top: 10px; }
          .detail-row { margin: 5px 0; }
          @media print {
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🐾 Daftar Hewan</h1>
          <p>Total: ${animals.length} hewan</p>
          <p>Dicetak pada: ${new Date().toLocaleString("id-ID")}</p>
        </div>
        ${animals
          .map(
            (animal) => `
          <div class="animal-item">
            <div class="animal-name">${animal.name} (${animal.species})</div>
            <div class="animal-details">
              <div class="detail-row"><strong>ID:</strong> ${animal.id
                .toString()
                .padStart(6, "0")}</div>
              <div class="detail-row"><strong>Ras:</strong> ${
                animal.breed || "-"
              }</div>
              <div class="detail-row"><strong>Jenis Kelamin:</strong> ${
                animal.gender
              }</div>
              <div class="detail-row"><strong>Umur:</strong> ${
                animal.age || "-"
              } bulan</div>
              <div class="detail-row"><strong>Berat:</strong> ${
                animal.weight || "-"
              } kg</div>
              <div class="detail-row"><strong>Warna:</strong> ${
                animal.color || "-"
              }</div>
              <div class="detail-row"><strong>Kesehatan:</strong> ${
                animal.health || "-"
              }</div>
              <div class="detail-row"><strong>Lokasi:</strong> ${
                animal.location || "-"
              }</div>
              ${
                animal.notes
                  ? `<div class="detail-row"><strong>Catatan:</strong> ${animal.notes}</div>`
                  : ""
              }
              <div class="detail-row"><strong>Ditambahkan:</strong> ${
                animal.dateAdded
              }</div>
            </div>
          </div>
        `
          )
          .join("")}
        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() {
              window.close();
            };
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(printContent);
  printWindow.document.close();
}

// Local storage management
function clearAllData() {
  if (
    confirm(
      "⚠️ PERINGATAN: Ini akan menghapus SEMUA data hewan. Tindakan ini tidak dapat dibatalkan. Lanjutkan?"
    )
  ) {
    if (
      confirm("Apakah Anda benar-benar yakin? Semua data akan hilang permanen!")
    ) {
      localStorage.removeItem("animals");
      localStorage.removeItem("currentId");
      animals = [];
      currentId = 1;
      updateDashboard();
      displayAllAnimals();
      alert("Semua data telah dihapus!");
    }
  }
}

// Statistics helpers
function getAnimalStatistics() {
  if (animals.length === 0) return null;

  const stats = {
    total: animals.length,
    species: [...new Set(animals.map((a) => a.species))],
    genders: {
      male: animals.filter((a) => a.gender === "Jantan").length,
      female: animals.filter((a) => a.gender === "Betina").length,
    },
    health: {
      healthy: animals.filter((a) => a.health === "Sehat").length,
      sick: animals.filter((a) => a.health === "Sakit").length,
      recovering: animals.filter((a) => a.health === "Pemulihan").length,
      unknown: animals.filter((a) => !a.health || a.health === "").length,
    },
    status: {
      active: animals.filter((a) => a.status === "Aktif").length,
      sick: animals.filter((a) => a.status === "Sakit").length,
      quarantine: animals.filter((a) => a.status === "Karantina").length,
      sold: animals.filter((a) => a.status === "Dijual").length,
      deceased: animals.filter((a) => a.status === "Mati").length,
    },
    averageAge:
      animals.filter((a) => a.age > 0).reduce((sum, a) => sum + a.age, 0) /
        animals.filter((a) => a.age > 0).length || 0,
    averageWeight:
      animals
        .filter((a) => a.weight > 0)
        .reduce((sum, a) => sum + a.weight, 0) /
        animals.filter((a) => a.weight > 0).length || 0,
  };

  return stats;
}

// Enhanced Export Functions for BRD Requirements
function exportAllData() {
  const exportData = {
    animals: animals,
    careSchedules: careSchedules || [],
    medicalRecords: medicalRecords || [],
    growthData: growthData || [],
    harvestData: harvestData || [],
    activities: activities || [],
    exportDate: new Date().toISOString(),
    version: "2.0",
  };

  const dataStr = JSON.stringify(exportData, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(dataBlob);
  link.download = `hewanku-data-backup-${
    new Date().toISOString().split("T")[0]
  }.json`;
  link.click();
}

// Generate Monthly Report
function generateMonthlyReport() {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthName = new Date().toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });

  const monthlyData = {
    period: monthName,
    animals: {
      total: animals.length,
      newAdditions: animals.filter((a) => {
        const addDate = new Date(a.dateAdded);
        return (
          addDate.getMonth() === currentMonth &&
          addDate.getFullYear() === currentYear
        );
      }).length,
      bySpecies: animals.reduce((acc, animal) => {
        acc[animal.species] = (acc[animal.species] || 0) + 1;
        return acc;
      }, {}),
    },
    production: (harvestData || []).filter((h) => {
      const harvestDate = new Date(h.date);
      return (
        harvestDate.getMonth() === currentMonth &&
        harvestDate.getFullYear() === currentYear
      );
    }),
    health: {
      totalCheckups: (medicalRecords || []).filter((r) => {
        const recordDate = new Date(r.date);
        return (
          recordDate.getMonth() === currentMonth &&
          recordDate.getFullYear() === currentYear
        );
      }).length,
      vaccinationsGiven: (careSchedules || []).filter(
        (s) =>
          s.type === "Vaksinasi" &&
          new Date(s.date).getMonth() === currentMonth &&
          new Date(s.date).getFullYear() === currentYear
      ).length,
    },
  };

  // Generate PDF report (simplified)
  const reportWindow = window.open("", "_blank");
  const reportContent = `
    <html>
      <head>
        <title>Laporan Bulanan - ${monthName}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; }
          .header { text-align: center; margin-bottom: 30px; }
          .section { margin-bottom: 30px; }
          .stats-table { width: 100%; border-collapse: collapse; }
          .stats-table th, .stats-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .stats-table th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📊 Laporan Bulanan Peternakan</h1>
          <h2>${monthName}</h2>
          <p>Dibuat pada: ${new Date().toLocaleDateString("id-ID")}</p>
        </div>
        
        <div class="section">
          <h3>🐄 Ringkasan Hewan</h3>
          <table class="stats-table">
            <tr><th>Metrik</th><th>Nilai</th></tr>
            <tr><td>Total Hewan</td><td>${monthlyData.animals.total}</td></tr>
            <tr><td>Penambahan Bulan Ini</td><td>${
              monthlyData.animals.newAdditions
            }</td></tr>
          </table>
        </div>
        
        <div class="section">
          <h3>🌾 Produksi</h3>
          <p>Total produksi: ${monthlyData.production.length} catatan panen</p>
        </div>
        
        <div class="section">
          <h3>🏥 Kesehatan</h3>
          <table class="stats-table">
            <tr><th>Metrik</th><th>Nilai</th></tr>
            <tr><td>Total Pemeriksaan</td><td>${
              monthlyData.health.totalCheckups
            }</td></tr>
            <tr><td>Vaksinasi Diberikan</td><td>${
              monthlyData.health.vaccinationsGiven
            }</td></tr>
          </table>
        </div>
        
        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `;

  reportWindow.document.write(reportContent);
  reportWindow.document.close();
}

// Generate Annual Report
function generateAnnualReport() {
  const currentYear = new Date().getFullYear();

  const annualData = {
    year: currentYear,
    animals: {
      total: animals.length,
      newAdditions: animals.filter(
        (a) => new Date(a.dateAdded).getFullYear() === currentYear
      ).length,
      bySpecies: animals.reduce((acc, animal) => {
        acc[animal.species] = (acc[animal.species] || 0) + 1;
        return acc;
      }, {}),
    },
    totalProduction: (harvestData || []).filter(
      (h) => new Date(h.date).getFullYear() === currentYear
    ),
    revenue: calculateYearlyRevenue(currentYear),
    growth: calculateYearlyGrowthStats(),
  };

  alert(
    `Laporan tahunan ${currentYear} akan didownload. Total hewan: ${
      annualData.animals.total
    }, Pendapatan: Rp ${annualData.revenue.toLocaleString("id-ID")}`
  );
}

// Calculate yearly revenue
function calculateYearlyRevenue(year) {
  return (harvestData || [])
    .filter((harvest) => new Date(harvest.date).getFullYear() === year)
    .reduce((total, harvest) => {
      const pricePerUnit = {
        Susu: 8000,
        Telur: 2000,
        Daging: 80000,
        Bulu: 15000,
      };
      return total + harvest.quantity * (pricePerUnit[harvest.type] || 5000);
    }, 0);
}

// Generate Health Report
function generateHealthReport() {
  const healthStats = {
    totalAnimals: animals.length,
    healthyAnimals: animals.filter((a) => a.status === "Aktif").length,
    sickAnimals: animals.filter((a) => a.status === "Sakit").length,
    quarantineAnimals: animals.filter((a) => a.status === "Karantina").length,
    recentTreatments: (medicalRecords || []).slice(-10),
    upcomingCare: (careSchedules || [])
      .filter((s) => new Date(s.date) > new Date())
      .slice(0, 10),
  };

  alert(
    `Laporan kesehatan: ${healthStats.healthyAnimals}/${healthStats.totalAnimals} hewan sehat, ${healthStats.sickAnimals} sakit, ${healthStats.quarantineAnimals} karantina`
  );
}

// Generate Financial Report
function generateFinancialReport() {
  const currentYear = new Date().getFullYear();
  const revenue = calculateYearlyRevenue(currentYear);
  const monthlyRevenue = calculateMonthlyRevenue();

  const financialData = {
    yearlyRevenue: revenue,
    monthlyRevenue: monthlyRevenue,
    productionBreakdown: (harvestData || []).reduce((acc, harvest) => {
      acc[harvest.type] = (acc[harvest.type] || 0) + harvest.quantity;
      return acc;
    }, {}),
    averageRevenuePerAnimal: animals.length > 0 ? revenue / animals.length : 0,
  };

  alert(
    `Laporan keuangan: Pendapatan tahunan Rp ${revenue.toLocaleString(
      "id-ID"
    )}, Bulanan Rp ${monthlyRevenue.toLocaleString("id-ID")}`
  );
}

// Calculate monthly revenue
function calculateMonthlyRevenue() {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  return (harvestData || [])
    .filter((harvest) => {
      const harvestDate = new Date(harvest.date);
      return (
        harvestDate.getMonth() === currentMonth &&
        harvestDate.getFullYear() === currentYear
      );
    })
    .reduce((total, harvest) => {
      const pricePerUnit = {
        Susu: 8000,
        Telur: 2000,
        Daging: 80000,
        Bulu: 15000,
      };
      return total + harvest.quantity * (pricePerUnit[harvest.type] || 5000);
    }, 0);
}

// Export to Excel (simplified)
function exportToExcel() {
  const csvContent = generateCSVContent();
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `hewanku-data-${new Date().toISOString().split("T")[0]}.csv`;
  link.click();
}

// Generate CSV content
function generateCSVContent() {
  const headers = [
    "ID",
    "Nama",
    "Spesies",
    "Ras",
    "Jenis Kelamin",
    "Umur",
    "Berat",
    "Status",
    "Lokasi",
    "Tanggal Ditambahkan",
  ];
  const csvRows = [headers.join(",")];

  animals.forEach((animal) => {
    const row = [
      animal.animalId || animal.id,
      animal.name,
      animal.species,
      animal.breed || "",
      animal.gender,
      animal.age || 0,
      animal.weight || 0,
      animal.status || "Aktif",
      animal.location || "",
      animal.dateAdded,
    ];
    csvRows.push(row.join(","));
  });

  return csvRows.join("\n");
}

// Export to PDF
function exportToPDF() {
  alert("Fitur export PDF akan tersedia dalam versi mendatang");
}

// Export to BI Tools
function exportToBI() {
  const biData = {
    animals: animals,
    production: harvestData || [],
    growth: growthData || [],
    health: medicalRecords || [],
    timestamp: new Date().toISOString(),
  };

  const dataStr = JSON.stringify(biData, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(dataBlob);
  link.download = `hewanku-bi-export-${
    new Date().toISOString().split("T")[0]
  }.json`;
  link.click();
}
