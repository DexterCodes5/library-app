import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BookModel } from "../../model/BookModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { StarsReview } from "../Utils/StarsReview";
import { CheckoutAndReviewBox } from "./components/CheckoutAndReviewBox";
import { ReviewModel } from "../../model/ReviewModel";
import { LatestReviews } from "./components/LatestReviews";

type BookParams = {
  bookId: string;
};

export const BookCheckoutPage = () => {
  const [book, setBook] = useState<BookModel>();
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);

  // Review State
  const [reviews, setReviews] = useState<ReviewModel[]>([]);
  const [totalStars, setTotalStars] = useState(0);
  const [isLoadingReview, setIsLoadingReview] = useState(true);

  const { bookId } = useParams<BookParams>();

  useEffect(() => {
    const fetchBook = async () => {
      const url: string = `http://localhost:8080/api/books/${bookId}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      const responseJson = await response.json();
      setBook(responseJson);
      setIsLoading(false);
    };

    fetchBook().catch((error: any) => {
      setIsLoading(false);
      setHttpError(error.message);
    });

    const fetchBookReview = async () => {
      const reviewUrl = `http://localhost:8080/api/reviews/search/findByBookId?bookId=${bookId}`;
      const reviewResponse = await fetch(reviewUrl);

      if (!reviewResponse.ok) {
        throw new Error("Something went wrong");
      }

      const reviewResponseJson = await reviewResponse.json();
      const reviewResponseData = await reviewResponseJson._embedded.reviews;
      setReviews(reviewResponseData);

      let wheightedStarReviews = 0;
      for (const review of reviewResponseData) {
        wheightedStarReviews += review.rating;
      }
      if (reviewResponseData) {
        wheightedStarReviews /= reviewResponseData.length;
        // const round = (Math.round((wheightedStarReviews * 2) / 2)).toFixed(1);
        console.log(wheightedStarReviews);
        setTotalStars(wheightedStarReviews);
      }

      setIsLoadingReview(false);
    };

    fetchBookReview().catch(error => {
      setIsLoadingReview(false);
      setHttpError(error.message);
    });
  }, []);

  if (isLoading || isLoadingReview) {
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
    <div>
      {/* Desktop */}
      <div className="container d-none d-lg-block">
        <div className="row mt-5">
          <div className="col-sm-2 col-md-2">
            {book?.img ?
              <img src={book.img} width="226" height="349" alt="Book" />
              :
              <img src={require("../../Images/BooksImages/book-luv2code-1000.png")} width="226" height="349" alt="Book" />
            }
          </div>
          <div className="col-4 col-md-4 container">
            <div className="ms-2">
              <h2>
                {book?.title}
              </h2>
              <h5 className="text-primary">{book?.author}</h5>
              <p className="lead">{book?.description}</p>
              <StarsReview rating={totalStars} size={32} />
            </div>
          </div>
          <CheckoutAndReviewBox book={book} mobile={false} />
        </div>
        <hr />
        <LatestReviews reviews={reviews} bookId={Number(bookId)} mobile={false} />
      </div>
      {/* Mobile */}
      <div className="container d-lg-none mt-5">
        <div className="d-flex justify-content-center align-items-center">
          {book?.img ?
            <img src={book.img} width="226" height="349" alt="Book" />
            :
            <img src={require("../../Images/BooksImages/book-luv2code-1000.png")} width="226" height="349" alt="Book" />
          }
        </div>
        <div className="mt-4">
          <div>
            <h2>
              {book?.title}
            </h2>
            <h5 className="text-primary">{book?.author}</h5>
            <p className="lead">{book?.description}</p>
            <StarsReview rating={totalStars} size={32} />
          </div>
        </div>
        <CheckoutAndReviewBox book={book} mobile={true} />
        <hr />
        <LatestReviews reviews={reviews} bookId={Number(bookId)} mobile={true} />
      </div>
    </div>
  );
};