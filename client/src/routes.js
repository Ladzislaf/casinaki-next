import Auth from './pages/Auth'
import Main from './pages/Main'
import Deposit from './pages/Deposit'
import { LOGIN_ROUTE, REGISTER_ROUTE, MAIN_ROUTE, HI_LOW_ROUTE, DICE_ROUTE, DEPOSIT_ROUTE } from './utils/constants'
import HiLowGame from './components/HiLowGame'
import DiceGame from './components/DiceGame'

export const authRoutes = [
	{
		path: MAIN_ROUTE,
		Component: Main
	},
	{
		path: HI_LOW_ROUTE,
		Component: HiLowGame
	},
	{
		path: DICE_ROUTE,
		Component: DiceGame
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