import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false); // Add state for cart visibility

  useEffect(() => {
    axios.get('https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json')
      .then(response => {
        setProducts(response.data.categories);
        setFilteredProducts(response.data.categories);
      })
      .catch(error => {
        console.error('Error fetching data: ', error);
      });
  }, []);

  const handleButtonPress = (category) => {
    let newSelectedCategories;
    if (selectedCategories.includes(category)) {
      newSelectedCategories = [];
    } else {
      newSelectedCategories = [category];
    }
    setSelectedCategories(newSelectedCategories);

    if (newSelectedCategories.length === 0) {
      setFilteredProducts(products);
    } else {
      const newFilteredProducts = products.filter(product => newSelectedCategories.includes(product.category_name));
      setFilteredProducts(newFilteredProducts);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filteredProducts = products.filter((product) => {
      const categoryName = product.category_name.toLowerCase();
      const matchingProducts = product.category_products.filter((p) =>
        p.title.toLowerCase().includes(query.toLowerCase())
      );
      const matchingPrices = product.category_products.filter((p) =>
        p.price.toString().includes(query)
      );
      return (
        categoryName.includes(query.toLowerCase()) ||
        matchingProducts.length > 0 ||
        matchingPrices.length > 0
      );
    });
    setFilteredProducts(filteredProducts);
  };

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (productId) => {
    const updatedCart = cart.filter(item => item.id !== productId);
    setCart(updatedCart);
  };

  const calculateTotalPrice = () => {
    return cart.reduce((total, item) => total + Number(item.price), 0);
  };
  

  return (
    <div className="App">
      <header>
        <h1>Clothing Store</h1>
        <div className="cart-icon cart-button" onClick={() => setShowCart(!showCart)}>
          <span>Cart</span>
          <i className="fa fa-shopping-cart"></i> &nbsp;
          <span>{cart.length}</span>
        </div>
      </header>
      {showCart && ( // Conditionally render cart
        <div className="cart-container">
          <h2>Shopping Cart</h2>
          {cart.map(item => (
            <div key={item.id} className="cart-item">
              <p>{item.title} - ${item.price}</p>
              <button onClick={() => removeFromCart(item.id)}>Remove</button>
            </div>
          ))}
          <p>Total Price: ${calculateTotalPrice()}</p>
          <button onClick={() => setCart([])}>Clear Cart</button>
          <button onClick={() => alert('Implement checkout functionality')}>Checkout</button>
        </div>
      )}
      <div className="container">
        <aside className="sidebar">
          <h2>Categories</h2>
          <div className='search-box'>
            <input
              id="search"
              type="text"
              placeholder="Search items"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <div>
            <button
              className={selectedCategories.includes('Men') ? 'selected' : ''}
              onClick={() => handleButtonPress('Men')}
            >
              Men
            </button>
          </div>
          <div>
            <button
              className={selectedCategories.includes('Women') ? 'selected' : ''}
              onClick={() => handleButtonPress('Women')}
            >
              Women
            </button>
          </div>
          <div>
            <button
              className={selectedCategories.includes('Kids') ? 'selected' : ''}
              onClick={() => handleButtonPress('Kids')}
            >
              Kids
            </button>
          </div>
        </aside>
        <main className="content" id="content">
          {filteredProducts.map(category => (
            <div key={category.category_name}>
              <h2>{category.category_name}</h2>
              <div className="products">
                {category.category_products.map(product => (
                  <div key={product.id} className="card">
                    <img src={product.image} alt={product.title} />
                    <h3>{product.title}</h3>
                    <p>Price: {product.price}</p>
                    {product.compare_at_price && <p>Compare at Price: {product.compare_at_price}</p>}
                    {product.badge_text && <div className="badge">{product.badge_text}</div>}
                    <button className='add-to-cart' onClick={() => addToCart(product)}>Add to Cart</button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </main>
      </div>
      <footer>
        <p>© By Aditya Sharma</p>
      </footer>
    </div>
  );
}

export default App;
