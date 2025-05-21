// Elements
const fileInput = document.getElementById("file-input");
const tableBody = document.getElementById("table-body");
const statsDiv = document.getElementById("stats");

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

    for (let line of lines) {
        if (
            line.startsWith("Scheme Code") ||
            line.includes("Open Ended Schemes") ||
            line.includes("Mutual Fund") ||
            !line.includes(";")
        ) continue;

        const parts = line.split(";");
        if (parts.length < 7) continue;

        const [
            schemeCode,
            schemeName,
            ISINGrowth,
            ISINDivReinvest,
            nav,
            ,
            ,
            date
        ] = parts;

        data.push({
            schemeCode,
            schemeName,
            ISIN: ISINGrowth || ISINDivReinvest,
            nav,
            date,
        });
    }

    return data;
}

// Render Table
function renderTable(data) {
    tableBody.innerHTML = "";
    const seen = new Set();
    let latestDate = "";

    data.forEach(entry => {
        const tr = document.createElement("tr");

        [entry.schemeCode, entry.ISIN, entry.schemeName, entry.nav, entry.date]
            .forEach((text,index) => {
                const td = document.createElement("td");
                td.textContent = text;
                tr.appendChild(td);
            });

        tableBody.appendChild(tr);
        seen.add(entry.schemeCode);

        if (!latestDate || new Date(entry.date) > new Date(latestDate)) {
            latestDate = entry.date;
        }
    });

    statsDiv.textContent = `Schemes: ${seen.size} | Latest NAV Date: ${latestDate}`;
}
