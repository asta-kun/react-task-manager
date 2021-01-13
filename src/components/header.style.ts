import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '0 2.5%',
    background: '#fff',
    height: 60,
    boxShadow: '0 0px 15px 0px #0000001f',
  },
  left: {
    color: '#3f3f3f',
  },
  h1: {
    fontSize: '1.25em',
    marginLeft: '.5em',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
}));
export default useStyles;
