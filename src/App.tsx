import React from 'react';
import { Provider } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';
import { ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';

import ErrorBoundary from 'components/ErrorBoundary';
import './App.scss';
import 'formiojs/dist/formio.full.css';
import { Formio } from '#web-components/exports/formio';
import { FormioModule } from '#web-components/components/Form';

import Routes from './routes/Routes';
import { store } from './store/store';
import muiTheme from './styles/theme';

Formio.use(FormioModule);

const App: React.FC = () => {
  const { t } = useTranslation('text', { keyPrefix: 'metaTags' });
  return (
    <>
      <Helmet>
        <title>{t('title')}</title>
        <meta name="description" content={t('description')} />
      </Helmet>
      <ThemeProvider theme={muiTheme()}>
        <CssBaseline />
        <ErrorBoundary>
          <Provider store={store}>
            <Routes />
          </Provider>
        </ErrorBoundary>
      </ThemeProvider>
    </>
  );
};

export default App;
