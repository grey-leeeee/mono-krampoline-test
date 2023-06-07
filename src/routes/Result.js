import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import '../styles/result.css';

import { getOrderList, deleteCart } from '../api'

import axios from 'axios';

function Result() {

    let [orderItems, setOrderItems] = useState();

    const {state} = useLocation();
    const {orderId} = state;

    useEffect(() => {
        console.log(orderId);
        getOrderList(orderId).then(res => {
            const order = res.data.response;

            setOrderItems(() => order);
            getTotalPrice(res.data.response);
        })

        return() => {

            deleteCart().then(res => {
            })
        }
    }, []);

    /** 전체 주문 금액 **/
    const [totalPrice, setTotalPrice] = useState(0);

    const getTotalPrice = (props) => {
        const pricesForOrder = props.map(item => {
            console.log("getTotalprice", item.price * item.quantity);
            return item.price * item.quantity;
        });

        const TotalPriceForOrder = pricesForOrder.reduce((a,b) => a + b, 0);
        console.log(TotalPriceForOrder);
        setTotalPrice(TotalPriceForOrder);
    }
    /* * * * * * * * */

    const navigate = useNavigate();

    const handleOnClick = () => {
        navigate("/");
    }

    return (
        <>
            <div id="result-title">
                <h3> 구매완료! </h3>
                <p>구매가 정상적으로 완료되었습니다. </p>
            </div>

            <div id="result-content">
                <div id="content-title"> 주문상품 정보 </div>
                    <div>
                        <table>
                        <tbody>
                            <tr><td>상품명</td><td>{orderItems?.[0].productName}</td></tr>
                            <tr><td>주문번호</td><td>1</td></tr>
                            <tr><td>옵션</td><td>{orderItems?.[0].optionName}</td></tr>
                        </tbody>
                        </table>
                    </div>
            </div>

            <div className="cart-box">
                <label id="cart-price-label"> 일반 결제 금액 </label>
                <span id="cart-price">{totalPrice}원</span>
                <button className="bottom-btn" onClick={handleOnClick}> 쇼핑 계속하기 </button>
            </div>
        </>
    );
}

export default Result;