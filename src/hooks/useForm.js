import React from 'react'

const useForm = (callback, validate) => {

    // const [values, setValues] = React.useState({
    //     username: '',
    //     email: '',
    //     password: '',
    //     password2: ''
    // })

    const [errors, setErrors] = React.useState({})
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    // const handleChange = e => {
    //     const { name, value } = e.target
    //     setValues({
    //         ...values,
    //         [name]: value
    //     })
    // }

    const handleSubmit = e => {
        e.preventDefault();

        // setErrors(validate(values));
        setIsSubmitting(true);
    }

    React.useEffect(() => {
        if (Object.keys(errors).length === 0 && isSubmitting) {
            callback()
        }
    }, [errors])

    return { handleSubmit, errors };
}

export default useForm;