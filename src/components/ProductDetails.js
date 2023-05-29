import React from 'react'
import '../App.css';
import { Link } from "react-router-dom";
import { useParams } from "react-router";


const ProductDetails = ({ products, onAddClick }) => {
    let { productTitle } = useParams();
    productTitle = decodeURIComponent(productTitle)
    const product = products.find(item => item.node.title === productTitle);
    const { title, description, featuredImage, variants } = product.node;

    const getVarId = () => {
        const selectBox = document.querySelector('#variants-select');
        const selectedOption = selectBox.options[selectBox.selectedIndex].value;
        if (!selectedOption) {
            alert('Please choose one from the option.');
            return null;
        }
        return selectedOption;
    }

    return (
        <div className="details">
            <h2 className="details__title">{title}</h2>
            <div>
                <img src={featuredImage.url} alt={title} width='200px'></img>
            </div>
            <p className="description">{description}</p>
            <p className="details__price">${variants.edges[0].node.price.amount} {variants.edges[0].node.price.currencyCode}</p>
            <label htmlFor="variants-select">Options:</label>
            <select name="variants" id="variants-select">
                <option value="">--Please choose one--</option>
                {variants.edges.map((item, i) => (
                    <option key={i} value={item.node.id}>{item.node.title}</option>
                ))}
            </select>
            <div className="details__btns">
                <button
                    className="details__add-btn"
                    onClick={() => { onAddClick(product, getVarId()); }}
                >Add to Cart
                </button>
                <Link to={`/products`}>
                    <button className="details__back-btn">Back</button>
                </Link>
            </div>
        </div>
    )
}

export default ProductDetails
