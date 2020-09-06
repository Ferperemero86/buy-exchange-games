import React from "react";

const Select = ({className, children, onChange, data}) => (
    <select className={className}
            data={data}
            onChange={onChange}>{children}</select>
)

export default Select;