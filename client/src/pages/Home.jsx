import React from "react";
import Hero from "../components/Layout/Hero";
import Carousel from "../components/Layout/Carousel";
import FeatureCarousel from "../components/Layout/FeatureCarousel";
import FeatureCollection from "../components/Layout/FeatureCollection";
import Testimonials from "../components/Layout/Testimonials";
import FeatureComparison from "../components/Layout/FeatureComparison";

const Home = () => {
  return (
    <div>
      <Hero />
      <Carousel />
      <FeatureCarousel/>
      <FeatureComparison />
      <FeatureCollection/>
      <Testimonials/>

    </div>
  );
};

export default Home;
