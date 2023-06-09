import '../App.css';
import { createContext, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { queryAll, queryFeatured, queryWomen, queryMen } from './Data';
import NavigationBar from './NavigationBar';
import Footer from './Footer';
import Main from './Main';
import Home from './Home';
import ProductDetails from './ProductDetails';
import Basket from './Basket';

export const AppContext = createContext();

function App() {
  // These states are kept here so that useEffect runs a callback for fetching data 
  // when users visit the homepage and updates the states
  const [products, setProducts] = useState([]);
  const [endCursor, setEndCursor] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(null);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [womenProducts, setWomenProducts] = useState([]);
  const [menProducts, setMenProducts] = useState([]);

  const [basketItems, setBasketItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);

  /* eslint-disable */
  // Load products from MockShop API when opening the app
  useEffect(() => {
    // Get All products
    const getAll = async () => {
      try {
        const query = encodeURIComponent(`first: 12, after: ${endCursor}`)
        const res = await fetch(`https://mock.shop/api?query={products(${query}){${encodeURIComponent(queryAll)}}}`);

        if (!res.ok) {
          throw new Error(`HTTP error occured when fetching all products. status: ${res.status}`)
        }

        const dataAll = await res.json();
        const { edges, pageInfo } = dataAll.data.products;
        setProducts(edges);
        setEndCursor(`"${pageInfo.endCursor}"`);
        setHasNextPage(pageInfo.hasNextPage);

      } catch (e) {
        console.log(e)
      }
    }

    // Get products in Featured Collection
    const getFeatured = async () => {
      try {
        const res = await fetch(`https://mock.shop/api?query=${encodeURIComponent(queryFeatured)}`);

        if (!res.ok) {
          throw new Error(`HTTP error occured when fetching featured products. status: ${res.status}`)
        }

        const resFeatured = await res.json();
        const { edges } = resFeatured.data.collection.products;
        setFeaturedProducts(edges)
      } catch (e) {
        console.log(e)
      }
    }

    // Get products in Women's Collection
    const getWomen = async () => {
      try {
        const res = await fetch(`https://mock.shop/api?query=${encodeURIComponent(queryWomen)}`);

        if (!res.ok) {
          throw new Error(`HTTP error occured when fetching women products. status: ${res.status}`)
        }

        const resWomen = await res.json();
        const { edges } = resWomen.data.collection.products;
        setWomenProducts(edges)
      } catch (e) {
        console.log(e)
      }
    }

    // Get products in Men's Collection
    const getMen = async () => {
      try {
        const res = await fetch(`https://mock.shop/api?query=${encodeURIComponent(queryMen)}`);
        const resMen = await res.json();

        if (!res.ok) {
          throw new Error(`HTTP occured when fetching men products. status: ${res.status}`)
        }

        const { edges } = resMen.data.collection.products;
        setMenProducts(edges)
      } catch (e) {
        console.log(e)
      }
    }

    getAll();
    getFeatured();
    getWomen();
    getMen();
  }, [])
  /* eslint-enable */


  // Run when Load More is clicked
  const handleLoadMore = async () => {
    try {
      const query = encodeURIComponent(`first: 12, after: ${endCursor}`)
      const res = await fetch(`https://mock.shop/api?query={products(${query}){${encodeURIComponent(queryAll)}}}`);

      if (!res.ok) {
        throw new Error(`HTTP error occured when fetching products. status: ${res.status}`)
      }

      const dataAll = await res.json();
      const { edges, pageInfo } = dataAll.data.products;
      setProducts((prev) => [...prev, ...edges])
      setEndCursor(`"${pageInfo.endCursor}"`);
      setHasNextPage(pageInfo.hasNextPage);
    } catch (e) {
      console.log(e)
    }
  }

  // Run when item added to the basket
  // This fn is defined here as it's needed in more than one component and it's passed as context
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
    <BrowserRouter>
      <NavigationBar />

      <AppContext.Provider
        value={{ basketItems, totalPrice, handleAdd, handleRemove, selectedItem, setSelectedItem }}
      >
        <div className="content">
          <Routes>
            <Route
              path="/"
              element={
                <Home />
              }
            />

            <Route
              path="/products"
              element={
                <>
                  <Main products={products} title="All Products" />
                  {hasNextPage !== false ? <div className="load-box"><button className="load" onClick={handleLoadMore}>Load More</button></div>
                    : <></>
                  }
                </>
              }
            />

            <Route
              path="/products/featured"
              element={
                <Main products={featuredProducts} title="Featured" />
              }
            />

            <Route
              path="/products/women"
              element={
                <Main products={womenProducts} title="Women" />
              }
            />

            <Route
              path="/products/men"
              element={
                <Main products={menProducts} title="Men" />
              }
            />

            <Route
              path="/products/:productTitle"
              element={
                <>
                  <div className="page__flex">
                    <div className="flex--left">
                      <ProductDetails products={[...new Set([...products, ...featuredProducts, ...womenProducts, ...menProducts])]} />
                    </div>
                    <div className="flex--right">
                      <Basket />
                    </div>
                  </div>
                </>
              }
            />
          </Routes>
        </div>
      </AppContext.Provider>

      <Footer />
    </BrowserRouter>
  );
}

export default App;