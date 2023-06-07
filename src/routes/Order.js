import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'

import CheckedContents from '../components/CheckedContents.js';

// data
import members from '../data/members.js';
import items from '../data/carts.js';

import '../styles/order.css'
import Form from 'react-bootstrap/Form';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';

import { getCartList } from '../api'

import axios from 'axios';

function Order({route}) {

    let [orderItems, setOrderItems] = useState(items);
    let [memberInfo] = useState(members);

    let [agree, setAgree] = useState();

    const getAgree = (isAllChecked) => {
        setAgree(isAllChecked)
    }

    useEffect( () => {
        getCartList().then(res => {
            console.log(res.data.response);
            setOrderItems(res.data.response);
        })
    }, []);

    /** 전체 주문 예상 금액 **/
    const pricesForOrder = orderItems.map(item => {
    console.log(item.price * item.quantity);
        return item.price * item.quantity;
    });

    const TotalPriceForOrder = pricesForOrder.reduce((a,b) => a + b, 0);
    /* * * * * * * * * * */

    /** 배송 메세지 **/
    const [deliveryMessage, setDeliveryMessage] = useState();   // 배송 메세지
    const [selected, setSelected] = useState("");               // 배송 메세지 선택 번호 (배송 메세지가 한글이라 별도로 관리)

    const handleSelect = (e) => {

        if(e.target.value === "4") {
            setDeliveryMessage();
        } else {
            setDeliveryMessage(e.target.options[e.target.value].text);
        }
        setSelected(e.target.value);
    }
    /**************/

    const navigate = useNavigate();

    const handleOnClick = async () => {

        if(agree){
            await axios
                .post('/order/save',
                    orderItems,
                    {
                       headers: {
                           "Content-Type": "application/json",
                           Authorization: localStorage.getItem("token"),
                       }
                    })
                .then((response) => {
                    console.log(response.data[0].orderId);
                    navigate("/result", {state : {orderId: response.data[0].orderId}});
                });


        } else {
            alert("결제 조건 전체 동의가 필요합니다.");
            console.log("전체 동의가 필요합니다.");
        }
    };

    return (
        <>
        <div id="result-content">
            <div id="content-title"> 주문하기 </div>
                <div>
                    <div className="content-title-inner"> 배송지 정보 </div>
                    <div className="content-list">
                        <Button id="order-btn-delivery"
                            variant="outline-secondary"
                            size="sm"
                        >수정</Button>
                        <li> <b>{memberInfo[0].name}</b>
                            <Badge pill bg="light" text="primary">
                              기본 배송지
                            </Badge></li>
                        <li> {memberInfo[0].phone} </li>
                        <li> {memberInfo[0].address} </li>
                    </div>
                    <div className="content-basic">
                        <Form.Select value={selected} id="select" onChange={handleSelect} >
                              <option disabled={true} value="" > 배송 요청사항을 선택해주세요. </option>
                              <option value="1">배송전 연락 바랍니다.</option>
                              <option value="2">부재시 경비실에 맡겨주세요.</option>
                              <option value="3">부재시 연락주세요.</option>
                              <option value="4">직접 입력</option>
                        </Form.Select>

                        <Form.Control
                            id="textarea"
                            as="textarea"
                            placeholder="배송 요청사항을 선택하거나 입력해주세요. (최대 50자) "
                            value={deliveryMessage}
                            rows={3} />
                    </div>
                </div>
                <div>
                    <div className="content-title-inner"> 주문상품 정보 </div>
                    {orderItems?.map((item, i) => (
                        <div className="content-list" key={i}>
                            {console.log("item.optionId", item.optionId)}
                            <li> <b> {item.optionName} </b> </li>
                            <li> {item.quantity} 개 </li>
                            <li> <b>{ item.quantity * item.price }</b> 원 </li>
                        </div>
                    ))}
                </div>
            </div>
            <div className="content-box">
                <label className="content-label-price"> 총 주문 금액 </label>
                <span id="cart-price">{TotalPriceForOrder}원</span>
            </div>

            <div className="content-box-bottom">
                <CheckedContents getAgree={getAgree}/>
                <div style={{
                    padding: "10px",
                    paddingTop: "20px",
                    fontSize : "12px",
                }}>
                <b> 법적고지 </b>
                <p> (주)카카오에서 판매하는 상품 중에는 개별 판매자가 판매하는 상품이 포함되어 있습니다.
                    개별 판매자가 판매하는 상품에 대해 (주)카카오는 통신중개 판매업자로서
                    통신판매의 당사자가 아니며 상품의 주문, 배송 및 환불 등과 관련한 의무와 책임은
                    각 판매자에게 있습니다.</p>
                </div>
            <button className="bottom-btn"
                style={{ marginTop: "0px" }}
                onClick={handleOnClick}> 결제하기 </button>
            </div>
        </>
    );
}

export default Order;