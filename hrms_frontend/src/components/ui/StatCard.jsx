export default function StatCard({ title, value, subtitle }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-sm text-gray-500">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
      <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
    </div>
  );
}
