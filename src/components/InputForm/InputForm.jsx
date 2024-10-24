import React from "react";

const InputForm = (props) => {
  const { type = "text", name, placeholder = "", value, onChange, className, ...rests } = props;

  const handleOnChangeInput = (e) => {
    onChange(e.target.value);
  };

  return (
    <input
      className={className}
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={handleOnChangeInput}
      {...rests}
    />
  );
};

export default InputForm;
