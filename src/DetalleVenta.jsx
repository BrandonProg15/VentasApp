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

    // Estados para agregar productos nuevos a la venta
    const [todosLosProductos, setTodosLosProductos] = useState([])
    const [busqueda, setBusqueda] = useState('')

    useEffect(() => {
        traerVenta()
        cargarProductos()
    }, [])

    async function cargarProductos() {
        const { data } = await supabase.from('Productos').select('*')
        setTodosLosProductos(data || [])
    }

    async function traerVenta() {
        const { data, error } = await supabase
            .from('Ventas')
            .select(`
                idVenta, fecha, estado, total,
                Clientes(Nombre, Apellido),
                DetalleVentas(idDetalle, CantidadUnidades, PrecioVentaUnitario, idProducto, Productos(Nombre))
            `)
            .eq('idVenta', id)
            .single()

        if (error) return console.log(error)
        setVenta(data)
        setForm(JSON.parse(JSON.stringify(data))) // Clonado profundo para evitar problemas de referencia
    }

    const sugerencias = todosLosProductos.filter(p =>
        p.Nombre.toLowerCase().includes(busqueda.toLowerCase()) && busqueda !== ''
    )

    function agregarProductoNuevo(prod) {
        const nuevoDetalle = {
            idVenta: id,
            idProducto: prod.idProducto,
            CantidadUnidades: 1,
            PrecioVentaUnitario: prod.PrecioVenta,
            Productos: { Nombre: prod.Nombre },
            esNuevo: true // Flag para saber que hay que insertarlo
        }
        setForm({ ...form, DetalleVentas: [...form.DetalleVentas, nuevoDetalle] })
        setBusqueda('')
    }

    async function guardarCambios() {
        // 1. Actualizar estado de la venta
        await supabase.from('Ventas').update({ estado: form.estado }).eq('idVenta', id)

        for (const detalle of form.DetalleVentas) {
            if (detalle.esNuevo) {
                // 2. Insertar productos nuevos
                await supabase.from('DetalleVentas').insert([{
                    idVenta: id,
                    idProducto: detalle.idProducto,
                    CantidadUnidades: Number(detalle.CantidadUnidades),
                    PrecioVentaUnitario: Number(detalle.PrecioVentaUnitario)
                }])
            } else {
                // 3. Actualizar productos existentes (Cantidad y PRECIO)
                await supabase.from('DetalleVentas').update({
                    CantidadUnidades: Number(detalle.CantidadUnidades),
                    PrecioVentaUnitario: Number(detalle.PrecioVentaUnitario)
                }).eq('idDetalle', detalle.idDetalle)
            }
        }

        alert("Venta actualizada ✅")
        setEditando(false)
        traerVenta()
    }

    if (!venta) return <p>Cargando...</p>

    return (
        <div className="detalle-venta-page">
            <div className="detalle-venta-header">
                <h2>Venta #{venta.idVenta} - {venta.Clientes?.Nombre}</h2>
                <select disabled={!editando} value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })}>
                    <option value="activa">Activa</option>
                    <option value="modificada">Modificada</option>
                    <option value="cancelada">Cancelada</option>
                </select>
            </div>

            <h3>Productos</h3>
            <div className="detalle-venta-productos">
                {form.DetalleVentas.map((detalle, index) => (
                    <div className="detalle-venta-producto-fila" key={index}>
                        <span>{detalle.Productos?.Nombre}</span>

                        {editando ? (
                            <>
                                <input
                                    type="number"
                                    placeholder="Cant"
                                    value={detalle.CantidadUnidades}
                                    onChange={(e) => {
                                        const nuevos = [...form.DetalleVentas]
                                        nuevos[index].CantidadUnidades = e.target.value
                                        setForm({ ...form, DetalleVentas: nuevos })
                                    }}
                                />
                                <input
                                    type="number"
                                    placeholder="Precio"
                                    value={detalle.PrecioVentaUnitario}
                                    onChange={(e) => {
                                        const nuevos = [...form.DetalleVentas]
                                        nuevos[index].PrecioVentaUnitario = e.target.value
                                        setForm({ ...form, DetalleVentas: nuevos })
                                    }}
                                />
                            </>
                        ) : (
                            <span>${detalle.PrecioVentaUnitario} x {detalle.CantidadUnidades}</span>
                        )}
                    </div>
                ))}
            </div>

            {editando && (
                <div className="buscador-edicion">
                    <h4>Agregar más productos:</h4>
                    <input
                        type="text"
                        placeholder="Buscar producto..."
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                    {sugerencias.map(p => (
                        <div key={p.idProducto} onClick={() => agregarProductoNuevo(p)} className="sugerencia-item">
                            {p.Nombre} (+ agregar)
                        </div>
                    ))}
                </div>
            )}

            <div className="detalle-venta-acciones">
                {editando ? (
                    <button onClick={guardarCambios}>Guardar Cambios</button>
                ) : (
                    <button onClick={() => setEditando(true)}>Editar Venta</button>
                )}
            </div>
        </div>
    )
}

export default DetalleVenta
