import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from './supabaseClient'
import './CrearVenta.css'

function CrearVenta() {

    const navigate = useNavigate()

    const [productos, setProductos] = useState([])
    const [clientes, setClientes] = useState([])
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null)
    const [productoSeleccionado, setProductoSeleccionado] = useState(null)
    const [cantidad, setCantidad] = useState('')
    const [renglones, setRenglones] = useState([])

    useEffect(() => {
        async function cargarDatos() {
            const { data: dataProductos } = await supabase.from('Productos').select('*')
            const { data: dataClientes } = await supabase.from('Clientes').select('*')
            if (dataProductos) setProductos(dataProductos)
            if (dataClientes) setClientes(dataClientes)
        }
        cargarDatos()
    }, [])

    function handleSelectProducto(e) {
        const prod = productos.find(p => p.idProducto === Number(e.target.value))
        setProductoSeleccionado(prod || null)
    }

    function handleSelectCliente(e) {
        const cliente = clientes.find(c => c.idCliente === Number(e.target.value))
        setClienteSeleccionado(cliente || null)
    }

    function agregarRenglon() {
        if (!productoSeleccionado) {
            alert("Seleccioná un producto")
            return
        }
        if (!cantidad || Number(cantidad) <= 0) {
            alert("Ingresá una cantidad válida")
            return
        }

        if (productoSeleccionado.Stock - Number(cantidad) < 0) {
            const confirmar = window.confirm(`No hay stock de ${productoSeleccionado.Nombre}, ¿agregar igual?`)
            if (!confirmar) return
        }

        const indexExistente = renglones.findIndex(
            r => r.producto.idProducto === productoSeleccionado.idProducto
        )

        if (indexExistente !== -1) {
            const nuevos = [...renglones]
            nuevos[indexExistente].cantidad += Number(cantidad)
            setRenglones(nuevos)
        } else {
            setRenglones([
                ...renglones,
                {
                    producto: productoSeleccionado,
                    cantidad: Number(cantidad)
                }
            ])
        }

        setProductoSeleccionado(null)
        setCantidad('')
    }

    function eliminarRenglon(index) {
        const nuevos = [...renglones]
        nuevos.splice(index, 1)
        setRenglones(nuevos)
    }

    function editarCantidad(index, nuevaCantidad) {
        if (!nuevaCantidad || Number(nuevaCantidad) <= 0) return

        const nuevos = [...renglones]
        nuevos[index].cantidad = Number(nuevaCantidad)
        setRenglones(nuevos)
    }

    async function agregarVenta() {
        if (!clienteSeleccionado) {
            alert("Seleccioná un cliente")
            return
        }

        if (renglones.length === 0) {
            alert("Agregá al menos un producto")
            return
        }

        const { data: ventaCreada, error: errorVenta } = await supabase
            .from('Ventas')
            .insert([{
                idCliente: clienteSeleccionado.idCliente,
                fecha: new Date(),
                estado: 'activa'
            }])
            .select()

        if (errorVenta) {
            alert("Error al crear la venta")
            return
        }

        const idVenta = ventaCreada[0].idVenta

        for (const renglon of renglones) {
            const { error: errorDetalle } = await supabase
                .from('DetalleVentas')
                .insert([{
                    idVenta: idVenta,
                    idProducto: renglon.producto.idProducto,
                    CantidadUnidades: renglon.cantidad,
                    PrecioVentaUnitario: renglon.producto.PrecioVenta
                }])

            if (errorDetalle) {
                alert("Error al guardar detalle")
                return
            }
        }

        alert("Venta creada ✅")
        navigate('/')
    }

    const manejarSubmit = (e) => {
        e.preventDefault()
        agregarVenta()
    }

    return (
        <form className="crear-venta-page" onSubmit={manejarSubmit}>
            <h2>Nueva venta</h2>

            <div className="crear-venta-campos">

                <div className="crear-venta-campo">
                    <label>Cliente</label>
                    <select onChange={handleSelectCliente} defaultValue="">
                        <option value="" disabled>Seleccioná un cliente</option>
                        {clientes.map(c => (
                            <option key={c.idCliente} value={c.idCliente}>
                                {c.Nombre} {c.Apellido}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="crear-venta-campo">
                    <label>Producto</label>
                    <select onChange={handleSelectProducto} value={productoSeleccionado?.idProducto || ""}>
                        <option value="" disabled>Seleccioná un producto</option>
                        {productos.map(prod => (
                            <option key={prod.idProducto} value={prod.idProducto}>
                                {prod.Nombre}
                            </option>
                        ))}
                    </select>

                    {productoSeleccionado && (
                        <div>
                            Precio: ${productoSeleccionado.PrecioVenta}
                        </div>
                    )}
                </div>

                <div className="crear-venta-campo">
                    <label>Cantidad</label>
                    <input
                        type="number"
                        min="1"
                        value={cantidad}
                        onChange={(e) => setCantidad(e.target.value)}
                    />
                </div>

                <button type="button" onClick={agregarRenglon}>
                    Agregar producto
                </button>

                {renglones.length > 0 && (
                    <div>
                        <h3>Productos agregados</h3>

                        {renglones.map((r, index) => (
                            <div key={index} className="renglon-item">
                                <span>{r.producto.Nombre}</span>

                                <input
                                    type="number"
                                    min="1"
                                    value={r.cantidad}
                                    onChange={(e) => editarCantidad(index, e.target.value)}
                                />

                                <span>${r.producto.PrecioVenta}</span>

                                <button type="button" onClick={() => eliminarRenglon(index)}>
                                    ❌
                                </button>
                            </div>
                        ))}
                    </div>
                )}

            </div>

            <button type="submit">Crear venta</button>

        </form>
    )
}

export default CrearVenta