import Auth from './pages/Auth'
import Main from './pages/Main'
import Games from './pages/Games'
import Deposit from './pages/Deposit'
import { LOGIN_ROUTE, REGISTER_ROUTE, MAIN_ROUTE, GAMES_ROUTE, DEPOSIT_ROUTE } from './utils/constants'

export const authRoutes = [
	{
		path: MAIN_ROUTE,
		Component: Main
	},
	// {
	// 	path: LOGIN_ROUTE,
	// 	Component: Auth
	// },
	// {
	// 	path: REGISTER_ROUTE,
	// 	Component: Auth
	// },
	{
		path: GAMES_ROUTE,
		Component: Games
	},
	{
		path: DEPOSIT_ROUTE,
		Component: Deposit
	}
]

export const publicRoutes = [
	{
		path: MAIN_ROUTE,
		Component: Main
	},
	{
		path: LOGIN_ROUTE,
		Component: Auth
	},
	{
		path: REGISTER_ROUTE,
		Component: Auth
	}
]