const StatCard = ({ title, value, icon, subtitle, color = "text-primary-600" }) => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-600 mt-1">{subtitle}</p>
          )}
        </div>
        <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-2xl">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
