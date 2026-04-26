import { useNavigate } from "react-router-dom";

const LockOverlay = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary-400 via-kid-purple to-primary-600 z-50 flex items-center justify-center px-6">
      {/* Floating decorations */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-white/5 rounded-full blur-3xl" />

      <div className="bg-white/95 backdrop-blur-sm rounded-[2.5rem] p-10 max-w-md w-full text-center shadow-2xl">
        <span className="text-7xl block mb-4">🎉</span>

        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          Great Job Today!
        </h1>

        <p className="text-gray-500 text-lg mb-2">
          You've completed your learning time for today.
        </p>

        <p className="text-gray-400 text-sm mb-8">
          Come back tomorrow for more fun adventures! 🌟
        </p>

        <div className="bg-primary-50 rounded-2xl p-4 mb-6">
          <p className="text-primary-600 font-semibold text-sm">
            💡 Tip: Ask your parent if you can get extra time!
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-xl transition-all cursor-pointer"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default LockOverlay;
