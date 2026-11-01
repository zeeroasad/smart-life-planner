export default function LoadError({ label = 'This section could not be loaded.', error, onRetry }) {
  return <section className="mx-auto my-12 max-w-xl rounded-3xl border border-coral/25 bg-white p-8 text-center shadow-soft" role="alert">
    <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-coral/15 text-xl font-black text-ink" aria-hidden="true">!</div>
    <h2 className="mt-4 text-xl font-black text-ink">{label}</h2>
    <p className="mt-2 text-sm leading-6 text-moss">{error}</p>
    <button className="btn-primary mt-5" type="button" onClick={onRetry}>Try again</button>
  </section>;
}
