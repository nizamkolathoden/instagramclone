//statehook we are using for state without class 
import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css';
import { UserContext } from '../../App'
function Login(props) {
    //use the context in there
    const { state, dispatch } = useContext(UserContext)
    const history = useHistory()
    //inial value set to null
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const postData = () => {
        //fetch data from backend signup and pass data to backend is atretinal way you can use axios also
        fetch('/login', {
            method: 'Post',
            // if you didn't pass header it can't get data in backend 
            //we mention it is a json formate
            headers: {
                'Content-Type': 'application/json'
            },
            // convert text to json format
            body: JSON.stringify({
                password,
                email
            })
            // send the result backend in here in json
        }).then(res => res.json()).catch(e => {
            M.toast({ html: 'user not found', classes: '#d50000 red accent-4' })
        })
            .then(data => {
                //data have token and user data we pass in backend
                console.log(data);
                if (data.error) {
                    M.toast({ html: data.error, classes: '#d50000 red accent-4' })
                } else {
                    localStorage.setItem("jwt", JSON.stringify(data.token));
                    localStorage.setItem("user", JSON.stringify(data.user));
                    dispatch({ type: 'USER', payload: data.user })
                    M.toast({ html: 'login in sucessfully', classes: '#64b5f6 blue darken-1' })
                    history.push("/")

                }
            }).catch(e => console.log('error in push:', e))

    }
    return (
        <div className='mycard'>
            <div className='card auth-card'>
                <h2>Instagram</h2>
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
                    onClick={() => postData()}
                >
                    Login
                    </button>
                <h5><Link to='/signup'> New account</Link></h5>
            </div>
        </div>

    );
}

export default Login;
