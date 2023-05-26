import React from 'react'
import '../App.css'

export default function Basket({ basketItems, totalPrice, onAddClick, onRemoveClick, countClick }) {
    return (
        <ul className="basket">
            <h3 className="basket__title">Basket</h3>
            {basketItems.map((item, i) => (
                <li key={i}>
                    <img src={item.node.featuredImage.url} alt={item.node.title} width="35px"></img>
                    <p>{item.node.title}</p>
                    <p>
                        quantity: <span>{item.quantity}</span>
                        <div className="basket__btns">
                            <button onClick={() => { onAddClick(item); countClick(); }}>+</button>
                            <button onClick={() => { onRemoveClick(item); countClick(); }}>-</button>
                        </div>
                    </p>
                    <p>value: <span>${item.totalVal}</span></p>
                </li>
            ))}
            <p className="basket__total">
                Total Value: <span>${totalPrice}</span>
            </p>
            <div className="basket__checkout">
                <button className="basket__checkout-btn">Checkout</button>
            </div>
        </ul>
    )
}
