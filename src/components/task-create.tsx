import React, { ChangeEvent, ReactElement, useEffect, useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, TextField, Grid, InputAdornment, Button } from '@material-ui/core';
import TrackChangesIcon from '@material-ui/icons/TrackChanges';
import SaveIcon from '@material-ui/icons/Save';
import _ from 'lodash';
// import { useKartsActions } from '../../../api/karts';
// import { useToasts } from 'react-toast-notifications';
// import { useTracks } from '../management/tracks';
import { useToasts } from 'react-toast-notifications';
// import Alert from '@material-ui/lab/Alert';
import Portal from '../containers/portal';
import { PayloadCreate } from '../api/tasks/list/response';
import { TaskStatus } from '../request-type/tasks.d';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import moment from 'moment';
import Alert from '@material-ui/lab/Alert';
import useStyles from './task-create.style';
import { useTaskActions } from '../api/tasks/list';

const initialState: PayloadCreate = {
  description: null,
  status: TaskStatus.pending,
  maxTime: 1000 * 60 * 30,
};
enum CustomErrors {
  invalidFormat = 0,
  invalidTime = 1,
}

type CustomErrorProps = {
  kind: CustomErrors | null;
};
const CustomError = ({ kind }: CustomErrorProps): ReactElement => {
  const classes = useStyles();

  return (
    <>
      {kind !== null && (
        <Alert severity="success" color="error" className={classes.alert}>
          {kind === CustomErrors.invalidTime && "Time can't be more than 2 hours"}
          {kind === CustomErrors.invalidFormat && 'time format is invalid'}
        </Alert>
      )}
    </>
  );
};

type TastCreateProps = {
  open: boolean;
  onClose: () => void;
};
const TastCreate = ({ open, onClose }: TastCreateProps): ReactElement => {
  const { create } = useTaskActions();
  const { addToast } = useToasts();
  const [state, setState] = useState<PayloadCreate>({ ...initialState });
  const [disabled, setDisabled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [timeAux, setTimeAux] = useState<number>(0);
  const [inputTime, setInputTime] = useState<string>('');
  const [errorKind, setErrorKind] = useState<CustomErrors | null>(null);

  const handleSave = () => {
    setLoading(true);

    create(state)
      .then(() => {
        addToast('Task updated successfully.', {
          appearance: 'success',
          autoDismiss: true,
        });
        onClose();
      })
      .catch(() =>
        addToast('Error creating Task.', {
          appearance: 'error',
          autoDismiss: true,
        }),
      )
      .finally(() => setLoading(false));
  };

  const handleChangeCustomTime = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9\:]/gi, ''); // clear alphabet
    let found = false;
    value = value
      .split('')
      .filter((item) => {
        if (item === ':' && found) {
          return false;
        } else if (item === ':') {
          found = true;
        }
        return true;
      })
      .join('');

    if (inputTime.length < value.length && value.length === 2) {
      if (!found) value += ':';
    }

    // checks error
    if (value.length !== 5) setErrorKind(CustomErrors.invalidFormat);
    else {
      const [hours, minutes] = value.split(':').map((item) => Number(item));

      const totalMinutes = hours * 60 + minutes;
      if (totalMinutes > 120) setErrorKind(CustomErrors.invalidTime);
      else {
        setErrorKind(null);
        const ms = totalMinutes * 60_000;
        setState({ ...state, maxTime: ms });
        setTimeAux(ms);
      }
    }

    setInputTime(value);
  };

  useEffect(() => {
    setState({
      ...initialState,
    });
  }, [open]);

  useEffect(() => {
    const date = moment()
      .set({ hour: 0, minute: 0, millisecond: 0 })
      .add(timeAux || state.maxTime, 'ms')
      .format('HH:mm');
    setInputTime(date);
  }, [state.maxTime]);

  useEffect(() => {
    setDisabled(errorKind !== null);
  }, [errorKind]);

  return (
    <Portal
      title="Add new task"
      open={open}
      fullHeight={false}
      fullScreen={false}
      fullWidth={true}
      maxWidth="sm"
      onClose={() => !loading && onClose()}
    >
      <CustomError kind={errorKind} />
      <Grid container justify="space-around">
        <Grid container xs={4}>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined" size="small" disabled={loading}>
              <InputLabel id="select-label">Status</InputLabel>
              <Select
                labelId="select-label"
                labelWidth={47}
                id="select"
                value={state.status}
                disabled={loading}
                onChange={(e) => setState({ ...state, status: Number(e.target.value) })}
              >
                <MenuItem value={TaskStatus.pending}>Pending</MenuItem>
                <MenuItem value={TaskStatus.running}>Running</MenuItem>
                <MenuItem value={TaskStatus.completed}>Completed</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel id="select-track-label">Duraction</InputLabel>
              <Select
                labelId="select-track-label"
                labelWidth={70}
                id="select-track"
                fullWidth
                value={timeAux || state.maxTime}
                disabled={loading}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value) {
                    setState({ ...state, maxTime: value });
                    setTimeAux(0);
                  } else setTimeAux(state.maxTime);
                }}
              >
                <MenuItem value={1000 * 60 * 30}>Short</MenuItem>
                <MenuItem value={1000 * 60 * 45}>Medium</MenuItem>
                <MenuItem value={1000 * 60 * 60}>Long</MenuItem>
                <MenuItem value={timeAux || 0}>Custom</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined" size="small">
              <TextField
                inputProps={{ maxLength: 5 }}
                label="Time"
                disabled={loading || !timeAux}
                value={inputTime}
                onChange={handleChangeCustomTime}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AccessTimeIcon />
                    </InputAdornment>
                  ),
                }}
                margin="dense"
                variant="outlined"
              />
            </FormControl>
          </Grid>
        </Grid>
        <Grid container xs={6} alignItems="flex-start">
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined">
              <TextField
                disabled={loading}
                multiline
                style={{ transform: 'translateY(-7px)' }}
                placeholder="Write something..."
                label="Description"
                onChange={(e) => setState({ ...state, description: e.target.value || null })}
                margin="dense"
                rows={5}
                inputProps={{ maxLength: 50 }}
                variant="outlined"
                value={state.description}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Grid container direction="row" spacing={3}>
              <Grid item xs={12}>
                <Grid container justify="space-between">
                  <Grid item xs={5}>
                    <Button variant="outlined" color="secondary" fullWidth disabled={loading} onClick={onClose}>
                      Cancel
                    </Button>
                  </Grid>
                  <Grid item xs={5}>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={handleSave}
                      fullWidth
                      disabled={disabled || loading}
                    >
                      <SaveIcon fontSize="small" />
                      <span style={{ marginLeft: 5 }}>Save</span>
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <br />
    </Portal>
  );
};

export default TastCreate;
