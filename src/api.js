import axios from 'axios';

/**
    전체 상품 조회
**/
const getProducts = async (props) => {
    return await axios.get(`/products/?page=${props}`);
}

const getProductDetails = async (props) => {
    return await axios.get(`/products/${props}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
        },
    })
}

const getOptions = async (props) => {
    return await axios.get(`/products/${props}/option`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
        },
    })
}

const getOptionName = async (props) => {
    return await axios.get(`/options/${props}/name`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
        },
    })
}

const getCartList = async (props) => {
    return await axios.get('/cart', {
        headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
        },
    })
}

const getOrderList = async (props) => {
    return await axios.get(`/order/${props}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
        },
    });
}

const deleteCart = async () => {
    return await axios.delete('/cart/clear', {
        headers: {
             "Content-Type": "application/json",
             Authorization: localStorage.getItem("token"),
        }
    })
}

export {
    getProducts,
    getProductDetails,
    getOptions,
    getCartList,
    getOrderList,
    getOptionName,
    deleteCart
}