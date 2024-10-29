
import { BrowserRouter } from 'react-router-dom'
import MainRoutes from './routes'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser } from './store/slices/userSlice'

function App() {
  // const user = useSelector(s => s.User.loggedIn)
  // console.log(user)


  return (
    <>
    <BrowserRouter>
      <MainRoutes/>
    </BrowserRouter>

    </>
  )
}

export default App
