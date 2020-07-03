import React from "react";

const Button = ({text, className, onClick, data}) => {
    return(
        <button className={className}
                data={data}
                onClick={onClick}>{text}</button>
    )
}

export default Button;