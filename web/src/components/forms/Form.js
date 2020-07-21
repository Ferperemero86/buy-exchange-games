import React, {forwardRef} from "react";

const Form = ({className, children}, ref) => {
    return (
        <form className={className}
              ref={ref}>{children}</form>
    )
}

const ForwardForm = forwardRef(Form);

export default ForwardForm;