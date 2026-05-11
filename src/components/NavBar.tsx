import { NavLink } from 'react-router-dom';

export default function NavBar() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-1 rounded text-sm font-medium transition-colors ${
      isActive
        ? 'bg-indigo-800 text-white'
        : 'text-indigo-100 hover:bg-indigo-700 hover:text-white'
    }`;

  return (
    <nav className="bg-indigo-600 shadow-md">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <span className="text-white font-bold text-lg tracking-tight">TaskMaster</span>
        <div className="flex gap-2">
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/about" className={linkClass}>
            About
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
