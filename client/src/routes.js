import Auth from './pages/Auth/Auth'
import Main from './pages/Main/Main'
import Deposit from './pages/Deposit/Deposit'
import { LOGIN_ROUTE, REGISTER_ROUTE, MAIN_ROUTE, HI_LOW_ROUTE, DICE_ROUTE, MINER_ROUTE, DEPOSIT_ROUTE, PROFILE_ROUTE, RANKS_ROUTE } from './utils/constants'
import HiLowGame from './components/HiLowGame/HiLowGame'
import DiceGame from './components/DiceGame/DiceGame'
import MinerGame from './components/MinerGame/MinerGame'
import Profile from './components/Profile/Profile'
import Ranks from './pages/Ranks/Ranks'

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
		path: MINER_ROUTE,
		Component: MinerGame
	},
	{
		path: DEPOSIT_ROUTE,
		Component: Deposit
	},
	{
		path: PROFILE_ROUTE,
		Component: Profile
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
	},
	{
		path: RANKS_ROUTE,
		Component: Ranks
	}
]