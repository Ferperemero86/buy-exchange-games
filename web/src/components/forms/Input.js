import React from "react";

const Input = ({type, className, name, onChange, placeholder, autoComplete, value, onFocus}) => {
    return (
        <input type={type} 
               className={className} 
               value={value}
               onFocus={onFocus}
               onChange={onChange}
               autoComplete={autoComplete}
               placeholder={placeholder}
               name={name} />
    )
}

export default Input;