import React, { createContext } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import PageStore from './store/PageStore'
import UserStore from './store/UserStore'
import './style/index.css'

export const Context = createContext(null)

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
	<React.StrictMode>
		<Context.Provider value={{
			user: new UserStore(),
			page: new PageStore()
		}}>
			<App />
		</Context.Provider>
	</React.StrictMode>
)
console.log()