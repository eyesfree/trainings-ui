import React, {useState} from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
import { backendUrl } from '.';
import { useForm, Controller  } from "react-hook-form";

export default function CreateTraining({setIsLoaded}) {
    const [dateTime, setDateTime] = useState(Date.now());
    const {register, handleSubmit, control} = useForm({
        defaultValues: {
          currency: 'EUR',
          durationFormat: 'Hours'
        }
      });

      const currencies = [
        {
          value: 'USD',
          label: '$',
        },
        {
          value: 'EUR',
          label: '€',
        },
        {
          value: 'JPY',
          label: '¥',
        },
      ];

      
      const durationFormats = [
        {
          value: 'Hours',
          label: 'h',
        },
        {
          value: 'Days',
          label: 'd',
        }
      ];

    const onSubmit = (trainingData) => {
        trainingData.startDates = [{
           "startDate": dateTime
        }];
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(trainingData)
        };
    
        fetch(backendUrl, requestOptions)
            .then((response) => {
                if (response.status === 201) {
                    alert(
                        `Training submitted successfully`
                    )
                }
                return response.json()
            })
            .then(
                (data) => {
                    console.log(data);
                    setIsLoaded(false);
                }
            )
            .catch((error) => {
                alert(
                    `error while submitting training ${error}`
                );
            });
    }

    return (
        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
                <form onSubmit={handleSubmit(onSubmit)}>
                <label> Name: 
                    <input type="text" {...register("name")}>
                    </ input>
                </label>
                    <br />
                    <br />
                <label>
                    Description:
                    <textarea type="text" {...register("description")} />
                </label>
                    <br />
                    <br />
                <label>
                    Price:
                    <input type="number" {...register("price")} />
                </label>
                <Controller
                name="currency"
                control={control}
                rules={{ required: true }}
                render={({ field }) => 
                    
                    <TextField
                    id="outlined-select-currency-native"
                    select
                    label="Currency"
                    {...field}
                    SelectProps={{
                        native: true,
                    }}
                    sx={{ margin: '0px 10px  10px 20px'}}
                    >
                    {currencies.map((option) => (
                        <option key={option.value} value={option.value}>
                        {option.label}
                        </option>
                    ))}
                    </TextField>}
                />

                    <br />
                    <br />
                <label>
                    Duration:
                    <input type="number" {...register("duration")} />
                </label>
                <label>
                   
                    <Controller
                    name="durationFormat"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => 
                    
                    <TextField
                    id="outlined-select-currency-native"
                    select
                    label=" Duration format"
                    {...field}
                    SelectProps={{
                        native: true,
                    }}
                    sx={{ margin: '0px 10px  10px 20px'}}
                    >
                    {durationFormats.map((option) => (
                        <option key={option.value} value={option.value}>
                        {option.label}
                        </option>
                    ))}
                    </TextField>}
                />
                </label>
                
                    <br />
                    <br />
                
                    <br />
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DateTimePicker {...register("dateTime")}
                        renderInput={(props) => <TextField {...props} />}
                        label="DateTimePicker"
                        value={dateTime}
                        onChange={(newValue) => setDateTime(newValue)}
                    />
                </LocalizationProvider>
                    <br />
                <button type="submit">Submit</button>
                </form>
            </FormControl>
        </Box>
    );
}
  