import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    position: 'fixed',
    bottom: 25,
    right: 25,
    width: '6em',
    fontSize: '1.75em',
    height: '1.5em',
    borderRadius: 5,
    animation: '$enter .75s ease',
    background: '#eaeaea',
    boxShadow: '0px 0px 9px #0000000f',
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
export default useStyles;
