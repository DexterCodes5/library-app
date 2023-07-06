import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import { ShelfCurrentLoansModel } from "../../../model/ShelfCurrentLoansModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Link } from "react-router-dom";
import { LoansModal } from "./LoansModal";

export const Loans = () => {
  const { authState } = useOktaAuth();

  // Current Loans
  const [shelfCurrentLoans, setShelfCurrentLoans] = useState<ShelfCurrentLoansModel[]>([]);
  const [checkoutChange, setCheckoutChange] = useState(false);

  const [httpError, setHttpError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentLoans = async () => {
      if (!authState?.isAuthenticated) {
        return;
      }
      const url = `${process.env.REACT_APP_API}/books/secure/currentloans`;
      const requestOptions = {
        headers: {
          Authorization: `Bearer ${authState?.accessToken?.accessToken}`
        }
      };
      const response = await fetch(url, requestOptions);
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      const responseJson = await response.json();
      setShelfCurrentLoans(responseJson);
      setIsLoading(false);
    }

    fetchCurrentLoans().catch(err => {
      setIsLoading(false);
      setHttpError(err.message);
    });

    window.scrollTo(0, 0);
  }, [authState, checkoutChange]);

  if (isLoading) {
    return (
      <SpinnerLoading />
    )
  }

  if (httpError) {
    return (
      <div className="container m-5">
        <p>{httpError}</p>
      </div>
    );
  }

  const returnBook = async (bookId: number) => {
    const url = `${process.env.REACT_APP_API}/books/secure/return?bookId=${bookId}`;
    const requestOptions = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`
      }
    }
    const response = await fetch(url, requestOptions);
    setCheckoutChange(!checkoutChange);
  }

  const renewBook = async (bookId: number) => {
    const url = `${process.env.REACT_APP_API}/books/secure/renew?bookId=${bookId}`;
    const requestOptions = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`
      }
    }
    const response = await fetch(url, requestOptions);
    setCheckoutChange(!checkoutChange);
  }

  return (
    <div>
      {/* Desktop */}
      <div className="d-none d-lg-block mt-2">
        {shelfCurrentLoans.length > 0 ?
          <>
            <h5>Current Loans: </h5>
            {shelfCurrentLoans.map(shelfCurrentLoan =>
              <div key={shelfCurrentLoan.book.id}>
                <div className="row mt-3 mb-3">
                  <div className="col-4 container">
                    <img src={shelfCurrentLoan.book.img} width="226" height="349" alt="Book" />
                  </div>
                  <div className="card col-3 container d-flex">
                    <div className="card-body">
                      <div className="mt-3">
                        <h4>Loan Options</h4>
                        {shelfCurrentLoan.daysLeft > 0 &&
                          <p className="text-secondary">
                            Due in {shelfCurrentLoan.daysLeft} days.
                          </p>
                        }
                        {shelfCurrentLoan.daysLeft === 0 &&
                          <p className="text-success">
                            Due today.
                          </p>
                        }
                        {shelfCurrentLoan.daysLeft < 0 &&
                          <p className="text-danger">
                            Past due by {shelfCurrentLoan.daysLeft} days.
                          </p>
                        }
                        <div className="list-group mt-3">
                          <button type="button" className="list-group-item list-group-item-action" aria-current="true" data-bs-toggle="modal" data-bs-target={`#modal${shelfCurrentLoan.book.id}`}>
                            Manage Loan
                          </button>
                          <Link to="/search" className="list-group-item list-group-item-action">
                            Search more book?
                          </Link>
                        </div>
                      </div>
                      <hr />
                      <p className="mt-3">
                        Help other find their adventure by reviewing your loan.
                      </p>
                      <Link to={`/checkout/${shelfCurrentLoan.book.id}`} className="btn btn-primary">
                        Leave a review
                      </Link>
                    </div>
                  </div>
                </div>
                <hr />
                <LoansModal shelfCurrentLoan={shelfCurrentLoan} mobile={false} returnBook={returnBook} renewBook={renewBook} />
              </div>
            )}
          </>
          :
          <>
            <h3 className="mt-3">
              Currently no loans
            </h3>
            <Link className="btn btn-primary" to="search">
              Search for a new book
            </Link>
          </>
        }
      </div>

      {/* Mobile */}
      <div className="container d-lg-none mt-2">
        {shelfCurrentLoans.length > 0 ?
          <>
            <h5 className="mb-3">Current Loans: </h5>
            {shelfCurrentLoans.map(shelfCurrentLoan =>
              <div key={shelfCurrentLoan.book.id}>
                <div className="d-flex justify-content-center align-items-center">
                  <img src={shelfCurrentLoan.book.img} width="226" height="349" alt="Book" />
                </div>
                <div className="card d-flex mt-5 mb-3">
                  <div className="card-body container">
                    <div className="mt-3">
                      <h4>Loan Options</h4>
                      {shelfCurrentLoan.daysLeft > 0 &&
                        <p className="text-secondary">
                          Due in {shelfCurrentLoan.daysLeft} days.
                        </p>
                      }
                      {shelfCurrentLoan.daysLeft === 0 &&
                        <p className="text-success">
                          Due today.
                        </p>
                      }
                      {shelfCurrentLoan.daysLeft < 0 &&
                        <p className="text-danger">
                          Past due by {shelfCurrentLoan.daysLeft} days.
                        </p>
                      }
                      <div className="list-group mt-3">
                        <button type="button" className="list-group-item list-group-item-action" aria-current="true"
                         data-bs-toggle="modal" data-bs-target={`#mobilemodal${shelfCurrentLoan.book.id}`}>
                          Manage Loan
                        </button>
                        <Link to="/search" className="list-group-item list-group-item-action">
                          Search more book?
                        </Link>
                      </div>
                    </div>
                    <hr />
                    <p className="mt-3">
                      Help other find their adventure by reviewing your loan.
                    </p>
                    <Link to={`/checkout/${shelfCurrentLoan.book.id}`} className="btn btn-primary">
                      Leave a review
                    </Link>
                  </div>
                </div>
                <hr />
                <LoansModal shelfCurrentLoan={shelfCurrentLoan} mobile={true} returnBook={returnBook} renewBook={renewBook} />
              </div>
            )}
          </>
          :
          <>
            <h3 className="mt-3">
              Currently no loans
            </h3>
            <Link className="btn btn-primary" to="search">
              Search for a new book
            </Link>
          </>
        }
      </div>
    </div>
  );
}