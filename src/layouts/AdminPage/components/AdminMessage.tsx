import { useState } from "react";
import { MessageModel } from "../../../model/MessageModel";
import { useOktaAuth } from "@okta/okta-react";
import { AdminRequestModel } from "../../../model/AdminRequestModel";

export const AdminMessage: React.FC<{
  message: MessageModel, setRespondedMessage: Function
}> = (props) => {
  const {authState} = useOktaAuth();
  const [displayWarning, setDisplayWarning] = useState(false);
  const [messageResponse, setMessageResponse] = useState("");

  const submitResponse = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (messageResponse.length === 0) {
      setDisplayWarning(true);
      return;
    }

    const url = `${process.env.REACT_APP_API}/messages/secure/admin`;
    const adminRequestModel = new AdminRequestModel(props.message.id!, messageResponse);
    const requestOptions = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(adminRequestModel)
    };

    const response = await fetch(url, requestOptions);
    props.setRespondedMessage((prevRespondedMessage: boolean) => !prevRespondedMessage);
  };

  return (
    <div className="card mb-2 shadow p-3 bg-body rounded">
      <h5>Case #{props.message.id}: {props.message.title}</h5>
      <h6>{props.message.userEmail}</h6>
      <p>{props.message.question}</p>
      <hr />
      <h5>Response: </h5>
      <form>
        {displayWarning && 
          <div className="alert alert-danger">
            All fields must be filled out.
          </div>
        }
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea className="form-control" rows={3} onChange={e => setMessageResponse(e.target.value)} value={messageResponse}></textarea>
        </div>
        <div>
          <button className="btn btn-primary mt-3" onClick={submitResponse}>
            Submit Response
          </button>
        </div>
      </form>
    </div>
  );
}