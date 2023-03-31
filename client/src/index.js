import React, { createContext } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import AppStore from './store/AppStore'
import UserStore from './store/UserStore'
import './style/index.css'

export const Context = createContext(null)

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
	<React.StrictMode>
		<Context.Provider value={{
			user: new UserStore(),
			app: new AppStore(),
		}}>
			<App />
		</Context.Provider>
	</React.StrictMode>
)
console.log()