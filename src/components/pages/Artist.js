import React from "react";
import { Link } from "react-router-dom";
import "../App.css";
export default function Artist({
  id_artist,
  artist_name
}) {
  return (
    <article className="artist">
      <div>
        <h2>{artist_name}</h2>
        <Link
          to={`/artist/${id_artist}`}
          className="btn btn-outline-primary btn-details"
        >
          More
        </Link>
      </div>
    </article>
  );
}
