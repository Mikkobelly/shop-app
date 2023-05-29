import '../App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavigationBar from './NavigationBar';
import ProductCard from './ProductCard';
import ProductDetails from './ProductDetails';
import Basket from './Basket';

function App() {
  const [products, setProducts] = useState([]);
  const [endCursor, setEndCursor] = useState(null);
  const [hasNextPage, setHasNextPage] = useState(null);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [womenProducts, setWomenProducts] = useState([]);
  const [menProducts, setMenProducts] = useState([]);
  const [basketItems, setBasketItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);


  const query = `query {
        products(first: 12, after: ${endCursor}) {
          pageInfo {
            hasNextPage
            endCursor
          }
          edges {
            node {
              id
              title
              description
              featuredImage {
                id
                url
              }
              variants(first: 3) {
                edges {
                  node {
                    id
                    title
                    image {
                      url
                    }
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
        }
      }`;


  // Load all products from MockShop API
  useEffect(() => {
    async function fetchProducts() {
      // Get All products
      const getAll = await fetch(`https://mock.shop/api?query=${encodeURIComponent(query)}`);
      const resAll = await getAll.json();
      const { edges, pageInfo } = resAll.data.products;
      console.log('setting products: ', edges)
      setProducts(edges);
      setEndCursor(`"${pageInfo.endCursor}"`);
      setHasNextPage(pageInfo.hasNextPage);

      // Get products in Featured Collection
      const getFeatured = await fetch('https://mock.shop/api?query={collection(id:%20%22gid://shopify/Collection/429512622102%22){id%20handle%20title%20description%20image%20{id%20url}%20products(first:%2020){edges%20{node%20{id%20title%20featuredImage%20{id%20url}%20description%20variants(first:%203){edges%20{node%20{price%20{amount%20currencyCode}}}}}}}}}')
      const resFeatured = await getFeatured.json();
      const dataFeatured = resFeatured.data.collection.products.edges;
      setFeaturedProducts(dataFeatured)

      // Get products in Women's Collection
      const encodedWomenId = encodeURIComponent('gid://shopify/Collection/429493813270');
      const getWomen = await fetch(`https://mock.shop/api?query={collection(id:"${encodedWomenId}"){id%20handle%20title%20description%20image%20{id%20url}%20products(first:%2020){edges%20{node%20{id%20title%20featuredImage%20{id%20url}%20description%20variants(first:%203){edges%20{node%20{price%20{amount%20currencyCode}}}}}}}}}`);
      const resWomen = await getWomen.json();
      const dataWomen = resWomen.data.collection.products.edges;
      // console.log('data Women', dataWomen)
      setWomenProducts(dataWomen)

      // Get products in Men's Collection
      const encodedMenId = encodeURIComponent('gid://shopify/Collection/429493780502');
      const getMen = await fetch(`https://mock.shop/api?query={collection(id:"${encodedMenId}"){id%20handle%20title%20description%20image%20{id%20url}%20products(first:%2020){edges%20{node%20{id%20title%20featuredImage%20{id%20url}%20description%20variants(first:%203){edges%20{node%20{price%20{amount%20currencyCode}}}}}}}}}`);
      const resMen = await getMen.json();
      const dataMen = resMen.data.collection.products.edges;
      setMenProducts(dataMen)
    }

    fetchProducts();
  }, [])

  // Run when Load More is clicked
  const handleLoadMore = async () => {
    const response = await fetch(`https://mock.shop/api?query=${encodeURIComponent(query)}`);
    const resAll = await response.json();
    const { edges, pageInfo } = resAll.data.products;
    setProducts((prev) => [...prev, ...edges])
    setEndCursor(`"${pageInfo.endCursor}"`);
    setHasNextPage(pageInfo.hasNextPage);
  }

  // Run when item added to the basket
  const handleAdd = (item, variantId) => {
    console.log('item, viriantId passed: ', item, variantId)
    // Return if no valid item is passed
    if (!item || !variantId) {
      return;
    }

    setBasketItems((prev) => {
      const foundItem = prev.find(el => el.varId === variantId); // Check if the selected item is already added to the basket

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
    <BrowserRouter basename="/shop-app">
      <NavigationBar />

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
                <h1 className="page__head">All Prodcts</h1>
                <div className="page__flex">
                  <div className="flex--left">
                    <div className="card__grid">
                      {products.map((item, i) => (
                        <ProductCard
                          key={i}
                          product={item}
                          onAddClick={handleAdd}
                        />))}
                    </div>
                    {hasNextPage !== false ? <button className="load" onClick={handleLoadMore}>Load More</button> : <></>}
                  </div>
                  <div className="flex--right">
                    <Basket
                      basketItems={basketItems}
                      totalPrice={totalPrice}
                      onAddClick={handleAdd}
                      onRemoveClick={handleRemove}
                    />
                  </div>
                </div>
              </>
            }
          />

          <Route
            path="/products/featured"
            element={
              <>
                <h1 className="page__head">Featured</h1>
                <div className="page__flex">
                  <div className="flex--left">
                    <div className="card__grid">
                      {featuredProducts.map((item, i) => (
                        <ProductCard
                          key={i}
                          product={item}
                          onAddClick={handleAdd}
                        />))}
                    </div>
                  </div>
                  <div className="flex--right">
                    <Basket
                      basketItems={basketItems}
                      totalPrice={totalPrice}
                      onAddClick={handleAdd}
                      onRemoveClick={handleRemove}
                    />
                  </div>
                </div>
              </>
            }
          />

          <Route
            path="/products/women"
            element={
              <>
                <h1 className="page__head">Women</h1>
                <div className="page__flex">
                  <div className="flex--left">
                    <div className="card__grid">
                      {womenProducts.map((item, i) => (
                        <ProductCard
                          key={i}
                          product={item}
                          onAddClick={handleAdd}
                        />))}
                    </div>
                  </div>
                  <div className="flex--right">
                    <Basket
                      basketItems={basketItems}
                      totalPrice={totalPrice}
                      onAddClick={handleAdd}
                      onRemoveClick={handleRemove}
                    />
                  </div>
                </div>
              </>
            }
          />

          <Route
            path="/products/men"
            element={
              <>
                <h1 className="page__head">Men</h1>
                <div className="page__flex">
                  <div className="flex--left">
                    <div className="card__grid">
                      {menProducts.map((item, i) => (
                        <ProductCard
                          key={i}
                          product={item}
                          onAddClick={handleAdd}
                        />))}
                    </div>
                  </div>
                  <div className="flex--right">
                    <Basket
                      basketItems={basketItems}
                      totalPrice={totalPrice}
                      onAddClick={handleAdd}
                      onRemoveClick={handleRemove}
                    />
                  </div>
                </div>
              </>
            }
          />

          <Route
            path="/products/:productTitle"
            element={
              <>
                <div className="page__flex">
                  <div className="flex--left">
                    <ProductDetails
                      products={products}
                      onAddClick={handleAdd}
                    />
                  </div>
                  <div className="flex--right">
                    <Basket
                      basketItems={basketItems}
                      totalPrice={totalPrice}
                      onAddClick={handleAdd}
                      onRemoveClick={handleRemove}
                    />
                  </div>
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
