import React, { useEffect, useReducer, useRef, useState } from 'react';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutline';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Figure from 'react-bootstrap/Figure';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Checkout.scss';
import { useDispatch, useSelector } from 'react-redux';
import {
  getProvinces,
  getDistrictsByProvinceCode,
  getWardsByDistrictCode,
} from '@natpkg/vn-local';
import makeRequest from '../../request';
import {
  decreaseQuantity,
  increaseQuantity,
  removeItem,
  resetCart,
  updateQuantity,
} from '../../redux/cartReducer';
import ButtonCustom from '../../components/ButtonCustom/ButtonCustom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFormik, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { CurrencyFormatter } from '../../Function/FormatPrice';

import usePostRequest from '../../hooks/usePost';
import { alertToast } from '../../Function/AlertToast';
import { Radio, Select, Space, Spin } from 'antd';
import queryString from 'query-string';
const Checkout = () => {
  const products = useSelector((state) => state.cart.products);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.login.user);
  const formikRef = useRef();
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const { postRequest } = usePostRequest();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, SetPaymentMethod] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  //Thay đổi size và set lại số lượng về 1

  //Kiểm tra size cùng 1 sản phẩm và disable các size đã có trong giỏ hàng
  const checkSizeProduct = (id, size) => {
    // Kiểm tra xem có sản phẩm trong giỏ hàng có cùng id và size không
    return products.some((item) => item.id === id && item.size === size);
  };

  const validationSchema = Yup.object().shape({
    phone: Yup.string()
      .length(10, 'Số điện thoại phải có 10 số')
      .required('Số Điện Thoại không được để trống'),
    name: Yup.string()
      .min(2, 'Độ dài ít nhất 3 ký tự')
      .max(15, 'Độ dài nhiều nhất 15 ký tự')
      .required('Họ và Tên không được để trống'),
    address: Yup.string().required('Địa Chỉ không được để trống'),
    selectedProvince: Yup.object().shape({
      code: Yup.string().required('Tỉnh/thành không được để trống'),
      name: Yup.string().required('Tỉnh/thành không được để trống'),
    }),
    selectedDistrict: Yup.object().shape({
      code: Yup.string().required('Quận/Huyện không được để trống'),
      name: Yup.string().required('Quận/Huyện không được để trống'),
    }),
    selectedWard: Yup.object().shape({
      code: Yup.string().required('Phường/Xã không được để trống'),
      name: Yup.string().required('Phường/Xã không được để trống'),
    }),
  });

  const initialValues = {
    phone: '',
    name: '',
    address: '',
    selectedProvince: { code: '', name: '' },
    selectedDistrict: { code: '', name: '' },
    selectedWard: { code: '', name: '' },
  };
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams) {
    window.onload = async function () {
      const apiUrl = '/api/vnpay/callback';

      // Lấy các query params từ URL
      const vnp_Amount = urlParams.get('vnp_Amount');
      const vnp_BankCode = urlParams.get('vnp_BankCode');
      const vnp_BankTranNo = urlParams.get('vnp_BankTranNo');
      const vnp_CardType = urlParams.get('vnp_CardType');
      const vnp_OrderInfo = urlParams.get('vnp_OrderInfo');
      const vnp_PayDate = urlParams.get('vnp_PayDate');
      const vnp_ResponseCode = urlParams.get('vnp_ResponseCode');
      const vnp_TmnCode = urlParams.get('vnp_TmnCode');
      const vnp_TransactionNo = urlParams.get('vnp_TransactionNo');
      const vnp_TransactionStatus = urlParams.get('vnp_TransactionStatus');
      const vnp_TxnRef = urlParams.get('vnp_TxnRef');
      const vnp_SecureHash = urlParams.get('vnp_SecureHash');

      const params = queryString.stringify({
        vnp_Amount,
        vnp_BankCode,
        vnp_BankTranNo,
        vnp_CardType,
        vnp_OrderInfo,
        vnp_PayDate,
        vnp_ResponseCode,
        vnp_TmnCode,
        vnp_TransactionNo,
        vnp_TransactionStatus,
        vnp_TxnRef,
        vnp_SecureHash,
      });
      // Gọi API để xử lý thông tin từ các query params
      const apiUrlWithParams = `${apiUrl}?${params}`;
      console.log(typeof vnpAmount);
      // Gửi yêu cầu GET với đường dẫn đã được tạo ra
      await makeRequest
        .post(apiUrlWithParams)
        .then((response) => {
          console.log(response.data);
          noticeOrder('Đặt hàng thành công');
          const { address, province, district, ward, name, phone, orderTotal } =
            response.data.order;
          const req = makeRequest.post(
            `/api/orders/send_email?orderId=${vnp_TxnRef}`,
            {
              accountId: user.id,
              address,
              province,
              district,
              ward,
              orderName: name,
              orderPhone: phone,
              orderTotal: orderTotal,
            }
          );
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    };
  }
  const noticeOrder = (notice) => {
    alertToast(notice);
    dispatch(resetCart());
    formik.resetForm();
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const orderStatus =
          paymentMethod === 0 ? 'Đang xử lý' : 'Chờ thanh toán';
        const responseData = await postRequest('/api/orders', {
          accountId: user.id,
          address: values.address,
          province: values.selectedProvince.name,
          district: values.selectedDistrict.name,
          ward: values.selectedWard.name,
          orderName: values.name,
          orderStatus: orderStatus,
          orderPhone: values.phone,
          orderTotal: totalPrice(),
        });

        const vnpayLink = await postRequest('/api/vnpay/link', {
          accountId: user.id,
          address: values.address,
          province: values.selectedProvince.name,
          district: values.selectedDistrict.name,
          ward: values.selectedWard.name,
          orderName: values.name,
          orderStatus: orderStatus,
          orderId: responseData.orderId,
          orderPhone: values.phone,
          orderTotal: totalPrice(),
        });
        if (responseData) {
          // Nếu có URL trả về, thực hiện redirect
          window.location.href = vnpayLink;
        }

        for (const item of products) {
          const orderDetails = await makeRequest.post('/api/orderDetails', {
            orderId: responseData.orderId,
            productId: item.id,
            quantity: item.quantity,
            productSize: item.size,
          });
        }

        if (paymentMethod === 0) {
          const req = await makeRequest.post(
            `/api/orders/send_email?orderId=${orderId}`,
            {
              accountId: user.id,
              address: values.address,
              province: values.selectedProvince.name,
              district: values.selectedDistrict.name,
              ward: values.selectedWard.name,
              orderName: values.name,
              orderPhone: values.phone,
              orderTotal: totalPrice(),
            }
          );
          noticeOrder();
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
  });

  //Lấy dữ liệu tỉnh,quận,huyện mỗi khi code tỉnh thay đổi
  useEffect(() => {
    // Gọi getProvinces() để lấy dữ liệu tỉnh/thành phố khi component được tạo
    const fetchProvinces = async () => {
      const fetchedProvinces = await getProvinces();
      setProvinces(fetchedProvinces);
    };

    // Sử dụng useEffect để theo dõi thay đổi trong selectedProvince
    const fetchDistricts = async () => {
      if (formik.values.selectedProvince.code) {
        const fetchedDistrict = await getDistrictsByProvinceCode(
          formik.values.selectedProvince.code
        );
        setDistricts(fetchedDistrict);
      }
    };

    // Gọi getProvinces() để lấy dữ liệu tỉnh/thành phố khi component được tạo
    const fetchWards = async () => {
      if (formik.values.selectedDistrict.code) {
        const fetchedWards = await getWardsByDistrictCode(
          formik.values.selectedDistrict.code
        );
        setWards(fetchedWards);
      }
    };

    fetchProvinces();
    fetchDistricts();
    fetchWards();
  }, [
    formik.values.selectedProvince.code,
    formik.values.selectedDistrict.code,
  ]);

  //Cập nhật quận/huyện, xã theo code được chọn
  const handleSelectChange = (event, setFieldValue) => {
    const selectedCode = event.target.value;
    const selectedName = event.target.options[event.target.selectedIndex].text;

    setFieldValue(event.target.name, {
      code: selectedCode,
      name: selectedName,
    });
  };

  const totalPrice = () => {
    let total = 0;
    products.forEach((item) => {
      total += item.quantity * item.price;
    });
    return total;
  };

  const changeNewMaxQuantity = (newSize, id) => {
    const product = products.find((item) => item.id === id);
    const newMaxQuantity = product.sizes.find(
      (size) => size.sizeName === newSize
    );
    return newMaxQuantity.quantity;
  };
  const handlePaymentMethod = (e) => {
    SetPaymentMethod(e.target.value);
  };

  return (
    <Container>
      {products.length > 0 ? (
        <Row className="checkout">
          <Col>
            <Form onSubmit={formik.handleSubmit}>
              <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridPassword">
                  <Form.Label>Số Điện Thoại</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Số Điện Thoại"
                    name="phone"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.errors.phone && formik.touched.phone && (
                    <p className="error-message">{formik.errors.phone}</p>
                  )}
                </Form.Group>
              </Row>

              <Form.Group className="mb-3" controlId="FullName">
                <Form.Label>Họ và Tên</Form.Label>
                <Form.Control
                  placeholder="Họ và Tên"
                  value={formik.values.name}
                  name="name"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.name && formik.touched.name && (
                  <p className="error-message">{formik.errors.name}</p>
                )}
              </Form.Group>

              <Form.Group className="mb-3" controlId="formGridAddress2">
                <Form.Label>Địa Chỉ</Form.Label>
                <Form.Control
                  placeholder="Địa Chỉ"
                  name="address"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.address && formik.touched.address && (
                  <p className="error-message">{formik.errors.address}</p>
                )}
              </Form.Group>

              <Row className="mb-3">
                <Form.Group as={Col} controlId="formGridCity">
                  <Form.Label>Tỉnh/thành</Form.Label>
                  <Form.Select
                    name="selectedProvince"
                    value={formik.values.selectedProvince.code}
                    onChange={(event) =>
                      handleSelectChange(event, formik.setFieldValue)
                    }
                    onBlur={formik.handleBlur}
                  >
                    <option value={''}>Chọn tỉnh/thành</option>
                    {provinces?.map((item) => (
                      <option value={item.code} key={item.code}>
                        {item.name}
                      </option>
                    ))}
                  </Form.Select>
                  {formik.touched.selectedProvince &&
                    formik.errors.selectedProvince && (
                      <p className="error-message">
                        {formik.errors.selectedProvince.code}
                      </p>
                    )}
                </Form.Group>

                <Form.Group as={Col} controlId="formGridState">
                  <Form.Label>Quận/huyện</Form.Label>
                  <Form.Select
                    name="selectedDistrict"
                    value={formik.values.selectedDistrict.code}
                    onChange={(event) =>
                      handleSelectChange(event, formik.setFieldValue)
                    }
                    onBlur={formik.handleBlur}
                  >
                    <option value={''}>Chọn quận/huyện</option>
                    {districts?.map((item) => (
                      <option value={item.code} key={item.code}>
                        {item.name}
                      </option>
                    ))}
                  </Form.Select>
                  {formik.touched.selectedDistrict &&
                    formik.errors.selectedDistrict && (
                      <p className="error-message">
                        {formik.errors.selectedDistrict.code}
                      </p>
                    )}
                </Form.Group>

                <Form.Group as={Col} controlId="formGridZip">
                  <Form.Label>Phường/xã</Form.Label>
                  <Form.Select
                    name="selectedWard"
                    value={formik.values.selectedWard.code}
                    onChange={(event) =>
                      handleSelectChange(event, formik.setFieldValue)
                    }
                    onBlur={formik.handleBlur}
                  >
                    <option value={''}>Chọn phường/xã</option>
                    {wards?.map((item) => (
                      <option value={item.code} key={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </Form.Select>
                  {formik.touched.selectedWard &&
                    formik.errors.selectedWard && (
                      <p className="error-message">
                        {formik.errors.selectedWard.code}
                      </p>
                    )}
                </Form.Group>
              </Row>

              <div className="paymethod-box">
                <label>Phương thức thanh toán</label>
                <Radio.Group
                  size="large"
                  onChange={handlePaymentMethod}
                  value={paymentMethod}
                >
                  <div className="radio-box">
                    <Radio value={0}>Thanh toán khi nhận hàng</Radio>
                    <Radio value={1}>Thanh toán online </Radio>
                  </div>
                </Radio.Group>
              </div>

              <ButtonCustom type="submit" text="Đặt Hàng"></ButtonCustom>
              <ToastContainer />
            </Form>
          </Col>
          <Col className="right">
            {products?.map((item) => {
              const productTotal = item.price * item.quantity;

              return (
                <div key={item.id}>
                  <Figure>
                    <Figure.Image alt="171x180" src={item.img} />
                    <div className="details">
                      <p>
                        {item.name} X {item.quantity}
                      </p>
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
                                newMaxQuantity: changeNewMaxQuantity(
                                  e,
                                  item.id
                                ),
                                quantity: 1,
                              })
                            );
                          }}
                        >
                          {item.sizes?.map((size) => (
                            <Select.Option
                              value={size.sizeName}
                              key={size.sizeId}
                              disabled={checkSizeProduct(
                                item.id,
                                size.sizeName
                              )}
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
                      <span>{CurrencyFormatter(productTotal)}</span>
                    </div>
                    <DeleteOutlinedIcon
                      onClick={() => {
                        dispatch(removeItem(item.id));
                      }}
                      className="deleteIcon"
                    />
                  </Figure>
                </div>
              );
            })}
            <div className="prices">
              <table>
                <thead></thead>
                <tbody>
                  <tr className="line-bottom">
                    <td className="text">Tạm tính</td>
                    <td className="text-price">
                      <span>{CurrencyFormatter(totalPrice())}</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="text">Tổng cộng</td>
                    <td className="text-price">
                      <span>{CurrencyFormatter(totalPrice())}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Col>
        </Row>
      ) : (
        <div className="empty-cart">
          <img className="empty-img" src="/empty-cart.png" alt="" />
        </div>
      )}
      <Spin spinning={loading} fullscreen />
    </Container>
  );
};

export default Checkout;
