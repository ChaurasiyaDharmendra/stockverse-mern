import React from "react";

function Footer() {
  return (
    <footer style={{ backgroundColor: "#0f172a", color: "#cbd5e1", padding: "40px 0" }}>
      <div className="container">

        {/* TOP ROW */}
        <div className="row mt-0 align-items-start">

          {/* LOGO */}
          <div className="col">
            <img
              src="media/images/logo.svg"
              alt="Zerodha logo"
              style={{ width: "50%" }}
            />
            <p className="mt-2">
              &copy; 2010 - 2024, Not Zerodha Broking Ltd. <br />
              All rights reserved.
            </p>
          </div>

          {/* COMPANY */}
          <div className="col">
            <p className="fw-bold mb-2">Company</p>
            <a href="#/">About</a>
            <a href="#/">Products</a>
            <a href="#/">Pricing</a>
            <a href="#/">Referral programme</a>
            <a href="#/">Careers</a>
            <a href="#/">Zerodha.tech</a>
            <a href="#/">Press & media</a>
            <a href="#/">Zerodha cares (CSR)</a>
          </div>

          {/* SUPPORT */}
          <div className="col">
            <p className="fw-bold mb-2">Support</p>
            <a href="#/">Contact</a>
            <a href="#/">Support portal</a>
            <a href="#/">Z-Connect blog</a>
            <a href="#/">List of charges</a>
            <a href="#/">Downloads & resources</a>
          </div>

          {/* ACCOUNT */}
          <div className="col">
            <p className="fw-bold mb-2">Account</p>
            <a href="#/">Open an account</a>
            <a href="#/">Fund transfer</a>
            <a href="#/">60 day challenge</a>
          </div>

        </div>

        {/* DISCLAIMER TEXT */}
        <div className="mt-5 text-muted" style={{ fontSize: "14px" }}>
          <p>
            Zerodha Broking Ltd.: Member of NSE & BSE – SEBI Registration no.:
            INZ000031633 CDSL: Depository services through Zerodha Securities
            Pvt. Ltd. – SEBI Registration no.: IN-DP-100-2015 Commodity Trading
            through Zerodha Commodities Pvt. Ltd. MCX: 46025 – SEBI Registration
            no.: INZ000038238 Registered Address: Zerodha Broking Ltd.,
            #153/154, 4th Cross, Dollars Colony, Opp. Clarence Public School,
            J.P Nagar 4th Phase, Bengaluru - 560078, Karnataka, India.
          </p>

          <p>
            Investments in securities market are subject to market risks; read
            all the related documents carefully before investing.
          </p>

          <p>
            Prevent unauthorised transactions in your account. Update your
            mobile numbers/email IDs with your stock brokers.
          </p>
        </div>

        {/* SOCIAL ICONS (BOTTOM) */}
        <div className="text-center mt-4 mb-3">
          <i className="fa fa-instagram mx-2"></i>
          <i className="fa fa-linkedin mx-2"></i>
          <i className="fa fa-twitter mx-2"></i>
        </div>

        {/* LINE BELOW ICONS */}
        <hr style={{ borderColor: "#334155", opacity: 0.5 }} />

      </div>
    </footer>
  );
}

export default Footer;