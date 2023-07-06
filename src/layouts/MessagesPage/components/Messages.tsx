import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { MessageModel } from "../../../model/MessageModel";
import { Pagination } from "../../Utils/Pagination";

export const Messages = () => {
  const { authState } = useOktaAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState(null);

  // Messages
  const [messages, setMessages] = useState<MessageModel[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const messagesPerPage = 5;
  const [totalPages, setTotalPages] = useState(0);
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);


  useEffect(() => {
    const fetchMessages = async () => {
      if (!authState?.isAuthenticated) return;

      const userEmail = authState?.accessToken?.claims.sub;
      const url = `${process.env.REACT_APP_API}/messages/search/findByUserEmail?userEmail=${userEmail}&page=${currentPage-1}&size=${messagesPerPage}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Something went wrong. Status: ${response.status}`)
      }
      const responseJson = await response.json();

      setMessages(responseJson._embedded.messages);
      setTotalPages(responseJson.page.totalPages);
      setIsLoading(false);
    };

    fetchMessages().catch((err) => {
      setIsLoading(false);
      setHttpError(err.message);
    });

    window.scrollTo(0, 0);
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
      {messages.length > 0 ?
        <>
          <h5>Current Q/A: </h5>
          {messages.map(message => 
            <div className="card mt-2 shadow p-3 bg-body rounded" key={message.id}>
              <h5>Case #{message.id}: {message.title}</h5>
              <h6>{message.userEmail}</h6>
              <p>{message.question}</p>
              <hr />
              <div>
                <h5>Response: </h5>
                {message.response ? 
                  <>
                    <h6>{message.adminEmail} (admin)</h6>
                    <p>{message.response}</p>
                  </>  
                  :
                  <p>
                    <i>
                      Pending response from administration, please be patient.
                    </i>
                  </p>
              }
              </div>
            </div>
          )}
        </>
        :
        <h5>All questions you submit will be show here</h5>   
      }
      {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />}
    </div>
  );
} 