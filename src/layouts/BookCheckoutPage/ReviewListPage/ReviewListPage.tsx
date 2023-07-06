import { useEffect, useState } from "react";
import { ReviewModel } from "../../../model/ReviewModel";
import { useParams } from "react-router-dom";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Review } from "../../Utils/Review";
import { Pagination } from "../../Utils/Pagination";

type Params = { bookId: string }; 

export const ReviewListPage = () => {

  const [reviews, setReviews] = useState<ReviewModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;
  const [totalAmountOfReviews, setTotalAmountOfReviews] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const { bookId } = useParams<Params>();

  useEffect(() => {
    const fetchBookReview = async () => {
      const reviewUrl = `${process.env.REACT_APP_API}/reviews/search/findByBookId?bookId=${bookId}&page=${currentPage-1}&size=${reviewsPerPage}`;
      const reviewResponse = await fetch(reviewUrl);

      if (!reviewResponse.ok) {
        throw new Error("Something went wrong");
      }

      const reviewResponseJson = await reviewResponse.json();
      const reviewResponseData = await reviewResponseJson._embedded.reviews;
      setTotalAmountOfReviews(reviewResponseJson.page.totalElements);
      setTotalPages(reviewResponseJson.page.totlaPages);
      setReviews(reviewResponseData);

      setIsLoading(false);
    };

    fetchBookReview().catch(error => {
      setIsLoading(false);
      setHttpError(error.message);
    });
  }, [currentPage]);

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

  const indexOfLastReview: number = currentPage * reviewsPerPage;
  const indexOfFirstReview: number = indexOfLastReview - reviewsPerPage;
  let lastItem = indexOfLastReview <= totalAmountOfReviews
    ? indexOfLastReview : totalAmountOfReviews;

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="container m-5">
      <div>
        <h3>Comments: ({reviews.length})</h3>
      </div>
      <p>
        {indexOfFirstReview + 1} to {lastItem} of {totalAmountOfReviews} items:
      </p>
      <div className="row">
        {reviews.map(review => (
          <Review review={review} key={review.id} />
        ))}
      </div>
      {totalPages > 1 && 
        <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
      }
    </div>
  );
};