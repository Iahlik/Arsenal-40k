import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="brand">
        ⚔️ Arsenal 40K
      </div>

      <nav className="navbar-right">
        <Link to="/lists">Mis Listas</Link>
        <Link to="/lists/new">Nueva Lista</Link>
        <button>Salir</button>
      </nav>
    </header>
  );
}
