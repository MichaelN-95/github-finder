import { useReducer } from 'react';
import axios from 'axios';
import GithubContext from './githubContext';
import GithubReducer from './githubReducer';
import {
	SEARCH_USERS,
	SET_LOADING,
	CLEAR_USERS,
	GET_USER,
	GET_REPOS,
} from '../types';
import githubContext from './githubContext';

const GithubState = (props) => {
	const initialState = {
		users: [],
		user: {},
		repos: [],
		loading: false,
	};

	const [state, dispatch] = useReducer(GithubReducer, initialState);

	const github = axios.create({
		baseURL: 'https://api.github.com',
		timeout: 1000,
		headers: { Authorization: process.env.REACT_APP_GITHUB_TOKEN },
	});

	//search users
	const searchUsers = async (text) => {
		setLoading(true);
		const res = await github.get(`/search/users?q=${text}`);

		dispatch({ type: SEARCH_USERS, payload: res.data.items });
	};
	//get user

	//get repos

	//clear users

	//set loading
	const setLoading = () => dispatch({ type: SET_LOADING });

	return (
		<GithubContext.Provider
			value={{
				users: state.users,
				user: state.user,
				repos: state.repos,
				loading: state.loading,
				searchUsers,
			}}>
			{props.children}
		</GithubContext.Provider>
	);
};

export default GithubState;
