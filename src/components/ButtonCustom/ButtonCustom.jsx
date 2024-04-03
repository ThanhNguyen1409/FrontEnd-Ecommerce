import './ButtonCustom.scss';
const ButtonCustom = (props) => {
  return (
    <div className="button-ec">
      <button
        className="button-custom"
        onClick={props.onClick}
        type={props.type}
      >
        {props.text}
      </button>
    </div>
  );
};

export default ButtonCustom;
