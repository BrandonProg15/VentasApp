import { Link } from 'react-router-dom'
import './Header.css'

function Header() {
  return (
    <header className="header">
      <nav className="nav">
        <Link to="/" className="nav-link">Inicio</Link>
        <Link to="/clientes" className="nav-link">Clientes</Link>
        <Link to="/ventas" className="nav-link">Ventas</Link>
        <Link to="/ganancias" className="nav-link">Ganancias</Link>
      </nav>
    </header>
  )
}

export default Header
