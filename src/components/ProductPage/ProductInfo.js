import React from "react";
import { Link } from "react-router-dom";
import "../App.css";
export default function ProductInfo({
  image_hash,
  name,
  id_product,
  artist_name,
  category,
  auction_started,
  description,
  purchased,
  text,
}) {
  return (
    <div className="product">
      <img
        src={`https://ipfs.infura.io/ipfs/${image_hash}`}
        alt={name}
        style={{ maxWidth: "420px" }}
        className="image-product"
      />
      <div className="product-info">
        <h4>
          <span className="badge bg-secondary bg-large">Name:</span>
          {name}
        </h4>
        <p>
          <span className="data">Artist Name:</span>
          {artist_name}
        </p>
        <p>
          <span className="data">Category:</span>
          {category}
        </p>
        <p>
          <span className="data">Description:</span>
          {description}
        </p>
        <Link to="/" className="btn btn-primary">
          Back Home
        </Link>
      </div>
    </div>
  );
}
