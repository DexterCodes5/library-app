import { ShelfCurrentLoansModel } from "../../../model/ShelfCurrentLoansModel"

export const LoansModal: React.FC<{
  shelfCurrentLoan: ShelfCurrentLoansModel, mobile: boolean, returnBook: Function,
  renewBook: Function
}> = (props) => {

  return (
    <div className="modal fade" id={props.mobile ? `mobilemodal${props.shelfCurrentLoan.book.id}` :
      `modal${props.shelfCurrentLoan.book.id}`} data-bs-backdrop="static" data-bs-keyboard="false" aria-labelledby="saticBackdropLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="staticBackdropLabel">
              Loan Options
            </h5>
            <button className="btn-close" data-bs-dismiss="modal" aria-label="Close">
            </button>
          </div>
          <div className="modal-body">
            <div className="container">
              <div className="mt-3">
                <div className="row">
                  <div className="col-2">
                    <img src={props.shelfCurrentLoan.book.img} width="56" height="87" alt="Book" />
                  </div>
                  <div className="col-10">
                    <h6>{props.shelfCurrentLoan.book.author}</h6>
                    <h4>{props.shelfCurrentLoan.book.title}</h4>
                  </div>
                </div>
                <hr />
                {props.shelfCurrentLoan.daysLeft > 0 &&
                  <p className="text-secondary">
                    Due in {props.shelfCurrentLoan.daysLeft} days.
                  </p>
                }
                {props.shelfCurrentLoan.daysLeft === 0 &&
                  <p className="text-success">
                    Due today.
                  </p>
                }
                {props.shelfCurrentLoan.daysLeft < 0 &&
                  <p className="text-danger">
                    Past due by {props.shelfCurrentLoan.daysLeft} days.
                  </p>
                }
                <div className="list-group mt-3">
                  <button className="list-group-item list-group-item-action" data-bs-dismiss="modal" aria-current="true" onClick={() => props.returnBook(props.shelfCurrentLoan.book.id)}>
                    Return Book
                  </button>
                  {props.shelfCurrentLoan.daysLeft < 0 ?
                    <button className="list-group-item list-group-item-action incativeLink" data-bs-dismiss="modal" onClick={e => e.preventDefault()}>
                    Late dues cannot be renewed
                  </button>
                  :
                  <button className="list-group-item list-group-item-action" data-bs-dismiss="modal" onClick={() => props.renewBook(props.shelfCurrentLoan.book.id)}>
                    Renew loan for 7 days
                  </button>
                }
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" data-bs-dismiss="modal">
                Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}