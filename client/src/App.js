import './App.css';
import React, { useState } from 'react'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import Photos from './components/Photos';
import ProtectedRoute from './components/ProtectedRoute';
import axios from 'axios';

function App() {

	const [isAuth, setIsAuth] = useState(true);

	return (
		<Router>
			<div>
				<Switch>
					<Route exact path="/">
						<Home />
					</Route>
					<Route path="/register">
						<Register />
					</Route>
					<Route path="/login">
						<Login />
					</Route>
					<ProtectedRoute path="/photos" component={Photos} isAuth={isAuth}/>
				</Switch>
			</div>
		</Router>
	);
}

export default App;
