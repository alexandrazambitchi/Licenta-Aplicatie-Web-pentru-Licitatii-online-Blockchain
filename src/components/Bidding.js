import React, { Component } from "react";

class Bidding extends Component {
  state = {
    count: 0, 
    tags: ["Bla"]
  };

  renderTags() {
    if (this.state.tags.length === 0) return <p>Thare are no tags</p>;

    return <ul>{this.state.tags.map(tag => <li key={tag}>{tag}</li>)} </ul>;
  }

  render() {
    return <div>
      { this.state.tags.length === 0 && "Please create a new tag!"}
        { this.renderTags() }
      </div>;
  }
}

export default Bidding;
