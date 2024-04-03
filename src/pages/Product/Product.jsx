import { useEffect, useRef, useState } from 'react';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import './Product.scss';
import useFetch from '../../hooks/useFetch';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/cartReducer';
import 'react-inner-image-zoom/lib/InnerImageZoom/styles.css';
import InnerImageZoom from 'react-inner-image-zoom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { CurrencyFormatter } from '../../Function/FormatPrice';

import { GoTop } from '../../Function/ScrollToTop';
import { Flex, Progress, Radio, Rate, Select, Skeleton, Space } from 'antd';
import ListRating from '../../components/ListRating/ListRating';
import Slider from 'react-slick';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
export const Product = () => {
  const [selectedImg, setSelectedImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [filterRating, setFilterRating] = useState([]);
  const [ratingCounts, setRatingCounts] = useState({
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  });
  const [selectedRating, setSelectedRating] = useState('all');
  const [selectedSize, setSelectedSize] = useState(null);
  const [percentages, setPercentages] = useState([]);
  const id = useParams().id;
  const { data, loading } = useFetch(`/api/products/${id}`);
  const { data: ratings } = useFetch(`/api/rating/${id}`);
  const { data: sizes } = useFetch(`/api/sizes/${id}`);
  const [sizeQuantity, setSizeQuantity] = useState(null);
  const slider1 = useRef(null);
  const slider2 = useRef(null);

  const [nav1, setNav1] = useState(() => slider1.current);
  const [nav2, setNav2] = useState(() => slider2.current);
  //Dùng truy cập vào các phương thức của cartReducer
  const dispatch = useDispatch();

  //Setting responsive cho slide product

  const notify = () =>
    toast.success('Thêm vào giỏ hàng thành công', {
      position: 'top-center',
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });
  useEffect(() => {
    if (ratings && ratings.length > 0) {
      ratings.forEach((item) => {
        const { ratingStar } = item;
        setRatingCounts((prevCounts) => ({
          ...prevCounts,
          [ratingStar]: (prevCounts[ratingStar] || 0) + 1,
        }));
      });
    }
    setFilterRating(ratings);
  }, [ratings]);

  useEffect(() => {
    const selectedSizeData = sizes?.find(
      (size) => size.sizeName === selectedSize
    );
    if (selectedSizeData) {
      setSizeQuantity(selectedSizeData.quantity);
    }
  }, [selectedSize, sizes]);
  const optionRating = [
    {
      label: `Tất cả`,
      value: 'all',
    },
    {
      label: `5 sao (${ratingCounts[5]})`,
      value: 5,
    },
    {
      label: `4 sao (${ratingCounts[4]})`,
      value: 4,
    },
    {
      label: `3 sao (${ratingCounts[3]})`,
      value: 3,
    },
    {
      label: `2 sao (${ratingCounts[2]})`,
      value: 2,
    },
    {
      label: `1 sao (${ratingCounts[1]})`,
      value: 1,
    },
  ];

  GoTop();

  const handleRatingChange = (e, name) => {
    const value = e.target.value;
    setSelectedRating(value);
    const result = ratings.filter((rating) => {
      return rating.ratingStar === value || value === 'all';
    });
    setFilterRating(result);
  };

  //Tính % các đánh giá
  useEffect(() => {
    if (ratings && ratings.length > 0) {
      const percentagesData = Object.keys(ratingCounts).map((star) => {
        const percentage = (
          (ratingCounts[star] / ratings.length) *
          100
        ).toFixed(0);
        return { star: parseInt(star), percentage };
      });
      setPercentages(percentagesData);
    }
  }, [ratingCounts]);

  const CustomPrevArrow = (props) => (
    <div className={props.className} onClick={props.onClick}>
      <ArrowBackIosNewIcon />
    </div>
  );

  const CustomNextArrow = (props) => (
    <div className={props.className} onClick={props.onClick}>
      <ArrowForwardIosIcon />
    </div>
  );
  const calculatedSlidesToShow = Math.min(data?.imageUrls?.length || 0, 4);
  const settingsMain = {
    dots: false,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    asNavFor: nav2,
  };

  const settingsNav = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: calculatedSlidesToShow,
    slidesToScroll: 1,
    asNavFor: nav1,
    focusOnSelect: true,
    centerMode: data?.imageUrls?.length < 3,
  };

  console.log(quantity);
  useEffect(() => {
    setNav1(slider1.current);
    setNav2(slider2.current);
  }, [slider1.current, slider2.current]);
  return (
    <>
      <div className="product-page">
        {loading ? (
          <Skeleton active />
        ) : (
          <>
            <div className="product-container">
              <div className="flex-colum">
                <div className="left">
                  <Slider
                    className="main-slider"
                    {...settingsMain}
                    ref={(slider) => (slider1.current = slider)}
                  >
                    {data?.imageUrls.map((imageUrl, index) => (
                      <InnerImageZoom
                        className="image-zoom"
                        src={imageUrl}
                        zoomSrc={imageUrl}
                        zoomPreload={true}
                        zoomType="hover"
                        zoomScale={1.5}
                        alt=""
                        key={index}
                        fullscreenOnMobile={true}
                      />
                    ))}
                  </Slider>
                  <Slider
                    className="nav-slider"
                    {...settingsNav}
                    ref={(slider) => (slider2.current = slider)}
                  >
                    {data?.imageUrls.map((imageUrl, index) => (
                      <img
                        key={index}
                        src={imageUrl}
                        style={{ width: 'unset' }}
                      />
                    ))}
                  </Slider>
                </div>
              </div>
              <div className="right">
                <h1>{data?.productName}</h1>

                <Space
                  size={10}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <Rate disabled allowHalf value={data?.averageRating} />
                  <p>({ratings?.length})</p>
                </Space>
                <span className="price">
                  {CurrencyFormatter(data?.productPrice)}
                </span>
                <p>{data?.productDes}</p>
                <div>
                  <Select
                    defaultValue="Size"
                    onChange={(e) => {
                      setSelectedSize(e);
                    }}
                    style={{ width: 70 }}
                  >
                    {sizes?.map((size) => (
                      <Select.Option value={size.sizeName} key={size.sizeId}>
                        {size.sizeName}
                      </Select.Option>
                    ))}
                  </Select>
                  <p>Số lượng: {sizeQuantity}</p>
                </div>
                <div className="quantity">
                  <button
                    onClick={() => {
                      setQuantity((prevQuantity) =>
                        prevQuantity === 1 ? 1 : prevQuantity - 1
                      );
                    }}
                  >
                    -
                  </button>
                  <input
                    type="text"
                    value={quantity}
                    onChange={(e) => {
                      const newQuantity = parseInt(e.target.value) || 0;

                      if (newQuantity <= sizeQuantity) {
                        setQuantity(newQuantity);
                      }
                    }}
                    onBlur={(e) => {
                      if (quantity === 0) {
                        setQuantity(1);
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      if (quantity < sizeQuantity)
                        setQuantity((prevQuantity) => prevQuantity + 1);
                    }}
                  >
                    +
                  </button>
                </div>
                <div className="addCart">
                  <button
                    className="addButton"
                    onClick={() => {
                      dispatch(
                        addToCart({
                          id: data.productId,
                          name: data.productName,
                          des: data.productDes,
                          price: data.productPrice,
                          img: data.image,
                          size: selectedSize,
                          maxQuantity: sizeQuantity,
                          sizes: sizes,
                          quantity,
                        })
                      );
                      notify();
                    }}
                  >
                    <AddShoppingCartIcon /> Thêm vào giỏ hàng
                  </button>

                  <ToastContainer />
                </div>
                <div className="links">
                  <div className="item">
                    <FavoriteBorderIcon /> ADD TO WISH LIST
                  </div>
                </div>

                <div className="info">
                  <span>DESCRIPTION</span>
                  <hr />
                  <span>ADDITIONAL INFORMATION</span>
                  <hr />
                  <span>FAQ</span>
                </div>
              </div>
            </div>
            <div className="rating-container">
              <h4 style={{ marginBottom: 15 }}>Đánh giá sản phẩm</h4>
              <Flex wrap="wrap" className="rating-info" gap={15}>
                <div className="left">
                  <Flex
                    align="center"
                    justify="center"
                    style={{ height: '100%' }}
                    vertical
                  >
                    <Flex gap={10} align="center" justify="center">
                      <span style={{ fontSize: '30px' }}>
                        {data?.averageRating}
                      </span>
                      <Rate disabled allowHalf value={data?.averageRating} />
                    </Flex>
                    <p>{ratings?.length} đánh giá</p>
                  </Flex>
                </div>
                <div className="right">
                  <Space
                    direction="vertical"
                    size="medium"
                    style={{ display: 'flex' }}
                  >
                    {[1, 2, 3, 4, 5].map((star) => {
                      const item = percentages.find(
                        (percentage) => percentage.star === star
                      );
                      const { percentage = 0 } = item || {};

                      return (
                        <Flex key={star} justify="center" align="center">
                          <p>{star} sao</p>
                          <Progress
                            percent={percentage}
                            size="small"
                            status="normal"
                          />
                        </Flex>
                      );
                    })}
                  </Space>
                </div>
              </Flex>
              <div style={{ padding: 20 }}>
                <Radio.Group
                  options={optionRating}
                  optionType="button"
                  buttonStyle="solid"
                  value={selectedRating}
                  onChange={(e) => {
                    handleRatingChange(e);
                  }}
                />
              </div>
              {filterRating && <ListRating filterRating={filterRating} />}
            </div>
          </>
        )}
      </div>
    </>
  );
};
