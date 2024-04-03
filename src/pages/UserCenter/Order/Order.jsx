import React, { useEffect, useState } from 'react';
import './Order.scss';
import useFetch from '../../../hooks/useFetch';
import { CurrencyFormatter } from '../../../Function/FormatPrice';
import { Table } from 'react-bootstrap';
import { Button, Collapse, Flex, Space, Tag } from 'antd';
import ButtonCustom from '../../../components/ButtonCustom/ButtonCustom';
import RatingOrder from '../RatingOrder/RatingOrder';
import { useParams } from 'react-router-dom';
import FormatDateTime from '../../../Function/FormatDateTime';
import {
  CheckCircleOutlined,
  SyncOutlined,
  CarOutlined,
} from '@ant-design/icons';
import makeRequest from '../../../request';
export default function Order({ status }) {
  const [open, setOpen] = useState(false);
  const id = useParams().id;
  const { data, fetchData, updateData } = useFetch(`/api/orders/${id}`);
  const [orderFilterStatus, setOrderFilterStatus] = useState([]);
  const [orderDetails, setOrderDetails] = useState([]);
  const handleOpen = () => {
    setOpen(!open);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const getOrderDetails = async (orderId) => {
    //flat giúp làm phẳng mảng 2 chiều => 1 chiều
    const allOrderDetails = (orderFilterStatus ?? [])
      .map((item) => item.orderDetails)
      .flat();
    const orderDetails = allOrderDetails?.filter((item) => {
      return item.orderId === orderId;
    });
    setOrderDetails({ orderDetails: orderDetails, orderId: orderId });
  };

  useEffect(() => {
    if (data) {
      filterOrderStatus();
    }
  }, [status, data]);
  console.log('order', orderFilterStatus);
  const filterOrderStatus = () => {
    const result = data.filter((item) => {
      return item.order.orderStatus === status || status === 'all';
    });
    setOrderFilterStatus(result);
    console.log(result);
  };
  const handleChangeOrderStatus = async (status, id) => {
    try {
      const req = await makeRequest.put(
        `/api/orders/update/status/${id}`,
        `"${status}"`, // Bọc chuỗi status trong dấu ngoặc kép để truyền đúng định dạng JSON
        { headers: { 'Content-Type': 'application/json' } }
      );
      console.log(req);
      fetchData();
    } catch (error) {
      console.error('Error:', error);
    }
  };
  return (
    <div className="order-wrapper">
      {orderFilterStatus?.map((item) => {
        let tagColor, icon;

        //Thay đổi màu của trạng thái order
        switch (item.order.orderStatus) {
          case 'Đang xử lý':
            tagColor = 'processing';
            icon = <SyncOutlined spin />;
            break;
          case 'Đang giao':
            tagColor = 'warning';
            icon = <CarOutlined />;
            break;
          case 'Đã giao':
            tagColor = 'success';
            icon = <CheckCircleOutlined />;

          case 'Đã hoàn thành':
            tagColor = 'success';
            icon = <CheckCircleOutlined />;
            break;
          default:
            tagColor = 'red';
        }
        return (
          <Collapse key={item.order.orderId}>
            <Collapse.Panel
              header={
                <Flex justify="space-between" align="center">
                  <span>Mã đơn hàng: {item.order.orderId}</span>
                  <Space size="middle">
                    <span className="order-date">
                      {FormatDateTime(item.order.orderDate)}
                    </span>

                    <Tag
                      bordered={false}
                      color={tagColor}
                      icon={icon}
                      style={{ fontSize: '14px' }}
                    >
                      {item.order.orderStatus}
                    </Tag>
                  </Space>
                </Flex>
              }
            >
              <div className="order-container" key={item.order.orderId}>
                <div className="main-content">
                  {item.orderDetails.map((orderDetail, index) => (
                    <div className="item" key={index}>
                      <img src={orderDetail.image} alt="" />
                      <div className="product-des">
                        <h3>{orderDetail.productName}</h3>

                        {CurrencyFormatter(orderDetail.productPrice)}
                        <p>Size: {orderDetail.productSize}</p>
                        <p>Số lượng: {orderDetail.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bottom">
                  <div className="wrap-container">
                    <div className="address-box">
                      <h3>Địa chỉ nhận hàng</h3>
                      <p>{}</p>
                      <p>
                        {item.order.province}, {item.order.district},{' '}
                        {item.order.ward}, {item.order.address}
                      </p>
                    </div>

                    <div className="price-box">
                      <Table>
                        <tbody>
                          <tr>
                            <td>Tổng tiền hàng: </td>
                            <td>{CurrencyFormatter(item.order.orderTotal)}</td>
                          </tr>

                          <tr>
                            <td>Mã giảm giá</td>
                            <td>0</td>
                          </tr>

                          <tr>
                            <td>Phí vận chuyển</td>
                            <td>0</td>
                          </tr>

                          <tr className="total">
                            <td>Thành tiền</td>
                            <td>{CurrencyFormatter(item.order.orderTotal)}</td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                  </div>
                  <div className="button-box">
                    {(() => {
                      switch (item.order.orderStatus) {
                        case 'Đang xử lý':
                          return (
                            <>
                              <Button type="primary" danger shape="round">
                                Hủy đơn hàng
                              </Button>
                            </>
                          );
                        case 'Đang giao':
                          return (
                            <>
                              <Button
                                type="primary"
                                shape="round"
                                onClick={() => {
                                  handleChangeOrderStatus(
                                    'Đã giao',
                                    item.order.orderId
                                  );
                                }}
                              >
                                Đã nhận được hàng
                              </Button>
                            </>
                          );
                        case 'Đã giao':
                          return (
                            <>
                              <Button
                                type="primary"
                                shape="round"
                                onClick={() => {
                                  getOrderDetails(item.order.orderId);
                                  handleOpen();
                                }}
                                disabled={item.order.isRating}
                              >
                                {item.order.isRating
                                  ? 'Đã đánh giá'
                                  : 'Đánh giá '}
                              </Button>
                            </>
                          );

                        // case 'Đã hoàn thành':
                        //   return (
                        //     <>
                        //       <Button
                        //         type="primary"
                        //         shape="round"
                        //         onClick={() => {
                        //           getOrderDetails(item.order.orderId);
                        //           handleOpen();
                        //         }}
                        //         disabled={item.order.isRating}
                        //       >
                        //         {item.order.isRating
                        //           ? 'Đã đánh giá'
                        //           : 'Đánh giá '}
                        //       </Button>
                        //     </>
                        //   );
                        case 'Đã hủy':
                          return null;
                        default:
                          return null;
                      }
                    })()}
                  </div>
                </div>
              </div>
            </Collapse.Panel>
          </Collapse>
        );
      })}
      {open && (
        <RatingOrder
          open={open}
          handleOpen={handleOpen}
          handleClose={handleClose}
          data={orderFilterStatus}
          orderDetails={orderDetails}
          fetchData={fetchData}
        />
      )}
    </div>
  );
}
