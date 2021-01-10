import { Button, Grid } from '@material-ui/core';
import React, { ReactElement } from 'react';
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import useStyles from './header.style';

const Header = (): ReactElement => {
  const classes = useStyles();
  return (
    <header>
      <Grid container justify="space-between" alignItems="center" className={classes.root}>
        <Grid item className={classes.left} xs={4}>
          <Grid container alignItems="center">
            <span>
              <AccessAlarmIcon fontSize="large" />
            </span>

            <h1 className={classes.h1}>Task Manager</h1>
          </Grid>
        </Grid>
        <Grid item xs={2}>
          <Grid container justify="space-around">
            <Grid item xs={5}>
              <Button variant="outlined" fullWidth>
                Timer
              </Button>
            </Grid>
            <Grid item xs={5}>
              <Button variant="outlined" fullWidth>
                Stats
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </header>
  );
};

export default Header;
