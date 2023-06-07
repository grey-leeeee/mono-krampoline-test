import { useState, useEffect, useRef } from 'react';
// api
import PropTypes from "prop-types";

import { getProducts } from '../api';
import axios from 'axios';

// components
import Card from '../components/Card';

// css
import Container from 'react-bootstrap/Container';
import "../styles/Card.css";

function ProductMain() {

    let [products, setProducts] = useState([]);
    let [page, setPage] = useState(0);

    const bottomObserver = useRef(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        io.observe(bottomObserver.current);
    }, [loading]);

    useEffect(() => {
        getNextPages();
    }, [page]);

    const getNextPages = async () => {
        try {
            const res = await getProducts(page);
            products.push(...res.data.response);
            setProducts(products => products);
        } catch (e) {
            console.log(e);
        }

        setLoading((check: boolean) => !check);
    }

    const io = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting)
                return;

            if (!loading && entry.isIntersecting && bottomObserver.current) {
                setPage(page => page + 1);
            }
        })
    },
    { threshold: 0.25 });

    return (
        <>
            <Container className="grid-container" >
                {
                    products.map((a,i) => {
                        return <Card product={a} key={i} />
                    })
                }
            </Container>
            <div ref={bottomObserver}/>
        </>
    );
}

ProductMain.propTypes = {
    getNextPage: PropTypes.func
};

export default ProductMain;