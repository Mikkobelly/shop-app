import React from 'react'
import '../App.css';
import { Link } from "react-router-dom";

const ProductCard = ({ product, onAddClick, countClick }) => {
    const { id, title, featuredImage, variants } = product.node;

    return (
        <div className="card">
            <div>
                <img src={featuredImage.url} alt={title} width="200px"></img>
            </div>
            <Link to={`/products/${encodeURIComponent(title)}`}>
                <button className="card__title-btn">
                    <p className="card__title">{title}</p>
                </button>
            </Link>
            <p className="card__price">${variants.edges[0].node.price.amount}</p>
            <button className="card__add-btn" onClick={() => { onAddClick(product); countClick(); }}>Add to Cart</button>

        </div>
    )
}

export default ProductCard;
