import React from "react";

const Span = ({className, text, onClick, data}) => (
    <span className={className}
          data={data}
          onClick={onClick}>{text}</span>
)

export default Span;