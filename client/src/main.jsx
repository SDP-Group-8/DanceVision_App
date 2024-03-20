import ReactDOM from 'react-dom/client'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'

import App from './App.jsx'
import './index.css'

import "./stylesheets/_colors.css";
import "./stylesheets/_typography.css";
import "./stylesheets/_reset.css";


const theme = extendTheme({
  colors: {
    pink: {
      500: "#db11fb",
    },
  },
    components: {
        Progress: {
          baseStyle: {
            filledTrack: {
              bg: '#db11fb'
            }
          }
        }
      }
  })

ReactDOM.createRoot(document.getElementById('root')).render(
    <ChakraProvider theme={theme}>
        <App />
    </ChakraProvider>
   
)
