import { useLocation, Outlet, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import useApiRequest from '../hooks/useAPI'
import { loginUser, logoutUser } from '../store/slices/userSlice'
import { useEffect } from 'react'
import axios from 'axios'

const ProtectedRoutes = () => {
  const location = useLocation()

  let { sendRequest, data, error, loading } = useApiRequest({ auth: true });
  const d = useDispatch()
  let token = useSelector(s => s.User.accessToken)
  if (!token) {
    token = localStorage.getItem("token")
} 
  // console.log('data ', data)
  
  useEffect(() => {

       console.log('token' , token)
       verifytoken(token)
  }, [token])

  useEffect(() => {
       if (data && !error && token){
            const login_data = {user: data, accessToken: token}
            d(loginUser(login_data))
       }
  },[data, token])

  const verifytoken = async (token) => {
       if (!token) {
            d(logoutUser())
            localStorage.clear()
            return
       }
       try {
            await axios.post('/auth/token/verify/', {token: token})
            await sendRequest('Get', '/user/me/', {}, false)
       } catch (error) {
            console.log(error)
            d(logoutUser())
            localStorage.clear()
       }
      }

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }
  return <Outlet />
}

export default ProtectedRoutes
