// Elements
const fileInput = document.getElementById("file-input");
const tableBody = document.getElementById("table-body");
const statsDiv = document.getElementById("stats");
const filterDropdown = document.getElementById("select-scheme");

// Constants
const STORAGE_KEY = "navData";

// Initialize
window.addEventListener("DOMContentLoaded", () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        const data = JSON.parse(stored);
        renderTable(data);
    }
});

filterDropdown.addEventListener("change",()=>{
    const stored = localStorage.getItem(STORAGE_KEY);
    let filteredData
    if(stored) {
        const parsedData = JSON.parse(stored);
        if(filterDropdown.value !== 'all') {
            filteredData = parsedData?.filter((item) => item.fundHouseName.split(" ")[0].toLowerCase() === filterDropdown.value)
        }else{
            filteredData = parsedData
        }
        renderTable(filteredData,true)
    }
})

// File Upload Handler
fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file || !file.name.endsWith(".txt")) {
        alert("Please upload a valid .txt file.");
        return;
    }

    const reader = new FileReader();
    reader.onload = () => {
        const parsed = parseNAVData(reader.result);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        renderTable(parsed);
    };
    reader.readAsText(file);
});

// Parse Function
function parseNAVData(text) {
    const lines = text.split("\n").map(line => line.trim()).filter(Boolean);
    const data = [];
    let fundHouseName ;

    for (let line of lines) {

        // Check weather the current line is fund name and extract it out first
        if(line.includes("Mutual Fund")) {
            fundHouseName = line.trim();
        }

        // Check weather the current line is a not a header line or also not contains ";", if so then skip it
        const isHeader = line.startsWith("Scheme Code") ||
            line.includes("Open Ended Schemes") ||
            !line.includes(";")

        if (isHeader) continue;

        // Split the current line using ";" delimiters
        const parts = line.split(";");
        // if (parts.length < 7) continue;

        const [
            schemeCode,
            ISINGrowth,
            ISINDivReinvest,
            schemeName,
            nav,
            date
        ] = parts;

        data.push({
            schemeCode,
            schemeName,
            ISIN: ISINGrowth || ISINDivReinvest,
            nav,
            date,
            fundHouseName
        });
    }

    return data;
}

// Populate the select options with stored data
function populateDropdownOptions(fundHouseNames){
    // filterDropdown.options = undefined;
    filterDropdown.options[filterDropdown.options.length] = new Option('All', 'all');
    fundHouseNames.forEach((item)=>{
        filterDropdown.options[filterDropdown.options.length] = new Option(item, item.split(" ")[0].toLowerCase());
    })
}

// Render Table
function renderTable(data,skipDropDownOptions=false) {
    tableBody.innerHTML = "";
    const seen = new Set();
    const fundHouses = new Set();
    let latestDate = "";

    data.forEach(entry => {
        const tr = document.createElement("tr");

        [entry.fundHouseName,entry.schemeCode, entry.ISIN, entry.schemeName, entry.nav, entry.date]
            .forEach((text) => {
                const td = document.createElement("td");
                td.textContent = text;
                tr.appendChild(td);
            });

        tableBody.appendChild(tr);
        seen.add(entry.schemeCode);
        fundHouses.add(entry.fundHouseName);

        if (!latestDate || new Date(entry.date) > new Date(latestDate)) {
            latestDate = entry.date;
        }
    });

    statsDiv.textContent = `Schemes: ${seen.size} | Latest NAV Date: ${latestDate}`;

    if(!skipDropDownOptions) {
        populateDropdownOptions(fundHouses)
    }
}
