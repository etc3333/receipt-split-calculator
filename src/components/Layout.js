import { Outlet, NavLink, useNavigate } from "react-router-dom";
import '../css/Layout.css'

const Layout = () => {
  const navigate = useNavigate();
  function changeNavigate() {
    navigate('/');
  }

  return (
    <>
      <nav>
        <h1 className="nav-link" onClick={() => changeNavigate()}>Finacial Assistance</h1>
        <ul>
          <li>
            <NavLink to="/receiptExcel" className="nav-link">Receipt Excel</NavLink>
          </li>
          <li>
            <NavLink to="/receiptVisual" className="nav-link">Receipt Visual</NavLink>
          </li>
        </ul>
      </nav>
      <main>
        <Outlet />
      </main>
    </>
  )
}

export default Layout;