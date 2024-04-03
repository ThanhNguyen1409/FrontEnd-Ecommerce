import React, { useState } from 'react';
import './ListProduct.scss';
import Card from '../Card/Card';
import ReactPaginate from 'react-paginate';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { List } from 'antd';
const ListProduct = (props) => {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6; // Số lượng sản phẩm trên mỗi trang

  const pageCount = Math.ceil(props.catProducts.length / itemsPerPage);

  const handlePageClick = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const indexOfLastItem = (currentPage + 1) * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = props.catProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  return (
    <>
      <div>
        <div className="filter-wrap">
          <div className="filter-btn" onClick={props.handleOpen}>
            <FilterAltIcon />
            Bộ lọc
          </div>
          <div className="sort-btn">
            <select
              name="sort-item"
              id="sort-item"
              onChange={(e) => {
                props.handleSortChange(e.target.value);
              }}
            >
              <option value="" selected disabled>
                Sắp xếp theo
              </option>
              <option value="desc">Giá cao trước</option>
              <option value="asc">Giá thấp trước</option>
              <option value="">Mới nhất</option>
              <option value="">Cũ nhất</option>
            </select>
          </div>
        </div>
        {props.catProducts.length > 0 ? (
          <>
            {/* <div className="list">
              {currentItems.map((item) => (
                <Card item={item} key={item.id} />
              ))}
            </div>
            <div className="pagination-container">
              <ReactPaginate
                previousLabel={'previous'}
                nextLabel={'next'}
                breakLabel={'...'}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={'pagination'}
                subContainerClassName={'pages pagination'}
                activeClassName={'active'}
              />
            </div> */}
            <List
              grid={{
                gutter: 24,
                xs: 1,
                sm: 2,
                md: 2,
                lg: 3,
                xl: 4,
                xxl: 4,
              }}
              dataSource={props.catProducts}
              pagination={{ align: 'center', pageSize: 8 }}
              renderItem={(item) => (
                <List.Item>
                  <Card item={item} key={item.id} />
                </List.Item>
              )}
            />
          </>
        ) : (
          <div>
            <h3>Không có sản phẩm phù hợp</h3>
          </div>
        )}
      </div>
    </>
  );
};

export default ListProduct;
