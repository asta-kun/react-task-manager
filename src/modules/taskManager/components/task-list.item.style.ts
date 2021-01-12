import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '95%',
    margin: '1em auto',
    boxShadow: '0 0 7px 0px #00000024',
    height: '3.5em',
    background: '#fff',
    borderRadius: 3,
    padding: '0 1em',
    willChange: 'transform, background',
    transition: 'all .5s',
    '&:hover': {
      transform: 'scale(1.025)',
    },
    '&.active': {
      background: '#4168d6',
    },
  },
  description: {
    fontSize: '.9em',
    color: '#949494',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    '&.active': {
      color: '#fff',
    },
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
      '&.active': {
        background: '#fff',
        color: '#000',
      },
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '.85em',
    },
  },
  iconDetails: {
    transform: 'rotate(-90deg)',
    color: '#000',
    transition: 'all .5s ease',
    willChange: 'transform, color',
    fontSize: '.7em',
    '&.active': {
      transform: 'rotate(90deg)',
      color: '#fff',
    },
  },
  details: {
    textAlign: 'center',
    fontSize: '.9em',
  },
  timeElapsed: {
    fontSize: '.7em',
    color: '#949494',
    textAlign: 'center',
    display: 'block',
    paddingLeft: 20,
    '&.active': {
      color: '#fff',
    },
  },
}));
export default useStyles;
