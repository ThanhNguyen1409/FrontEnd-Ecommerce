import React, { useState } from 'react';
import EastOutlinedIcon from '@mui/icons-material/EastOutlined';
import WestOutlinedIcon from '@mui/icons-material/WestOutlined';
import './Slider.scss';

const Slider = () => {
  const [currentSlide, setcurrentSlide] = useState(0);
  const data = [
    'https://images.pexels.com/photos/1549200/pexels-photo-1549200.jpeg?auto=compress&cs=tinysrgb&w=1600',
    'https://images.pexels.com/photos/949670/pexels-photo-949670.jpeg?auto=compress&cs=tinysrgb&w=1600',
    'https://images.pexels.com/photos/837140/pexels-photo-837140.jpeg?auto=compress&cs=tinysrgb&w=1600',
  ];
  const prevSlide = () => {
    setcurrentSlide(currentSlide === 0 ? 2 : currentSlide - 1);
  };

  const nextSlide = () => {
    setcurrentSlide(currentSlide === 2 ? 0 : currentSlide + 1);
  };

  return (
    <div className="slider">
      <div
        className="slider-container"
        //Di chuyen mot anh hinh sang ben trai bang cách -100vw mỗi hình ảnh
        style={{ transform: `translateX(-${currentSlide * 100}vw)` }}
      >
        <img src={data[0]} alt="" />
        <img src={data[1]} alt="" />
        <img src={data[2]} alt="" />
      </div>
      <div className="icons">
        <div className="icon" onClick={prevSlide}>
          <WestOutlinedIcon />
        </div>

        <div className="icon" onClick={nextSlide}>
          <EastOutlinedIcon />
        </div>
      </div>
    </div>
  );
};

export default Slider;
