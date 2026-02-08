export default function StatCard({ title, value }) {
  return (
    <div className="bg-white p-5 rounded-xl border shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-2xl font-semibold text-gray-900 mt-1">
        {value ?? 0}
      </h2>
    </div>
  );
}
