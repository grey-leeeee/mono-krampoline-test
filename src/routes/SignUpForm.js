import useForm from '../hooks/useForm';
import ErrorText from '../components/ErrorText';
import SimpleFooter from '../components/SimpleFooter';
import { Link } from 'react-router-dom';

import { useState } from "react";
import { useNavigate } from 'react-router-dom'

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import "../styles/form.css";

import axios from 'axios';

function SignUpForm({onSubmit,onClick}) {
    const navigate = useNavigate();
    const [emailCheck, setEmailCheck] = useState(false);

    const sleep = () => {
        return new Promise((resolve) => {
            setTimeout(() => resolve(), 1000);
        })
    };

    const { values, errors, isLoading, handleChange, handleCheck, handleSubmit} = useForm({
        initialValues: {
            email: '',
            name: '',
            password: '',
            passwordConfirm: ''
        },
        onSubmit: async () => {
            await sleep();

            let body = {
                "email" : values.email,
                "password" : values.password,
                "userName" : values.name
            };

            axios
                .post('/join', body)
                .then((res) => console.log(res));

            alert(values.name + "님, 로그인 화면으로 이동합니다.");

            console.log("Submit!");

            navigate("/login");
        },
        onClick: async () => {
            let body =  {
                "email" : values.email
            };

            axios
                .post('/check', body)
                .then((res) => {
                    if (res.data === "available") {
                        alert("사용 가능한 이메일입니다.");
                        setEmailCheck(true);
                    }
                    else {
                        alert("이미 사용중인 이메일입니다.");
                        setEmailCheck(false);
                    }
                });
        },
        setEmailCheck,
        validate: ({email, name, password, passwordConfirm}) => {
            const newErrors = {};
            const emailRegex =
                  /([\w-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/

            if (!email)
                newErrors.email = "이메일을 입력해주세요.";
            else if (!emailRegex.test(email))
                newErrors.email = "이메일 형식이 틀렸습니다. 다시 한번 확인해주세요.";
            else if (emailCheck == false)
                newErrors.email = "이메일 중복 확인을 해주세요.";

            if (!name) newErrors.name = "이름을 입력해주세요.";
            if (!password) newErrors.password = "비밀번호를 입력해주세요.";
            if (password !== passwordConfirm) newErrors.passwordConfirm = "비밀번호가 일치하지 않습니다.";
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
                    alt="logoKakaoText.png"
                    width = {120}
                />
                </Link>

                <div className="inBox">
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formGroupEmail">
                        <label className="form-label"> 이메일 (아이디) </label>
                            <Form.Control
                                type="email"
                                name="email"
                                placeholder="이메일"
                                onChange={handleChange}
                            />
                            <Button className="form-btn-email-check"
                                variant="outline-secondary"
                                onClick={handleCheck}
                                > 이메일 중복 확인
                            </Button>
                            {errors.email && <ErrorText>{errors.email}</ErrorText>}
                    </Form.Group>

                    <label className="form-label"> 이름 </label>
                    <Form.Control
                        type="text"
                        name="name"
                        placeholder="이름"
                        onChange={handleChange}
                    />
                    {errors.name && <ErrorText>{errors.name}</ErrorText>}

                    <label className="form-label"> 비밀번호 </label>
                    <Form.Control
                        type="password"
                        name="password"
                        placeholder="비밀번호"
                        onChange={handleChange}
                    />
                    {errors.password && <ErrorText>{errors.password}</ErrorText>}

                    <label className="form-label"> 비밀번호 확인 </label>
                    <Form.Control
                        type="password"
                        name="passwordConfirm"
                        placeholder="비밀번호 확인"
                        onChange={handleChange}
                    />
                    {errors.passwordConfirm && <ErrorText>{errors.passwordConfirm}</ErrorText>}

                    <Button className="form-btn"
                        style={{ backgroundColor: '#FEE500', color: 'black', border: 'none'}}
                        type="submit" disabled={isLoading}>회원가입</Button>
                </Form>
                </div>
                <SimpleFooter />
            </div>
        </div>
    );
}

export default SignUpForm;