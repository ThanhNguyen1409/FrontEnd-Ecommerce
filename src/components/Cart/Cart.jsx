import React, { useEffect, useState } from 'react';
import './Cart.scss';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutline';
import { useDispatch, useSelector } from 'react-redux';
import {
  addToCart,
  decreaseQuantity,
  increaseQuantity,
  removeItem,
  resetCart,
  updateQuantity,
} from '../../redux/cartReducer';
import { Link } from 'react-router-dom';
import ButtonCustom from '../ButtonCustom/ButtonCustom';
import { CurrencyFormatter } from '../../Function/FormatPrice';
import { Close } from '@mui/icons-material';
import { Drawer, Select, Space } from 'antd';

const Cart = (props) => {
  const products = useSelector((state) => state.cart.products);
  const dispatch = useDispatch();
  const [selectedSize, setSelectedSize] = useState(null);
  // Lấy dữ liệu từ local storage và cập nhật initial state

  // useEffect(() => {
  //   products?.forEach((item) => {
  //     const selectedSizeData = item.sizes?.find(
  //       (size) => size.sizeName === item.size
  //     );
  //     if (selectedSizeData) {
  //       dispatch(
  //         updateQuantity({
  //           id: item.id,
  //           maxQuantity: selectedSizeData.quantity,
  //           quantity: 1,
  //           command: 'update size quantity',
  //         })
  //       );
  //     }
  //   });
  // }, [selectedSize]);
  const changeNewMaxQuantity = (newSize, id) => {
    const product = products.find((item) => item.id === id);
    const newMaxQuantity = product.sizes.find(
      (size) => size.sizeName === newSize
    );
    return newMaxQuantity.quantity;
  };

  const totalPrice = () => {
    let total = 0;
    products.forEach((item) => {
      total += item.quantity * item.price;
    });
    return total;
  };

  const handleClick = () => {
    props.setOpen(!props.open);
  };

  const checkSizeProduct = (id, size) => {
    // Kiểm tra xem có sản phẩm trong giỏ hàng có cùng id và size không
    return products.some((item) => item.id === id && item.size === size);
  };
  return (
    <>
      <Drawer onClose={handleClick} open={props.open} className="cart">
        {products?.length > 0 ? (
          <>
            <div className="header">
              <h1>Giỏ hàng</h1>
            </div>

            {products?.map((item) => (
              <div className="item" key={item.id}>
                <img src={item.img} alt="" />
                <div className="details">
                  <h1>{item.name}</h1>
                  <Space>
                    <Select
                      defaultValue={item.size}
                      value={item.size}
                      onChange={(e) => {
                        setSelectedSize(e);
                        dispatch(
                          updateQuantity({
                            id: item.id,
                            size: item.size,
                            command: 'update size',
                            newSize: e,
                            newMaxQuantity: changeNewMaxQuantity(e, item.id),
                            quantity: 1,
                          })
                        );
                      }}
                    >
                      {item.sizes?.map((size) => (
                        <Select.Option
                          value={size.sizeName}
                          key={size.sizeId}
                          disabled={checkSizeProduct(item.id, size.sizeName)}
                        >
                          {size.sizeName}
                        </Select.Option>
                      ))}
                    </Select>
                    <span>Số lượng: {item.maxQuantity}</span>
                  </Space>
                  <div className="quantity">
                    <button
                      onClick={() => {
                        dispatch(
                          decreaseQuantity({
                            id: item.id,
                            size: item.size,
                          })
                        );
                      }}
                    >
                      -
                    </button>
                    <input
                      type="text"
                      value={item.quantity}
                      onChange={(e) => {
                        const newQuantity = parseInt(e.target.value) || 0;

                        if (newQuantity <= item.maxQuantity) {
                          dispatch(
                            updateQuantity({
                              id: item.id,
                              quantity: newQuantity,
                              size: item.size,
                              command: 'update quantity',
                            })
                          );
                        }
                      }}
                      onBlur={(e) => {
                        if (item.quantity === 0) {
                          dispatch(
                            updateQuantity({
                              id: item.id,
                              quantity: 1,
                              size: item.size,
                              command: 'update quantity',
                            })
                          );
                        }
                      }}
                    />
                    <button
                      onClick={() => {
                        if (item.quantity < item.maxQuantity)
                          dispatch(
                            increaseQuantity({
                              id: item.id,
                              size: item.size,
                            })
                          );
                      }}
                    >
                      +
                    </button>
                  </div>
                  <div className="price">
                    {item.quantity} x {CurrencyFormatter(item.price)}
                  </div>
                </div>

                <DeleteOutlinedIcon
                  onClick={() => {
                    dispatch(
                      removeItem({
                        id: item.id,
                        size: item.size,
                      })
                    );
                  }}
                  className="deleteIcon"
                />
              </div>
            ))}
            <div className="total">
              <span>Tổng tiền</span>
              <span>{CurrencyFormatter(totalPrice())}</span>
            </div>
            <Link className="link" to={'/checkout'}>
              <ButtonCustom
                onClick={handleClick}
                text={'Đi tới thanh toán'}
              ></ButtonCustom>
            </Link>
            <span
              className="reset"
              onClick={() => {
                dispatch(resetCart());
              }}
            >
              Xóa toàn bộ
            </span>
          </>
        ) : (
          <div className="cart">
            <img className="empty-img" src="/empty-cart.png" alt="" />
          </div>
        )}
      </Drawer>
      {/* {products.length > 0 ? (
        <div className={`cart ${props.open ? 'open' : ''}`}>
          <div className="header">
            <h1>Giỏ hàng</h1>
            <div className="icon" onClick={handleClick}>
              <Close />
            </div>
          </div>
          {products?.map((item) => (
            <div className="item" key={item.id}>
              <img src={item.img} alt="" />
              <div className="details">
                <h1>{item.name}</h1>
                <div className="quantity">
                  <button
                    onClick={() => {
                      dispatch(decreaseQuantity(item.id));
                    }}
                  >
                    -
                  </button>
                  {item.quantity}
                  <button
                    onClick={() => {
                      dispatch(increaseQuantity(item.id));
                    }}
                  >
                    +
                  </button>
                </div>
                <div className="price">
                  {item.quantity} x {CurrencyFormatter(item.price)}
                </div>
              </div>

              <DeleteOutlinedIcon
                onClick={() => {
                  dispatch(removeItem(item.id));
                }}
                className="deleteIcon"
              />
            </div>
          ))}
          <div className="total">
            <span>Tổng tiền</span>
            <span>{CurrencyFormatter(totalPrice())}</span>
          </div>
          <Link className="link" to={'/checkout'}>
            <ButtonCustom
              onClick={handleClick}
              text={'Đi tới thanh toán'}
            ></ButtonCustom>
          </Link>
          <span
            className="reset"
            onClick={() => {
              dispatch(resetCart());
            }}
          >
            Xóa toàn bộ
          </span>
        </div>
      ) : (
        <div className={`cart ${props.open ? 'open' : ''}`}>
          <img className="empty-img" src="/empty-cart.png" alt="" />
        </div>
      )} */}
    </>
  );
};

export default Cart;
