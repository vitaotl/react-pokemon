/* eslint-disable no-use-before-define */
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';


export default function FreeSolo({ autoCompleteArray, getSinglePokemon }) {
  
  const handleChange = (value) => {
    getSinglePokemon(value)
  }
  return (
    <div style={{ width: '200px' }}>
      <Autocomplete
        freeSolo
        id="free-solo-2-demo"
        disableClearable
        options={autoCompleteArray.map((option) => option)}
        onChange={(event, value) => handleChange(value)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Procurar Pokemon"
            margin="normal"
            variant="outlined"
            InputProps={{ ...params.InputProps, type: 'search' }
            }
          />
        )}
      />
    </div>
  );
}
