document.getElementById('extractButton').addEventListener('click', () => {
    const columnName = document.getElementById('columnInput').value.trim();

    if (!columnName) {
        document.getElementById('output').innerText = "Please enter a column name.";
        return;
    }

    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        const tabId = tabs[0].id;

        chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: extractAllRowsIfColumnName,
            args: [columnName]
        }, (result) => {
            const rowData = result[0].result;

            document.getElementById('output').innerText = JSON.stringify(rowData, null, 2);
            
            if (rowData && rowData.rows) {
                document.getElementById('exportButton').disabled = false;
                document.getElementById('exportButton').dataset.csv = convertToCSV(rowData);
            } else {
                document.getElementById('exportButton').disabled = true;
            }
        });
    });
});

document.getElementById('exportButton').addEventListener('click', () => {
    const csv = document.getElementById('exportButton').dataset.csv;
    downloadCSV(csv, 'table_data.csv');
});

function convertToCSV(data) {
    const headers = data.headers.join(',');
    const rows = data.rows.map(row => 
        row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')
    ).join('\n');
    return headers + '\n' + rows;
}

function downloadCSV(csv, filename) {
    const csvFile = new Blob([csv], { type: 'text/csv' });
    const downloadLink = document.createElement('a');
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

function extractAllRowsIfColumnName(columnName) {
    const tables = Array.from(document.querySelectorAll('table'));

    for (const table of tables) {
        const headers = Array.from(table.querySelectorAll('th'));

        const hasTargetHeader = headers.some(header => header.innerText.includes(columnName));

        if (hasTargetHeader) {
            const headerData = headers.map(header => header.innerText);

            const rows = Array.from(table.querySelectorAll('tr'));

            const rowData = rows
                .filter(row => row.querySelectorAll('td').length > 0)
                .map(row => {
                    const cells = Array.from(row.querySelectorAll('td'));
                    return cells.map(cell => cell.innerText);
                });

            return {
                headers: headerData,
                rows: rowData.length > 0 ? rowData : 'No data rows found in the table.'
            };
        }
    }

    return 'No table with the specified column name found on this page.';
}
