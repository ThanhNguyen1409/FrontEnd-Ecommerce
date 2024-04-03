import { Button, Col, Form, Row } from 'react-bootstrap';
import { Formik, Field, ErrorMessage, useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';

import { useState } from 'react';
import { UserCenter } from '../UserCenter';
import usePutRequest from '../../../hooks/usePut';
import { saveUser } from '../../../redux/userReducer';
import ButtonCustom from '../../../components/ButtonCustom/ButtonCustom';
const UserInformation = () => {
  const user = useSelector((state) => state.login.user);
  const [checked, setChecked] = useState(false);
  const { data, error, loading, putRequest } = usePutRequest();
  const dispatch = useDispatch();
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Email không hợp lệ')
      .required('Email không được để trống'),

    phone: Yup.string()
      .length(10, 'Số điện thoại phải có 10 số')
      .required('Số Điện Thoại không được để trống'),

    name: Yup.string()
      .min(2, 'Độ dài ít nhất 3 ký tự')
      .max(15, 'Độ dài nhiều nhất 15 ký tự')
      .required('Họ và Tên không được để trống'),
  });

  const handleCheck = (e) => {
    const value = e.target.checked;
    setChecked(value);
  };
  const initialValues = {
    email: user.email,
    phone: user.phone,
    name: user.name,
    password: '',
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      const res = await putRequest(`/api/account/update/${user.id}`, {
        accountEmail: values.email,
        accountPhone: values.phone,
        accountName: values.name,
        accountPassword: values.password,
      });
      await dispatch(
        saveUser({
          email: values.email,
          phone: values.phone,
          name: values.name,
        })
      );
    },
  });
  return (
    <form onSubmit={formik.handleSubmit}>
      <h3 className="account-title">Thông tin của tôi</h3>
      <Row className="mb-3">
        <Form.Group as={Col} controlId="formGridEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            placeholder="Email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />

          {formik.errors.email && formik.touched.email && (
            <p className="error-message">{formik.errors.email}</p>
          )}
        </Form.Group>

        <Form.Group as={Col} controlId="formGridPassword">
          <Form.Label>Họ Tên</Form.Label>
          <Form.Control
            type="text"
            placeholder="Họ tên"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />

          {formik.errors.name && formik.touched.name && (
            <p className="error-message">{formik.errors.name}</p>
          )}
        </Form.Group>
      </Row>

      <Form.Group className="mb-3" controlId="formGridAddress1">
        <Form.Label>Số Điện Thoại</Form.Label>
        <Form.Control
          type="text"
          placeholder="Số điện thoại"
          name="phone"
          value={formik.values.phone}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />

        {formik.errors.phone && formik.touched.phone && (
          <p className="error-message">{formik.errors.phone}</p>
        )}
      </Form.Group>
      <Form.Group className="mb-3" id="formGridCheckbox">
        <Form.Check
          type="checkbox"
          label="Đổi mật khẩu"
          onChange={handleCheck}
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formGridAddress2">
        <Form.Label>Mật khẩu mới</Form.Label>
        <Form.Control
          type="password"
          placeholder="Mật khẩu mới"
          name="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          disabled={!checked}
        />

        {formik.errors.password && formik.touched.password && (
          <p className="error-message">{formik.errors.password}</p>
        )}
      </Form.Group>

      <ButtonCustom text="Cập nhật" type="submit" />
    </form>
  );
};

export default UserInformation;
