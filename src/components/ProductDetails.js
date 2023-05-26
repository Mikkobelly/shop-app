import React from 'react'
import '../App.css';

const ProductDetails = ({ product, onAddClick, countClick, onBackClick }) => {
    const { title, description, featuredImage, variants } = product.node;

    return (
        <div className="details">
            <h2 className="details__title">{title}</h2>
            <div>
                <img src={featuredImage.url} alt={title} width='200px'></img>
            </div>
            <p className="description">{description}</p>
            <p className="details__price">${variants.edges[0].node.price.amount}</p>
            <p>Currency: {variants.edges[0].node.price.currencyCode}</p>
            <div className="details__btns">
                <button className="details__add-btn" onClick={() => { onAddClick(product); countClick(); }}>Add to Cart</button>
                <button className="details__back-btn" onClick={onBackClick}>Back</button>
            </div>
        </div>
    )
}

export default ProductDetails
