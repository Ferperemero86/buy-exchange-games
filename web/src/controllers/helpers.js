const timeOut = (func, val, delay) => {
    const timerId = setTimeout(() => {
        func(val);
    }, delay);
    return () => clearTimeout(timerId);
};

export const clearState = (page, messagePage, updateState) => {
    if (page) {
        if (page !== messagePage) {
            console.log("Clearing messages ...");
             updateState(false);
             return null;
        }
    }
    return null;
};


export default timeOut;


