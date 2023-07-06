import { useEffect, useState } from "react";
import { BookModel } from "../../../model/BookModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Pagination } from "../../Utils/Pagination";
import { ChangeQuantityBook } from "./ChangeQuantityBook";

export const ChangeQuantityBooks = () => {
  const [books, setBooks] = useState<BookModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 5;
  const [totalAmountOfBooks, setTotalAmountOfBooks] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const paginate = (pageNum: number) => setCurrentPage(pageNum);

  const [bookDeleted, setBookDeleted] = useState(false);
  
  useEffect(() => {
    
    const fetchBooks = async () => {
      const url: string = `${process.env.REACT_APP_API}/books?page=${currentPage - 1}&size=${booksPerPage}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Something went wrong");
      }

      const responseJson = await response.json();
      setTotalAmountOfBooks(responseJson.page.totalElements);
      setTotalPages(responseJson.page.totalPages);

      const responseData = await responseJson._embedded.books;
      setBooks(responseData);
      setIsLoading(false);
    }

    fetchBooks().catch((error: any) => {
      setIsLoading(false);
      setHttpError(error.message);
    });

  }, [currentPage, bookDeleted]);
  
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

  const indexOfLastBook: number = currentPage * booksPerPage;
  const indexOfFirstBook: number = indexOfLastBook - booksPerPage;
  let lastItem = booksPerPage * currentPage <= totalAmountOfBooks
    ? booksPerPage * currentPage : totalAmountOfBooks;

    const book = new BookModel("", "", "", 1, "", "");
  return (
    <div className="container mt-5">
      {totalAmountOfBooks ?
        <>
          <h3 className="mt-3">Number of results</h3>
          <p>{indexOfFirstBook+1} to {lastItem} of {totalAmountOfBooks}</p>
          {books.map(book => <ChangeQuantityBook book={book} setBookDeleted={setBookDeleted} key={book.id} />)}
          {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />}
        </>
        :
        <h5>Add a book before changing quantity</h5>
      }
    </div>
  );
}