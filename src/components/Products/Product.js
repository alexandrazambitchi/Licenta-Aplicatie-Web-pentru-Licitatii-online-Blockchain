import React from "react";
import { Link } from "react-router-dom";
import "../App.css";
export default function Product({
  image_hash,
  name,
  id_product,
  artist_name,
  category,
  auction_started,
  auction_ended,
  text
}) {
  return (
    <article className="product">
      {!auction_ended ? (
        <section>
          {auction_started ? (
            <div>
              <div className="img-container">
                <img
                  src={`https://ipfs.infura.io/ipfs/${image_hash}`}
                  alt={name}
                  style={{ maxWidth: "210px" }}
                />
              </div>
              <div className="product-footer">
                <h3>{name}</h3>
                <h4>{artist_name}</h4>
                <p>{category}</p>
                <Link
                  to={`/product/${id_product}`}
                  className="btn btn-outline-primary btn-details"
                >
                  {text}
                </Link>
              </div>
            </div>
          ) : null}
        </section>
      ) : null}
    </article>
  );
}
