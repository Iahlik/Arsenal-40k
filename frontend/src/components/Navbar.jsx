import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="brand">⚔️ Arsenal 40K</Link>
      </div>

      <div className="navbar-right">
        {!token ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Registro</Link>
          </>
        ) : (
          <>
            <Link to="/lists">Mis Listas</Link>
            <Link to="/lists/new">Nueva Lista</Link>
            <button onClick={logout}>Salir</button>
          </>
        )}
      </div>
    </nav>
  );
}
