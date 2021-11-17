import React, {useState} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';

const Register = () => {

    const [status, setStatus] = useState('');

    const [emailReg, setEmailReg] = useState('');
    const [passwordReg, setPasswordReg] = useState('');
    // const [confirmPasswordReg, setConfirmPasswordReg] = useState('');

    const register = (e) => {
        axios.post('http://localhost:5000/register', {
            email: emailReg,
            password: passwordReg
            // confirmPassword: confirmPasswordReg
        }).then((response) => {
            if(response.data.message){
                setStatus(response.data.message)
            } else{
                setStatus(response.data.passed)
            }
        })

        e.preventDefault();
    }

    return (
        <form onSubmit={(e) => {register(e)}}>
            <h1>Register</h1>
            <div>
                <label>Email</label>
                <input type="email" placeholder='example@gmail.com' required
                    onChange={(e) => {setEmailReg(e.target.value)}}
                />
            </div>
            <div>
                <label>Password</label>
                <input type="password" placeholder='password' required
                    onChange={(e) => {setPasswordReg(e.target.value)}}
                />
            </div>	
            {/* <div>
                <label>Confirm Password</label>
                <input type="password" placeholder='confirm password' required
                    onChange={(e) => {setConfirmPasswordReg(e.target.value)}}
                />
            </div> */}
            <button type='submit'>Register</button>	
            <Link to='/login'>login</Link>		
            <h1>{status}</h1>			
		</form>
    )
}

export default Register;