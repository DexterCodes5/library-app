import { BookModel } from "../../../model/BookModel";

export const ReturnBook: React.FC <{
  book: BookModel
}> = (props) => {
  
  return (
    <div className='col-xs-6 col-sm-6 col-md-4 col-lg-3 mb-3'>
      <div className='text-center'>
        {props.book.img ? 
        <img
          src={props.book.img}
          width='151'
          height='233'
          alt="book"
        />
        :
        <img
          src={require("../../../Images/BooksImages/book-luv2code-1000.png")}
          width='151'
          height='233'
          alt="book"
        />  
        }
        
        <h6 className='mt-2'>{props.book.title}</h6>
        <p>Luv2Code</p>
        <a className='btn main-color text-white' href='#'>Reserve</a>
      </div>
    </div>
  );
};