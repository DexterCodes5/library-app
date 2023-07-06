import { useState } from "react";
import { BookModel } from "../../../model/BookModel";
import { useOktaAuth } from "@okta/okta-react";

export const ChangeQuantityBook: React.FC<{ 
  book: BookModel, setBookDeleted: React.Dispatch<React.SetStateAction<boolean>>
}> = (props) => {
  const { authState } = useOktaAuth();

  const [copies, setCopies] = useState(props.book.copies);
  const [copiesAvailable, setCopiesAvailable] = useState(props.book.copiesAvailable);

  const addQuantity = () => {
    setCopies(++props.book.copies);
    setCopiesAvailable(++props.book.copiesAvailable!);

    fetchBook("PUT");
  };

  const decreaseQuantity = () => {
    setCopies(--props.book.copies);
    setCopiesAvailable(--props.book.copiesAvailable!);

    fetchBook("PUT");
  };

  const deleteBook = async () => {
    await fetchBook("DELETE");
    props.setBookDeleted((prevValue: boolean) => !prevValue);
  };

  const fetchBook = async (method: string) => {
    const url = `${process.env.REACT_APP_API}/books/secure/admin`;
    const requestOptions = {
      method: method,
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(props.book)
    };

    const response = await fetch(url, requestOptions);
  };

  return (
    <div className="card mt-3 mb-3 shadow p-3 rounded">
      <div className="row">
        <div className="col-md-2">
          <div className="d-none d-lg-block">
            <img src={props.book.img} alt="Book" width="123" />
          </div>
          <div className="d-lg-none d-flex justify-content-center align-item-center">
            <img src={props.book.img} alt="Book" width="123" />
          </div>
        </div>
        <div className="col-md-6 card-body">
          <h5>{props.book.author}</h5>
          <h4>{props.book.title}</h4>
          <p className="card-text">{props.book.description}</p>
        </div>
        <div className="mt-3 col-md-4">
          <p className="d-flex justify-content-center align-items-center">Copies: <b className="ms-1">{copies}</b></p>
          <p className="d-flex justify-content-center align-items-center">Copies Available: <b className="ms-1">{copiesAvailable}</b></p>
        </div>
        <div className="mt-3">
          <button className="m-1 btn btn-danger" onClick={deleteBook}>Delete</button>
        </div>
        <div>
          <button className="mt-1 mb-1 btn main-color text-white w-100" onClick={addQuantity}>Add Quantity</button>
        </div>
        <div>
          <button className="btn btn-warning w-100" onClick={decreaseQuantity}>Decrease Quantity</button>
        </div>
        
      </div>
    </div>
  );
}