// 1. 증감하는 기능
// 2. 부모 컴포넌트에게 메시지 전달
import {useState} from "react";

import PropTypes from "prop-types";

function Counter({ onIncrease, onDecrease, disabled }) {
    const [count, setCount] = useState(1);

    const handleIncrease = () => {
        setCount(count + 1);
        onIncrease(count + 1);
    }

    const handleDecrease = () => {
        setCount(count - 1);
        onDecrease(count - 1);
    }

    return (
        <div>
            <button onClick={handleDecrease} disabled={disabled}>-</button>
            {count}
            <button onClick={handleIncrease}>+</button>
        </div>
    );
}

Counter.propTypes = {
    onIncrease: PropTypes.func,
    onDecrease: PropTypes.func,
};

export default Counter;