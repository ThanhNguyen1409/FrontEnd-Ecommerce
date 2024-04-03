import React from 'react';
import './Categories.scss';
import { Link } from 'react-router-dom';
const Categories = () => {
  return (
    <div className="categories">
      <div className="col-cus">
        <div className="row-cus">
          <img
            src="https://images.pexels.com/photos/818992/pexels-photo-818992.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt=""
          />
          <Link className="link" to="/products/1">
            <button>Sale</button>
          </Link>
        </div>
        <div className="row-cus">
          <img
            src="https://images.pexels.com/photos/2036646/pexels-photo-2036646.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt=""
          />
          <Link className="link" to="/products/1">
            <button>Women</button>
          </Link>
        </div>
      </div>
      <div className="col-cus">
        <div className="row-cus">
          <img
            src="https://images.pexels.com/photos/1813947/pexels-photo-1813947.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt=""
          />
          <Link className="link" to="/products/1">
            <button>New Season</button>
          </Link>
        </div>
      </div>
      <div className="col-cus col-cus-l">
        <div className="row-cus">
          <div className="col-cus">
            <div className="row-cus">
              <img
                src="https://images.pexels.com/photos/1192609/pexels-photo-1192609.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt=""
              />
              <Link className="link" to="/products/1">
                <button>Men</button>
              </Link>
            </div>
          </div>
          <div className="col-cus">
            <div className="row-cus">
              <img
                src="https://images.pexels.com/photos/2703202/pexels-photo-2703202.jpeg?auto=compress&cs=tinysrgb&w=1600"
                alt=""
              />
              <Link className="link" to="/products/1">
                <button>Accessories</button>
              </Link>
            </div>
          </div>
        </div>
        <div className="row-cus">
          <img
            src="https://images.pexels.com/photos/1159670/pexels-photo-1159670.jpeg?auto=compress&cs=tinysrgb&w=1600"
            alt=""
          />
          <Link className="link" to="/products/1">
            <button>Shoes</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Categories;
