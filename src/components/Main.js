import ProductCard from "./ProductCard";
import Basket from "./Basket";

function Main({ products, title }) {
    return (
        <>
            <h1 className="page__head">{title}</h1>
            <div className="page__flex">
                <div className="flex--left">
                    <div className="card__grid">
                        {products.map((item, i) => (
                            <ProductCard
                                key={i}
                                product={item}
                            />))}
                    </div>
                </div>
                <div className="flex--right">
                    <Basket />
                </div>
            </div>
        </>
    )
}

export default Main
