import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import { useState } from "react";

const Orders = () => {

  const [allOrders , setAllOrders] = useState([]);
  
  useEffect(() => {
    const fetchOrders = () => {
      axios.get("https://stockverse-mern.onrender.com/getOrders")
        .then((res) => {
          setAllOrders(res.data);
        })
        .catch((err) => console.error("Error fetching orders:", err));
    };

    fetchOrders();
    // Poll for new orders every 1 second
    const interval = setInterval(fetchOrders, 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="orders">
        <h3 className="title">Orders ({allOrders.length})</h3>
      <div className="order-table">
       <table>
        <tr>
          <th>Name</th>
          <th>Price</th>
          <th>Quantity</th>
          <th>Mode</th>
        </tr>

        {allOrders.map((item,index)=>{
          return(
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.price}</td>
              <td>{item.qty}</td>
              <td className={item.mode==="BUY" ? "profit" : "loss" }><h3>{item.mode}</h3></td>
            </tr>
          )
        })}
       </table>

        
      
       {allOrders.length===0 && <Link to={"/"} className="btn">
          Get started
        </Link>} 
      </div>
    </div>
  );
};

export default Orders;