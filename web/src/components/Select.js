import React, {forwardRef} from "react";

const Select = forwardRef((props, ref) => {
    const {className, children, onChange, data} = props;

    return (
        <select className={className}
                data={data}
                ref={ref}
                onChange={onChange}>{children}</select>
    );
});

export default Select;