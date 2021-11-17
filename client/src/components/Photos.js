import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useHistory, withRouter } from 'react-router-dom';

const Photos = () => {

    const history = useHistory();   

    const [imagesList, setImagesList] = useState([]);
    const [file, setFile] = useState(null);

    const [loggedInUser, setLoggedInUser] = useState(0)

    const [status, setStatus] = useState('')

    axios.defaults.withCredentials = true;

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
        })
    }


    useEffect(() => {        
        axios.get('http://localhost:5000/images').then((response) => {
            setImagesList(response.data)
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
                    <div className="image">
                        <div>
                            <img src={val.secureUrl}/>
                        </div>                        
                    </div>
                )
            })}
        </div>
    )
}
 
export default withRouter(Photos);
