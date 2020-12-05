import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../App'
import { useParams } from 'react-router-dom'


const User = () => {
    const [userProfile, setProfile] = useState([])

    const { state, dispatch } = useContext(UserContext)
    console.log(state);
    console.log('followers', userProfile);
    const localstorage = localStorage.getItem('jwt')
    const { id } = useParams()
    console.log(id);
    useEffect(() => {
        fetch(`/user/${id}`, {
            headers: {
                "authorization": localstorage.replace(/['"]+/g, '')
            }
        }).then(res => res.json()).then(mypost => {
            console.log(mypost);
            setProfile(mypost);



        })
    }, [])

    const followUser = () => {
        fetch('/follow', {
            method: 'Put',
            headers: {
                'Content-Type': 'application/json',
                "authorization": localstorage.replace(/['"]+/g, '')
            },
            body: JSON.stringify({
                followid: id
            })
        }).then(res => res.json()).then(data => {
            console.log(data.following);
            dispatch({ type: 'update', payload: { followers: data.followers, following: data.following } })
            localStorage.setItem('user', JSON.stringify(data))
            //in prev have value of prevasse data stored in setProfile
            setProfile((prev) => {
                console.log(prev);
                return {
                    // we spread prev bcz in data have only user data
                    ...prev,
                    // user:data,

                    user: {
                        // we spread prev.user bcz in data have value of loggedin user data
                        ...prev.user,
                        // append the logged user id in to user(guest) followers section
                        followers: [...prev.user.followers, data._id]
                    }
                }

            })

        })
    }


    const unfollowUser = () => {
        fetch('/unfollow', {
            method: 'put',
            headers: {
                'Content-Type': 'application/json',
                "authorization": localstorage.replace(/['"]+/g, '')
            },
            body: JSON.stringify({
                unfollowid: id
            })
        }).then(res => res.json()).then(data => {
            console.log(data);
            dispatch({ type: 'update', payload: { following: data.following, followers: data.followers } })
            localStorage.setItem('user', JSON.stringify(data))
            setProfile((prev) => {
                console.log(prev);
                const newFollower = prev.user ? prev.user.followers.filter(item => item !== data._id) : console.log(null);
                console.log(newFollower);
                return {
                    // we spread prev bcz in data have only user data
                    ...prev,
                    // user:data,

                    user: {
                        // we spread prev.user bcz in data have value of loggedin user data
                        ...prev.user,
                        // append the logged user id in to user(guest) followers section
                        followers: newFollower
                    }
                }

            })
        })
    }


    return (
        <div>
            <div style={{

                display: 'flex',
                justifyContent: 'space-around',
                margin: '18px  0px',
                borderBottom: '1px solid gray'

            }}>
                <div>
                    <img alt='sorry' style={{ width: '160px', height: '160px', borderRadius: '60px' }}
                        src='data:image/jpeg;base64,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' />
                </div>
                <div>
                    <h4>{userProfile.user ? userProfile.user.name : 'loading..'}</h4>
                    <div className='row' /* style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: '108%',
                    }} */>
                        <h5>{userProfile.posts ? userProfile.posts.length : 0} Posts</h5>
                        <h5>{userProfile.user ? userProfile.user.followers.length : 'Loading'} followers</h5>
                        <h5>{userProfile.user ? userProfile.user.following.length : 'Loading'} following</h5>
                        {userProfile.user ? userProfile.user.followers.includes(state._id) ?
                            <button className='btn' style={{ color: 'black', background: '#f6f5f4' }}
                                onClick={() => unfollowUser()}>
                                unfollow
                    </button> :
                            <button className='btn waves-effect waves-light #64b5f6 blue darken-1'
                                onClick={() => followUser()}>
                                follow
                    </button> : <h1>Loading</h1>
                        }

                    </div>
                </div>
            </div>
            <div className='gallery'>
                {
                    userProfile.posts ? userProfile.posts.map(user => {
                        return (
                            <>
                                <div className='card home-card'>
                                    <h5>{user.title}</h5>
                                    <div className='card-image'>
                                        <img alt='sorry'
                                            src={user.photo} />
                                        <div className='card-content'>
                                            <i className="material-icons" style={{ color: "red" }}>favorite</i>
                                            <h6>{user.likes.length} likes</h6>
                                            <p>{user.body}</p>
                                            <input type='text' placeholder='comments' />
                                        </div>
                                    </div>
                                </div>

                            </>
                        )
                    }) : <h2>Loading..!</h2>
                }




            </div>
        </div>
    );
}

export default User;