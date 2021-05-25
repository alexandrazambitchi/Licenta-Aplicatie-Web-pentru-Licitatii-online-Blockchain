import React, { Component } from 'react';
import { Link } from "react-router-dom";
import AddProduct from './AddProduct';
import Product from './Product';

class Main extends Component {

  render() {
    
    return (
      <div id="content">
        {this.props.admin ? (
          <p>
            <Link to="/addproduct">Add Product</Link>
          </p>
        ) : null}
        <p>&nbsp;</p>
        {/* <h2>Product List</h2> */}
        <section className="section">
          {
            this.props.productCount<1 ? (
              <h2 className="section-title">No results</h2>
            ) : (
              <section className="section">
                <h2 className="section-title">Products</h2>
                <div className="product-center">
                  {this.props.products.map((product, key) => {
                    return <Product key={key} {...product} />
                  }
                  )
                  }
                </div>
              </section>
            )
            // (
            //       <thead>
            //         <tr>
            //           <th scope="col">#</th>
            //           <th scope="col">Name</th>
            //           <th scope="col">Price</th>
            //           <th scope="col">Artist</th>
            //           <th scope="col">Owner</th>
            //           <th scope="col">Status Auction</th>
            //           <th scope="col"></th>
            //         </tr>
            //       </thead>

            //       <tbody id="productList">
            //         {this.props.products.map((product, key) => {

            //           return (
            //             <tr key={key}>
            //               <th scope="row">{product.id_product.toString()}</th>
            //               <td>{product.name}</td>
            //               <td>
            //                 {window.web3.utils.fromWei(product.price, "Ether")} Eth
            //               </td>
            //               <td>{product.artist_name}</td>
            //               <td>{product.owner}</td>
            //               <td>{product.auction_started.toString()}</td>
            //               <td>
            //                 {!product.auction_started ? (
            //                   <button
            //                     name={product.id_product}
            //                     onClick={(event) => {
            //                       this.props.createAuction(product.id_product);
            //                     }}
            //                   >
            //                     Start Auction
            //                   </button>
            //                 ) : null}
            //               </td>
            //             </tr>
            //           );}
            //         )}
            //       </tbody>
            // )
          }
        </section>
      </div>
    );
  }
}

export default Main;
