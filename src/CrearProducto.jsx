import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from './supabaseClient'
import './Form.css'

function CrearProducto() {

    const navigate = useNavigate()

    const [Nombre, setNombre] = useState('')
    const [PrecioCompra, setPrecioCompra] = useState('')
    const [PrecioVenta, setPrecioVenta] = useState('')
    const [NombreProveedor, setProveedor] = useState('')
    const [TipoProducto, setTipo] = useState('')
    const [ImagenUrl, setImagenUrl] = useState('')

    async function agregarProducto(producto) {
        const { error } = await supabase
            .from('Productos')
            .insert([producto])
            .select()

        if (error) {
            alert("Error al crear producto")
            return
        }

        alert("Producto creado ✅")
        navigate('/')
    }

    const manejarSubmit = (e) => {
        e.preventDefault()

        const producto = {
            Nombre: Nombre,
            PrecioCompra: Number(PrecioCompra),
            PrecioVenta: Number(PrecioVenta),
            NombreProveedor: NombreProveedor,
            TipoProducto: TipoProducto,
            ImagenUrl: ImagenUrl
        }

        agregarProducto(producto)
    }

    return (
        <form className="form-page" onSubmit={manejarSubmit}>
            <h2>Nuevo producto</h2>

            <div className="form-campos">

                <div className="form-campo">
                    <label className="form-label">Nombre</label>
                    <input placeholder="Nombre" onChange={(e) => setNombre(e.target.value)} />
                </div>

                <div className="form-campo">
                    <label className="form-label">Precio compra</label>
                    <input placeholder="0" type="number" onChange={(e) => setPrecioCompra(e.target.value)} />
                </div>

                <div className="form-campo">
                    <label className="form-label">Precio venta</label>
                    <input placeholder="0" type="number" onChange={(e) => setPrecioVenta(e.target.value)} />
                </div>

                <div className="form-campo">
                    <label className="form-label">Proveedor</label>
                    <input placeholder="Proveedor" onChange={(e) => setProveedor(e.target.value)} />
                </div>

                <div className="form-campo">
                    <label className="form-label">Tipo</label>
                    <input placeholder="Ej: Funko, Videojuego..." onChange={(e) => setTipo(e.target.value)} />
                </div>
                <div className="form-campo">
                    <label className="form-label">URL de imagen</label>
                    <input placeholder="https://..." onChange={(e) => setImagenUrl(e.target.value)} />
                </div>
            </div>

            <button className="btn btn-primary" type="submit">Agregar producto</button>

        </form>
    )
}

export default CrearProducto