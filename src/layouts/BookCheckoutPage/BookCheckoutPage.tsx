import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { BookModel } from "../../model/BookModel";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { StarsReview } from "../Utils/StarsReview";
import { CheckoutAndReviewBox } from "./components/CheckoutAndReviewBox";
import { ReviewModel } from "../../model/ReviewModel";
import { LatestReviews } from "./components/LatestReviews";
import { useOktaAuth } from "@okta/okta-react";
import { ReviewRequestModel } from "../../model/ReviewRequestModel";

type BookParams = {
  bookId: string;
};

export const BookCheckoutPage = () => {
  const { bookId } = useParams<BookParams>();
  const { authState } = useOktaAuth();

  const [book, setBook] = useState<BookModel>();
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);

  // Review State
  const [reviews, setReviews] = useState<ReviewModel[]>([]);
  const [totalStars, setTotalStars] = useState(0);
  const [isLoadingReview, setIsLoadingReview] = useState(true);
  
  const [isReviewLeft, setIsReviewLeft] = useState(false);
  const [isLoadingUserReview, setIsLoadingUserReview] = useState(true);

  // Loans Count State
  const [currentLoansCount, setCurrentLoansCount] = useState(0);
  const [isLoadingCurrentLoansCount, setIsLoadingCurrentLoansCount] = useState(true);

  // Is Book Checked out
  const [isCheckedOut, setIsCheckedOut] = useState(false);
  const [isLoadingBookCheckedOut, setIsLoadingBookCheckedOut] = useState(true);

  // Payment
  const [displayError, setDisplayError] = useState(false);


  useEffect(() => {
    const fetchBook = async () => {
      const url: string = `${process.env.REACT_APP_API}/books/${bookId}`;

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

  }, [isCheckedOut]);

  useEffect(() => {
    const fetchBookReview = async () => {
      const reviewUrl = `${process.env.REACT_APP_API}/reviews/search/findByBookId?bookId=${bookId}`;
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
        const round = (Math.round(wheightedStarReviews * 2) / 2).toFixed(1);
        setTotalStars(Number(round));
      }

      setIsLoadingReview(false);
    };

    fetchBookReview().catch(error => {
      setIsLoadingReview(false);
      setHttpError(error.message);
    });
  }, [isReviewLeft]);

  useEffect(() => {
    const fetchUserReviewBook = async () => {
      if (authState?.isAuthenticated) {
        const userReviewBookUrl = `${process.env.REACT_APP_API}/reviews/secure/isreviewed/byuser?bookId=${bookId}`;
        const requestOptions = {
          headers: {
            Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
            "Content-Type": "application/json"
          }
        };
        const userReviewBookResponse = await fetch(userReviewBookUrl, requestOptions);
        if (!userReviewBookResponse.ok) {
          throw new Error("Something went wrong");
        }

        const userReviewBookResponseJson = await userReviewBookResponse.json();
        setIsReviewLeft(userReviewBookResponseJson);
      }
      setIsLoadingUserReview(false);
    };
    fetchUserReviewBook().catch(err => {
      setIsLoadingUserReview(false);
      setHttpError(err.message);
    })
  }, [authState]);

  useEffect(() => {
    const fetchCurrentLoansCount = async () => {
      if (authState?.isAuthenticated) {
        const url = `${process.env.REACT_APP_API}/books/secure/currentloans/count`;
        const requestOptions = {
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            "Content-Type": "application/json"
          }
        };

        const currentLoansResponse = await fetch(url, requestOptions);
        if (!currentLoansResponse.ok) {
          throw new Error("Something went wrong!");
        }

        const currentLoansResponseJson = await currentLoansResponse.json();
        setCurrentLoansCount(currentLoansResponseJson);
      }
      setIsLoadingCurrentLoansCount(false);
    }

    fetchCurrentLoansCount().catch(err => {
      setIsLoadingCurrentLoansCount(false);
      setHttpError(err.message)
    });
  }, [authState, isCheckedOut]);

  useEffect(() => {
    const fetchIsCheckedOutByUser = async () => {
      if (authState?.isAuthenticated) {
        const url = `${process.env.REACT_APP_API}/books/secure/ischeckedout/byuser?bookId=${bookId}`;
        const requestOptions = {
          headers: {
            Authorization: `Bearer ${authState.accessToken?.accessToken}`,
            "Content-Type": "application/json"
          }
        };

        const isCheckedOutByUserResponse = await fetch(url, requestOptions);
        if (!isCheckedOutByUserResponse.ok) {
          throw new Error("Something went wrong!");
        }

        const isCheckedOutByUserResponseJson = await isCheckedOutByUserResponse.json();
        setIsCheckedOut(isCheckedOutByUserResponseJson);
      }
      setIsLoadingBookCheckedOut(false);
    }

    fetchIsCheckedOutByUser().catch(err => {
      setIsLoadingBookCheckedOut(false);
      setHttpError(err);
    })
  }, [authState]);
  
  if (isLoading || isLoadingReview || isLoadingCurrentLoansCount || isLoadingBookCheckedOut || isLoadingUserReview) {
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

  const checkoutBook = async () => {
    const url = `${process.env.REACT_APP_API}/books/secure/checkout?bookId=${bookId}`;
    const requestOptions = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        "Content-Type": "application/json"
      }
    }
    const checkoutResponse = await fetch(url, requestOptions);
    if (!checkoutResponse.ok) {
      setDisplayError(true);
      return;
    }
    setDisplayError(false);
    setIsCheckedOut(true);
  }

  const submitReview = async (starInput: number, reviewDescription: string) => {
    const reviewRequestModel = new ReviewRequestModel(starInput, Number(bookId), reviewDescription);

    const url = `${process.env.REACT_APP_API}/reviews/secure`;
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(reviewRequestModel) 
    };

    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      throw new Error("Something went wrong");
    }
    setIsReviewLeft(true);
  }

  return (
    <div>
      {/* Desktop */}
      <div className="container d-none d-lg-block">
        {displayError &&
          <div className="alert alert-danger mt-3">
            Please pay outstanding fees and return late book(s).
          </div>
        }
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
          <CheckoutAndReviewBox book={book!} mobile={false} currentLoans={currentLoansCount} isAuthenticated={authState?.isAuthenticated} 
          isCheckedOut={isCheckedOut} checkoutBook={checkoutBook} isReviewLeft={isReviewLeft} submitReview={submitReview} />
        </div>
        <hr />
        <LatestReviews reviews={reviews} bookId={Number(bookId)} mobile={false} />
      </div>
      {/* Mobile */}
      <div className="container d-lg-none mt-5">
        {displayError &&
          <div className="alert alert-danger mt-3">
            Please pay outstanding fees and return late book(s).
          </div>
        }
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
        <CheckoutAndReviewBox book={book!} mobile={true} currentLoans={currentLoansCount} isAuthenticated={authState?.isAuthenticated} 
          isCheckedOut={isCheckedOut} checkoutBook={checkoutBook} isReviewLeft={isReviewLeft} submitReview={submitReview} />
        <hr />
        <LatestReviews reviews={reviews} bookId={Number(bookId)} mobile={true} />
      </div>
    </div>
  );
};