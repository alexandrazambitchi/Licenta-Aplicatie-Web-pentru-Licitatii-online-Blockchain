import React, { Component } from "react";
import { useParams, Link } from "react-router-dom";
import Product from "../components/Product";

const ProductPage = props => {
    const params = useParams();
    console.log(params)
    return (
      <div id="content">
        <div>
          {props.products.map((product, key) => {
            return (
              <div>
                {product.id_product === params.id_product ? (
                  <section className="section product-section">
                    <h2 className="section-title">{product.name}</h2>
                    <div className="product">
                      <img
                        src={`https://ipfs.infura.io/ipfs/${product.image_hash}`}
                        alt={product.name}
                        style={{ maxWidth: "420px" }}
                      />
                      <div className="product-info">
                        <p>
                          <h4>
                            <span className="badge bg-secondary bg-large">
                              Name:
                            </span>
                            {product.name}
                          </h4>
                        </p>
                        <p>
                          <span className="data">Artist Name:</span>
                          {product.artist_name}
                        </p>
                        <p>
                          <span className="data">Category:</span>
                          {product.category}
                        </p>
                        <p>
                          <span className="data">Description:</span>
                          {product.description}
                        </p>
                        <Link to="/" className="btn btn-primary">
                          Back Home
                        </Link>
                      </div>
                    </div>
                  </section>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    );
}

export default ProductPage;
