import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useHistory, withRouter } from 'react-router-dom';
import UrlImageDownloader from 'react-url-image-downloader';

const Photos = () => {

    const history = useHistory();   

    const [imagesList, setImagesList] = useState([]);
    const [file, setFile] = useState(null);

    const [loggedInUser, setLoggedInUser] = useState(0)

    const [status, setStatus] = useState('')

    axios.defaults.withCredentials = true;

    const [newPublicId, setNewPublicId] = useState('')

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
                }else {
                    setStatus(response.data.message)
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

    const downloadImage = (publicId) => {
        axios.get(`http://localhost:5000/download/${publicId}`).then((response) => {
            if(response){
                console.log(response)
            } else {
                console.log('error downloading')
            }
        })
    }

    useEffect(() => {        
        axios.get('http://localhost:5000/images').then((response) => {
            setImagesList(response.data)
            console.log(response.data)
        })
    }, [])

    return (
        <div>
            Welcome
            <button onClick={logout}>
                Logout
            </button>
            <div>
                <input type='file'
                    onChange={handlePic}
                />
                <button onClick={onUpload}>upload</button>
            </div>
            <h1>{status}</h1>
            <button onClick={showImages}>Show images</button>            
            {imagesList.map((val, key) => {
                return (
                    <div>
                        <div className="image">
                            <img src={val.secureUrl}/>   
                            <input type='text' placeholder='Update public id' onChange={(event) => {
                                setNewPublicId(event.target.value);
                            }}/>
                            <button onClick={() => {updateImage(val.publicId)}}>Update</button>
                            <button onClick={() => {deleteImage(val.publicId)}}>Delete</button>
                            <a href="">
                                <UrlImageDownloader imageUrl={val.secureUrl}/>                                
                            </a>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}
 
export default withRouter(Photos);
