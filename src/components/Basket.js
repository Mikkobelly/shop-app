import { useContext } from "react";
import { AppContext } from "./App";

function Basket() {
    const { basketItems, setBasketItems, totalPrice, setTotalPrice } = useContext(AppContext);

    // Run when item added to the basket
    const handleAdd = (item, variantId) => {
        // Return if no valid item is passed
        if (!item || !variantId || variantId === 'default') {
            alert('Please choose one from the option.');
            return;
        }

        setBasketItems((prev) => {
            // Check if the selected item is already added to the basket
            const foundItem = prev.find(el => el.varId === variantId);

            if (foundItem) {
                foundItem.quantity++;
                foundItem.totalVal += foundItem.price;
                return prev;
            } else {
                const { title, variants } = item.node;
                let index;
                variants.edges.forEach((el, i) => {
                    if (el.node.id === variantId) {
                        index = i;
                    }
                })

                const entry = {
                    varId: variants.edges[index].node.id,
                    title,
                    varTitle: variants.edges[index].node.title,
                    image: variants.edges[index].node.image.url,
                    price: Number(variants.edges[index].node.price.amount),
                    currencyCode: variants.edges[index].node.price.currencyCode,
                    quantity: 1,
                    totalVal: Number(variants.edges[index].node.price.amount)
                }

                return basketItems.length === 0 ? [entry] : [...prev, entry];
            }
        })

        // Update total price in basket
        setTotalPrice((prev) => {
            return prev + item.price || prev + Number(item.node.variants.edges[0].node.price.amount);
        });
    }

    // Run when item removed from the basket
    const handleRemove = (item, variantId) => {
        setBasketItems((prev) => {
            const foundItem = prev.find(el => el.varId === variantId);
            foundItem.quantity--;
            foundItem.totalVal -= foundItem.price;
            return foundItem.quantity < 1 ? prev.filter(el => el !== foundItem) : prev;
        })

        setTotalPrice((prev) => {
            return prev - item.price;
        });
    }


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