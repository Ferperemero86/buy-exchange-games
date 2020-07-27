import React from "react";

const ListElement = ({className, onClick, children}) => (
    <li className={className}
        onClick={onClick}>{children}</li>
)

export default ListElement;