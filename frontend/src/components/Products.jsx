import React, { useEffect, useState } from "react";
import { API_URL, useFetch } from "./useFetch";
import { formatCurrency } from "./Dashboard";
import { Cloudinary } from "@cloudinary/url-gen";
import { fill } from "@cloudinary/url-gen/actions/resize";
import { format } from "@cloudinary/url-gen/actions/delivery";
import Loader from "./Loader";
import LoadingImg from "./LoadingImg";
import { broadcast, useApp } from "./AppContext";
import { Toaster, toast } from "sonner";

export default function Products() {
  const [url, setUrl] = useState("");
  useEffect(() => {
    const cld = new Cloudinary({
      cloud: {
        cloudName: "dxbonqlbo",
      },
    });

    const image = cld.image("hairdryer_d7oykc");

    image
      .resize(fill().width(600).height(600))
      .delivery(format("auto"))
      .quality("auto");

    const url = image.toURL();

    setUrl(url);
    console.log(url);
  }, []);

  const { data: allProducts, refetch } = useFetch("/products");

  function fetchAgain() {
    refetch();
  }

  return (
    <main className="bg-[#F5F7F8] min-h-[100vh] py-[40px]">
      <Toaster />
      <div className="max-w-[1280px] mx-auto">
        {/* Product page title */}
        <div>
          <h1 className="text-[36px] font-semibold tracking-tight">Products</h1>
          <p className="text-gray leading-[110%]">
            Find your next favourite product and add it to your collection
          </p>
        </div>

        {/* Container for products */}
        <div className="flex flex-wrap gap-[30px] mt-[40px]">
          {allProducts &&
            allProducts.map((product) => {
              return (
                <ProductCard
                  productName={product.title}
                  price={product.selling_price}
                  imgUrl={product.img_url}
                  units_in_stock={product.units_in_stock}
                  fetchAgain={fetchAgain}
                />
              );
            })}
        </div>
      </div>
    </main>
  );
}

function ProductCard({
  productName,
  price,
  imgUrl,
  units_in_stock,
  fetchAgain,
}) {
  const { data: allProducts, refetch } = useFetch("/products");
  const [buyAmount, setBuyAmount] = useState(1);
  const [modal, setModal] = useState(false);

  function toggleModal() {
    setModal(!modal);
  }

  const updateData = async () => {
    const allProducts = await refetch();

    if (buyAmount == 0 || buyAmount == undefined) {
      toast.error("Please buy at least 1 product");
      return;
    }

    if (buyAmount > units_in_stock) {
      toast.error("We do not have enough in stock");
      return;
    }

    const updatedProducts = allProducts.map((product) => {
      if (product.title === productName) {
        const updatedProduct = product;
        updatedProduct.units_in_stock = Number(
          updatedProduct.units_in_stock - Number(buyAmount)
        );
        updatedProduct.units_sold = Number(
          updatedProduct.units_sold + Number(buyAmount)
        );
        return updatedProduct;
      } else {
        return product;
      }
    });

    console.log(updatedProducts)

    const res = await fetch(`http://${API_URL}:8000/products/update`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: updatedProducts }),
    });

    if (res.ok) {
      broadcast.postMessage({ type: "REFRESH_PRODUCTS" });
      setModal(false);
      fetchAgain();
    } else {
      const errorText = await res.text();
      console.log(errorText);
    }
  };

  return (
    <>
      <div className="border border-neutral-300 overflow-hidden rounded-[12px] w-full max-w-[250px]">
        <LoadingImg
          src={imgUrl}
          alt="product"
          className="h-[190px] w-full object-cover object-top pointer-events-none"
        />

        {/* Container for title and price */}
        <div className="flex flex-col gap-[4px] p-[15px]">
          <h3 className="font-semibold text-[18px] tracking-tight">
            {productName}
          </h3>

          {/* Price */}
          <p className="text-gray">{formatCurrency(price)}</p>

          {/* Buy btn */}
          <button
            onClick={toggleModal}
            className="font-semibold tracking-tight text-white bg-blue1 w-full h-[40px] rounded-[10px]"
          >
            Buy
          </button>

          <div className=" text-right mt-[4px] font-medium">
            In Stock: {units_in_stock}
          </div>
        </div>
      </div>

      {modal && (
        <>
          {" "}
          {/* Modal to confirm buy and buy amount */}
          <div className="fixed w-full max-w-[400px] z-[50] left-[50%] translate-x-[-50%] top-[50%] translate-y-[-50%] bg-white border border-slate-300 rounded-[14px] p-[20px] py-[40px]  flex flex-col gap-[20px]">
            <h3 className="text-[20px] font-medium">
              How many do you want to buy?
            </h3>

            <input
              type="number"
              min={0}
              defaultValue={1}
              onKeyDown={(e) => {
                const disallowed = ["e", "E", "+", "-"];
                if (disallowed.includes(e.key)) {
                  e.preventDefault();
                }
              }}
              onChange={(e) => {
                setBuyAmount(e.target.value);
              }}
              className="w-full border border-slate-300 rounded-[5px] p-[8px] py-[14px] focus:outline-none focus:shadow-lg"
            />

            {/* Cancel or confirm order */}
            <div className="flex gap-[15px] justify-center items-center">
              <button
                onClick={toggleModal}
                className="border border-slate-300 py-[9px] px-[20px] rounded-[5px]"
              >
                Cancel
              </button>
              <button
                onClick={updateData}
                className="bg-blue1 text-white rounded-[5px] py-[9px] px-[20px]"
              >
                Confirm Buy
              </button>
            </div>
          </div>
          {/* Modal overlay */}
          <div
            onClick={toggleModal}
            className="fixed inset-0 bg-[black] bg-opacity-60 w-full h-full z-[40]"
          ></div>
        </>
      )}
    </>
  );
}
