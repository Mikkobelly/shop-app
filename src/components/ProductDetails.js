import React from 'react'
import '../App.css';
import { useParams } from "react-router";


const ProductDetails = ({ products, onAddClick, onSelectChange, selectedItem }) => {
    let { productTitle } = useParams();
    productTitle = decodeURIComponent(productTitle)
    const product = products.find(item => item.node.title === productTitle);
    const { title, description, featuredImage, variants } = product.node;

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
                <select name="variants" id="variants-select" onChange={(e) => onSelectChange(e, product)}>
                    <option value="">--Please choose one--</option>
                    {variants.edges.map((item, i) => (
                        <option key={i} value={item.node.id}>{item.node.title}</option>
                    ))}
                </select>
                <button
                    className="details__add"
                    onClick={() => { onAddClick(product, selectedItem ? selectedItem.node.id : null); }}
                >Add to Cart
                </button>
            </div>
        </div>
    )
}

export default ProductDetails
