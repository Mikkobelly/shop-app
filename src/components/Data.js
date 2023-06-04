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