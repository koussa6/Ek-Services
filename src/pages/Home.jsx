import React from 'react';
import NavBar from '../components/NavBar';
import Banner from '../components/Banner';
import Login from '../components/Login';
import SpeicalOffer from '../components/SpeicalOffer';
import AboutHome from '../components/AboutHome';
import OurHomeMenu from '../components/OurHomeMenu';
const Home = () => {
  return (
    <>
      <Banner />
      <SpeicalOffer />
      <AboutHome />
      <OurHomeMenu />
    </>
  );
};

export default Home;
