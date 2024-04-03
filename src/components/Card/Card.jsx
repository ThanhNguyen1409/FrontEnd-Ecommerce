import React from 'react';
import './Card.scss';
import { Link } from 'react-router-dom';

import { CurrencyFormatter } from '../../Function/FormatPrice';
import { Rate } from 'antd';
function Card({ item, key }) {
  return (
    <div key={key}>
      <Link className="link" to={`/product/${item.productId}`}>
        <div className="card-product">
          <div className="image">
            {/* {item?.attributes.isNew && <span>New Season</span>} */}
            <img src={item.image} alt="" className="mainImg" />
            <img src={item.subImage} alt="" className="secondImg" />
          </div>
          <h2>{item.productName}</h2>
          <Rate
            disabled
            allowHalf
            value={item.averageRating}
            style={{
              fontSize: 13,
            }}
          />
          <div className="prices">
            {/* <h3>${item.oldPrice || item?.attributes.price}</h3> */}
            <h3>{CurrencyFormatter(item.productPrice)}</h3>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default Card;
