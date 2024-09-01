document.getElementById('fileInput').addEventListener('change', handleFileSelect);
document.getElementById('dropdown').addEventListener('change', populateTableFromDropdown);

let columnData = {};
let sheetData = [];

function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.xlsx')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            sheetData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            populateDropdown(sheetData[0]);
            populateTableFromDropdown();
        };
        reader.readAsArrayBuffer(file);
    } else {
        alert('Please upload a valid .xlsx file');
    }
}

function populateDropdown(headers) {
    const dropdown = document.getElementById('dropdown');
    dropdown.innerHTML = '<option value="">Select a column</option>'; // Clear existing options
    headers.forEach((header, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = header;
        dropdown.appendChild(option);
    });
}

function populateTableFromDropdown() {
    const dropdown = document.getElementById('dropdown');
    const columnIndex = dropdown.value;
    if (columnIndex === '') {
        return; // No column selected
    }

    const table = document.getElementById('dataTable');
    table.innerHTML = ''; // Clear existing table

    // Create table header
    const thead = table.createTHead();
    const headerRow = thead.insertRow();
    const th = document.createElement('th');
    th.textContent = sheetData[0][columnIndex];
    headerRow.appendChild(th);

    // Create table body
    const tbody = table.createTBody();
    sheetData.slice(1).forEach(row => {
        const tr = tbody.insertRow();
        const td = tr.insertCell();
        td.textContent = row[columnIndex] || '';
    });
}
