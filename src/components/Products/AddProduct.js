import React, { Component } from "react";
// import { useParams, Link, useHistory, withRouter } from "react-router-dom";
// import history from "../History";

class AddProduct extends Component {
  // routeChange = () => {
  //   let path = "/product/:id_product";
  //   let history = useHistory();
  //   history.push(path);
  // };
  render() {
    if (this.props.owner === this.props.account) {
      return (
        <div id="content">
          {this.props.loading ? (
            <div id="loader" className="text-center">
              <p className="text-center">Loading...</p>
            </div>
          ) : (
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
                  // this.routeChange()
                  // history.push("/");
                  // window.location.href = "/"
                }}
              >
                <fieldset className="form-group">
                  <div className="form-group">
                    <label className="col-sm-2 col-form-label">
                      Product name
                    </label>
                    <div className="col-sm-10">
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
                  <div className="form-group">
                    <label className="col-sm-2 col-form-label">
                      Product price
                    </label>
                    <div className="col-sm-10">
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
                      <small className="form-text text-muted">
                        Price should be in ethers.
                      </small>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-sm-2 col-form-label">
                      Product Artist Name
                    </label>
                    <div className="col-sm-10">
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
                  </div>
                  <div className="form-group">
                    <label className="form-label mt-4">Category</label>
                    <div className="col-sm-10">
                      <select
                        className="form-select"
                        ref={(option) => {
                          this.productCategory = option;
                        }}
                        required
                        placeholder="Select category"
                      >
                        <option>Select Category...</option>
                        <option>Painting</option>
                        <option>Sculpture</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-sm-2 col-form-label">
                      Description
                    </label>
                    <div className="col-sm-10">
                      <textarea
                        id="productDescription"
                        type="text"
                        rows="3"
                        ref={(input) => {
                          this.productDescription = input;
                        }}
                        className="form-control"
                        placeholder="Product Description"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label mt-4">Image file</label>
                    <input
                      className="form-control"
                      type="file"
                      accept=".jpg, .jpeg, .png, .bmp"
                      onChange={this.props.captureFile}
                      required
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

                  <button
                    type="submit"
                    className="btn btn-primary"
                    // onClick={history.push("/")}
                  >
                    {/* <Link to="/" className="btn btn-primary"> */}
                    Add Product
                    {/* </Link> */}
                  </button>
                </fieldset>
              </form>
            </div>
          )}
        </div>
      );
    } else {
      return <div>You have to be logged in as an owner to add a product</div>;
    }
  }
}

export default AddProduct;
