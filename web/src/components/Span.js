import React from "react";

const Span = ({className, text, onClick, data, children}) => (
    <span className={className}
          data={data}
          onClick={onClick}>{children}{text}</span>
)

export default Span;