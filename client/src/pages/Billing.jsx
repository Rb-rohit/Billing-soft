import React, { useEffect, useRef, useState } from 'react'
import ProductSearch from '../components/ProductSearch';
import ProductList from '../components/ProductList';
import CartTable from '../components/CartTable';
import BillSummary from '../components/BillSummary';
import axios from 'axios';

const Billing = () => {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);

  const searchRef = useRef(null);

  const token = localStorage.getItem("token");
  //fetch products
  useEffect(() => {
    const fetchProducts = async() => {
      const res = await axios.get(
        "https://billing-soft-roxt.onrender.com/api/products",
        {headers: { Authorization: `Bearer ${token}` }}
      );
      setProducts(res.data.products);
    };
    fetchProducts();
  }, []);

  //Add product to cart
  const addToCart = (product) => {
    setCart(prev => {
      const exist = prev.find(p => p._id === product._id);

      let updatedCart;

      if (exist) {
        updatedCart = prev.map(p => 
          p._id === product._id
          ? { ...p, qty: p.qty + 1 }
          : p
        );
    } else {
      updatedCart = [...prev, {...product, qty:1 }];
    }

    return updatedCart;
    });
    setSelectedItemId(product._id);
  };

  const increaseQty = () => {
  if (!selectedItemId) return;

  setCart(prev =>
    prev.map(item =>
      item._id === selectedItemId
        ? { ...item, qty: item.qty + 1 }
        : item
    )
  );
};

  // move selection with arrow keys
  const moveSelection = (direction) => {
    if (cart.length === 0) return;

    const currentIndex = cart.findIndex(
      item => item._id === selectedItemId
    );

    let newIndex;

    if (direction === "down") {
      newIndex =
        currentIndex === -1 || currentIndex === cart.length - 1
        ? 0
        : currentIndex + 1;
    }

    if (direction === "up") {
      newIndex = 
        currentIndex <= 0
        ? cart.length - 1
        : currentIndex - 1;
    }

    setSelectedItemId(cart[newIndex]._id);
  };


  // keyboard shortcut 
  useEffect(() => {
    const handleKeyDown = (e) => {

      // F2 focus product search
      if (e.key === "F2") {
        e.preventDefault();
        searchRef.current?.focus();
      }

      //arrow down
      if (e.key === "ArrowDown") {
        e.preventDefault();
        moveSelection("down");
      }

      //arrow up
      if (e.key === "ArrowUp") {
        e.preventDefault();
        moveSelection("up");
      }

      if (e.key === "Enter") {
      e.preventDefault();
      increaseQty();
    }

      //delete remove selected item
      if (e.key === "Delete" && selectedItemId) {
        setCart(prev =>
          prev.filter(item => item._id !== selectedItemId));
      }

      // + increase quantity
      if (e.key === "+" && selectedItemId) {
        setCart(prev => 
          prev.map(item => 
            item._id === selectedItemId
            ? {...item, qty: item.qty + 1}
            : item
        ));
      }

      // - decrease quantity 
      if (e.key === "-" && selectedItemId) {
        setCart(prev => 
          prev.map(item => 
            item._id === selectedItemId
            ? {...item, qty: Math.max(1, item.qty - 1)}
            :item
        ));
      }

    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedItemId, cart]);

  return (
    <div className='grid grid-cols-12 h-screen gap-4 p-4'>

      {/* left side  */}
      <div className='col-span-7 bg-white rounded-xl shadow p-4'>
        <ProductSearch
          ref={searchRef}
          products={products}
          addToCart={addToCart}
        />

        <ProductList 
          products={products}
          addToCart={addToCart}
        />
      </div>

      {/* right side  */}
      <div className='col-span-5 bg-white rounded-xl shadow p-4'>
        <CartTable 
        cart={cart} 
        setCart={setCart} 
        selectedItemId={selectedItemId}
        setSelectedItemId={setSelectedItemId}
        />
        <BillSummary cart={cart} setCart={setCart} />
      </div>
    </div>
  );
};

export default Billing;