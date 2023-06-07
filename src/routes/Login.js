import useForm from '../hooks/useForm';
import ErrorText from '../components/ErrorText';
import SimpleFooter from '../components/SimpleFooter';
import { Link } from 'react-router-dom';

import { useNavigate } from 'react-router-dom'

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import "../styles/form.css";

import axios from 'axios';

function Login({onSubmit}) {
    const navigate = useNavigate();

    const sleep = () => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(), 1000);
        })
    };

    const { values, errors, isLoading, handleChange, handleSubmit} = useForm({
        initialValues: {
            email: '',
            password: ''
        },
        onSubmit: async () => {
            await sleep();

            let body = {
                "userId" : values.email,
                "password" : values.password
            };

            axios
                .post('/login', body)
                .then((response) => {
                    if (response.data === "fail")
                        alert("찾을 수 없는 회원 정보입니다.");
                    else {
                        localStorage.setItem("token", response.data);
                        console.log(response.data);
                        alert("로그인 되었습니다.");
                        navigate("/");
                    }
                });
        },
        validate: ({email, password}) => {
            const newErrors = {};
            const emailRegex =
                  /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/

            if (!email)
                newErrors.email = "이메일을 입력해주세요.";
            else if (!emailRegex.test(email))
                newErrors.email = "이메일 형식이 틀렸습니다. 다시 한번 확인해주세요.";

            if (!password) newErrors.password = "비밀번호를 입력해주세요.";

            return newErrors;
        },
    });

    console.log(values, errors);

    return (
        <div className="outBox">
            <div>
                <Link to="/">
                <img className="logoText"
                    src={'logoKakaoText.png'}
                    width = {120}
                    alt="logoKakaoText.png"
                />
                </Link>

                <div className="inBox">
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formGroupEmail">

                    <Form.Control
                        type="email"
                        name="email"
                        placeholder="이메일"
                        onChange={handleChange}
                    />
                    {errors.email && <ErrorText>{errors.email}</ErrorText>}
                    </Form.Group>

                    <Form.Control
                        type="password"
                        name="password"
                        placeholder="비밀번호"
                        onChange={handleChange}
                    />
                    {errors.password && <ErrorText>{errors.password}</ErrorText>}

                    <Button className="form-btn"
                        style={{ backgroundColor: '#FEE500', color: 'black', border: 'none'}}
                        type="submit" disabled={isLoading}>로그인</Button>
                </Form>

                <Link to="/signup" className="login-signup"
                    style={{ textDecoration: 'none' }}
                > 회원가입 </Link>
                </div>
                <SimpleFooter />
            </div>
        </div>
    );
}

export default Login;