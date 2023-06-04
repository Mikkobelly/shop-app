import { useContext } from "react";
import { AppContext } from "./App";

function Basket() {
    const { basketItems, totalPrice, handleAdd, handleRemove } = useContext(AppContext);
    return (
        <ul className="basket">
            <h3 className="basket__title">Basket</h3>
            {basketItems.map((item, i) => (
                <li key={i}>
                    <img src={item.image} alt={item.title} width="35px"></img>
                    <p>{item.title}</p>
                    <p>{item.varTitle}</p>
                    <div className="basket__quantity">
                        <span className="basket__label">quantity: </span>{item.quantity}
                        <div className="basket__btns">
                            <button onClick={() => { handleRemove(item, item.varId); }}>-</button>
                            <button onClick={() => { handleAdd(item, item.varId); }}>+</button>
                        </div>
                    </div>
                    <p><span className="basket__label">value: </span>${item.totalVal}</p>
                </li>
            ))}
            <p className="basket__total">
                <span className="basket__label">Total Value: </span>${totalPrice}
            </p>
            <div className="basket__checkout">
                <button className="basket__checkout-btn">Checkout</button>
            </div>
        </ul>
    )
}

export default Basket