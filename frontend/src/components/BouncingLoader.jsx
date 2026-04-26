const BouncingLoader = ({ label = "Loading adventure..." }) => (
  <div className="flex min-h-[220px] items-center justify-center">
    <div className="rounded-3xl bg-white/80 px-8 py-6 text-center shadow-xl">
      <div className="flex justify-center gap-2 mb-3">
        {[0, 1, 2].map((item) => (
          <span
            key={item}
            className="h-4 w-4 rounded-full bg-primary-500 animate-bounce"
            style={{ animationDelay: `${item * 0.12}s` }}
          />
        ))}
      </div>
      <p className="text-sm font-bold text-gray-500">{label}</p>
    </div>
  </div>
);

export default BouncingLoader;
