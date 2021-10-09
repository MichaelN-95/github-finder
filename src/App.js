import React, { Fragment, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Navbar from './components/layout/Navbar';
import Users from './components/users/Users';
import Search from './components/users/Search';
import { Alert } from './components/layout/Alert';
import User from './components/users/User';

import About from './components/pages/About';

import axios from 'axios';
import PropTypes from 'prop-types';
import './App.css';

const github = axios.create({
	baseURL: 'https://api.github.com',
	timeout: 1000,
	headers: { Authorization: process.env.REACT_APP_GITHUB_TOKEN },
});

const App = () => {
	const [users, setUsers] = useState([]);
	const [user, setUser] = useState({});
	const [repos, setRepos] = useState([]);
	const [loading, setLoading] = useState(false);
	const [alert, setAlert] = useState(null);

	const searchUsers = async (text) => {
		setLoading(true);
		const res = await github.get(`/search/users?q=${text}`);
		setUsers(res.data.items);
		setLoading(false);
	};

	const getUser = async (username) => {
		setLoading(true);
		const res = await github.get(`/users/${username}`);
		setUser(res.data);
		setLoading(false);
	};

	const getUserRepos = async (username) => {
		setLoading(true);
		const res = await github.get(
			`/users/${username}/repos?per_page=5&sort=created:asc`
		);

		setRepos(res.data);
		setLoading(false);
	};

	const clearUsers = () => {
		setUsers([]);
		setLoading(false);
	};

	const showAlert = (msg, type) => {
		setAlert({ msg, type });
		setTimeout(() => setAlert(null), 3000);
	};

	return (
		<Router>
			<div className='App'>
				<Navbar />
				<div className='container'>
					<Alert alert={alert} />
					<Switch>
						<Route
							exact
							path='/'
							render={(props) => (
								<Fragment>
									<Search
										searchUsers={searchUsers}
										clearUsers={clearUsers}
										showClear={users.length > 0 ? true : false}
										setAlert={showAlert}
									/>
									<Users loading={loading} users={users} />
								</Fragment>
							)}
						/>
						<Route
							exact
							path='/user/:login'
							render={(props) => (
								<User
									{...props}
									getUser={getUser}
									getUserRepos={getUserRepos}
									user={user}
									repos={repos}
									loading={loading}
								/>
							)}
						/>
						<Route exact path='/about' component={About} />
					</Switch>
				</div>
			</div>
		</Router>
	);
};

App.propTypes = {
	searchUsers: PropTypes.func.isRequired,
};
export default App;
