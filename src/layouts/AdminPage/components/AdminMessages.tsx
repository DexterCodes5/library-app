import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import { MessageModel } from "../../../model/MessageModel";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Pagination } from "../../Utils/Pagination";
import { AdminMessage } from "./AdminMessage";

export const AdminMessages = () => {
  // Normal Loading Pieces
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState("");

  // Messages endpoint State
  const [messages, setMessages] = useState<MessageModel[]>([]);
  const [respondedMessage, setRespondedMessage] = useState(false);

  // Pagination
  const messagesPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const paginate = (pageNum: number) => setCurrentPage(pageNum);

  useEffect(() => {
    const fetchMessages = async () => {
      const url = `${process.env.REACT_APP_API}/messages/search/findByClosed?closed=${false}&page=${currentPage-1}&size=${messagesPerPage}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Something went wrong. Status: ${response.status}`);
      }
      const responseJson = await response.json();
      setMessages(responseJson._embedded.messages);
      setTotalPages(responseJson.page.totalPages);
      setIsLoading(false);
    };

    fetchMessages().catch((err: Error) => {
      setIsLoading(false);
      setHttpError(err.message);
    });

    window.scrollTo(0, 0);
  }, [currentPage, respondedMessage]);

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
    <div className="mt-3">
      {messages.length > 0 ?
        <>
          <h5>Pending Q/A: </h5>
          {messages.map(message => 
            <AdminMessage message={message} setRespondedMessage={setRespondedMessage} key={message.id}/>
          )}
        </>
        :
        <h5>No pending Q/A</h5>
      }
      {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />}
    </div>
  );
}