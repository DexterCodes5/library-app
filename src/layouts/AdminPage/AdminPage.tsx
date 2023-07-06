import { useOktaAuth } from "@okta/okta-react"
import { useState } from "react";
import { Redirect } from "react-router-dom";
import { AdminMessages } from "./components/AdminMessages";
import { AddNewBook } from "./components/AddNewBook";
import { ChangeQuantityBooks } from "./components/ChangeQuantityBooks";

export const AdminPage = () => {
  const { authState } = useOktaAuth();

  const [changeQuantityClick, setChangeQuantityClick] = useState(false);
  const [messagesClick, setMessagesClick] = useState(false);

  const handleNavLink = (e: React.MouseEvent<HTMLElement>) => {
    if (e.currentTarget.id === "nav-add-book-tab") {
      setChangeQuantityClick(false);
      setMessagesClick(false);
    }
    else if (e.currentTarget.id === "nav-quantity-tab") {
      setChangeQuantityClick(true);
      setMessagesClick(false);
    }
    else {
      setChangeQuantityClick(false);
      setMessagesClick(true);
    }
  }
  
  if (!authState?.accessToken?.claims.userType) {
    return <Redirect to="/home" />
  }

  return (
    <div className="container mt-5">
      <h3>Manange Library</h3>
      <nav className="nav nav-tabs" id="nav-tab" role="tablist">
        <button className="nav-link active" id="nav-add-book-tab" data-bs-toggle="tab" data-bs-target="#nav-add-book" type="button" aria-controls="nav-add-book" aria-selected="false" onClick={handleNavLink}>
          Add new book
        </button>
        <button className="nav-link" id="nav-quantity-tab" data-bs-toggle="tab" data-bs-target="#nav-quantity" type="button" aria-controls="nav-quantity" aria-selected="true" onClick={handleNavLink}>
          Change quantity
        </button>
        <button className="nav-link" id="nav-messages-tab" data-bs-toggle="tab" data-bs-target="#nav-messages" type="button" aria-controls="nav-messages" aria-selected="false" onClick={handleNavLink}>
          Messages
        </button>
      </nav>
      <div className="tab-content">
        <div className="tab-pane fade show active" id="nav-add-book" aria-labelledby="nav-add-book-tab">
          <AddNewBook />
        </div>
        <div className="tab-pane fade" id="nav-quantity" aria-labelledby="nav-quantity-tab">
          {changeQuantityClick && <ChangeQuantityBooks />}
        </div>
        <div className="tab-pane fade" id="nav-messages" role="tabpanel" aria-labelledby="nav-messages-tab">
          {messagesClick && <AdminMessages />}
        </div>
      </div>
    </div>
  )
}