/**
 * Export data as a CSV file download
 * @param {Array<Object>} data - Array of objects to export
 * @param {string} filename - Name of the downloaded file (without extension)
 * @param {Array<{key: string, label: string}>} columns - Column definitions
 */
export const exportToCSV = (data, filename, columns) => {
  if (!data || data.length === 0) return;

  const header = columns.map(col => `"${col.label}"`).join(',');
  const rows = data.map(row =>
    columns.map(col => {
      let value = row[col.key] ?? '';
      // Escape quotes in values
      if (typeof value === 'string') {
        value = value.replace(/"/g, '""');
      }
      return `"${value}"`;
    }).join(',')
  );

  const csvContent = [header, ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Trigger browser print dialog
 */
export const printPage = () => {
  window.print();
};
