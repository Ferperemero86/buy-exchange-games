import React from "react";

const Button = ({text, className, onClick, data, type}) => (
    <button className={className}
            data={data}
            type={type}
            onClick={onClick}>{text}</button>
   
)

export default Button;