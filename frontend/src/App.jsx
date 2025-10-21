import { useEffect, useState } from "react";
import "./App.css";
import Dashboard from "./components/Dashboard";
import Products from "./components/Products";
import Navbar from "./components/Navbar";
import Inventory from "./components/Inventory";
import { Route, Routes } from "react-router-dom";
import ProductDetails from "./components/ProductDetails";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/products-sale" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
