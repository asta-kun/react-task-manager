import React, { ReactElement } from 'react';
import 'normalize.css';
import './app.css';
import ModuleRouter from './modules/_router';
import { TaskManagerContextProvider } from './management/task-manager';

const App = (): ReactElement => {
  return (
    <TaskManagerContextProvider>
      <ModuleRouter />
    </TaskManagerContextProvider>
  );
};

export default App;
