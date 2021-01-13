import React, { ChangeEvent, ReactElement, useEffect, useState } from 'react';
import { FormControl, InputLabel, Select, MenuItem, TextField, Grid, InputAdornment, Button } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import { cloneDeep, isEmpty } from 'lodash';
import { useToasts } from 'react-toast-notifications';
import Portal from '../containers/portal';
import { PayloadCreate } from '../api/tasks/list/response';
import { TaskStatus } from '../request-type/tasks.d';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import moment from 'moment';
import Alert from '@material-ui/lab/Alert';
import useStyles from './task.style';
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

export type State = PayloadCreate & {
  id?: string | null;
};

type TaskCreateProps = {
  open: boolean;
  onClose: () => void;
  task?: State;
};
const TaskEditor = ({ open, onClose, task }: TaskCreateProps): ReactElement => {
  const { create, update } = useTaskActions();
  const { addToast } = useToasts();
  const [state, setState] = useState<State>({ ...initialState, ...task });
  const [disabled, setDisabled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [timeAux, setTimeAux] = useState<number>(0);
  const [inputTime, setInputTime] = useState<string>('');
  const [errorKind, setErrorKind] = useState<CustomErrors | null>(null);

  const handleSave = () => {
    setLoading(true);
    const payload = cloneDeep(state);

    const isUpdate = !isEmpty(payload?.id);
    isUpdate && delete payload.id;

    ((isUpdate ? update(state?.id as string, state) : create(payload)) as Promise<void>)
      .then(() => onClose())
      .catch(() => {
        addToast(`Error  ${state?.id ? 'updating' : 'creating'} Task.`, {
          appearance: 'error',
        });
        setLoading(false);
      });
  };

  const handleChangeCustomTime = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9\:]/gi, ''); // clear alphabet
    let found = 0;
    value = value
      .split('')
      .filter((item) => {
        if (item === ':' && found === 2) {
          return false;
        } else if (item === ':') {
          found += 1;
        }
        return true;
      })
      .join('');

    if (inputTime.length < value.length && value.length === 2) {
      if (!found) value += ':';
    }

    if (inputTime.length < value.length && value.length === 5) {
      if (found === 1) value += ':';
    }

    // checks error
    if (value.length !== 8) setErrorKind(CustomErrors.invalidFormat);
    else {
      const [hours, minutes, seconds] = value.split(':').map((item) => Number(item));

      const totalMinutes = hours * 60 + minutes + seconds / 60;
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
    const date = moment()
      .set({ hour: 0, minute: 0, millisecond: 0, seconds: 0 })
      .add(timeAux || state.maxTime, 'ms')
      .format('HH:mm:ss');
    setInputTime(date);
  }, [state.maxTime]);

  useEffect(() => {
    setDisabled(errorKind !== null);
  }, [errorKind]);

  useEffect(() => {
    setState({ ...initialState, ...task });
  }, [task]);

  useEffect(() => {
    !open &&
      setState({
        ...initialState,
      });
    setLoading(false);
  }, [open]);

  return (
    <Portal
      title={(state?.id && `Edit task`) || 'Add new task'}
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
                disabled
                onChange={(e) => setState({ ...state, status: Number(e.target.value) })}
              >
                <MenuItem value={TaskStatus.pending}>Pending</MenuItem>
                <MenuItem value={TaskStatus.running}>Running</MenuItem>
                <MenuItem value={TaskStatus.paused}>Paused</MenuItem>
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
                disabled={loading || state.status === TaskStatus.completed}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setState({ ...state, maxTime: value });
                  setTimeAux(0);
                  setErrorKind(null);
                }}
              >
                <MenuItem value={1000 * 60 * 30}>Short</MenuItem>
                <MenuItem value={1000 * 60 * 45}>Medium</MenuItem>
                <MenuItem value={1000 * 60 * 60}>Long</MenuItem>
                <MenuItem value={timeAux}>Custom</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined" size="small">
              <TextField
                inputProps={{ maxLength: 8 }}
                label="Time"
                disabled={loading || state.status === TaskStatus.completed}
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
                      disabled={disabled || loading || state.maxTime <= 0}
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

export default TaskEditor;
