import React, { Component } from "react";
import { Link } from "react-router-dom";

class AddArtist extends Component {

  submitHandler = (event) => {
    event.preventDefault();
    const name = this.artistName.value;
    const description = this.artistDescription.value;
    this.props.createArtist(name, description);
  }

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
              <h1>Add Artist</h1>
              <form
                onSubmit={this.submitHandler}>
                <fieldset className="form-group">
                  <div className="form-group">
                    <label className="col-sm-2 col-form-label">
                      Artist name
                    </label>
                    <div className="col-sm-10">
                      <input
                        id="artistName"
                        type="text"
                        ref={(input) => {
                          this.artistName = input;
                        }}
                        className="form-control"
                        placeholder="Artist Name"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label className="col-sm-2 col-form-label">
                      Artist Details
                    </label>
                    <div className="col-sm-10">
                      <textarea
                        id="artistDescription"
                        type="text"
                        rows="3"
                        ref={(input) => {
                          this.artistDescription = input;
                        }}
                        className="form-control"
                        placeholder="Artist Description"
                        required
                      />
                    </div>
                  </div>
                  <p></p>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Add Artist
                  </button>
                  <Link to="/" className="btn btn-primary">
                    Back Home
                  </Link>
                </fieldset>
              </form>
            </div>
          )}
        </div>
      );
    } else {
      return <div>You have to be logged in as an owner to add an artist</div>;
    }
  }
}

export default AddArtist;
