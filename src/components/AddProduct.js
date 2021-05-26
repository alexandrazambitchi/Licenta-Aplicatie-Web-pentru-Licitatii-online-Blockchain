import React, { Component } from "react";

class AddProduct extends Component {
  render() {
    if (this.props.owner === this.props.account) {
      return (
        <div id="content">
          <h1>Add Product</h1>
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
              const description = this.productDescription.value;
              // const image = this.imageFile.value;
              this.props.createProduct(
                name,
                price,
                artist_name,
                category,
                description
              );
              
            }}
          >
            <fieldset class="form-group">
              <div className="form-group row">
                <label class="col-sm-2 col-form-label">Product name</label>
                <div class="col-sm-10">
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
              </div>
              <div className="form-group row">
                <label class="col-sm-2 col-form-label">Product price</label>
                <div class="col-sm-10">
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
                  <small class="form-text text-muted">
                    Price should be in ethers.
                  </small>
                </div>
              </div>
              <div className="form-group row mr-sm-2">
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
                    this.productCategory = input;
                  }}
                  className="form-control"
                  placeholder="Product Category"
                  required
                />
              </div>
              <div className="form-group mr-sm-2">
                <input
                  id="productDescription"
                  type="text"
                  ref={(input) => {
                    this.productDescription = input;
                  }}
                  className="form-control"
                  placeholder="Product Description"
                  required
                />
              </div>
              <div className="form-group mr-sm-2">
                <input
                  type="file"
                  accept=".jpg, .jpeg, .png, .bmp"
                  onChange={this.props.captureFile}
                  placeholder="Product Image"
                />
              </div>

              {/* <div className="form-group mr-sm-2">
              <input
                id="imageFile"
                type="text"
                ref={(input) => {
                  this.imageFile = input;
                }}
                className="form-control"
                placeholder="Image Description"
                required
              />
            </div> */}
              <button type="submit" className="btn btn-primary">
                Add Product
              </button>
            </fieldset>
          </form>
        </div>
      );
    }
    else{
      return <div>You have to be logged in as an owner to add a product</div>;
    }
  }
}

export default AddProduct;
