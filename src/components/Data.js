// https://mock.shop/api?query={collection(id:"${encodedFeaturedId}"){id%20handle%20title%20description%20image%20{id%20url}%20products(first:%2020){edges%20{node%20{id%20title%20featuredImage%20{id%20url}%20description%20variants(first:%203){edges%20{node%20{id%20title%20image%20{url}price%20{amount%20currencyCode}}}}}}}}}
// https://mock.shop/api?query={products(first: 12, after: ${endCursor}){${queryAll}}}
const queryAll = `
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
`;

const queryFeatured = `query {
    collection(id: "gid://shopify/Collection/429512622102") {
      id
      handle
      title
      description
      image {
        id
        url
      }
      products(first: 20) {
        edges {
          node {
            id
            title
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
    }
  }`;

const queryWomen = `query {
    collection(id: "gid://shopify/Collection/429493813270") {
      id
      handle
      title
      description
      image {
        id
        url
      }
      products(first: 20) {
        edges {
          node {
            id
            title
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
    }
  }`;

const queryMen = `query {
    collection(id: "gid://shopify/Collection/429493780502") {
      id
      handle
      title
      description
      image {
        id
        url
      }
      products(first: 20) {
        edges {
          node {
            id
            title
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
    }
  }`;

export { queryAll, queryFeatured, queryWomen, queryMen };