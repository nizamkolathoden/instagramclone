import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom'
//import { json } from 'express'; 
//import metiralize css for toast
import M from 'materialize-css';
const Signup = () => {
    let history = useHistory()
    //inial value set to null
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const postData = () => {
        //fetch data from backend signup and pass data to backend is atretinal way you can use axios also
        fetch('/signup', {
            method: 'Post',
            // if you didn't pass header it can't get data in backend 
            //we mention it is a json formate
            headers: {
                'Content-Type': 'application/json'
            },
            // convert text to json format
            body: JSON.stringify({
                name,
                password,
                email
            })
            // send the result backend in here in json
        }).then(res => res.json())
            .then(data => {
                //console.log(data.error);
                if (data.error) {
                    M.toast({ html: data.error, classes: '#d50000 red accent-4' })
                } else {
                    M.toast({ html: data.message, classes: '#64b5f6 blue darken-1' })
                    history.push("/login")

                }
            }).catch(e => console.log('error in push:', e))

    }
    return (
        <div>
            <div className='card auth-card'>
                <h2>Instagram</h2>
                <input type="text"
                    placeholder='name'
                    value={name}
                    onChange={(e) => setName(e.target.value)} />
                <input type="email"
                    placeholder='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input type="password"
                    placeholder='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className='btn waves-effect waves-light #64b5f6 blue darken-1'
                    onClick={() => postData()}>
                    Signup
                    </button>
                <h5><Link to='/login'> Alerady have an account</Link></h5>
            </div>
        </div>

    );
}

export default Signup
