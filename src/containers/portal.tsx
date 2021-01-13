import React, { forwardRef, ReactElement, ReactNode, Ref } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Dialog, DialogTitle } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import Grow from '@material-ui/core/Grow';
import { TransitionProps } from '@material-ui/core/transitions';
import clsx from 'clsx';

const useStyles = makeStyles(() =>
  createStyles({
    dialogRoot: {
      '&.fullHeight .MuiPaper-root': {
        height: '100%',
        maxHeight: 760,
      },
    },
    title: {
      textAlign: 'center',
      width: '100%',
      maxWidth: '540px',
    },
    closeButton: {
      position: 'absolute',
      color: '#004ecd',
    },
    dialogContainer: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },
  }),
);

const Transition = forwardRef((props: TransitionProps & { children?: ReactElement }, ref: Ref<unknown>) => {
  return <Grow ref={ref} {...props} />;
});

type PortalProps = {
  children: ReactNode;
  open: boolean;
  onClose: () => void;
  title: string;
  fullScreen?: boolean;
  fullWidth?: boolean;
  fullHeight?: boolean;
  maxWidth?: false | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
};

const Portal = ({
  children,
  open,
  onClose,
  title,
  fullScreen = true,
  fullWidth,
  fullHeight,
  maxWidth,
}: PortalProps): ReactElement => {
  const classes = useStyles();
  return (
    <Dialog
      fullScreen={fullScreen}
      onClose={onClose}
      aria-labelledby="dialogPortal"
      open={open}
      TransitionComponent={Transition}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      className={clsx(classes.dialogRoot, fullHeight && 'fullHeight')}
    >
      <Container className={classes.dialogContainer}>
        {title && (
          <DialogTitle id="dialogPortal" className={classes.title}>
            {title}
          </DialogTitle>
        )}
        {children}
      </Container>
    </Dialog>
  );
};

export default Portal;
