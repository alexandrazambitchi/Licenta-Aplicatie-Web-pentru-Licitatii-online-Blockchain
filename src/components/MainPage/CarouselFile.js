import React from "react";
import Carousel from "react-bootstrap/Carousel";
import image1 from "../images/image1.png";

const CarouselFile = () => {
  return (
    <div>
      <Carousel>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={image1}
            alt="image1"
            // style={{ maxWidth: "600px" }}
          />
          <Carousel.Caption>
            <h3>Products from all around the world</h3>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={image1}
            alt="image1"
            // style={{ maxWidth: "600px" }}
          />
          <Carousel.Caption>
            <h3>From paintings to sculptures</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={image1}
            alt="image1"
            // style={{ maxWidth: "600px" }}
          />
          <Carousel.Caption>
            <h3>Newly discovered artists</h3>
            <p>Plus already loved artists.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={image1}
            alt="image1"
            // style={{ maxWidth: "600px" }}
          />
          <Carousel.Caption>
            <h3>From paintings to sculptures</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
      {/* <Carousel fade="true" controls="false">
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={image1}
            alt="image1"
            // style={{ maxWidth: "600px" }}
          />
          <Carousel.Caption>
            <h3>featured</h3>
            <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={image1}
            alt="image1"
            // style={{ maxWidth: "600px" }}
          />
          <Carousel.Caption>
            <h3>Best selling</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={image1}
            alt="image1"
            // style={{ maxWidth: "600px" }}
          />
          <Carousel.Caption>
            <h3>Too much</h3>
            <p>Plus already loved artists.</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel> */}
    </div>
  );
};

export default CarouselFile;
