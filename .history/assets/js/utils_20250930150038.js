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
    const lastId = animals.length > 0 ? Math.max(...animals.map(a => a.id)) : 0;
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
    displayNotes: animal.notes || ""
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
          <div class="info-value status-${formattedAnimal.health?.toLowerCase() || 'unknown'}">
            ${formattedAnimal.displayHealth}
          </div>
        </div>
        <div class="info-item">
          <div class="info-label">Lokasi</div>
          <div class="info-value">${formattedAnimal.displayLocation}</div>
        </div>
        ${formattedAnimal.displayNotes ? `
        <div class="info-item full-width">
          <div class="info-label">Catatan</div>
          <div class="info-value">${formattedAnimal.displayNotes}</div>
        </div>
        ` : ''}
        <div class="info-item">
          <div class="info-label">Tanggal Ditambahkan</div>
          <div class="info-value">${formattedAnimal.dateAdded}</div>
        </div>
      </div>
      
      <div class="barcode-container">
        <h4>Barcode</h4>
        <div id="barcode-${animal.id}" class="barcode-display"></div>
        <div class="animal-actions">
          <button class="btn btn-primary" onclick="downloadBarcode(${animal.id}, '${formattedAnimal.name}')">
            📥 Download Barcode
          </button>
          <button class="btn btn-secondary" onclick="deleteAnimal(${animal.id})">
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
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = `data-hewan-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
}

// Import data functionality
function importData() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  
  input.onchange = function(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
      try {
        const importedData = JSON.parse(e.target.result);
        
        if (Array.isArray(importedData)) {
          if (confirm(`Akan mengimpor ${importedData.length} data hewan. Lanjutkan?`)) {
            animals = [...animals, ...importedData];
            
            // Update current ID to avoid conflicts
            const maxId = Math.max(...animals.map(a => a.id), currentId);
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

  const printWindow = window.open('', '_blank');
  const printContent = `
    <html>
      <head>
        <title>Daftar Hewan - ${new Date().toLocaleDateString('id-ID')}</title>
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
          <p>Dicetak pada: ${new Date().toLocaleString('id-ID')}</p>
        </div>
        ${animals.map(animal => `
          <div class="animal-item">
            <div class="animal-name">${animal.name} (${animal.species})</div>
            <div class="animal-details">
              <div class="detail-row"><strong>ID:</strong> ${animal.id.toString().padStart(6, "0")}</div>
              <div class="detail-row"><strong>Ras:</strong> ${animal.breed || "-"}</div>
              <div class="detail-row"><strong>Jenis Kelamin:</strong> ${animal.gender}</div>
              <div class="detail-row"><strong>Umur:</strong> ${animal.age || "-"} bulan</div>
              <div class="detail-row"><strong>Berat:</strong> ${animal.weight || "-"} kg</div>
              <div class="detail-row"><strong>Warna:</strong> ${animal.color || "-"}</div>
              <div class="detail-row"><strong>Kesehatan:</strong> ${animal.health || "-"}</div>
              <div class="detail-row"><strong>Lokasi:</strong> ${animal.location || "-"}</div>
              ${animal.notes ? `<div class="detail-row"><strong>Catatan:</strong> ${animal.notes}</div>` : ''}
              <div class="detail-row"><strong>Ditambahkan:</strong> ${animal.dateAdded}</div>
            </div>
          </div>
        `).join('')}
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
  if (confirm("⚠️ PERINGATAN: Ini akan menghapus SEMUA data hewan. Tindakan ini tidak dapat dibatalkan. Lanjutkan?")) {
    if (confirm("Apakah Anda benar-benar yakin? Semua data akan hilang permanen!")) {
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
    species: [...new Set(animals.map(a => a.species))],
    genders: {
      male: animals.filter(a => a.gender === "Jantan").length,
      female: animals.filter(a => a.gender === "Betina").length
    },
    health: {
      healthy: animals.filter(a => a.health === "Sehat").length,
      sick: animals.filter(a => a.health === "Sakit").length,
      recovering: animals.filter(a => a.health === "Pemulihan").length,
      unknown: animals.filter(a => !a.health || a.health === "").length
    },
    averageAge: animals.filter(a => a.age > 0).reduce((sum, a) => sum + a.age, 0) / animals.filter(a => a.age > 0).length || 0,
    averageWeight: animals.filter(a => a.weight > 0).reduce((sum, a) => sum + a.weight, 0) / animals.filter(a => a.weight > 0).length || 0
  };
  
  return stats;
}