import { Modal, Rate, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { CurrencyFormatter } from '../../../Function/FormatPrice';
import './RatingOrder.scss';
import TextArea from 'antd/es/input/TextArea';
import makeRequest from '../../../request';
export default function RatingOrder({
  open,
  handleOpen,
  handleClose,
  orderDetails,
  fetchData,
}) {
  const desc = ['quá tệ', 'tệ', 'bình thường', 'tốt', 'tuyệt vời'];
  const [ratings, setRatings] = useState({});
  const [reviews, setReviews] = useState({});

  useEffect(() => {
    orderDetails.orderDetails.forEach((item) => {
      const uniqueKey = `${item.productId}_${item.productSize}`;
      setRatings((prevRatings) => ({
        ...prevRatings,
        [uniqueKey]: 5,
      }));
    });
  }, []);
  const handleRatingChange = (productId, value, size) => {
    const uniqueKey = `${productId}_${size}`;
    setRatings((prevRatings) => ({
      ...prevRatings,
      [uniqueKey]: value,
    }));
  };

  const handleReviewChange = (productId, review, size) => {
    const uniqueKey = `${productId}_${size}`;
    setReviews((prevReviews) => ({
      ...prevReviews,
      [uniqueKey]: review,
    }));
  };

  const submitReviews = async () => {
    try {
      const reviewsData = Object.keys(ratings).map((uniqueKey) => {
        const [productId] = uniqueKey.split('_');

        return {
          orderId: orderDetails.orderId,
          productId: parseInt(productId, 10),
          ratingText: reviews[uniqueKey],
          ratingStar: ratings[uniqueKey],
        };
      });

      // const req = await makeRequest.post('/api/rating', reviewsData, {
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      // });
      console.log(reviewsData);
      setRatings({});
      setReviews({});
      handleClose();
      fetchData();
    } catch (error) {
      // Xử lý lỗi khi gửi đánh giá
      console.error('Lỗi khi gửi đánh giá:', error);
    }
  };
  console.log(ratings);
  return (
    <>
      <Modal
        title="Đánh giá đơn hàng"
        open={open}
        onCancel={handleClose}
        onOk={submitReviews}
      >
        <div className="container">
          {orderDetails.orderDetails?.map((item, index) => (
            <div className="main-content" key={index}>
              <div className="product-box">
                <img src={item.image} alt="" />
                <div className="product-des">
                  <h3>{item.productName}</h3>
                  {CurrencyFormatter(item.productPrice)}
                  <p>
                    Size: {item.productSize}
                    <br />
                    Số lượng: {item.quantity}
                  </p>
                </div>
              </div>
              <div className="rating-box">
                <Space>
                  <span>Chất lượng sản phẩm</span>
                  <Rate
                    tooltips={desc}
                    onChange={(value) =>
                      handleRatingChange(
                        item.productId,
                        value,
                        item.productSize
                      )
                    }
                    value={
                      ratings[`${item.productId}_${item.productSize}`] || 5
                    }
                  />
                  <span>
                    {ratings[`${item.productId}_${item.productSize}`]
                      ? desc[
                          ratings[`${item.productId}_${item.productSize}`] - 1
                        ]
                      : 'tuyệt vời'}
                  </span>
                </Space>
                <TextArea
                  className="text-area"
                  showCount
                  maxLength={300}
                  placeholder="Viết đánh giá của bạn"
                  style={{ height: 60, resize: 'none' }}
                  onChange={(e) =>
                    handleReviewChange(
                      item.productId,
                      e.target.value,
                      item.productSize
                    )
                  }
                  value={reviews[`${item.productId}_${item.productSize}`] || ''}
                />
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
}
