import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';

import { CookiesProvider } from 'react-cookie';
import { Provider as ReduxProvider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import App from './App';
import CollapseSideBarProvider from './contexts/CollapseSideBarContext';
import SettingContextProvider from './contexts/SettingContext';
import store, { persistor } from './redux/store';
import ThemeProvider from './theme';

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <ReduxProvider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <HelmetProvider>
        <CookiesProvider>
          <CollapseSideBarProvider>
            <SettingContextProvider>
              <ThemeProvider>
                <App />
              </ThemeProvider>
            </SettingContextProvider>
          </CollapseSideBarProvider>
        </CookiesProvider>
      </HelmetProvider>
    </PersistGate>
  </ReduxProvider>
  // </React.StrictMode>
);
