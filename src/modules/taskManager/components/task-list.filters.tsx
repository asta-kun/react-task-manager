import { Grid, MenuItem, Select, TextField } from '@material-ui/core';
import React, { ReactElement, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core';
import { Filter } from './tasks-list';

const useStyles = makeStyles(() => ({
  root: {
    width: '94%',
    margin: '0 auto .5em auto',
  },
  textfield: {
    width: 200,
  },
}));

export enum FilterItem {
  long = 0,
  medium = 1,
  short = 2,
  all = 3,
}

type TaskListFiltersProps = {
  updateState: (filters: Filter) => void;
};

const TaskListFilters = ({ updateState }: TaskListFiltersProps): ReactElement => {
  const classes = useStyles();
  const [duration, setDuration] = useState<FilterItem>(FilterItem.all);
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    // send state to parent
    updateState({ duration, search });
  }, [duration, search]);

  return (
    <Grid container justify="space-between" className={classes.root}>
      <Grid item>
        <TextField
          placeholder="write something..."
          label="Search"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          inputProps={{ maxLength: 25 }}
          className={classes.textfield}
        />
      </Grid>
      <Grid item>
        <Select value={duration} onChange={(e) => setDuration(e.target.value as FilterItem)}>
          <MenuItem value={FilterItem.all}>All</MenuItem>
          <MenuItem value={FilterItem.short}>Short</MenuItem>
          <MenuItem value={FilterItem.medium}>Medium</MenuItem>
          <MenuItem value={FilterItem.long}>Long</MenuItem>
        </Select>
      </Grid>
    </Grid>
  );
};

export default TaskListFilters;
