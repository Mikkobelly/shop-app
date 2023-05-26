import React from 'react'
import '../App.css';


const ProductCard = ({ product, onProductClick, onAddClick, countClick }) => {
    const { title, featuredImage, variants } = product.node;

    return (
        <div className="card">
            <div>
                <img src={featuredImage.url} alt={title} width="200px"></img>
            </div>
            <button className="card__title-btn" onClick={() => onProductClick(product)}>
                <p className="card__title">{title}</p>
            </button>
            <p className="card__price">${variants.edges[0].node.price.amount}</p>
            <button className="card__add-btn" onClick={() => { onAddClick(product); countClick(); }}>Add to Cart</button>

        </div>
    )
}

export default ProductCard;
