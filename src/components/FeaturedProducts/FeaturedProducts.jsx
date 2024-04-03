import './FeaturedProducts.scss';

import Card from '../Card/Card';
import useFetch from '../../hooks/useFetch';
import Slider from 'react-slick';

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { HubConnectionBuilder } from '@microsoft/signalr';
const FeaturedProducts = ({ type }) => {
  const { data } = useFetch('/api/products');
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
  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    swipeToSlide: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    slidesToShow: 3,
    slidesToScroll: 3,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
          initialSlide: 0,
        },
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          initialSlide: 0,
        },
      },
      {
        breakpoint: 600,

        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,

          initialSlide: 2,
        },
      },
    ],
  };

  return (
    <div className="featuredProducts">
      <div className="top">
        <h1>{type} products</h1>
      </div>
      {data && (
        <Slider {...settings}>
          {data.map((item) => (
            <Card item={item} key={item.productId} />
          ))}
        </Slider>
      )}
    </div>
  );
};

export default FeaturedProducts;
