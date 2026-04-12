import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from './supabaseClient'
import './Lista.css'

function Clientes() {

    const [clientes, setClientes] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        cargarClientes()
    }, [])

    async function cargarClientes() {
        const { data, error } = await supabase
            .from('Clientes')
            .select('*')

        if (error) return
        setClientes(data)
    }

    return (
        <div className="lista-page">

            <div className="lista-header">
                <h2>Clientes</h2>
                <button className="btn btn-primary" onClick={() => navigate('/crear-cliente')}>
                    Nuevo cliente
                </button>
            </div>

            <div className="lista-items">
                {clientes.map((cli, index) => (
                    <button className="lista-item" key={index} onClick={() => navigate(`/cliente/${cli.idCliente}`)}>
                        <div className="lista-item-info">
                            <span className="lista-item-titulo">{cli.Nombre} {cli.Apellido}</span>
                            <span className="lista-item-subtitulo">{cli.Email}</span>
                        </div>
                        <span className="lista-item-derecha">›</span>
                    </button>
                ))}
            </div>

        </div>
    )
}

export default Clientes