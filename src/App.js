import React, { Component, Fragment } from 'react';
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
class App extends Component {
	state = {
		users: [],
		user: {},
		repos: [],
		loading: false,
		alert: null,
	};

	static propTypes = {
		searchUsers: PropTypes.func.isRequired,
	};

	searchUsers = async (text) => {
		this.setState({ loading: true });
		const res = await github.get(`/search/users?q=${text}`);
		this.setState({ users: res.data.items, loading: false });
	};

	getUser = async (username) => {
		this.setState({ loading: true });
		const res = await github.get(`/users/${username}`);
		this.setState({ user: res.data, loading: false });
	};

	getUserRepos = async (username) => {
		this.setState({ loading: true });
		const res = await github.get(
			`/users/${username}/repos?per_page=5&sort=created:asc`
		);
		this.setState({ repos: res.data, loading: false });
	};

	clearUsers = () => this.setState({ users: [], loading: false });

	setAlert = (msg, type) => {
		this.setState({ alert: { msg, type } });
		setTimeout(() => this.setState({ alert: null }), 3000);
	};

	render() {
		const { users, user, repos, loading } = this.state;
		return (
			<Router>
				<div className='App'>
					<Navbar />
					<div className='container'>
						<Alert alert={this.state.alert} />
						<Switch>
							<Route
								exact
								path='/'
								render={(props) => (
									<Fragment>
										<Search
											searchUsers={this.searchUsers}
											clearUsers={this.clearUsers}
											showClear={users.length > 0 ? true : false}
											setAlert={this.setAlert}
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
										getUser={this.getUser}
										getUserRepos={this.getUserRepos}
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
	}
}

export default App;
