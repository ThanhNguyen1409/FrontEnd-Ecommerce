import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import List from '../../components/List/ListProduct';
import './Products.scss';
import useFetch from '../../hooks/useFetch';
import makeRequest from '../../request';
import ScrollToTop from 'react-scroll-to-top';
import { GoTop } from '../../Function/ScrollToTop';
import { Close } from '@mui/icons-material';
import ListProduct from '../../components/List/ListProduct';
export const Products = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPrices, setSelectedPrices] = useState([]);
  const [initialProducts, setInitialProducts] = useState([]);
  const [catProducts, setCatProducts] = useState([]);

  const [open, setOpen] = useState(false);
  const [filteredByCategory, setFilteredByCategory] = useState([]);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('query');
  const searchResults = location.state?.searchResults || [];

  const { data } = useFetch(`/api/category`);

  useEffect(() => {
    if (searchResults.length > 0) {
      setInitialProducts(searchResults);
      setFilteredByCategory(searchResults);
    } else {
      fetchData();
    }
  }, [query]);

  useEffect(() => {
    handleSortAndPriceFilter();
  }, [initialProducts, selectedCategories, selectedPrices]);

  GoTop();

  const fetchData = async () => {
    try {
      const res = await makeRequest.get('/api/products');
      setInitialProducts(res.data);
      setFilteredByCategory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckboxChange = (event, stateUpdater) => {
    const value =
      stateUpdater === setSelectedCategories
        ? parseInt(event.target.value, 10)
        : event.target.value;

    stateUpdater((prevSelected) =>
      prevSelected.includes(value)
        ? prevSelected.filter((selected) => selected !== value)
        : [...prevSelected, value]
    );
  };

  const handleSortAndPriceFilter = () => {
    // Áp dụng bộ lọc theo danh mục
    const filteredByCategoryResult = initialProducts.filter((product) => {
      const categoryFilter =
        selectedCategories.length === 0 ||
        selectedCategories.includes(product.categoryId);

      return categoryFilter;
    });

    setFilteredByCategory(filteredByCategoryResult);

    // Áp dụng bộ lọc theo giá trên danh sách đã lọc theo danh mục
    const priceFilter =
      selectedPrices.length === 0 ||
      filteredByCategoryResult.filter((product) =>
        selectedPrices.some((selectedPrice) => {
          if (selectedPrice === '< 500,000 đ') {
            return product.productPrice < 500000;
          } else if (selectedPrice === '500,000 - 1,000,000 đ') {
            return (
              product.productPrice >= 500000 && product.productPrice <= 1000000
            );
          }
          return false;
        })
      );

    setCatProducts(
      priceFilter.length >= 0 ? priceFilter : filteredByCategoryResult
    );
  };

  const handleSortChange = (value) => {
    const sortedProducts = catProducts
      .slice()
      .sort((a, b) =>
        value === 'asc'
          ? a.productPrice - b.productPrice
          : b.productPrice - a.productPrice
      );
    setCatProducts(sortedProducts);
  };

  const handleOpen = () => {
    setOpen(!open);
  };
  const prices = [
    { id: 1, price: '< 500,000 đ' },
    { id: 2, price: '500,000 - 1,000,000 đ' },
  ];

  return (
    <div className="products">
      <div className={`filter-bar ${open ? 'open' : ''}`}>
        <div className="close-icon" onClick={handleOpen}>
          <Close />
        </div>
        <h4>Bộ lọc</h4>
        <h6>Theo danh mục</h6>
        <div className="filter-item">
          {data?.map((item) => (
            <div className="checkbox-item" key={item.categoryId}>
              <input
                type="checkbox"
                aria-label=""
                id={item.categoryId}
                value={item.categoryId}
                onChange={(event) =>
                  handleCheckboxChange(event, setSelectedCategories)
                }
              />
              <label htmlFor={item.categoryId}>{item.categoryName}</label>
            </div>
          ))}
        </div>

        <h6>Theo mức giá</h6>
        <div className="filter-item">
          {prices.map((item) => (
            <div className="checkbox-item" key={item.id}>
              <input
                type="checkbox"
                aria-label=""
                id={`price-${item.id}`}
                value={item.price}
                checked={selectedPrices.includes(item.price)}
                onChange={(event) =>
                  handleCheckboxChange(event, setSelectedPrices)
                }
              />
              <label htmlFor={`price-${item.id}`}>{item.price}</label>
            </div>
          ))}
        </div>
      </div>
      <div className="main-content">
        <img
          className="catImg"
          src="https://images.pexels.com/photos/1074535/pexels-photo-1074535.jpeg?auto=compress&cs=tinysrgb&w=1600"
          alt=""
        />
        {catProducts.length > 0 && (
          <ListProduct
            catProducts={catProducts}
            handleOpen={handleOpen}
            handleSortChange={handleSortChange}
          />
        )}
      </div>
      <div
        className={`overlay-container ${open ? 'open' : ''}`}
        onClick={handleOpen}
      ></div>
    </div>
  );
};
