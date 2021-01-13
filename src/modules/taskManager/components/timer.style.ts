import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '.5em 1em',
    borderRadius: 4,
  },

  time: {
    background: '#eaeaea',
    color: '#929292',
    fontSize: '3.5em',
    overflow: 'hidden',
    height: '1.2em',
    textAlign: 'center',
    position: 'relative',
    borderRadius: 5,
    '& span': {
      zIndex: 5,

      position: 'relative',
    },
    '&.active': {
      color: '#fff',
      background: '#4168d6',
    },
  },
  loading: {
    height: '100%',
    background: '#b54d4d',
    zIndex: 4,
    position: 'absolute',
  },
  button: {
    display: 'block',
    margin: '0 auto',
  },
  actions: {
    [theme.breakpoints.down('sm')]: {
      marginTop: '.75em',
    },
  },
}));
export default useStyles;
