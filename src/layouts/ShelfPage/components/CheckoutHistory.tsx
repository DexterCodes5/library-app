import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import { HistoryModel } from "../../../model/HistoryModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Link } from "react-router-dom";
import { Pagination } from "../../Utils/Pagination";

export const CheckoutHistory = () => {
  const { authState } = useOktaAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);

  // Histories
  const [histories, setHistories] = useState<HistoryModel[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const historiesPerPage = 5;
  const [totalPages, setTotalPages] = useState(0);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  useEffect(() => {
    const fetchHistories = async () => {
      const url = `${process.env.REACT_APP_API}/histories/search/findBooksByUserEmail?userEmail=${authState?.accessToken?.claims.sub}&page=${currentPage-1}&size=${historiesPerPage}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      const responseJson = await response.json();
      const responseData = responseJson._embedded.histories;

      const historiesArr: HistoryModel[] = [];
      for (const data of responseData) {
        const book = await fetchBook(data._links.book.href);
        const history = new HistoryModel(data.id, data.userEmail, data.checkoutDate, 
          data.returnedDate, book);
        historiesArr.push(history);
      }
      setHistories(historiesArr);
      setTotalPages(responseJson.page.totalPages);
      setIsLoading(false);
    };

    const fetchBook = async (url: string) => {
      const bookResponse = await fetch(url);
      if (!bookResponse.ok) {
        throw new Error("Can't fetch book");
      }
      const bookResponseJson = await bookResponse.json();
      return bookResponseJson;
    }

    fetchHistories().catch(err => {
      setIsLoading(false);
      setHttpError(err.message);
    });
  }, [authState, currentPage]);

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

  return (
    <div className="mt-2">
      {histories.length > 0 ?
        <>
          <h5>Recent History:</h5>
          {histories.map(history => 
            <div key={history.id} className="mb-3">
              <div className="card mt-3 shadow p-3 mb-3 bg-body rounded">
                <div className="row">
                  <div className="col-md-2">
                    <div className="d-none d-lg-block">
                      <img src={history.book.img} width="123" height="196" alt="Book" />
                    </div>
                    <div className="d-lg-none d-flex justify-content-center align-item-center">
                      <img src={history.book.img} width="123" height="196" alt="Book" />
                    </div>
                  </div>
                  <div className="col">
                    <div className="card-body">
                      <h5 className="card-title">{history.book.author}</h5>
                      <h4>{history.book.title}</h4>
                      <p className="card-text">{history.book.description}</p>
                      <hr />
                      <p className="card-text">Check out on: {history.checkoutDate}</p>
                      <p className="card-text">Returned on: {history.returnedDate}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>  
          )}
        </>
        :
        <>
          <h3 className="mt-3">
            Currently no history: 
          </h3>
          <Link className="btn btn-primary" to="/search">Search for new book</Link>
        </>
      }
      {totalPages > 1 &&
        <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
      }
    </div>
  );
}