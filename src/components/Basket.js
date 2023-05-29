import React from 'react'
import '../App.css'

// const entry = {
//     varId: variants.edges[index].node.id,
//     title,
//     image: variants.edges[index].node.image.url,
//     price: Number(variants.edges[index].node.price.amount),
//     currencyCode: variants.edges[index].node.price.currencyCode,
//     quantity: 1,
//     totalVal: Number(variants.edges[index].node.price.amount)
//   }

export default function Basket({ basketItems, totalPrice, onAddClick, onRemoveClick, }) {
    return (
        <ul className="basket">
            <h3 className="basket__title">Basket</h3>
            {basketItems.map((item, i) => (
                <li key={i}>
                    <img src={item.image} alt={item.title} width="35px"></img>
                    <p>{item.title}</p>
                    <p>{item.varTitle}</p>
                    <div>
                        quantity: <span>{item.quantity}</span>
                        <div className="basket__btns">
                            <button onClick={() => { onAddClick(item, item.varId); }}>+</button>
                            <button onClick={() => { onRemoveClick(item, item.varId); }}>-</button>
                        </div>
                    </div>
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
