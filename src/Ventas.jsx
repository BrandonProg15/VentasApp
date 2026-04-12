import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from './supabaseClient'
import './Lista.css'

function Ventas() {

    const [ventas, setVentas] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        cargarVentas()
    }, [])

    async function cargarVentas() {
        const { data, error } = await supabase
            .from('Ventas')
            .select('idVenta, fecha, total, estado, Clientes(Nombre, Apellido)')

        if (error) return
        setVentas(data)
    }

    return (
        <div className="lista-page">

            <div className="lista-header">
                <h2>Ventas</h2>
                <button className="btn btn-primary" onClick={() => navigate('/crear-venta')}>
                    Nueva venta
                </button>
            </div>

            <div className="lista-items">
                {ventas.map((venta, index) => (
                    <button className="lista-item" key={index} onClick={() => navigate(`/venta/${venta.idVenta}`)}>
                        <div className="lista-item-info">
                            <span className="lista-item-titulo">
                                {venta.Clientes?.Nombre} {venta.Clientes?.Apellido}
                            </span>
                            <span className="lista-item-subtitulo">
                                {new Date(venta.fecha).toLocaleDateString('es-AR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </span>
                        </div>
                        <div className="lista-item-derecha">
                            <span className="lista-item-total">${venta.total}</span>
                            <span className={`badge badge-${venta.estado}`}>{venta.estado}</span>
                        </div>
                    </button>
                ))}
            </div>

        </div>
    )
}

export default Ventas