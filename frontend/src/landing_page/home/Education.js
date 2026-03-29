import React from "react";

function Education() {
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-6">
          <img src="media/images/education.svg" style={{ width: "70%" }} alt="Market education illustration" />
        </div>
        <div className="col-6">
          <h1 className="mb-3 fs-2">Free and open market education</h1>
          <p>
            Varsity, the largest online stock market education book in the world
            covering everything from the basics to advanced trading.
          </p>
          <button style={{ background: "none", border: "none", padding: 0, cursor: "pointer", textDecoration: "none", color: "inherit" }}>
            Versity <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
          </button>
          <p className="mt-5">
            TradingQ&A, the most active trading and investment community in
            India for all your market related queries.
          </p>
          <button style={{ background: "none", border: "none", padding: 0, cursor: "pointer", textDecoration: "none", color: "inherit" }}>
            TradingQ&A <i className="fa fa-long-arrow-right" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Education;
