import { useOktaAuth } from "@okta/okta-react";
import { useState } from "react";
import { MessageModel } from "../../../model/MessageModel";

export const PostNewMessage = () => {
  const { authState } = useOktaAuth();
  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [displayWarning, setDisplayWarning] = useState(false);
  const [displaySuccess, setDisplaySuccess] = useState(false);

  const sumbitQustion = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();

    const userEmail = authState?.accessToken?.claims.sub;
    if (!userEmail) return;

    if (title === "" || question === "") {
      setDisplayWarning(true);
      setDisplaySuccess(false)
      return;
    }
    const url = `${process.env.REACT_APP_API}/messages/secure`;
    const message = new MessageModel(userEmail, title, question);
    const requestOptions = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(message)
    };
    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      throw new Error("Something went wrong");
    }

    setTitle("");
    setQuestion("");
    setDisplayWarning(false)
    setDisplaySuccess(true);
  }

  return (
    <div className="card mt-3">
      {displaySuccess &&
        <div className="alert alert-success">
          Question added successfully
        </div>
      }
      <div className="card-header">
        Ask question to Luv 2 Read Admin
      </div>
      <div className="card-body">
        <form>
          {displayWarning &&
            <div className="alert alert-danger">
              All fields must be filled out
            </div>
          }
          <div className="mb-3">
            <label className="form-label">
              Title
            </label>
            <input type="text" className="form-control" placeholder="Title" 
            onChange={e => setTitle(e.target.value)} value={title}/>
          </div>
          <div className="mb-3">
            <label className="form-label">
              Question
            </label>
            <textarea className="form-control" rows={3} onChange={e => setQuestion(e.target.value)} value={question}></textarea>
          </div>
          <div className="mt-3">
            <button type="button" className="btn btn-primary" onClick={sumbitQustion}>Submit Question</button>
          </div>
        </form>
      </div>
    </div>
  );
}