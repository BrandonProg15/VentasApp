import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from './supabaseClient'
import './Productos.css'

function Productos() {
    const [productos, setProductos] = useState([])
    const navigate = useNavigate()
    const [busqueda, setBusqueda] = useState('')

    useEffect(() => {
        cargarProductos()
    }, [])

    async function cargarProductos() {
        const { data, error } = await supabase
            .from('Productos')
            .select('*')

        if (error) return
        setProductos(data)
    }
    const productosFiltrados = productos.filter(prod =>
        prod.Nombre.toLowerCase().includes(busqueda.toLowerCase())
    )

    return (
        <div className="productos-page">

            <div className="productos-header">
                <h2>Lista de productos</h2>
                <button className="btn btn-primary" onClick={() => navigate('/crear-producto')}>
                    Crear producto
                </button>
            </div>

            <div className="productos-toolbar">
                <input
                    placeholder="Buscar producto..."
                    onChange={(e) => setBusqueda(e.target.value)}
                />
                <button className="btn btn-secondary" onClick={() => navigate('/importar-productos')}>
                    Importar Excel
                </button>
            </div>

            <div className="productos-lista">
                {productosFiltrados.map((prod, index) => (
                    <button className="producto-item" key={index} onClick={() => navigate(`/producto/${prod.idProducto}`)}>
                        {prod.ImagenUrl && (
                            <img src={prod.ImagenUrl} alt={prod.Nombre} />
                        )}
                        {prod.Nombre}
                    </button>
                ))}
            </div>

        </div>
    )
}

export default Productos