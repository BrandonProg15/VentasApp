import { useState } from 'react'
import { supabase } from './supabaseClient'
import './Ganancias.css'

function Ganancias() {

    const [desdeFecha, setDesdeFecha] = useState('')
    const [hastaFecha, setHastaFecha] = useState('')
    const [resultado, setResultado] = useState(null)

    async function consultarGanancias() {
        const { data, error } = await supabase
            .from('DetalleVentas')
            .select(`
                CantidadUnidades,
                PrecioVentaUnitario,
                Productos(PrecioCompra),
                Ventas!inner(fecha, estado)
            `)
            .gte('Ventas.fecha', desdeFecha)
            .lte('Ventas.fecha', hastaFecha)
            .neq('Ventas.estado', 'cancelada')

        if (error || !data) {
            alert("Error al consultar")
            return
        }

        let ingresos = 0
        let costos = 0

        data.forEach(detalle => {
            ingresos += detalle.PrecioVentaUnitario * detalle.CantidadUnidades
            costos += detalle.Productos.PrecioCompra * detalle.CantidadUnidades
        })

        setResultado({
            ingresos,
            costos,
            ganancia: ingresos - costos
        })
    }

    return (
        <div className="ganancias-page">
            <h2>Ganancias</h2>

            <div className="ganancias-filtros">
                <div className="ganancias-filtro-campo">
                    <label className="ganancias-filtro-label">Desde</label>
                    <input type="date" onChange={(e) => setDesdeFecha(e.target.value)} />
                </div>
                <div className="ganancias-filtro-campo">
                    <label className="ganancias-filtro-label">Hasta</label>
                    <input type="date" onChange={(e) => setHastaFecha(e.target.value)} />
                </div>
                <button className="btn btn-primary" onClick={consultarGanancias}>
                    Consultar
                </button>
            </div>

            {resultado && (
                <div className="ganancias-resultados">
                    <div className="ganancia-card">
                        <span className="ganancia-card-label">Ingresos</span>
                        <span className="ganancia-card-valor neutro">${resultado.ingresos}</span>
                    </div>
                    <div className="ganancia-card">
                        <span className="ganancia-card-label">Costos</span>
                        <span className="ganancia-card-valor neutro">${resultado.costos}</span>
                    </div>
                    <div className="ganancia-card">
                        <span className="ganancia-card-label">Ganancia neta</span>
                        <span className={`ganancia-card-valor ${resultado.ganancia >= 0 ? 'positivo' : 'negativo'}`}>
                            ${resultado.ganancia}
                        </span>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Ganancias