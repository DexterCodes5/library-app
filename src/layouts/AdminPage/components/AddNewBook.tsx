import { useRef, useState } from "react";
import { BookModel } from "../../../model/BookModel";
import { useOktaAuth } from "@okta/okta-react";

export const AddNewBook = () => {
  const [newBook, setNewBook] = useState<BookModel>(new BookModel("", "", "", 1, "Category", ""));

  const [displayWarning, setDisplayWarning] = useState(false);
  const [displaySuccess, setDisplaySuccess] = useState(false);

  const {authState} = useOktaAuth();
  const imageInput = useRef<HTMLInputElement>(null);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    const {name, value} = e.target;
    setNewBook({...newBook, [name]: value});
    // setNewBook(prevNewBook => ({...prevNewBook, [name]: value}));
  };

  const handleCategory = (categoryValue: string) => {
    setNewBook({...newBook, category: categoryValue})
  };

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const imageBase64 = await convertImageToBase64(e.target.files![0]);
    setNewBook({ ...newBook, img: imageBase64 });
  }

  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();

      fileReader.addEventListener("load", (e) => {
        resolve(fileReader.result as string);
      });

      fileReader.addEventListener("error", (err) => {
        reject(err);
      });

      fileReader.readAsDataURL(file);
    });
  };

  const addBook = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (!newBook.title || !newBook.author || !newBook.category || !newBook.copies || !newBook.img) {
      setDisplayWarning(true);
      return;
    }

    newBook.copiesAvailable = newBook.copies; 
    const url = `${process.env.REACT_APP_API}/books/secure/admin`;
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newBook)
    };
    const response = fetch(url, requestOptions);
    setDisplaySuccess(true);
    setNewBook(new BookModel("", "", "", 1, "Category", ""));
    imageInput.current!.value = "";
  }

  return (
    <div className="container mt-5 mb-5">
      {displaySuccess &&
        <div className="alert alert-success">
          Book Added Successfully
        </div>
      }
      {displayWarning &&
        <div className="alert alert-danger">
          All fields myst be filled out
        </div>
      }
      <div className="card">
        <div className="card-header">
          Add a new book
        </div>
        <div className="card-body">
          <form>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Title</label>
                <input type="text" className="form-control" name="title" required onChange={handleChange} value={newBook.title} />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label">Author</label>
                <input type="text" className="form-control" name="author" required onChange={handleChange} value={newBook.author} />
              </div>
              <div className="col-md-3 mb-3">
                <label className="form-label">Category</label>
                <button className="form-control btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                  {newBook.category}
                </button>
                <ul className="dropdown-menu user-select-none" aria-labelledby="dropdownMenuButton1">
                  <li><a className="dropdown-item" href="#" onClick={() => handleCategory("FE")}>Front End</a></li>
                  <li><a className="dropdown-item" href="#" onClick={() => handleCategory("BE")}>Back End</a></li>
                  <li><a className="dropdown-item" href="#" onClick={() => handleCategory("Data")}>Data</a></li>
                  <li><a className="dropdown-item" href="#" onClick={() => handleCategory("DevOps")}>DevOps</a></li>
                </ul>
              </div>
            </div>
            <div className="col-md-12 mb-3">
              <label className="form-label">Description</label>
              <textarea className="form-control" rows={3} name="description" onChange={handleChange} value={newBook.description}></textarea>
            </div>
            <div className="col-md-3 mb-3">
              <label className="form-label">Copies</label>
              <input type="number" min={1} className="form-control" name="copies" required onChange={handleChange} value={newBook.copies} />
            </div>
            <div className="col-md-3 mb-3">
              <label className="form-label">Image</label>
              <input type="file" className="form-control" name="img" required onChange={handleImage} ref={imageInput} />
            </div>
            <div>
              <button className="btn btn-primary mt-3" onClick={addBook}>Add Book</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}