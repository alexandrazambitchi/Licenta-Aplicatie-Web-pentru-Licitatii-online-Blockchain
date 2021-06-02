import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../App.css";
import Product from "../Products/ProductEnded";

const ArtistPage = (props) =>{
  const params = useParams();

  return (
    <div id="content">
      {props.artists.map((artist) => {
        if(artist.id_artist === params.id_artist){
          return (
            <div className="center">
              <h2 className="section-title text-center">{artist.artist_name}</h2>
              <h3 className="section-title text-center">{artist.details}</h3>
              <div className="grid-container">
                {props.products.map((product, key)=>{
                  if (product.id_artist == artist.id_artist) {
                    return <Product key={key} {...product} {...artist.artist_name} />;
                  }
                }
                
                )}
                </div>
            </div>
          );
          
        }
      })}
    </div>
  )
}

export default ArtistPage;