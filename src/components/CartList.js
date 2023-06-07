
import {useState, useEffect} from "react";
import { useNavigate } from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

import "../styles/cartList.css"

import axios from 'axios';

function CartList(props) {

    const navigate = useNavigate();
    let [cartItems, setCartItems] = useState(props.items);

    useEffect(() => {

        if (cartItems.length === 0) {
            alert("장바구니에 담긴 상품이 없습니다.");
            navigate("/");
        }

    }, [cartItems.length, navigate]);

    const handleOnClick = async () => {
        await axios
            .post('/cart/update',
                cartItems,
                {
                   headers: {
                       "Content-Type": "application/json",
                       Authorization: localStorage.getItem("token"),
                   }
                })

            .then((response) => {
                console.log(response.data);
            });

        navigate("/order");
    };

    /* Counter 에 있던 함수 */
    const handleIncrease = (itemId) => {
        const addItem = cartItems.map(item => {
            if (itemId === item.cartListId) {
                return { ...item, quantity: item.quantity + 1};
            } else return item;
        });
        setCartItems(addItem);
        props.getCartItems(addItem);
    }

    const handleDecrease = (itemId) => {
        const subtractItem = cartItems.map(item => {
            if (itemId === item.cartListId) {
                    return { ...item, quantity: item.quantity - 1};
            } else return item;
        });
        setCartItems(subtractItem);
        props.getCartItems(subtractItem);
    }

    const handleChange = (itemId) => {
        setCartItems(itemId);
        props.getCartItems(itemId);
    }
    /* * * * * */

    /** 전체 주문 예상 금액 **/
    const pricesForCart = cartItems.map(item => {
        console.log(item.price * item.quantity);
        return item.price * item.quantity;
    });

    const TotalPriceForCart = pricesForCart.reduce((a,b) => a + b, 0);
    /* * * * * * * * * * */

    return (
        <>
            <div className="cart-box">
                <div id="content-title"> 장바구니 </div>
                <div id="cart-title"> {cartItems[0]?.productName} </div>
                <div>
                {cartItems?.map((item, i) => (
                <div>
                    {( i>0 && item.productName !== cartItems[i-1].productName )? <div id="cart-title"> {item.productName} </div>:""}
                    <div className="cart-item" key={i}>
                        <li id="cart-item-title"> {item?.optionName} </li>
                        <li>
                            <div id="cart-item-count">
                                <InputGroup className="mb-3" id="cart-item-count-btn">
                                    <Button variant="outline-secondary"
                                        onClick={() => {
                                            handleDecrease(item.cartListId)
                                        }}
                                        disabled={item.quantity==1? true:false}
                                    >-</Button>
                                    <Form.Control id="cart-item-box"
                                        value={item.quantity}
                                        onChange={handleChange}
                                    />
                                    <Button variant="outline-secondary"
                                        onClick={() => {
                                            handleIncrease(item.cartListId)
                                        }}
                                    >+</Button>
                                </InputGroup>
                                <div id="cart-item-price">{item.quantity * item.price}원</div>
                            </div>
                        </li>
                    </div>
                </div>
                ))}
                </div>
            </div>
            <div className="cart-box">
                <label id="cart-price-label"> 주문 예상 금액</label>
                <span id="cart-price">{TotalPriceForCart}원</span>
                <button className="bottom-btn" type="submit"
                onClick={handleOnClick}> 주문하기 </button>
            </div>
        </>
    );
}

export default CartList;