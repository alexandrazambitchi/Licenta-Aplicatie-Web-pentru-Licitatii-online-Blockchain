import React from "react";
import Product from "./Product";

const SearchForm = () => {
  const searchValue = React.useRef('');
  const searchProduct = () => {
    this.props.products.map((product, key) => {
      {product.name.search(searchValue) ? <Product key={key} {...product} /> : null}
    }
    )
  }
  return (
    <section className="section search">
      <form className="search-form">
        <div className="form-control">
          <label htmlFor="name">Search a product</label>
          <input type="text" id="name" ref={searchValue} onChange={searchProduct}/>
        </div>
      </form>

    </section>
  );
};

export default SearchForm;
