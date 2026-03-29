import React, { useState } from "react";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // input change handle
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://stockverse-mern.onrender.com"/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      alert(data.message);

      // 🔥 redirect to dashboard
      window.location.href = "https://stockverse-mern.onrender.com";

    } catch (err) {
      console.log(err);
      alert("Error aa gaya ❌");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "80vh",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "300px",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
        }}
      >
        <h2 style={{ textAlign: "center" }}>Signup</h2>

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
          placeholder="Email"
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

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
