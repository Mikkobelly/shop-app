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
    async function fetchProducts() {
      // Get All products
      const query = encodeURIComponent(`first: 12, after: ${endCursor}`)
      const getAll = await fetch(`https://mock.shop/api?query={products(${query}){${encodeURIComponent(queryAll)}}}`);
      const resAll = await getAll.json();
      const { edges, pageInfo } = resAll.data.products;
      setProducts(edges);
      setEndCursor(`"${pageInfo.endCursor}"`);
      setHasNextPage(pageInfo.hasNextPage);

      // Get products in Featured Collection
      const getFeatured = await fetch(`https://mock.shop/api?query=${encodeURIComponent(queryFeatured)}`);
      const resFeatured = await getFeatured.json();
      const dataFeatured = resFeatured.data.collection.products.edges;
      setFeaturedProducts(dataFeatured)

      // Get products in Women's Collection
      const getWomen = await fetch(`https://mock.shop/api?query=${encodeURIComponent(queryWomen)}`);
      const resWomen = await getWomen.json();
      const dataWomen = resWomen.data.collection.products.edges;
      setWomenProducts(dataWomen)

      // Get products in Men's Collection
      const getMen = await fetch(`https://mock.shop/api?query=${encodeURIComponent(queryMen)}`);
      const resMen = await getMen.json();
      const dataMen = resMen.data.collection.products.edges;
      setMenProducts(dataMen)
    }

    fetchProducts();
  }, [])
  /* eslint-enable */


  // Run when Load More is clicked
  const handleLoadMore = async () => {
    const query = encodeURIComponent(`first: 12, after: ${endCursor}`)
    const response = await fetch(`https://mock.shop/api?query={products(${query}){${encodeURIComponent(queryAll)}}}`);
    const resAll = await response.json();
    const { edges, pageInfo } = resAll.data.products;
    setProducts((prev) => [...prev, ...edges])
    setEndCursor(`"${pageInfo.endCursor}"`);
    setHasNextPage(pageInfo.hasNextPage);
  }

  // Run when item added to the basket
  const handleAdd = (item, variantId) => {
    // Return if no valid item is passed
    if (!item || !variantId) {
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

    // Clear the selected option after adding the item to basket 
    setSelectedItem(null)
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

  // Run when select input is changed to display the according image
  const handleChange = (e, item) => {
    const foundVariant = item.node.variants.edges.find((item) => {
      return item.node.id === e.target.value
    });
    setSelectedItem(foundVariant);
  }


  return (
    <BrowserRouter>
      <NavigationBar />

      <AppContext.Provider
        value={{ basketItems, totalPrice, handleAdd, handleRemove, selectedItem, handleChange }}
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
                  <h1 className="page__head">All Prodcts</h1>
                  <Main products={products} />
                  {hasNextPage !== false ? <div className="load-box"><button className="load" onClick={handleLoadMore}>Load More</button></div>
                    : <></>
                  }
                </>
              }
            />

            <Route
              path="/products/featured"
              element={
                <>
                  <h1 className="page__head">Featured</h1>
                  <Main products={featuredProducts} />
                </>
              }
            />

            <Route
              path="/products/women"
              element={
                <>
                  <h1 className="page__head">Women</h1>
                  <Main products={womenProducts} />
                </>
              }
            />

            <Route
              path="/products/men"
              element={
                <>
                  <h1 className="page__head">Men</h1>
                  <Main products={menProducts} />
                </>
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