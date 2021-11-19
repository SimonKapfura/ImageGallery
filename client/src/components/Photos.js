import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useHistory, withRouter } from 'react-router-dom';
import { saveAs } from 'file-saver'

const Photos = () => {

    const history = useHistory();   

    const [imagesList, setImagesList] = useState([]);
    const [file, setFile] = useState(null);

    const [loggedInUser, setLoggedInUser] = useState(0)

    const [status, setStatus] = useState('')

    axios.defaults.withCredentials = true;

    const [newPublicId, setNewPublicId] = useState('')

    const [color, setColor] = useState('')

    const [updateStatus, setUpdateStatus] = useState('')

    const [updateColor, setUpdateColor] = useState('')

    const logout = () => {
        axios.get('http://localhost:5000/logout').then(response => {
            if(response.data.message){
                console.log(response.data.message);
            } else {
                console.log(response.data.result);
                localStorage.clear();
                history.push('/')
            }
            
        })
    }

    const handlePic = (e) => {
        const pic = e.target.files[0];
        setFile(pic);
    }

    const onUpload = () => {
        let formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'koketjogallery')

        fetch('https://api.cloudinary.com/v1_1/koketjosethobja/image/upload', {
            method: 'POST',
            body: formData
        }).then((res) => res.json())
        .then((res) => {
            console.log(res);
            const img_publicId = res.public_id;
            const img_size = res.bytes / Math.pow(1024, 2);
            const img_uploadDate = res.created_at;
            const img_format = res.format;
            const img_fileName = res.original_filename;
            const img_secureUrl = res.secure_url;
            const img_height = res.height;
            const img_width = res.width;
            const id = localStorage.getItem('id')
            axios.post('http://localhost:5000/upload', {
                publicId: img_publicId,
                fileName: img_fileName,
                uploadDate: img_uploadDate,
                secureUrl: img_secureUrl,
                size_in_mb: img_size,                
                format: img_format,                                
                height: img_height,
                width: img_width,
                user_id: id
            }).then((response) => {                
                if(response.data.error){
                    setStatus(response.data.error)
                    setColor('red')
                }else {
                    setStatus(response.data.message)
                    setColor('green')
                }
                // console.log(response)
            }).then(() => {
                setImagesList([
                    ...imagesList, {
                        publicId: img_publicId,
                        fileName: img_fileName,
                        uploadDate: img_uploadDate,
                        secureUrl: img_secureUrl,
                        size_in_mb: img_size,                
                        format: img_format,                                
                        height: img_height,
                        width: img_width,
                        user_id: id
                    }
                ])
            })
        })
    }    

    const showImages = () => { 
        const id = +localStorage.getItem('id')
        axios.get('http://localhost:5000/images',{
            uid: id
        }).then((response) => {
            setImagesList(response.data)
            console.log(response.data.publicId)
        })
    }

    const updateImage = (publicId) => {
        axios.put('http://localhost:5000/update', {newPublicId: newPublicId, publicId: publicId}).then((response) => {            
            setImagesList(imagesList.map((val) => {
                return val.publicId == publicId ? {
                    publicId: val.publicId,
                    fileName: val.fileName,
                    uploadDate: val.uploadDate,
                    secureUrl: val.secureUrl,
                    size_in_mb: val.size_in_mb,                
                    format: val.format,                                
                    height: val.height,
                    width: val.width,
                    user_id: val.user_id
                } : val
            }))
        })
    }

    const deleteImage = (publicId) => {
        axios.delete(`http://localhost:5000/delete/${publicId}`).then((response) => {
            setImagesList(imagesList.filter((val) => {
                return val.publicId != publicId
            }))
        })
    }

    useEffect(() => {        
        axios.get('http://localhost:5000/images').then((response) => {
            setImagesList(response.data)
            console.log(response.data)            
        })
    }, [])

    const user = localStorage.getItem('user')

    return (
        <div>
            {/* navbar */}
            <div className="photo-nav w-full flex items-center justify-between flex-wrap bg-black pl-6 pr-6 pt-3 pb-3">
                <div className="w-1/5 flex items-center justify-center flex-shrink-0 text-white mr-6">
                    <img className="fill-current h-8 w-8 mr-1" src="../logo.svg" alt="" />
                    <span className="font-semibold text-xl tracking-tight"><b>Com</b>gallery</span>
                </div>
                <div className="email-logout w-1/5 flex items-center justify-around">
                    <p className="text-white">{user}</p>
                    <button onClick={logout}
                        className="text-white rounded-lg px-2 py-1 bg-red-500 hover:bg-red-800 duration-300"
                    >
                        Logout
                    </button>
                </div>                
            </div> 
            {/* second nav */}
            <div className="second-nav w-full flex items-center justify-around flex-wrap bg-gray-900 pl-6 pr-6 pt-2 pb-2 text-white">
                <div className="flex justify-around items-center w-2/5">
                    <input 
                        className="cursor-pointer bg-gray-700 rounded-lg shadow"
                        type='file'
                        onChange={handlePic}
                    />
                    <button 
                        className="rounded-lg bg-green-500 py-0.5 px-3 hover:bg-green-800 duration-300"
                        onClick={onUpload}>upload
                    </button>
                </div>
                <h1 className="w-1/5"
                    style={{color: color}}>{status}
                </h1>
            </div>    
            <div className="flex w-full justify-start items-center px-10 py-1">
                <h1 className="font-bold text-2xl">Photos</h1>         
                <button
                    className="ml-4 rounded-lg px-2 py-2 bg-blue-800 text-white hover:bg-blue-900 duration-300"
                    onClick={showImages}>Reload images
                </button> 
            </div>     
            <div className="images-grid grid 2xl:grid-cols-6 grid-cols-4 gap-4 grid-flow-row px-4 pb-6">
                {imagesList.map((val, key) => {
                    return (                    
                        <div>
                            <div className="w-full rounded p-2 bg-gray-900 text-white">
                                <div className="flex items-center pb-1">
                                    <p>{val.publicId}</p>
                                </div>
                                <img 
                                    className="w-full h-60 rounded"
                                    alt="ImageName"
                                    src={val.secureUrl}
                                />   

                                <div className="w-full h-0/5 mt-2 rounded flex items-center justify-between">
                                    <div className="dropdown inline-block relative">
                                        <button className="flex hover:text-blue-600 duration-300">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <div className="dropdown-menu absolute hidden rounded bg-gray-700 p-1">
                                            <input 
                                                className="shadow py-1 px-2 border rounded focus:outline-none focus:ring focus:border-blue-900 text-black"
                                                type='text' placeholder='Update public id' onChange={(event) => {
                                                setNewPublicId(event.target.value);
                                            }}/>
                                            <div className="flex items-center justify-between">
                                                <button 
                                                    className="mr-2 rounded-lg px-3 py-1 mt-1 bg-blue-800 text-white hover:bg-blue-900 duration-300"
                                                    onClick={() => {updateImage(val.publicId)}}>Update
                                                </button>
                                                <p style={{color: updateColor}}>{updateStatus}</p>
                                            </div>
                                            
                                        </div>     
                                    </div>    
                                    <div className="flex">
                                        <button 
                                            className="mr-2 hover:text-red-600 duration-300"
                                            onClick={() => {deleteImage(val.publicId)}}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => saveAs(val.secureUrl, 'image')}                                            
                                            className="mr-2 hover:text-green-600 duration-300"
                                        >                                                                                        
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                        </button>
                                    </div>                                                                                                   
                                </div>   

                            </div>
                        </div>                                        
                    )
                })}
            </div>                                                
        </div>
    )
}
 
export default withRouter(Photos);
