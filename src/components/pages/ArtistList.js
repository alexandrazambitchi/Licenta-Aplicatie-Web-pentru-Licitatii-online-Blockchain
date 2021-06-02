import React, { Component } from "react";
import Artist from "./Artist"
import "../App.css";

class ArtistList extends Component {
  render() {
    return (
      <div>
        {this.props.loading ? (
          <div id="loader" className="text-center">
            <p className="text-center">Loading...</p>
          </div>
        ) : (
          <div>
            {/* <p>{this.props.donatedValue}</p> */}
            <p>&nbsp;</p>
            {this.props.artistCount === 0 ? (
              <div className="text-center">
                <h2 className="section-title text-center">Artists</h2>
                <h3 className="section-title text-center">No results</h3>
              </div>
            ) : (
              // <div>
              <div className="product-center">
                <h2 className="section-title text-center">Artists</h2>
                <div className="grid-container">
                  {this.props.artists.map((artist, key) => {
                    return <Artist key={key} {...artist} />;
                  })}
                </div>
              </div>
              // </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default ArtistList;
