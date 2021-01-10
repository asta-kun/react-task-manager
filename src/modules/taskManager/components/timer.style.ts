import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    padding: '.5em 1em',
    borderRadius: 4,
    background: '#eaeaea',
    color: '#929292',
    '&.active': {
      color: '#fff',
      background: '#28acec',
    },
  },
  time: {
    fontSize: '3.5em',
  },
}));
export default useStyles;
