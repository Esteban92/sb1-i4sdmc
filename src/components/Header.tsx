import React from 'react'
import { Link } from 'react-router-dom'
import { Plane, ShoppingBag, LogIn, UserPlus, LogOut, MessageCircle } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center">
          <Plane className="mr-2" />
          TravelShare
        </Link>
        <nav>
          <ul className="flex space-x-4">
            {user ? (
              <>
                {user.role === 'traveler' && (
                  <>
                    <li><Link to="/traveler" className="hover:text-blue-200">Dashboard</Link></li>
                    <li><Link to="/create-route" className="hover:text-blue-200">Crear Ruta</Link></li>
                  </>
                )}
                {user.role === 'buyer' && (
                  <>
                    <li><Link to="/buyer" className="hover:text-blue-200">Dashboard</Link></li>
                    <li><Link to="/search-routes" className="hover:text-blue-200">Buscar Rutas</Link></li>
                  </>
                )}
                <li>
                  <Link to="/messages" className="hover:text-blue-200 flex items-center">
                    <MessageCircle className="mr-1" size={18} />
                    Mensajes
                  </Link>
                </li>
                <li>
                  <button onClick={logout} className="hover:text-blue-200 flex items-center">
                    <LogOut className="mr-1" size={18} />
                    Cerrar Sesión
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login" className="hover:text-blue-200 flex items-center">
                    <LogIn className="mr-1" size={18} />
                    Iniciar Sesión
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-blue-200 flex items-center">
                    <UserPlus className="mr-1" size={18} />
                    Registrarse
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header