import React,{useContext, useState} from 'react';
import axios from 'axios';
import GeneralContext from './GeneralContext';
import './BuyActionWindow.css';
import { Link } from "react-router-dom";


const SellActionWindow = ({uid})=>{
    const [stockQuantity,setStockQuantity] =useState(1);
    const [stockPrice , setStockPrice] = useState(0.0);
    const {closeSellWindow} = useContext(GeneralContext);

    const handleSellClick = () =>{
        axios.post("https://zerodhaclone-bd.onrender.com/newOrder",{
            name:uid,
            qty:stockQuantity,
            price:stockPrice,
            mode:"SELL"
        });
        closeSellWindow();
    }

    const handleCancelClick = () =>{
        closeSellWindow();
    }



    return(
        <div className="container" id="buy-window" draggable="true">
            <div className="regular-order">
                <div className="inputs">
                    <fieldset>
                        <legend>Qty</legend>
                        <input type='number'
                        name='qty'
                        id='qty'
                        onChange={(e)=>{setStockQuantity(e.target.value)}}
                        value={stockQuantity}
                        />
                    </fieldset>
                    <fieldset>
                        <legend>price</legend>
                        <input type='number'
                        name='price'
                        id='price'
                        onChange={(e)=>{setStockPrice(e.target.value)}}
                        value={stockPrice}
                        />
                    </fieldset>
                </div>
            </div>

            <div  className="buttons">
                <span>Margin required ₹140.65</span>
                <div>
                     <Link className="btn btn-danger" onClick={handleSellClick}>
                                sell
                     </Link>
                    <Link to="" className="btn btn-grey" onClick={handleCancelClick}>
                                Cancel
                       </Link>
                </div>
            </div>
        </div>
    )

}

export default SellActionWindow;