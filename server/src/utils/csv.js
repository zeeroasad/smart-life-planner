const FORMULA_PREFIX = /^[=+\-@]/;

export function safeCsvCell(value) {
  const text = value === null || value === undefined ? '' : String(value);
  const guarded = FORMULA_PREFIX.test(text) ? `'${text}` : text;
  return `"${guarded.replaceAll('"', '""')}"`;
}

export function toCsv(rows, columns) {
  const header = columns.map((column) => safeCsvCell(column.label)).join(',');
  const body = rows.map((row) => columns.map((column) => safeCsvCell(row[column.key])).join(',')).join('\n');
  return `${header}\n${body}`;
}
