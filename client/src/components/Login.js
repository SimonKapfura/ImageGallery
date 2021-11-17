import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Link, useHistory} from 'react-router-dom';
 
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [status, setStatus] = useState('');
    const [id, setId] = useState('');
    const [user, setUser] = useState('');

    const history = useHistory();

    axios.defaults.withCredentials = true;

    const login = (e) => {
        axios.post('http://localhost:5000/login', {
            email: email,
            password: password
        }).then((response) => {
            if(response.data.message){
                setStatus(response.data.message)
            }else {
                // setStatus(response.data[0].email);
                history.push('/photos');
                setId(response.data[0].id)
                setUser(response.data[0].email)
                localStorage.setItem('id', (response.data[0].id))
            }        
            
        })

        e.preventDefault();
    }

    useEffect(() => {
        axios.get('http://localhost:5000/login').then((response) => {
            //console.log(response);
            if(response.data.loggedIn == true){
                setStatus(response.data.user[0].email)
            }            
        })
    }, [])

    return (
        <form onSubmit={(e) => {login(e)}}>
            <h1>Login</h1>
            <div>
                <label>Email</label>
                <input type="email" placeholder='example@gmail.com' required
                    onChange={(e) => {setEmail(e.target.value)}}
                />
            </div>
            <div>
                <label>Password</label>
                <input type="password" placeholder='password' required
                    onChange={(e) => {setPassword(e.target.value)}}
                />
            </div>	
            <button type='submit'>Login</button>
            <Link to='/register'>register</Link>    
            <h1>{status}</h1>
        </form>
    )
}

export default Login;