module.exports = function handleMessages(response) {
    let msg = [];
    console.log(response);
    if (response.inputValidation) {
        const {inputValidation} = response;
        const {country, nickName} = inputValidation;

        if (country) {
            msg.push(country[0]);
        }
        if (nickName) {
            msg.push(nickName[0]);
        }
    }

    return msg;
}