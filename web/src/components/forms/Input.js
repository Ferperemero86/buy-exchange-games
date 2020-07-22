import React from "react";

const Input = ({type, className, name, onChange, placeholder, autoComplete, value}) => {
    return (
        <input type={type} 
               className={className} 
               value={value}
               onChange={onChange}
               autoComplete={autoComplete}
               placeholder={placeholder}
               name={name} />
    )
}

export default Input;