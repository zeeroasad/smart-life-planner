export function formatCurrency(value, currency = 'PKR') { return new Intl.NumberFormat('en', { style: 'currency', currency, maximumFractionDigits: 0 }).format(Number(value || 0)); }
export function currentMonth() { return new Date().toISOString().slice(0, 7); }
export function monthLabel(value) { return new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(new Date(`${value}-01`)); }
export function apiError(error) { return error.response?.data?.error?.message || error.message || 'Something went wrong.'; }
