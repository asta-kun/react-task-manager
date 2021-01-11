import { Box } from '@material-ui/core';
import { cloneDeep } from 'lodash';
import moment from 'moment';
import React, { ReactElement, useMemo } from 'react';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme } from 'victory';
import { useTaskManager } from '../../../management/task-manager';

const initialState = [
  { day: 0, hours: 0 },
  { day: 1, hours: 0 },
  { day: 2, hours: 0 },
  { day: 3, hours: 0 },
  { day: 4, hours: 0 },
  { day: 5, hours: 0 },
  { day: 6, hours: 0 },
];

const Stats = (): ReactElement => {
  const { tasks } = useTaskManager();

  const data = useMemo(
    () =>
      Object.values(tasks).reduce((state, task) => {
        const day = moment(task.createdAt).day();
        state[day].hours += task.timeElapsed / 1000 / 60 / 60;
        return state;
      }, cloneDeep(initialState)),
    [tasks],
  );

  return (
    <Box>
      <VictoryChart
        // adding the material theme provided with Victory
        theme={VictoryTheme.material}
        padding={80}
        height={250}
      >
        <VictoryAxis
          tickValues={[0, 1, 2, 3, 4, 5, 6]}
          tickFormat={['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat']}
        />
        <VictoryAxis dependentAxis tickFormat={(x) => `${Number(x).toFixed(2)}h`} />
        <VictoryBar data={data} x="day" y="hours" />
      </VictoryChart>
    </Box>
  );
};

export default Stats;
