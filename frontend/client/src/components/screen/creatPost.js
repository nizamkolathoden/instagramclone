//useEffect is a hooks for component didmount,component did update
import React, { useState, useEffect } from 'react';
import M from 'materialize-css';
import { useHistory } from 'react-router-dom';
function CreatPost(props) {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [image, setImage] = useState('');
    const [url, setUrl] = useState('');
    const history = useHistory();
    const localstorage = localStorage.getItem("jwt")
    //useEffect hook is used for in here for component didupdate url
    useEffect(() => {

        if (url) {
            //create post
            fetch('/createpost', {
                method: 'Post',
                // if you didn't pass header it can't get data in backend 
                //we mention it is a json formate
                headers: {
                    'Content-Type': 'application/json',
                    //.replace for replace double qoutes in localstorage
                    "authorization": localstorage.replace(/['"]+/g, '')
                    //"authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZjczNmUzZmNhM2RiOTNmYWEyYmM0MzQiLCJpYXQiOjE2MDE0ODk5MTV9.Cy-KQiGrok3L2Nvj1jopDGF7YBDL2I4cb839x7JGV8I"
                },
                // convert text to json format
                body: JSON.stringify({
                    title,
                    body,
                    pic: url
                })
                // send the result backend in here in json
            }).then(res => res.json()).catch(e => {
                M.toast({ html: 'fill all field', classes: '#d50000 red accent-4' })
            })
                .then(data => {
                    //data have title body and url of pic data value get from backend its mainly used for any error from backend to show user and devolpers
                    console.log(data);
                    if (data.error) {
                        M.toast({ html: data.error, classes: '#d50000 red accent-4' })
                    } else {
                        M.toast({ html: 'uploadsucessfuly sucessfully', classes: '#64b5f6 blue darken-1' })
                        history.push("/")

                    }
                }).catch(e => console.log('error in push:', e))
        }
    }, [url])

    //for cloudinary when we click submit button it will call  postdetails
    const PostDetials = () => {
        //formdata object ||Currently its empty and more clarification go and read mozila doc you will understand much more about Formdata()
        const data = new FormData()

        //append the image with key value pair image is above const image 
        data.append('file', image)

        //put name of cloud upload/project name read cloudinary docs
        data.append('upload_preset', "insta_clone");

        //put name of cloud 
        data.append('cloud_name', "dnkybekht")

        //cloud base api insted fetch you can use axios like 3rd party libary
        fetch(" https://api.cloudinary.com/v1_1/dnkybekht/image/upload", {
            method: "post",
            body: data
        }).then(res => res.json()).then(data => {
            //console.log(data);
            setUrl(data.url)
            console.log("url", data.url);
        }).catch(e => console.log('error in upload', e))
    }
    return (
        <div className='card input-field'
            style={{
                margin: '30px auto',
                maxWidth: '500px',
                padding: '20px',
                textAlign: 'center'
            }}

        >
            <input type='text'
                placeholder='title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}

            />
            <input type='text'
                placeholder='Body'
                value={body}
                onChange={(e) => setBody(e.target.value)}
            />
            <div className="file-field input-field">
                <div className="btn waves-effect waves-light #64b5f6 blue darken-1">
                    <span>Upload Photo</span>
                    <input type="file"
                        onChange={e => setImage(e.target.files[0])}
                    />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                    <button className='btn waves-effect waves-light #64b5f6 blue darken-4'
                        onClick={() => PostDetials()}
                    >
                        Submit Post
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CreatPost;