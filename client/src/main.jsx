import ReactDOM from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import App from './App.jsx'
import './index.css'

import "./stylesheets/_colors.css";
import "./stylesheets/_typography.css";
import "./stylesheets/_reset.css";

ReactDOM.createRoot(document.getElementById('root')).render(
    <ChakraProvider>
        <App />
    </ChakraProvider>
   
)
