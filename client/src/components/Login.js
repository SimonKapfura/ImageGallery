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
                localStorage.setItem('user', (response.data[0].email))
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
        <div className="w-full h-screen flex items-center flex-col bg-cover bg-right" style={{backgroundImage: "url("+ "../bg.svg" +")"}}>
            {/* nav */}
            <div className="w-full h-1/6 container p-6 flex">
                <div className="w-1/4 flex items-center justify-center flex-shrink-0 text-black">
                    <img className="fill-current h-14 w-14 mr-1" src="../logo.svg" alt="" />
                    <span className="font-semibold text-2xl tracking-tight"><b>Com</b>gallery</span>
                </div>
            </div>

            {/* main */}
            <div className="container w-full h-5/6 px-8 flex flex-wrap flex-col items-center justify-center">
                {/* left column */}
                <form className="w-2/5 px-8" onSubmit={(e) => {login(e)}}>
                    <h1 className="my-4 text-3xl font-bold text-blue-900 uppercase">Login</h1>
                    <div className="w-full mb-4">
                        <label className="block font-bold mb-2">Email</label>
                        <input 
                            className="shadow w-full border rounded py-2 px-3 focus:outline-none focus:ring focus:border-blue-900"
                            type="email" placeholder='example@gmail.com' required
                            onChange={(e) => {setEmail(e.target.value)}}
                        />
                    </div>
                    <div className="w-full mb-2">
                        <label className="block font-bold mb-2">Password</label>
                        <input 
                            className="shadow w-full border rounded py-2 px-3 focus:outline-none focus:ring focus:border-blue-900"
                            type="password" placeholder='Password' required
                            onChange={(e) => {setPassword(e.target.value)}}
                        />
                    </div>	
                    <h1 className="text-red-500">{status}</h1>
                    <div className="flex w-full justify-start mt-6">
                        <button 
                            className="mr-2 rounded-lg px-4 py-2 bg-blue-800 text-white hover:bg-blue-900 duration-300"
                            type='submit'>
                            Login
                        </button>
                        <button
                            className="ml-2 rounded-lg px-4 py-2 border-2 border-blue-800 text-blue-800 hover:bg-blue-800 hover:text-white duration-300"
                        >
                            <Link to='/register'>register</Link>  
                        </button>
                    </div>                                                              
                </form>
                {/* right column*/}
                <div className="w-3/5 h-full">
                    <img className="w-full h-full" src="../side_photo.png" alt="" />
                </div>
            </div>                                                        
        </div>        
    )
}

export default Login;