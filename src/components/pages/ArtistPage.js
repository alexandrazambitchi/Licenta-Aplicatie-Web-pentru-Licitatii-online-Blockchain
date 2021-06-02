import React from "react";
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
              <h2 className="section-title text-center">
                {artist.artist_name}
              </h2>
              <h3 className="section-title text-center">{artist.details}</h3>
              <div>
                {!props.admin ? (
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      const value = window.web3.utils.toWei(
                        this.donation.value.toString(),
                        "Ether"
                      );
                      props.donate(value, artist.id_artist);
                    }}
                  >
                    <div className="form-group">
                      <p>You can help the new artists to develop their art by donating any sum of money.</p>
                      <label className="form-label mt-4">Donation</label>
                      <input
                        id="donation"
                        type="text"
                        ref={(input) => {
                          this.donation = input;
                        }}
                        className="form-control"
                        placeholder="Donation value"
                      />
                      <small className="form-text text-muted">
                        Value should be in ethers.
                      </small>
                    </div>
                    <button type="submit" className="btn btn-primary">
                      Donate!
                    </button>
                    <p></p>
                  </form>
                ) : (
                  <div>
                    <p>
                      Value collected:{" "}
                      {window.web3.utils.fromWei(
                        artist.amount_collected,
                        "Ether"
                      )}{" "}
                      Eth
                    </p>
                  </div>
                )}
              </div>
              <div className="grid-container">
                {props.products.map((product, key) => {
                  if (product.id_artist === artist.id_artist) {
                    return (
                      <Product key={key} {...product} {...artist.artist_name} />
                    );
                  }
                })}
              </div>
            </div>
          );
          
        }
      })}
    </div>
  )
}

export default ArtistPage;