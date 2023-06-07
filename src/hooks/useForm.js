import { useState } from "react";

const useForm = ({ initialValues, onSubmit, onClick, setEmailCheck, validate}) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues({...values, [name]: value})

        if (setEmailCheck && name == "email")
            setEmailCheck(false);
    };

    const handleCheck = async (e) => {
        await onClick();
    }

    const handleSubmit = async (e) => {
        setIsLoading(true);
        e.preventDefault();

        const newErrors = validate(values);
        if (Object.keys(newErrors).length === 0) {
            await onSubmit();
        }
        setErrors(newErrors);
        setIsLoading(false);
    };

    return {
        values,
        errors,
        isLoading,
        handleChange,
        handleCheck,
        handleSubmit,
    };
};

export default useForm;