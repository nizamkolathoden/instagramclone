import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../App';
import {Link} from 'react-router-dom'
function Home() {
  const [data, setData] = useState([]);
  const localstorage = localStorage.getItem('jwt')
  const [commentsA, setCommentsA] = useState('')
  //state have value of user logedin 
  const { state, dispatch } = useContext(UserContext)
  useEffect(() => {
    fetch('/allpost', {
      headers: {
        "authorization": localstorage.replace(/['"]+/g, '')
      }
    }).then(res => res.json()).then(responce => {
      setData(responce.sucess)

      // console.log(responce.sucess);

    });

  }, [])
  console.log(data);
  const likePost = (id) => {
    fetch('/like', {
      method: 'Put',
      headers: {
        'Content-Type': 'application/json',
        "authorization": localstorage.replace(/['"]+/g, '')
      },
      body: JSON.stringify({
        postId: id
      })
    }).then(res => res.json()).then(result => {
      // console.log(result);
      const newData = data.map(item => {
        if (item._id === result.sucess._id) {
          return result.sucess
        } else {
          return item
        }
      })
      setData(newData)
    }).catch(err => console.log('error in like', err))
  }

  const unlikePost = (id) => {
    fetch('/unlike', {
      method: 'Put',
      headers: {
        'Content-Type': 'application/json',
        "authorization": localstorage.replace(/['"]+/g, '')
      },
      body: JSON.stringify({
        //its id is the postes id
        postId: id
      })
    }).then(res => res.json()).then(result => {
      const newData = data.map(item => {
        // console.log(item);
        //checking postid
        if (item._id === result.sucess._id) {
          return result.sucess
        } else {
          return item
        }
      })
      setData(newData)



    })
  }

  const makeComment = (text, postId) => {
    fetch('/comment', {
      method: 'Put',
      headers: {
        'Content-Type': 'application/json',
        "authorization": localstorage.replace(/['"]+/g, '')
      },
      body: JSON.stringify({
        postId,
        text
      })

    }).then(res => res.json()).then(result => {
      console.log(result);
      const newData = data.map(item => {
        // console.log(item);
        //checking postid
        if (item._id === result.sucess._id) {
          return result.sucess
        } else {
          return item
        }
      })
      setData(newData)
    }).catch(err => console.log('error at comment', err))

  }

  const deletePost = (id) => {
    fetch(`/deletepost/${id}`, {
      method: 'delete',
      headers: {
        "authorization": localstorage.replace(/['"]+/g, '')
      },

    }).then(res => res.json())
      .then(result => {
        const newData = data.filter(item => {
          return item._id !== result.sucess._id
        })
        setData(newData)
        console.log(result);
      })
  }
  const deleteComment = (id, postId) => {
    fetch(`/deletecomment/${id}`, {
      method: 'delete',
      headers: {
        "authorization": localstorage.replace(/['"]+/g, ''),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        postId: postId
      })
    }).then(res => res.json()).then(result => {
      const newData = data.map(item => {
        console.log('item:', item, 'result:', result);
        //we checking the id of the post and the id of result we send in backend is equel we return what data we get in result 
        if (item._id == result.sucess._id) {
          return result.sucess
        } else {
          return item
        }
      })
      setData(newData)

    })
  }
  return (
    <div>
      {
        data.map((item, index) => {
          console.log(item.comments);
          return (
            <div key={index} className='home'>
              <div className='card home-card'>
                <h5><Link style={{color:'!important blue'}}  to={item.postedBy._id == state._id ? '/profile' : '/profile/'+item.postedBy._id}>{item.postedBy.name}</Link>{item.postedBy._id == state._id ? <i className="material-icons" style={{ float: "right", cursor: 'pointer' }}
                  onClick={() => deletePost(item._id)}>delete</i> : ''} </h5>


                <div className='card-image' style={{ border: ' solid 1px white' }}>
                  <img alt='sorry'
                    src={item.photo} style={{ border: ' solid 1px white' }} />
                  <div className='card-content'>
                    {
                      //includes a function that return true or false value for checking data in array for more read mozila doc
                      item.likes.includes(state._id)
                        ?
                        <i className="material-icons" style={{cursor:'pointer',color:'red'}} 
                        onClick={() => unlikePost(item._id)}>favorite</i>
                        :
                        <i className="material-icons" style={{ color: "black", cursor: 'pointer' }}
                          onClick={() => likePost(item._id)}>favorite_border</i>

                    }

                    <h6>{item.likes.length} Likes</h6>
                    <h4>{item.title}</h4>
                    <p>{item.body}</p>
                    {
                      item.comments.map(comment => {

                        return (
                          <h6 key={comment._id}><span>{comment.postedBy.name}:</span> {comment.text}

                            {comment.postedBy._id == state._id ? <i className="material-icons" style={{ float: "right", cursor: 'pointer' }}
                              onClick={() => deleteComment(comment._id, item._id)}>delete</i> : ''}
                          </h6>
                        )
                      })
                    }

                    <div className="row">
                      <div className="col s12">
                        <div className="row">
                          <div className="input-field col s12">
                            <input type='text'  onChange={(e) => {
                              setCommentsA(e.target.value)

                            }} value={commentsA} >
                                </input>
                              <i className="material-icons" onClick={() => {

                                makeComment(commentsA, item._id);

                                setCommentsA('')
                              }} style={{ float: 'right', cursor: 'pointer'}}>send</i>
                            
                            <label for="autocomplete-input" style={{fontSize:'16px'}}>Comment</label>
                          </div>
                        </div>
                      </div>
                    </div>


                  </div>
                </div>
              </div>
            </div>
          )
        })

      }



    </div>
  );
}

export default Home;