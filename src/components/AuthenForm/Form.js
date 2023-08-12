import React from 'react'
import Signup from './SignUp'
import FormSuccess from './FormSuccess'
import './Form.css'

const Form = () => {

  const [isSubmited, setIsSubmited] = React.useState(false)

  function submitForm() {
    setIsSubmited(true);
  }

  return (
    <>
      <div className="form-container">
        <span className="close-btn">x</span>
        <div className="form-content-left">
          <img src="img/img-2.svg" alt="spaceship" className="form-img" />
        </div>
        {!isSubmited ? (<Signup submitForm={submitForm} />) : (<FormSuccess />)}
      </div>
    </>
  )
}

export default Form