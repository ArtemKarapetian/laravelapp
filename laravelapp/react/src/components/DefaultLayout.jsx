import {Link, Navigate, Outlet} from "react-router-dom";
import {useStateContext} from "../contexts/ContextProvider";
import axiosClient from "../axios-client.js";
import {useEffect} from "react";

export default function DefaultLayout() {
  const {user, token, setUser, setToken } = useStateContext();

//   if (!token) {
//     return <Navigate to="/login"/>
//   }


  const onLogout = ev => {
    ev.preventDefault()

    axiosClient.post('/logout')
    .then(() => {
        setUser({})
        setToken(null)
        window.location.href = "/catalogue";
    })

  }

  useEffect(() => {
    axiosClient.get('/user')
      .then(({data}) => {
         setUser(data)
      })
  }, [])

  return (
    <div id="defaultLayout">
      <aside>
        <Link to="/catalogue">Catalogue</Link>
        {token && user.role === 'Admin' && <Link to="/users">Users</Link> }
        {token && user.role === 'Admin' && <Link to="/orders">Orders</Link> }
        {token && <Link to="/myorders">My orders</Link>}
      </aside>
      <div className="content">
        <header>
          <div />

          <div>
            {user.name} &nbsp; &nbsp;
            {token && <a onClick={onLogout} className="btn-logout" href="#">Logout</a>}
            {!token && <a><Link to="/login">Login</Link></a>}
          </div>
        </header>
        <main>
          <Outlet/>
        </main>
      </div>
    </div>
  )
}
