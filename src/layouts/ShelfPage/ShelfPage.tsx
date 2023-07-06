import { useState } from "react";
import { CheckoutHistory } from "./components/CheckoutHistory";
import { Loans } from "./components/Loans";

export const ShelfPage = () => {

  const [historyClicked, setHistoryClicked] = useState(false);

  return (
    <div className="container mt-3">
      <nav className="nav nav-tabs" id="nav-tab" role="tablist">
        <button className="nav-link active" id="nav-loans-tab" data-bs-toggle="tab" 
        data-bs-target="#nav-loans" role="tab" aria-controls="nav-loans" onClick={() => setHistoryClicked(false)}>
          Loans
        </button>
        <button className="nav-link" id="nav-history-tab" data-bs-toggle="tab" data-bs-target="#nav-history" role="tab" aria-controls="nav-history"
        aria-selected="false" onClick={() => setHistoryClicked(true)}>
          Your History
        </button>
      </nav>
      <div className="tab-content" id="nav-tab-content">
        <div className="tab-pane fade show active" id="nav-loans" role="tabpanel" aria-labelledby="nav-loans-tab">
          <Loans />
        </div>
        <div className="tab-pane fade" id="nav-history" role="tabpanel" aria-labelledby="nav-history-tab">
          {historyClicked && <CheckoutHistory />}
        </div>
      </div>
    </div>
  );
};