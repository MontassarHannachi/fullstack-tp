"use client";

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="p-4">
      <p>Unable to load the product ({error.message})</p>
      <button className="rounded bg-blue-500 px-4 py-2 text-white" onClick={reset}>
        Retry
      </button>
    </div>
  );
}
