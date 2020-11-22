//reducer is like a state they have action
import React, { createContext, useEffect, useReducer, useContext } from 'react';
import './App.css';
import Navbar from './components/navbar';
//BrowserRouter for navBar always visble; Route for link path in the page  
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom'
import Home from './components/screen/home';
import Profile from './components/screen/profile';
import Signup from './components/screen/signup';
import Login from './components/screen/login';
import User from './components/screen/user';
import CreatePost from './components/screen/creatPost';
import { reducer, intialState } from './reducers/userReducer'
//create context
export const UserContext = createContext()
const Routing = () => {
      const { state, dispatch } = useContext(UserContext);
      const history = useHistory()
      useEffect(() => {
            const user = JSON.parse(localStorage.getItem("user"))
            if (user) {
                  dispatch({ type: 'USER', payload: user });
                  // console.log(state);
                  // history.push('/')
            } else {
                  history.push('/login')
            }
      }, [])
      return (
            // switch is like a empty fragment more ablity
            <Switch>
                  <Route exact path="/">
                        <Home />
                  </Route>

                  <Route path="/login">
                        <Login />
                  </Route>

                  <Route path="/signup">
                        <Signup />
                  </Route>

                  <Route exact path="/profile">
                        <Profile />
                  </Route>
                  <Route path="/create">
                        <CreatePost />
                  </Route>
                  <Route path="/profile/:id">
                        <User />
                  </Route>
            </Switch>
      )
}
function App() {

      const [state, dispatch] = useReducer(reducer, intialState)
      return (
            <div>
                  <UserContext.Provider value={{ state, dispatch }}>
                        <BrowserRouter>
                              <Navbar />
                              <Routing />
                        </BrowserRouter>
                  </UserContext.Provider>

            </div>

      )

}

export default App;
