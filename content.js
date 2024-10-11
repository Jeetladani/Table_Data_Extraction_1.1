// Function to extract all rows from a table if one of the headers is "Course ID"
function extractAllRowsIfCourseID() {
    const tables = Array.from(document.querySelectorAll('table')); // Get all tables on the page

    for (const table of tables) {
        const headers = Array.from(table.querySelectorAll('th')); // Get all <th> elements in the table

        // Check if any header contains "Course ID"
        const hasCourseIDHeader = headers.some(header => header.innerText.includes('Course ID'));

        if (hasCourseIDHeader) {
            // Extract header text
            const headerData = headers.map(header => header.innerText); // Get header text

            // Extract all rows from the table
            const rows = Array.from(table.querySelectorAll('tr')); // Get all rows in the table

            // Extract data from each row, skipping empty rows
            const rowData = rows
                .filter(row => row.querySelectorAll('td').length > 0) // Filter out rows without <td> elements
                .map(row => {
                    const cells = Array.from(row.querySelectorAll('td')); // Get all <td> elements in the row
                    return cells.map(cell => cell.innerText); // Extract cell text
                });

            // Return header data along with row data
            return {
                headers: headerData,
                rows: rowData.length > 0 ? rowData : 'No data rows found in the table.'
            };
        }
    }

    return 'No table with "Course ID" header found on this page.';
}

// Return the extracted rows and headers
extractAllRowsIfCourseID();
