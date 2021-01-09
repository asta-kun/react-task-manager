import React, { ReactElement, ReactNode } from 'react';
import Header from '../components/header';
import useStyles from './basePage.style';

type BasePageProps = {
  children: ReactNode;
};

const BasePage = ({ children }: BasePageProps): ReactElement => {
  const classes = useStyles();
  return (
    <main className={classes.root}>
      <Header />
      {children}
    </main>
  );
};

export default BasePage;
