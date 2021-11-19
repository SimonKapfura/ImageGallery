import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {

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
                <div className="w-2/5">
                    <h1 className="my-4 text-3xl font-bold text-blue-900">Welcome to Comgallery</h1>
                    <p className="mb-8">Here you can upload your photos and manage them. Just login or Register if you don't have an account with us</p>
                    <div className="flex w-full justify-start">
                        <button className="mr-2 rounded-lg px-4 py-2 bg-blue-800 text-white hover:bg-blue-900 duration-300">
                            <Link to='/register'>Register</Link>
                        </button>
                        <button className="ml-2 rounded-lg px-4 py-2 border-2 border-blue-800 text-blue-800 hover:bg-blue-800 hover:text-white duration-300">
                            <Link to='/login'>Login</Link>
                        </button> 
                    </div>                    
                </div>    
                {/* right column*/}
                <div className="w-3/5 h-full">
                    <img className="w-full h-full" src="../side_photo.png" alt="" />
                </div>
            </div>
                                                        
        </div>
    )
}

export default Home;