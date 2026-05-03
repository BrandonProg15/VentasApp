import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { supabase } from './supabaseClient'
import jsPDF from 'jspdf'
import './DetalleVenta.css'

function DetalleVenta() {

    const { id } = useParams()
    const [venta, setVenta] = useState(null)
    const [editando, setEditando] = useState(false)
    const [form, setForm] = useState(null)

    useEffect(() => {
        traerVenta()
    }, [])
    function generarPDF() {
        const doc = new jsPDF()

        doc.setFontSize(18)
        doc.text('Presupuesto de venta', 20, 20)

        doc.setFontSize(12)
        doc.text(`Cliente: ${venta.Clientes?.Nombre} ${venta.Clientes?.Apellido}`, 20, 45)
        doc.text(`Fecha: ${new Date(venta.fecha).toLocaleDateString('es-AR')}`, 20, 55)
        doc.text(`Estado: ${venta.estado}`, 20, 65)

        doc.text('Productos:', 20, 80)
        let y = 90
        venta.DetalleVentas.forEach(detalle => {
            doc.text(
                `${detalle.Productos?.Nombre} x ${detalle.CantidadUnidades} — $${detalle.PrecioVentaUnitario} c/u — Total: $${detalle.PrecioVentaUnitario * detalle.CantidadUnidades}`,
                20, y
            )
            y += 10
        })


        doc.text(`Total: $${venta.total}`, 20, y + 10)

        doc.save(`factura-venta-${venta.idVenta}.pdf`)
    }
    async function traerVenta() {
        const { data, error } = await supabase
            .from('Ventas')
            .select(`
                idVenta, fecha, estado, total,
                Clientes(Nombre, Apellido),
                DetalleVentas(idDetalle, CantidadUnidades, PrecioVentaUnitario, Productos(Nombre))
            `)
            .eq('idVenta', id)

        if (error) {
            console.log(error)
            return
        }

        setVenta(data[0])
        setForm(data[0])
    }

    async function guardarCambios() {
        const { error: errorVenta } = await supabase
            .from('Ventas')
            .update({ estado: form.estado })
            .eq('idVenta', id)

        if (errorVenta) {
            alert("Error al guardar")
            return
        }

        for (const detalle of form.DetalleVentas) {
            const { error: errorDetalle } = await supabase
                .from('DetalleVentas')
                .update({ CantidadUnidades: Number(detalle.CantidadUnidades) })
                .eq('idDetalle', detalle.idDetalle)

            if (errorDetalle) {
                alert("Error al guardar detalle")
                return
            }
        }

        alert("Guardado ✅")
        setEditando(false)
        traerVenta()
    }

    if (!venta) return <p>Cargando...</p>

    return (
        <div className="detalle-venta-page">

            <div className="detalle-venta-header">
                <p className="detalle-venta-id">Venta #{venta.idVenta}</p>
                <h2 className="detalle-venta-cliente">
                    {venta.Clientes?.Nombre} {venta.Clientes?.Apellido}
                </h2>

                <div className="detalle-venta-meta">
                    <div className="detalle-venta-meta-item">
                        <span className="detalle-venta-meta-label">Fecha</span>
                        <span className="detalle-venta-meta-valor">
                            {new Date(venta.fecha).toLocaleDateString('es-AR', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </span>
                    </div>
                    <div className="detalle-venta-meta-item">
                        <span className="detalle-venta-meta-label">Estado</span>
                        {editando ? (
                            <select value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })}>
                                <option value="activa">Activa</option>
                                <option value="modificada">Modificada</option>
                                <option value="cancelada">Cancelada</option>
                            </select>
                        ) : (
                            <span className={`badge badge-${venta.estado}`}>{venta.estado}</span>
                        )}
                    </div>
                </div>
            </div>

            <h3>Productos</h3>
            <div className="detalle-venta-productos">
                {venta.DetalleVentas.map((detalle, index) => (
                    <div className="detalle-venta-producto-fila" key={detalle.idDetalle}>
                        <span className="detalle-venta-producto-nombre">{detalle.Productos?.Nombre}</span>
                        <span className="detalle-venta-producto-precio">
                            ${detalle.PrecioVentaUnitario} x {detalle.CantidadUnidades}
                        </span>
                        {editando && (
                            <input
                                className="detalle-venta-producto-input"
                                type="number"
                                min="1"
                                value={form.DetalleVentas[index].CantidadUnidades}
                                onChange={(e) => {
                                    const nuevosDetalles = [...form.DetalleVentas]
                                    nuevosDetalles[index] = { ...nuevosDetalles[index], CantidadUnidades: e.target.value }
                                    setForm({ ...form, DetalleVentas: nuevosDetalles })
                                }}
                            />
                        )}
                    </div>
                ))}
            </div>

            <div className="detalle-venta-total">
                <span className="detalle-venta-total-label">Total</span>
                <span className="detalle-venta-total-valor">${venta.total}</span>
            </div>

            <div className="detalle-venta-acciones">
                {editando ? (
                    <button className="btn btn-primary" onClick={guardarCambios}>Guardar</button>
                ) : (
                    <>
                        <button className="btn btn-secondary" onClick={() => setEditando(true)}>Editar</button>
                        <button className="btn btn-secondary" onClick={generarPDF}>Descargar PDF</button>
                    </>
                )}
            </div>
        </div>
    )
}

export default DetalleVenta