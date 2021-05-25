import React, { Component } from 'react';
import AddProduct from './AddProduct';

class Main extends Component {

  render() {
    
    return (
      <div id="content">
        {this.props.admin ? (
          <button
            // name={product.id_product}
          >
            Add Product
          </button>
        ) : null}
        {/* <h1>Add Product</h1>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const name = this.productName.value;
            const price = window.web3.utils.toWei(
              this.productPrice.value.toString(),
              "Ether"
            );
            const artist_name = this.productArtist.value;
            const category = this.productCategory.value;
            this.props.createProduct(name, price, artist_name, category);
          }}
        >
          <div className="form-group mr-sm-2">
            <input
              id="productName"
              type="text"
              ref={(input) => {
                this.productName = input;
              }}
              className="form-control"
              placeholder="Product Name"
              required
            />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="productPrice"
              type="text"
              ref={(input) => {
                this.productPrice = input;
              }}
              className="form-control"
              placeholder="Product Price"
              required
            />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="productArtist"
              type="text"
              ref={(input) => {
                this.productArtist = input;
              }}
              className="form-control"
              placeholder="Product Artist Name"
              required
            />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="productCategory"
              type="text"
              ref={(input) => {
                this.productArtist = input;
              }}
              className="form-control"
              placeholder="Product Category"
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Add Product
          </button>
        </form> */}
        <p>&nbsp;</p>
        <h2>Buy Product</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Price</th>
              <th scope="col">Artist</th>
              <th scope="col">Owner</th>
              <th scope="col">Status Auction</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody id="productList">
            {this.props.products.map((product, key) => {
              return (
                <tr key={key}>
                  <th scope="row">{product.id_product.toString()}</th>
                  <td>{product.name}</td>
                  <td>
                    {window.web3.utils.fromWei(product.price, "Ether")} Eth
                  </td>
                  <td>{product.artist_name}</td>
                  <td>{product.owner}</td>
                  <td>{product.auction_started.toString()}</td>
                  <td>
                    {!product.auction_started ? (
                      <button
                        name={product.id_product}
                        onClick={(event) => {
                          this.props.createAuction(product.id_product);
                        }}
                      >
                        Start Auction
                      </button>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Main;
