import React, { ReactElement, useCallback, useState } from 'react';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles, IconButton, Grid, Button } from '@material-ui/core';
import Portal from '../../../containers/portal';
import CloseIcon from '@material-ui/icons/Close';
import { useTaskManager } from '../../../management/task-manager';

const useStyles = makeStyles(() => ({
  root: {
    position: 'fixed',
    bottom: 25,
    right: 25,
    width: '2em',
    fontSize: '1.75em',
    height: '1.5em',
    borderRadius: 5,
    animation: '$enter .75s ease',
  },
  button: {
    background: '#4168d6',
    color: '#fff',
    '&:hover': {
      background: '#9944a9',
    },
  },
  '@keyframes enter': {
    from: {
      opacity: 0,
      bottom: 35,
    },
    to: {
      opacity: 1,
      bottom: 25,
    },
  },
}));

const AddButton = (): ReactElement => {
  const classes = useStyles();
  const { addRandomTasks } = useTaskManager();
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = useCallback(() => setOpen(!open), [open]);
  return (
    <>
      <Grid container className={classes.root} justify="center" alignItems="center">
        <IconButton className={classes.button} onClick={handleOpen}>
          {(!open && <AddIcon />) || <CloseIcon />}
        </IconButton>
      </Grid>
      <Portal
        title="Add 50 random tasks"
        open={open}
        fullHeight={false}
        fullScreen={false}
        fullWidth={false}
        maxWidth="sm"
        onClose={handleOpen}
      >
        <Grid container justify="center" style={{ textAlign: 'center' }}>
          <Grid item xs={6}>
            <Button variant="outlined" color="secondary" onClick={handleOpen}>
              Cancel
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => {
                addRandomTasks();
                handleOpen();
              }}
            >
              Accept
            </Button>
          </Grid>
        </Grid>
        <br />
      </Portal>
    </>
  );
};

export default AddButton;
