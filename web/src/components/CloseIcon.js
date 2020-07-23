import React from "react";

const CloseIcon = ({onClick, data, text, className}) => (
    <span onClick={(e) => onClick(e)}
          className={className}
          data={data}>{text}</span>
)

export default CloseIcon;