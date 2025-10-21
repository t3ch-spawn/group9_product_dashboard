import React from "react";
import { useParams } from "react-router-dom";
import { useFetch } from "./useFetch";

export default function ProductDetails() {
  const { id } = useParams();

  const { data: product } = useFetch(`/products/${id}`);
  console.log(product);

  return (
    <main>
      <div>{product && product[0].title}</div>
    </main>
  );
}
