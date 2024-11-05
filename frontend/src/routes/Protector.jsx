import { useLocation, Outlet, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const ProtectedRoutes = () => {
  const location = useLocation()
  const loggedIn = useSelector((state) => state.User.loggedIn)

  if (!loggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return <Outlet />
}

export default ProtectedRoutes
