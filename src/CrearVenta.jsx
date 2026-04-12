import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from './supabaseClient'
import './CrearVenta.css'

function CrearVenta() {

    const navigate = useNavigate()

    const [productos, setProductos] = useState([])
    const [clientes, setClientes] = useState([])
    const [productoSeleccionado, setProductoSeleccionado] = useState(null)
    const [clienteSeleccionado, setClienteSeleccionado] = useState(null)
    const [CantidadUnidades, setCantidadUnidades] = useState('')

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

    async function agregarVenta() {
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

        const { error: errorDetalle } = await supabase
            .from('DetalleVentas')
            .insert([{
                idVenta: idVenta,
                idProducto: productoSeleccionado.idProducto,
                CantidadUnidades: Number(CantidadUnidades),
                PrecioVentaUnitario: productoSeleccionado.PrecioVenta
            }])

        if (errorDetalle) {
            alert("Error al guardar el detalle de la venta")
            return
        }

        alert("Venta creada ✅")
        navigate('/')
    }

    const manejarSubmit = (e) => {
        e.preventDefault()

        if (!clienteSeleccionado) {
            alert("Seleccioná un cliente")
            return
        }
        if (!productoSeleccionado) {
            alert("Seleccioná un producto")
            return
        }
        if (!CantidadUnidades || Number(CantidadUnidades) <= 0) {
            alert("Ingresá una cantidad válida")
            return
        }
        if (productoSeleccionado.Stock - Number(CantidadUnidades) < 0) {
            const confirmar = window.confirm(`Ya no te queda stock de ${productoSeleccionado.Nombre}, ¿querés hacer la venta igual?`)
            if (!confirmar) return
        }

        agregarVenta()
    }

    return (
        <form className="crear-venta-page" onSubmit={manejarSubmit}>
            <h2>Nueva venta</h2>

            <div className="crear-venta-campos">

                <div className="crear-venta-campo">
                    <label className="crear-venta-label">Cliente</label>
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
                    <label className="crear-venta-label">Producto</label>
                    <select onChange={handleSelectProducto} defaultValue="">
                        <option value="" disabled>Seleccioná un producto</option>
                        {productos.map(prod => (
                            <option key={prod.idProducto} value={prod.idProducto}>
                                {prod.Nombre}
                            </option>
                        ))}
                    </select>
                    {productoSeleccionado && (
                        <div className="crear-venta-preview">
                            <span className="crear-venta-preview-label">Precio de venta</span>
                            <span className="crear-venta-preview-valor">${productoSeleccionado.PrecioVenta}</span>
                        </div>
                    )}
                </div>

                <div className="crear-venta-campo">
                    <label className="crear-venta-label">Cantidad</label>
                    <input
                        placeholder="Cantidad unidades"
                        type="number"
                        min="1"
                        onChange={(e) => setCantidadUnidades(e.target.value)}
                    />
                </div>

            </div>

            <button className="btn btn-primary" type="submit">Agregar venta</button>

        </form>
    )
}

export default CrearVenta