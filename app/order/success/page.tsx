import Link from "next/link";

export default function OrderSuccess({
  searchParams,
}: {
  searchParams: { id?: string; warn?: string };
}) {
  return (
    <div className="card mx-auto max-w-md p-8 text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-2xl">
        ✓
      </div>
      <h1 className="text-2xl font-bold">Thanks for your order</h1>
      <p className="mt-1 text-gray-600">
        Order #{searchParams.id?.slice(0, 8) ?? "—"} has been placed.
      </p>
      <p className="mt-3 text-sm text-gray-500">
        A confirmation email is on its way to your inbox.
      </p>
      {searchParams.warn && (
        <p className="mt-3 rounded border border-amber-200 bg-amber-50 p-2 text-xs text-amber-700">
          Note: {searchParams.warn}
        </p>
      )}
      <Link href="/" className="btn-outline mt-6 inline-flex">
        Continue shopping
      </Link>
    </div>
  );
}