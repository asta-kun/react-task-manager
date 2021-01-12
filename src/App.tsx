import React, { ReactElement } from 'react';
import 'normalize.css';
import './app.css';
import ModuleRouter from './modules/_router';
import { TaskManagerContextProvider } from './management/task-manager';
import { ToastProvider } from 'react-toast-notifications';
import { BrowserRouter as Router } from 'react-router-dom';

const App = (): ReactElement => {
  return (
    <Router>
      <ToastProvider autoDismiss={true} autoDismissTimeout={3000}>
        <TaskManagerContextProvider>
          <ModuleRouter />
        </TaskManagerContextProvider>
      </ToastProvider>
    </Router>
  );
};

export default App;
