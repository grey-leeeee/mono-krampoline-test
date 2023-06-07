import { Link } from 'react-router-dom';
import "../styles/Card.css";

import { staticServerUri } from '../config';

import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Badge from 'react-bootstrap/Badge';

function Card(props) {

    return (
        <Col>
            <Link
                to={"/product/"+props.product.productId}
                style={{ textDecoration: 'none'}}
            >
                <div className="card-img">
                    <Image
                        src={staticServerUri + props.product.image}
                        rounded={true}
                        width= {300}
                        height= {200}
                    />
                </div>
                <div className="test2">
                    <li> <Badge bg="secondary"> 무료배송 </Badge> </li>
                    <li className="card-title"> {props.product.productName} </li>
                    <li className="card-price">
                    톡별가 <span>{props.product.price} 원 부터~</span> </li>
                </div>
            </Link>
        </Col>
    );
}

export default Card;