import React from "react";
import { useParams, Link } from "react-router-dom";
import Product from "../components/Product";

const ProductPage = () => {
  const { id_product } = useParams();
  const [loading, setLoading] = React.useState(false);
  const [product, setProduct] = React.useState(null);
  React.useEffect(() => {
    this.props.loading=true;
    async function getProduct(){
      
    }
  }, [id_product])
  return (
    <div>
      {this.props.products.map((product, key) => {
        return <Product key={id_product} {...product} />;
      })}
    </div>
  );
};

export default ProductPage;
