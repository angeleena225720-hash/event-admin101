import { NavLink } from "react-router-dom";

const tabClass = ({ isActive }) => (isActive ? "tab tab-on" : "tab");

export default function TopBar() {
  return (
    <header className="topbar">
      <div className="topbar-row">
        <div className="logo">
          <span className="logo-mark">E</span>
          <span>Eventura <small>Admin</small></span>
        </div>
        <nav className="tabs">
          <NavLink to="/" end className={tabClass}>Dashboard</NavLink>
          <NavLink to="/add" className={tabClass}>Add Event</NavLink>
        </nav>
      </div>
    </header>
  );
}
