import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

global.APPLICATION_THEME = undefined as unknown as ApplicationTheme;

const renderReact = () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  // const container = document.getElementById('root')!;

  // const root = createRoot(container);
  // root.render(
  //   <React.StrictMode>
  //     <App />
  //   </React.StrictMode>,
  // );

  ReactDOM.render(
    <App />,
    document.getElementById('root'),
  );
};

if (!REGISTRY_ENVIRONMENT_VARIABLES.theme) {
  renderReact();
} else {
  const themeScript = document.createElement('script');
  const themeName = REGISTRY_ENVIRONMENT_VARIABLES.theme;
  themeScript.setAttribute('src', `${import.meta.env.BASE_URL}/themes/${themeName}/${themeName}.js`);
  themeScript.async = false;

  document.head.append(themeScript);

  themeScript.onload = renderReact;
  themeScript.onerror = renderReact;
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
