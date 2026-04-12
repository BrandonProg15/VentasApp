import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from './supabaseClient'
import './Productos.css'

function Productos() {
    const [productos, setProductos] = useState([])
    const navigate = useNavigate()

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

    return (
        <div className="productos-page">

            <div className="productos-header">
                <h2>Lista de productos</h2>
                <button className="btn btn-primary" onClick={() => navigate('/crear-producto')}>
                    Crear producto
                </button>
            </div>

            <div className="productos-nav">
                <button className="btn btn-secondary" onClick={() => navigate('/clientes')}>Clientes</button>
                <button className="btn btn-secondary" onClick={() => navigate('/ventas')}>Ventas</button>
                <button className="btn btn-secondary" onClick={() => navigate('/ganancias')}>Ganancias</button>
            </div>

            <div className="productos-lista">
                {productos.map((prod, index) => (
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