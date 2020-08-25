import React from "react";

const Option = ({value, children, onClick}) => (
    <option value={value} onClick={onClick}>{children}</option>
)

export default Option;