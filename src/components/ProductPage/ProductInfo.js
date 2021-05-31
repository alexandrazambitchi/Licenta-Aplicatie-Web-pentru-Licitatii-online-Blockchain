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
        <h4>
          <span className="badge bg-secondary bg-large">Artist Name:</span>
          {artist_name}
        </h4>
        <h4>
          <span className="badge bg-secondary bg-large">Category:</span>
          {category}
        </h4>
        <h4>
          <span className="badge bg-secondary bg-large">Description:</span>
          {description}
        </h4>
        <Link to="/" className="btn btn-primary">
          Back Home
        </Link>
      </div>
    </div>
  );
}
