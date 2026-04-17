// import React, { useState } from "react";

// const Signup = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });

//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     setLoading(true);

//     try {
//       const res = await fetch("https://stockverse-mern.onrender.com/signup", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(formData),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         // 🔥 delay for smooth feel
//         setTimeout(() => {
//           window.location.href = "https://stockverse-mern-z6hc.vercel.app";
//         }, 1500);
//       } else {
//         alert(data.message || "Signup failed ❌");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Server error ❌");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="signup-container">
//       <form onSubmit={handleSubmit} className="signup-box">
//         <h2>Create Account 🚀</h2>

//         <input
//           type="text"
//           name="name"
//           placeholder="Full Name"
//           value={formData.name}
//           onChange={handleChange}
//           required
//         />

//         <input
//           type="email"
//           name="email"
//           placeholder="Email address"
//           value={formData.email}
//           onChange={handleChange}
//           required
//         />

//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           value={formData.password}
//           onChange={handleChange}
//           required
//         />

//         <button type="submit" disabled={loading}>
//           {loading ? "Creating account..." : "Sign Up"}
//         </button>

//         {loading && <p className="loading-text">Please wait...</p>}
//       </form>
//     </div>
//   );
// };

// export default Signup;

import React, { useState } from "react";

/* 🔥 TIMEOUT FUNCTION */
const fetchWithTimeout = (url, options, timeout = 8000) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), timeout)
    ),
  ]);
};

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await fetchWithTimeout(
        "https://stockverse-mern.onrender.com/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setTimeout(() => {
          window.location.href =
            "https://stockverse-mern-z6hc.vercel.app";
        }, 1500);
      } else {
        alert(data.message || "Signup failed ❌");
      }
    } catch (err) {
      alert("Server slow hai, please try again ⏳");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-box">
        <h2>Create Account 🚀</h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        {loading && (
          <p className="loading-text">
            Server starting... please wait ⏳
          </p>
        )}
      </form>
    </div>
  );
};

export default Signup;