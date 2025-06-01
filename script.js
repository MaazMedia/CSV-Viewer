const params = new URLSearchParams(window.location.search);
const csvUrl = params.get('url');
const preview = params.get('preview')
if (!csvUrl) {
  document.getElementById('tableContainer').innerText = '❌ No CSV URL provided.';
} else {
  if (!preview) {
    fetch(csvUrl)
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch CSV.');
        return response.text();
      })
      .then(csvText => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: function(results) {
            const data = results.data;

            // Define custom column headers
            const headers = ['Transaction Date', 'Reference', 'Description', 'Money in', 'Money out', 'Balance'];
            let html = '<table><tr>' + headers.map(h => `<th>${h}</th>`).join('') + '</tr>';

            data.forEach(row => {
              html += `<tr>
                <td>${row["Transaction date"] || ''}</td>
                <td>${row["Transaction reference"] || ''}</td>
                <td>${row["Description"] || ''}</td>
                <td>${row["Credit Amount"] || ''}</td>
                <td>${row["Debit Amount"] || ''}</td>
                <td>${row["Balance"] || ''}</td>
              </tr>`;
            });

            html += '</table>';
            document.getElementById('tableContainer').innerHTML = html;
          }
        });
      })
      .catch(err => {
        document.getElementById('tableContainer').innerText = '❌ Error loading CSV: ' + err.message;
      });

  }
  else {
    fetch(csvUrl)
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch CSV.');
        return response.text();
      })
      .then(csvText => {
        Papa.parse(csvText, {
          header: false,
          complete: function(results) {
            const data = results.data;
            let html = '<table>';
            data.forEach((row, index) => {
              html += '<tr>' + row.map(cell => {
                const safe = String(cell).replace(/</g, "&lt;").replace(/>/g, "&gt;");
                return index === 0
                  ? `<th>${safe}</th>`
                  : `<td>${safe}</td>`;
              }).join('') + '</tr>';
            });
            html += '</table>';
            document.getElementById('tableContainer').innerHTML = html;
          }
        });
      })
      .catch(err => {
        document.getElementById('tableContainer').innerText = '❌ Error loading CSV: ' + err.message;
      });

  }
}
