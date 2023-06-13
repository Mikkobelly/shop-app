import { useParams } from "react-router";
import { useContext } from "react";
import { AppContext } from "./App";

const ProductDetails = ({ products }) => {
    const { basketItems, setBasketItems, setTotalPrice, selectedItem, setSelectedItem } = useContext(AppContext);

    // Find which item to show its details
    const productTitle = decodeURIComponent(useParams().productTitle)
    const product = products.find(item => item.node.title === productTitle);
    const { title, description, featuredImage, variants } = product.node;

    const selectOptions = document.querySelectorAll('#variants-select option');

    // Run when select input is changed to display the according image
    const handleChange = (e, item) => {
        const foundVariant = item.node.variants.edges.find((item) => {
            return item.node.id === e.target.value
        });
        setSelectedItem(foundVariant);
    }

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

        // Reset selected state after adding the item to basket 
        setSelectedItem(null);

        // Set the selected value back to the default option
        for (let i = 0; i < selectOptions.length; i++) {
            selectOptions[i].selected = selectOptions[i].defaultSelected;
        }
    }


    return (
        <div className="details">
            <div className="details__img-box">
                <img src={selectedItem ? selectedItem.node.image.url : featuredImage.url} alt={title}></img>
            </div>
            <div className="details__info">
                <p className="details__title">{title}</p>
                <p className="details__price">${variants.edges[0].node.price.amount} {variants.edges[0].node.price.currencyCode}</p>
                <p className="details__description">{description}</p>
                <label htmlFor="variants-select">Options:</label>
                <select name="variants" id="variants-select" defaultValue={'default'} onChange={(e) => handleChange(e, product)}>
                    <option value="default">--Please choose one--</option>
                    {variants.edges.map((item, i) => (
                        <option key={i} value={item.node.id}>{item.node.title}</option>
                    ))}
                </select>
                <button
                    className="details__add"
                    onClick={() => { handleAdd(product, selectedItem ? selectedItem.node.id : null); }}
                >Add to Cart
                </button>
            </div>
        </div>
    )
}

export default ProductDetails