import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { Radio, RadioGroup, FormHelperText, FormControlLabel, Typography } from '@mui/material';

// ----------------------------------------------------------------------

RHFRadioGroup.propTypes = {
  name: PropTypes.string,
  options: PropTypes.array,
  label: PropTypes.string,
};

export default function RHFRadioGroup({ name, options, label, disabled, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div>
            <Typography variant="subtitle1">{label}</Typography>
            <RadioGroup {...field} row {...other}>
              {options.map((option) => (
                <FormControlLabel key={option.value} value={option.value} control={<Radio disabled={disabled} />} label={option.label} />
              ))}
            </RadioGroup>

            {!!error && (
              <FormHelperText error sx={{ px: 2 }}>
                {error.message}
              </FormHelperText>
            )}
        </div>
      )}
    />
  );
}
