import React, { useCallback, useEffect, useState } from 'react';
import './SearchBar.scss';
import { useNavigate } from 'react-router-dom';
import makeRequest from '../../request';
import { Link } from 'react-router-dom';

import SearchIcon from '@mui/icons-material/Search';
import { Form } from 'react-bootstrap';
import { Drawer } from 'antd';
import { CurrencyFormatter } from '../../Function/FormatPrice';
const SearchBar = (props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const nagivate = useNavigate();
  const handleSearch = useCallback(async () => {
    try {
      const response = await makeRequest.get(
        `/api/products/search?query=${searchQuery}`
      );
      setSearchResults(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  }, [searchQuery]);

  const handleChange = (event) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    if (props.searchOpen === true) {
      const timeoutId = setTimeout(() => {
        handleSearch();
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
    // Cleanup, clear existing timeout when the component unmounts or when searchQuery changes
  }, [searchQuery, handleSearch]);

  const handleClick = () => {
    props.setSearchOpen(!props.searchOpen);
  };
  return (
    <>
      <Drawer
        onClose={handleClick}
        open={props.searchOpen}
        className="search-bar"
      >
        <Form>
          <div className="search-form">
            <input
              type="text"
              aria-label="Tìm kiếm"
              placeholder="Tìm kiếm"
              value={searchQuery}
              onChange={handleChange}
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                nagivate(`/products/search?query=${searchQuery}`, {
                  state: { searchResults: searchResults },
                });
                handleClick();
              }}
            >
              <SearchIcon />
            </button>
          </div>
        </Form>
        {searchResults &&
          searchResults.length > 0 &&
          searchResults.map((item) => (
            <Link
              className="link"
              to={`/product/${item.productId}`}
              onClick={() =>
                props.handleChange(props.searchOpen, props.setSearchOpen)
              }
              key=""
            >
              <div className="item" key={item.productId}>
                <img src={item.image} alt="" />
                <div className="details">
                  <h1>{item.productName}</h1>
                  <div className="price">
                    {CurrencyFormatter(item.productPrice)}
                  </div>
                </div>
                <div></div>
              </div>
            </Link>
          ))}
      </Drawer>

      {/* <div className={`search-bar ${props.searchOpen ? 'open' : ''}`}>
        <div className="close-icon" onClick={handleClick}>
          <Close />
        </div>

        <Form>
          <div className="search-form">
            <input
              type="text"
              aria-label="Tìm kiếm"
              placeholder="Tìm kiếm"
              value={searchQuery}
              onChange={handleChange}
            />
            <button
              onClick={(e) => {
                e.preventDefault();
                nagivate(`/products/search?query=${searchQuery}`, {
                  state: { searchResults: searchResults },
                });
                handleClick();
              }}
            >
              <SearchIcon />
            </button>
          </div>
        </Form>
        {searchResults &&
          searchResults.length > 0 &&
          searchResults.map((item) => (
            <Link
              className="link"
              to={`/product/${item.productId}`}
              onClick={() =>
                props.handleChange(props.searchOpen, props.setSearchOpen)
              }
              key=""
            >
              <div className="item" key={item.productId}>
                <img src={item.image} alt="" />
                <div className="details">
                  <h1>{item.productName}</h1>
                  <div className="price">{item.productPrice}</div>
                </div>
                <div></div>
              </div>
            </Link>
          ))}
      </div> */}
    </>
  );
};

export default SearchBar;
