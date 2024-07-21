// Packages
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Amplify } from 'aws-amplify';
//import { Provider } from 'react-redux';

// Local
import App from './App';
//import { store } from './redux/store';
import config from './config';
import './index.css';
import {ContextProvider} from "./Context/ContextProvider";
import {InstitutionContextProvider} from "./Context/InstitutionContextProvider";


// Code
Amplify.configure(config);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    {/*<Provider store={store}>*/}
    <ContextProvider>
      <InstitutionContextProvider>
        <App />
      </InstitutionContextProvider>
    </ContextProvider>
    {/*</Provider>*/}
  </BrowserRouter>
)