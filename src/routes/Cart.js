import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'

// component
import CartList from "../components/CartList.js";

import "../styles/cart.css"

// data
import { getCartList } from '../api'

function Cart() {

    const navigate = useNavigate();

    let [cartItems, setCartItems] = useState();

    useEffect(() => {
        if (localStorage.getItem("token") === null) {
            alert("로그인이 필요한 서비스입니다.");
            navigate("/login");
        } else {
            getCartList()
            .then(res => {
                console.log(res.status);
                console.log(res.data.response);
                setCartItems(res.data.response);
            })
            .catch((err) => {
                if (err.response.status === 401) {
                    console.log("expired token");
                    alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
                    localStorage.removeItem("token");
                    navigate("/login");
                }
            })
        }

        document.body.classList.add('cart-bg');
        document.body.style.backgroundColor= "#F5F4F4";

        return() => {
            document.body.style.backgroundColor= null;
            document.body.classList.remove('cart-bg');
        }
    }, [navigate]);

    const getCartItems = (products) => {
        setCartItems(products);
    }

    return (
        <>
            {cartItems &&
                <CartList
                    items={cartItems}
                    getCartItems={getCartItems}
                />
            }
        </>
    );
}

export default Cart;