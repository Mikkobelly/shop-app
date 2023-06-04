import { Link } from "react-router-dom";
const ProductCard = ({ product }) => {
    const { title, featuredImage, variants } = product.node;

    return (
        <Link to={`/products/${encodeURIComponent(title)}`}>
            <div className="card">
                <div className="card__img-box">
                    <img src={featuredImage.url} alt={title}></img>
                </div>
                <p className="card__title">{title}</p>
                <p className="card__price">${variants.edges[0].node.price.amount}</p>
            </div>
        </Link>
    )
}

export default ProductCard;