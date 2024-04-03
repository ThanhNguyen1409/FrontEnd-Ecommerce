import React, { useState } from 'react';
import './Login.scss';

import axios from 'axios';
import makeRequest from '../../request';
import { useDispatch, useSelector } from 'react-redux';
import { saveUser } from '../../redux/userReducer';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { alertToast } from '../../Function/AlertToast';
import usePostRequest from '../../hooks/usePost';

const Login = (props) => {
  const [authMode, setAuthMode] = useState('signin');
  const { error, postRequest } = usePostRequest();
  const dispatch = useDispatch();
  const changeAuthMode = () => {
    setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Email không hợp lệ')
      .required('Email không được để trống'),
    password: Yup.string()
      .min(6, 'Mật khẩu phải có độ dài ít nhất 6 ký tự')
      .required('Mật khẩu không được trống'),

    phone:
      authMode === 'signup'
        ? Yup.string()
            .length(10, 'Số điện thoại phải có 10 số')
            .required('Số Điện Thoại không được để trống')
        : null,
    name:
      authMode === 'signup'
        ? Yup.string()
            .min(2, 'Độ dài ít nhất 3 ký tự')
            .max(30, 'Độ dài nhiều nhất 30 ký tự')
            .required('Họ và Tên không được để trống')
        : null,
  });

  const initialValues = {
    email: '',
    phone: '',
    name: '',
    password: '',
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      if (authMode === 'signin') {
        try {
          const data = await postRequest('/api/account/login', {
            accountEmail: values.email,
            accountPassword: values.password,
          });

          // In ra dữ liệu từ phản hồi
          dispatch(
            saveUser({
              id: data.account.accountId,
              name: data.account.accountName,
              email: data.account.accountEmail,
              phone: data.account.accountPhone,
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
              expiration: data.expiration,
            })
          );
          //Đóng form login sau khi click đăng nhập
          props.onClick();
          alertToast('Đăng nhập thành công');
        } catch (error) {}
      } else {
        //Đăng ký
        try {
          const response = await makeRequest.post('/api/account/register', {
            userEmail: values.email,
            userPassword: values.password,
            userName: values.name,
            userPhone: values.phone,
          });
          const data = response.data;
          console.log(response.data); // In ra dữ liệu từ phản hồi
          // dispatch(
          //   saveUser({
          //     id: data.customerId,
          //     name: data.customerName,
          //     email: data.customerEmail,
          //     phone: data.customerPhone,
          //   })
          // );

          props.onClick();

          alertToast('Đăng ký thành công');
        } catch (error) {
          console.error(error);
        }
      }
    },
  });

  if (authMode === 'signin') {
    return (
      <div className="Auth-form-container">
        <form className="Auth-form" onSubmit={formik.handleSubmit}>
          <div className="Auth-form-content">
            <h3 className="Auth-form-title">Đăng Nhập</h3>
            <div className="text-center">
              Chưa có tài khoản?{' '}
              <span className="link-primary" onClick={changeAuthMode}>
                Đăng Ký
              </span>
            </div>
            <div className="form-group mt-3">
              <label>Email</label>
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="form-control mt-1"
              />
              {formik.errors.email && formik.touched.email && (
                <p className="error-message">{formik.errors.email}</p>
              )}
            </div>
            <div className="form-group mt-3">
              <label>Mật Khẩu</label>
              <input
                type="password"
                className="form-control mt-1"
                placeholder="Mật Khẩu"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.password && formik.touched.password && (
                <p className="error-message">{formik.errors.password}</p>
              )}
            </div>
            <div className="d-grid gap-2 mt-3">
              <p className="error-message">{error}</p>
              <button type="submit" className="btn btn-primary">
                Đăng nhập
              </button>
            </div>
            <p className="text-center mt-2">
              Quên <a href="#">Mật Khẩu?</a>
            </p>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="Auth-form-container">
      <form className="Auth-form" onSubmit={formik.handleSubmit}>
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Đăng Ký</h3>
          <div className="text-center">
            Đã có tài khoản?{' '}
            <span className="link-primary" onClick={changeAuthMode}>
              Đăng Nhập
            </span>
          </div>
          <div className="form-group mt-3">
            <label>Họ Tên</label>
            <input
              type="text"
              className="form-control mt-1"
              placeholder="Họ Tên"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.name && formik.touched.name && (
              <p className="error-message">{formik.errors.name}</p>
            )}
          </div>
          <div className="form-group mt-3">
            <label>Số Điện Thoại</label>
            <input
              type="text"
              className="form-control mt-1"
              placeholder="Số Điện Thoại"
              name="phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.phone && formik.touched.phone && (
              <p className="error-message">{formik.errors.phone}</p>
            )}
          </div>
          <div className="form-group mt-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control mt-1"
              placeholder="Email"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.email && formik.touched.email && (
              <p className="error-message">{formik.errors.email}</p>
            )}
          </div>
          <div className="form-group mt-3">
            <label>Mật Khẩu</label>
            <input
              type="password"
              className="form-control mt-1"
              placeholder="Mật Khẩu"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.errors.password && formik.touched.password && (
              <p className="error-message">{formik.errors.password}</p>
            )}
          </div>
          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary">
              Đăng Ký
            </button>
          </div>
          <p className="text-center mt-2">
            Quên <a href="#">Mật Khẩu?</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
