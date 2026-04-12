import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Productos from './Productos'
import DetalleProducto from './DetalleProducto'
import CrearProducto from './CrearProducto'
import CrearCliente from './CrearCliente'
import CrearVenta from './CrearVenta'
import Clientes from './Clientes'
import Ventas from './Ventas'
import Ganancias from './Ganancias'
import DetalleVenta from './DetalleVenta'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Productos />} />
        <Route path="/producto/:id" element={<DetalleProducto />} />
        <Route path="/crear-producto" element={<CrearProducto />} />
        <Route path="/crear-venta" element={<CrearVenta />} />
        <Route path="/crear-cliente" element={<CrearCliente />} />
        <Route path="/clientes" element={<Clientes />} />
        <Route path="/ventas" element={<Ventas />} />
        <Route path="/ganancias" element={<Ganancias />} />
        <Route path="/venta/:id" element={<DetalleVenta />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App