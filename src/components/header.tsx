import { Button, Grid } from '@material-ui/core';
import React, { ReactElement } from 'react';
import AccessAlarmIcon from '@material-ui/icons/AccessAlarm';
import useStyles from './header.style';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';

const Header = (): ReactElement => {
  const classes = useStyles();
  const { pathname } = useLocation();

  return (
    <header>
      <Grid container justify="space-between" alignItems="center" className={classes.root}>
        <Grid item className={classes.left}>
          <Grid container alignItems="center">
            <span>
              <AccessAlarmIcon fontSize="large" />
            </span>

            <h1 className={classes.h1}>Task Manager</h1>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container justify="space-around">
            <Grid item xs={5}>
              <Link to="/taskManager">
                <Button variant="outlined" fullWidth color={(pathname === '/taskManager' && 'primary') || 'default'}>
                  Timer
                </Button>
              </Link>
            </Grid>
            <Grid item xs={5}>
              <Button
                variant="outlined"
                fullWidth
                disabled
                color={(pathname === '/taskManager/stats' && 'primary') || 'default'}
              >
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
