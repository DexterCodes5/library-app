import { Link } from "react-router-dom";
import { BookModel } from "../../../model/BookModel";
import { MouseEventHandler } from "react";
import { LeaveAReview } from "../../Utils/LeaveAReview";

export const CheckoutAndReviewBox: React.FC<{ 
  book: BookModel, mobile: boolean, currentLoans: number, isAuthenticated: any, isCheckedOut: boolean, checkoutBook: MouseEventHandler, isReviewLeft: boolean, submitReview: Function
 }> = (props) => {

  const buttonRender = () => {
    if (props.isAuthenticated) {
      if (false) {
        return (<p></p>);
      }
      if (!props.isCheckedOut && props.currentLoans < 5) {
        return (<button className="btn btn-success btn-lg" onClick={props.checkoutBook}>Checkout</button>);
      }
      else if (props.isCheckedOut) {
        return (<p className="fw-bold">You already checked out this book</p>);
      }
      return (<p className="text-danger">Too many books checked out.</p>);
    }
    return (<Link className="btn btn-success btn-lg" to="/login">Sign in</Link>);
  }

  const reviewRender = () => {
    if (props.isAuthenticated) {
      if (props.isReviewLeft) {
        return <p className="fw-bold">Thank you for your review!</p>
      }
      return <LeaveAReview submitReview={props.submitReview} />
    }
    return (
      <div>
        <hr />
        <p>Sign in to be able to leave a review</p>
      </div>
    );
  }

  return (
    <div className={props.mobile ? "card d-flex mt-5" : "card col-3 container d-flex mb-5"}>
      <div className="card-body container">
        <div className="mt-3">
          <p>
            <b>{props.currentLoans}/5 </b>
            books checked out
          </p>
          <hr />
          {props.book && props.book.copiesAvailable && props.book.copiesAvailable > 0 ?
            <h4 className="text-success">Available</h4>
            :
            <h4 className="text-danger">Wait List</h4>
          }
          <div className="row">
            <p className="col-6 lead">
              <b>{props.book?.copies} </b>
              copies
            </p>
            <p className="col-6 lead">
              <b>{props.book?.copiesAvailable} </b>
              available
            </p>
          </div>
        </div>
        {buttonRender()}
        <hr />
        <p className="mt-3">
          This number can change until placing order has been complete.
        </p>
        {reviewRender()}
      </div>
    </div>
  );
}