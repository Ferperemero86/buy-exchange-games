import React from "react";

const Input = ({type, className, name, onChange, placeholder}) => {
    return (
        <input type={type} 
               className={className} 
               onChange={onChange}
               placeholder={placeholder}
               name={name} />
    )
}

export default Input;