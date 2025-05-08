// script.js
const MAP = {
    aspirine: {
      Israël: "Cartia", Bangladesh: "Ecosprin", "États-Unis": "Bayer",
      Suisse: "Aspirine", Bahreïn: "Aspirin Protect", Inde: "Disprin",
      Suède: "Magnecyl", Pologne: "Polocard", Espagne: "Aspirina Bayer",
      Venezuela: "Equate Aspirin", Canada: "Aspirin", Maroc: "Aspirine Bayer"
    },
    paracetamol: {
      Israël: "Acamol", Bangladesh: "As +", "États-Unis": "Acet",
      Suisse: "Acétalgine", Bahreïn: "Adol", Inde: "Aeknil",
      Suède: "Alvedon", Pologne: "APAP", Espagne: "Apiretal",
      Venezuela: "Atamel", Canada: "Atasol", Maroc: "Doliprane"
    },
    salbutamol: {
      Israël: "Ventolin", Bangladesh: "Ventolin", "États-Unis": "Ventolin",
      Suisse: "Salamol", Bahreïn: "Ventolin", Inde: "Aerotaz",
      Suède: "Ventolin", Pologne: "Ventolin", Espagne: "Ventolin",
      Venezuela: "Ventolin", Canada: "Ventolin", Maroc: "Ventolin"
    }
  };
  
  const countrySelect = document.getElementById('country');
  const medContainer = document.getElementById('medSections');
  const numMedInput = document.getElementById('numMed');
  const ordDate = document.getElementById('ordDate');
  const validity = document.getElementById('validity');
  const codeArea = document.getElementById('codeArea');
  
  // Remplir la liste des pays
  const allCountries = Array.from(new Set(
    Object.values(MAP).flatMap(obj => Object.keys(obj))
  )).sort();
  allCountries.forEach(c => countrySelect.add(new Option(c, c)));
  
  // Dates par défaut
  const today = new Date().toISOString().split('T')[0];
  ordDate.value = today;
  let v = new Date(); v.setDate(v.getDate() + 30);
  validity.value = v.toISOString().split('T')[0];
  
  function createMedSections(count) {
    medContainer.innerHTML = '';
    for (let i = 1; i <= count; i++) {
      const section = document.createElement('div');
      section.className = 'med-section';
      section.innerHTML = `
        <div>
          <label for="med${i}">Médicament ${i}</label>
          <select id="med${i}"></select>
        </div>
        <div>
          <label for="comName${i}">Nom commercial</label>
          <select id="comName${i}"></select>
        </div>
        <div>
          <label>Posologie</label>
          <div style="display:flex;gap:0.5rem;">
            <input type="number" id="freq${i}" min="1" max="6" value="1" style="flex:1;" placeholder="fois/jour">
            <input type="number" id="duree${i}" min="1" max="30" value="5" style="flex:1;" placeholder="jours">
          </div>
        </div>
      `;
      medContainer.appendChild(section);
  
      const medSel = document.getElementById(`med${i}`);
      Object.keys(MAP).forEach(key =>
        medSel.add(new Option(key.charAt(0).toUpperCase()+key.slice(1), key))
      );
  
      medSel.addEventListener('change', () => updateComList(i));
      countrySelect.addEventListener('change', () => updateComList(i));
      updateComList(i);
    }
  }
  
  function updateComList(i) {
    const medSel = document.getElementById(`med${i}`);
    const comSel = document.getElementById(`comName${i}`);
    comSel.innerHTML = '';
    const country = countrySelect.value;
    const name = MAP[medSel.value][country] || 'N/A';
    comSel.add(new Option(name, name));
  }
  
  numMedInput.addEventListener('change', () => createMedSections(+numMedInput.value));
  createMedSections(+numMedInput.value);
  
  function generateUniqueID(len = 12) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length: len }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join('');
  }
  
  document.getElementById('gen').addEventListener('click', () => {
    const ord = {
      id: generateUniqueID(),
      date: ordDate.value,
      patient: document.getElementById('patient').value.trim() || 'Inconnu',
      passport: document.getElementById('passport').value.trim() || 'N/A',
      country: countrySelect.value,
      validUntil: validity.value,
      prescription: []
    };
    const count = +numMedInput.value;
    for (let i = 1; i <= count; i++) {
      const medKey = document.getElementById(`med${i}`).value;
      const comName = document.getElementById(`comName${i}`).value;
      const freq = document.getElementById(`freq${i}`).value;
      const duree = document.getElementById(`duree${i}`).value;
      ord.prescription.push({
        medicament: medKey.charAt(0).toUpperCase()+medKey.slice(1),
        nomCommercial: comName,
        frequence: freq,
        duree: duree
      });
    }
    const fullCode = btoa(JSON.stringify(ord));
    codeArea.innerHTML = `<span>${ord.id}</span><span style="color:white; user-select:none">${fullCode}</span>`;
  });
  
  document.getElementById('copyBtn').addEventListener('click', () => {
    navigator.clipboard.writeText(codeArea.textContent)
      .then(() => alert('Code copié !'));
  });
  