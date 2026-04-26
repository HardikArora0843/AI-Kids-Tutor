import { Link } from "react-router-dom";

const parentUrl = import.meta.env.VITE_PARENT_URL || "http://localhost:5174";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 px-4">
      <div className="text-center animate-slide-up">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
          AI Kids Tutor
        </h1>
        <p className="text-lg text-gray-500 mb-10 max-w-md mx-auto">
          A fun, gamified learning adventure for kids.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/login"
            className="px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-2xl shadow-lg shadow-primary-500/30 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Child Sign In
          </Link>
          <Link
            to="/register"
            className="px-8 py-3 bg-white hover:bg-gray-50 text-primary-600 font-bold rounded-2xl shadow-lg border-2 border-primary-200 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Create Child Account
          </Link>
        </div>

        <a
          href={parentUrl}
          className="inline-block mt-6 text-sm font-bold text-gray-400 hover:text-primary-600"
        >
          Parent? Open the Parent Portal
        </a>
      </div>
    </div>
  );
};

export default Landing;
