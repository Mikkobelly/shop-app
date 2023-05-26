// import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductCard from './ProductCard';
import ProductDetails from './ProductDetails';
import Basket from './Basket';

function App() {
  const [products, setProducts] = useState([]);
  const [basketItems, setBasketItems] = useState([]);
  const [clickCount, setClickCount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  // Load products from MockShop API
  useEffect(() => {
    async function fetchData() {
      const request = await fetch('https://mock.shop/api?query={products(first:%2020){edges%20{node%20{id%20title%20description%20featuredImage%20{id%20url}%20variants(first:%203){edges%20{node%20{price%20{amount%20currencyCode}}}}}}}}')
      const response = await request.json();
      const data = response.data.products.edges;
      console.log(data);
      setProducts(data);
    }
    fetchData();
  }, [])

  // Keep updating item's quantity in basket
  useEffect(() => {
    setBasketItems(basketItems);
    setTotalPrice(totalPrice);
  }, [clickCount])

  // Run when item added to the basket
  const handleAdd = (item) => {
    setBasketItems((prev) => {
      const foundItem = prev.find(el => el.node.title === item.node.title); // Check if the selected item is already added to the basket

      if (foundItem) {
        foundItem.quantity++;
        foundItem.totalVal += Number(foundItem.node.variants.edges[0].node.price.amount);
        return prev;
      } else {
        item.quantity = 1;
        item.totalVal = Number(item.node.variants.edges[0].node.price.amount);
        return basketItems.length === 0 ? [item] : [...prev, item];
      }
    })

    setTotalPrice((prev) => {
      return prev + Number(item.node.variants.edges[0].node.price.amount);
    });
  }

  // Run when item removed from the basket
  const handleRemove = (item) => {
    setBasketItems((prev) => {
      const foundItem = prev.find(el => el.node.title === item.node.title);
      foundItem.quantity--;
      foundItem.totalVal -= Number(foundItem.node.variants.edges[0].node.price.amount);
      return foundItem.quantity < 1 ? prev.filter(el => el !== foundItem) : prev;
    })

    setTotalPrice((prev) => {
      return prev - Number(item.node.variants.edges[0].node.price.amount);
    });
  }


  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              <><p>Home page</p></>
            }
          />

          <Route
            path="/products"
            element={
              <>
                <div className="flex--left">
                  <div className="card__grid">
                    {products.map((item, i) => (
                      <ProductCard
                        key={i}
                        product={item}
                        onAddClick={handleAdd}
                        countClick={() => setClickCount(clickCount + 1)}
                      />))}
                  </div>
                </div>
                <div className="flex--right">
                  <Basket
                    basketItems={basketItems}
                    totalPrice={totalPrice}
                    onAddClick={handleAdd}
                    onRemoveClick={handleRemove}
                    countClick={() => setClickCount(clickCount + 1)}
                  />
                </div>
              </>
            }
          />

          <Route
            path="/products/:productTitle"
            element={
              <>
                <div className="flex--left">
                  <ProductDetails
                    products={products}
                    onAddClick={handleAdd}
                    countClick={() => setClickCount(clickCount + 1)}
                  />
                </div>
                <div className="flex--right">
                  <Basket
                    basketItems={basketItems}
                    totalPrice={totalPrice}
                    onAddClick={handleAdd}
                    onRemoveClick={handleRemove}
                    countClick={() => setClickCount(clickCount + 1)}
                  />
                </div>
              </>
            }
          />

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
