import React, { lazy, ReactElement, Suspense } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import BasePage from '../containers/basePage';

const TaskManager = lazy(() => import('./taskManager'));
const Index = () => {
  const history = useHistory();
  history.push('/taskManager');
  return null;
};

const ModuleRouter = (): ReactElement => {
  return (
    <BasePage>
      <Suspense fallback={<>Loading...</>}>
        <Switch>
          <Route path="/" exact strict>
            <Index />
          </Route>
          <Route path="/taskManager" exact strict>
            <TaskManager />
          </Route>
        </Switch>
      </Suspense>
    </BasePage>
  );
};

export default ModuleRouter;
