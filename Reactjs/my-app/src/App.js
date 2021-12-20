import React from 'react';
import { MuiPickersUtilsProvider, DatePicker  } from '@material-ui/pickers';
import TextField from "@material-ui/core/TextField";
import MomentUtils from '@date-io/moment';

import moment from 'moment';

export default function BasicDatePicker() {

  const [value, setValue] = React.useState<Date | null>(new Date());
  return (
    <div>
      <MuiPickersUtilsProvider
        libInstance={moment}
        utils={MomentUtils}
        locale={'vi'}
      >
       <DatePicker
      label="Basic example"
      value={value}
      onChange={(newValue) => setValue(newValue)}
      renderInput={(props) => <TextField {...props} />}
    />
      </MuiPickersUtilsProvider>
     
    </div>
  );
};





