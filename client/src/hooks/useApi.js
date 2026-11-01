import { useCallback, useState } from 'react';
import { apiError } from '../utils/format.js';

export function useApi() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const run = useCallback(async (request) => { setBusy(true); setError(''); try { return await request(); } catch (err) { setError(apiError(err)); throw err; } finally { setBusy(false); } }, []);
  return { busy, error, setError, run };
}
