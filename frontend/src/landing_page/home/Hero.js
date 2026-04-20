
import React from "react";

function Hero() {
  return (
    <div className="hero-section">
      <div className="container p-5 mb-5">
        <div className="row text-center">
        <img
         src="media/images/homeHero.png"
         alt="Home page hero banner"
         className="mb-3"
        />

          <h1 className="mt-5">Invest in everything</h1>

          <p>
            Online platform to invest in stocks, derivatives, mutual funds, and
            more
          </p>

          <button
            className="p-2 btn btn-primary fs-5 mb-5"
            style={{ width: "20%", margin: "0 auto" }}
          >
            Signup Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default Hero;