import React from "react";

const Select = ({className, children, onChange}) => (
    <select className={className}
            onChange={onChange}>{children}</select>
)

export default Select;