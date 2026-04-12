import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from './supabaseClient'
import './Form.css'

function CrearCliente() {

    const navigate = useNavigate()

    const [Nombre, setNombre] = useState('')
    const [Apellido, setApellido] = useState('')
    const [Telefono, setTelefono] = useState('')
    const [Email, setEmail] = useState('')

    async function agregarCliente(cliente) {
        const { error } = await supabase
            .from('Clientes')
            .insert([cliente])
            .select()

        if (error) {
            alert("Error al crear cliente")
            return
        }

        alert("Cliente creado ✅")
        navigate('/')
    }

    const manejarSubmit = (e) => {
        e.preventDefault()

        const cliente = {
            Nombre: Nombre,
            Apellido: Apellido,
            Telefono: Telefono,
            Email: Email
        }

        agregarCliente(cliente)
    }

    return (
        <form className="form-page" onSubmit={manejarSubmit}>
            <h2>Nuevo cliente</h2>

            <div className="form-campos">

                <div className="form-campo">
                    <label className="form-label">Nombre</label>
                    <input placeholder="Nombre" onChange={(e) => setNombre(e.target.value)} />
                </div>

                <div className="form-campo">
                    <label className="form-label">Apellido</label>
                    <input placeholder="Apellido" onChange={(e) => setApellido(e.target.value)} />
                </div>

                <div className="form-campo">
                    <label className="form-label">Teléfono</label>
                    <input placeholder="Teléfono" onChange={(e) => setTelefono(e.target.value)} />
                </div>

                <div className="form-campo">
                    <label className="form-label">Email</label>
                    <input placeholder="Email" type="email" onChange={(e) => setEmail(e.target.value)} />
                </div>

            </div>

            <button className="btn btn-primary" type="submit">Agregar cliente</button>

        </form>
    )
}

export default CrearCliente