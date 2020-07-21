import React from "react";

const Input = ({type, className, name, onChange, placeholder, autoComplete}) => {
    return (
        <input type={type} 
               className={className} 
               onChange={onChange}
               autoComplete={autoComplete}
               placeholder={placeholder}
               name={name} />
    )
}

export default Input;