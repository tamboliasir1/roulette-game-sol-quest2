const getReturnAmount = async (amount, ratio) => {
    return amount * ratio
}

const totalAmtToBePaid = async (amount) => {
    return amount
}

const randomNumber = async (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


module.exports = {
    getReturnAmount,
    totalAmtToBePaid,
    randomNumber
}