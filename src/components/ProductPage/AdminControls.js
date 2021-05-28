import React, { Component } from "react";
import { useParams, Link } from "react-router-dom";

const AdminControls = (props) => {
  const params = useParams();
  console.log("Admin", params.id_product);
  return (
    <section>
      {props.products.map((product, key) => {
          <div>
            {/* <p>{product.id_product}</p>
            <p>Do smth</p> */}
            {product.id_product === params.id_product ? (
              <p>Empty</p>
            ) : null}
          </div>;
      })}
      
    </section>
  );
}

export default AdminControls;