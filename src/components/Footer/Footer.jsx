import React from 'react';
import './Footer.scss';
const Footer = () => {
  return (
    <div className="footer">
      <div className="top">
        <div className="item">
          <h1>Categories</h1>
          <span>Women</span>
          <span>Men</span>
          <span>Shoes</span>
          <span>Accessories</span>
          <span>New Arrivals</span>
        </div>
        <div className="item">
          <h1>Links</h1>
          <span>FAQn</span>
          <span>Pages</span>
          <span>Stores</span>
          <span>Compare</span>
          <span>Cookies</span>
        </div>
        <div className="item">
          <h1>About</h1>
          <span>
            Women Women Women Women Women Women Women Women Women Women Women
            Women WomenWomenWomenWomenWomen
          </span>
        </div>
        <div className="item">
          <h1>Contact</h1>
          <span>
            Women Women Women Women Women Women Women
            WomenWomenWomenWomenWomenWomen WomenWomenWomenWomen
          </span>
        </div>
      </div>
      <div className="bottom">
        <div className="left">
          <span className="logo">Lamastore</span>
          <span className="copyright">copyright 2023. All rights reserved</span>
        </div>

        <div className="right">
          <img src="/img/payment.png" alt="" />
        </div>
      </div>
    </div>
  );
};

export default Footer;
