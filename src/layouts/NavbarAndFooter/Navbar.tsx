import { useOktaAuth } from "@okta/okta-react";
import { Link, NavLink } from "react-router-dom";
import { SpinnerLoading } from "../Utils/SpinnerLoading";


export const Navbar: React.FC = () => {
  const { oktaAuth, authState } = useOktaAuth();

  if (!authState) {
    return (<SpinnerLoading />);
  }

  const handleLogout = async () => oktaAuth.signOut();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark main-color py-3">
      <div className="container-fluid">
        <span className="navbar-brand">Luv 2 Read</span>
        <button className="navbar-toggler" data-bs-toggle="collapse"
          data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDown"
          aria-expanded="false" aria-label="Toggle Navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavDropdown">
          <ul className="navbar-nav">
            <li>
              <NavLink to="/home" className="nav-link">Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/search" className="nav-link">Search Books</NavLink>
            </li>
            {authState.isAuthenticated &&
              <li className="nav-item">
                <NavLink to="/shelf" className="nav-link">Shelf</NavLink>
              </li>
            } 
            {authState.isAuthenticated &&
              <li className="nav-item">
                <NavLink to="/payment" className="nav-link">Payment</NavLink>
              </li>
            } 
            {authState.accessToken?.claims.userType &&
              <li className="nav-item">
                <NavLink to="/admin" className="nav-link">Admin</NavLink>
              </li>
            }
          </ul>
          <ul className="navbar-nav ms-auto">
            <li className="nav-item m-1">
              {authState.isAuthenticated ?
                <button className="btn btn-outline-light" onClick={handleLogout}>Logout</button>
                :
                <Link className="btn btn-outline-light" to="/login">Sign in</Link>
              }
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}