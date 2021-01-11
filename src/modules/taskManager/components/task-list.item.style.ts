import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    width: '95%',
    margin: '1em auto',
    boxShadow: '0 0 7px 0px #00000024',
    height: '3.5em',
    background: '#fff',
    borderRadius: 3,
  },
  description: {
    fontSize: '.9em',
    color: '#949494',
  },
  status: {
    '& span': {
      background: '#bfbfbf',
      borderRadius: 5,
      padding: '.2em .5em .25em .5em',
      color: '#fff',
      fontSize: '.75em',
      display: 'inline-block',
      minWidth: '6em',
      textAlign: 'center',
      textTransform: 'uppercase',
      fontWeight: 600,
      fontFamily: 'system-ui',
      '&.completed': {
        background: '#4168d6',
      },
      '&.running': {
        background: '#3cbf33',
      },
      '&.paused': {
        background: '#ff7f24',
      },
    },
  },
}));
export default useStyles;
