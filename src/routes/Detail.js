import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { getProductDetails, getOptions, getCartList } from '../api'

import { staticServerUri } from '../config';

// components
import Counter from "../components/Counter.js";
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import stars from '../stars.png';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';

// css
import "../styles/Detail.css";

import axios from 'axios';

function Detail() {

    const { productId } = useParams();
    let [products, setProducts] = useState();
    let [options, setOptions] = useState();

    const navigate = useNavigate();
    const [isCartListItem, setIsCartListItem] = useState(false);


    useEffect(() => {

//         product DB 읽어 오기
        getProductDetails(productId).then(res => {
            console.log(productId);
            console.log(res.data.response);
            setProducts(res.data.response);
        })

//         option DB 읽어 오기
        getOptions(productId).then(res =>{
            console.log(res.data.response);
            setOptions(res.data.response);
        })
    }, [productId]);


    let [totalCount, setTotalCount] = useState(0);
    let [cartId, setCartId] = useState(1);

    const [selectOptionListJson, setSelectOptionListJson] = useState([]);
    const onAddSelectedOptionJson = (event, optionId, i) => {
        let selectedJson = [...selectOptionListJson];

        /*
            선택된 옵션 = 장바구니에 넣을 옵션
            cartListId는 상세 페이지 옵션 리스트 순서 (0,1,2...)
        */
        const selectedOption = {
            "cartListId" : i,
            "optionId" : optionId,
            "optionName" : options[i].optionName,
            "quantity" : 1,
            "price" : options[i].price,
            "isDisabled" : true
        }

        const hasSelectedOption = selectedJson.filter(item => i === item.cartListId);
        if (hasSelectedOption.length === 0) {
            selectedJson.push(selectedOption);
            setSelectOptionListJson(selectedJson);
            setCartId(cartId+1);
            console.log(selectedJson);
            setTotalCount(totalCount+1);
        } else {
            alert("이미 선택된 옵션입니다.");
        }
    }

    const handleIncrease = (itemId) => {
        const addItem = selectOptionListJson.map(item => {
            if (itemId === item.optionId) {
                return { ...item, quantity: item.quantity +1, isDisabled: false};
            } else return item;
        })

        setSelectOptionListJson(addItem);
        setTotalCount(totalCount + 1);
        console.log(selectOptionListJson);
    }

    const handleDecrease = (itemId) => {
        const subtractItem = selectOptionListJson.map(item => {
            if (itemId === item.optionId) {
                if (item.quantity === 2)
                    return { ...item, quantity: item.quantity -1, isDisabled: true};
                else
                    return { ...item, quantity: item.quantity -1, isDisabled: false};
            } else return item;
        })

        setSelectOptionListJson(subtractItem);
        setTotalCount(totalCount - 1);
        console.log(selectOptionListJson);
    }

    /* 전체 금액 합계 */
    const priceForSelected = selectOptionListJson.map(item => {
        return item.quantity * item.price;
    });

    const totalPrice = priceForSelected.reduce((a,b) => a + b, 0);
    /* * * * * * */

    const addCartList = async () => {
        await axios
            .post('/cart/add',
                selectOptionListJson,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: localStorage.getItem("token"),
                    }
                }
            )
            .then((response) => {
                console.log(response.data);
            });

        alert("장바구니에 담겼습니다.");
    }

    const checkCartList = async () => {
        await getCartList()
            .then(res => {
                if (res.data.response !== null) {
                    const cartList = res.data.response;

                    const filterCartList = (query) => {
                        return cartList.filter((el) => el.optionId == query);
                    }

                    const filterSelectOptionList = () => {
                        return selectOptionListJson.filter((item) => filterCartList(item.optionId).length !== 0);
                    }

                    if(filterSelectOptionList().length !== 0) {
                        alert("이미 장바구니에 담긴 아이템이 있습니다.");
                    } else {
                        addCartList();
                    }
                }
            })
            .catch((err) => {
                if (err.response.status === 401) {
                    console.log("expired token");
                    alert("로그인이 필요한 서비스입니다. 다시 로그인해주세요.");
                    localStorage.removeItem("token");

                    navigate("/login");
                }
            })
    }

    const handleOnClick = async () => {

        if (localStorage.getItem("token") === null) {
            alert("로그인이 필요한 서비스입니다.");
        } else {
            if (selectOptionListJson.length === 0) {
                alert ("구매하실 상품을 선택하세요.");
            } else {
                await checkCartList();
            }
        }
    }

    const handleOnNotice = () => {
        alert("아직 서비스 중이 아닙니다.");
    }

    return (
    <div>
        <Container className="detail-grid-container">
            <Col className="detail-grid-col">
                {products &&
                <Image id="detail-grid-img"
                    src={staticServerUri + products.image}
                    rounded={true}
                />}
            </Col>
            <Col className="detail-grid-col">
                <Image
                    src={stars}
                    width={100}
                />
                <h3>
                    { products?.productName }
                </h3>

                <div id="detail-price"> 톡딜가  { products?.price } 원 ~ </div>
            </Col>
            <Col className="grid-option">
                <h6> 옵션 선택 </h6>
                <ListGroup as="ol" numbered>
                    {
                        options?.map((option,i) => {
                            return (
                                <ListGroup.Item onClick={event => onAddSelectedOptionJson(event, option.optionId, i)} key={i}
                                    as="li"
                                    className="d-flex justify-content-between align-items-start"
                                >
                                    <div  className="ms-2 me-auto" >
                                        <div className="fw-bold">{option.optionName}</div>
                                        {option.price} 원
                                    </div>
                                </ListGroup.Item>
                            );
                        })
                    }
                </ListGroup>
                <div id="detail-delivery">
                    <div><b>배송방법</b> 택배배송</div>
                    <div>
                        <b>배송비</b>
                        <Form.Control size="sm" placeholder="무료배송" disabled type="text"></Form.Control>
                        제주 추가 3,000원, 제주 외 도서지역 추가 6,000원
                    </div>
                </div>
                <div>
                {selectOptionListJson?.map((item,i) => (
                    <div id="detail-selectedItem" key={i}>
                        {console.log("item.optionId", item.optionId)}
                        {console.log("i", i)}
                        선택한 상품 : {item.optionName}
                        <Counter
                            onIncrease={() => handleIncrease(item.optionId)}
                            onDecrease={() => handleDecrease(item.optionId)}
                            disabled={item.isDisabled}
                        />
                    </div>
                ))}
                </div>

                <div>
                <div id="detail-label-total">
                    <span id="detail-label-totalCount"> 총 수량 : {totalCount} 개</span>
                    <span id="detail-label-totalPrice"> 총 주문금액 : {totalPrice} 원</span>
                </div>
                <div>
                    <Button id="detail-btn-cart"
                        style={{
                            backgroundColor: 'black',
                            color: 'white',
                            border: 'none',
                            height: 50,}}
                        onClick={handleOnClick}>
                        <img src={'/cart_white.png'} style={{height: 35}}/>
                    </Button>
                    <Button id="detail-btn-buy"
                        style={{
                            backgroundColor: '#FEE500',
                            color: 'black',
                            border: 'none',
                            height: 50}}
                        type="button"
                        onClick={handleOnNotice}>
                        톡딜가로 구매하기
                    </Button>
                </div>
                </div>
            </Col>
        </Container>
    </div>
    );
}

export default Detail;