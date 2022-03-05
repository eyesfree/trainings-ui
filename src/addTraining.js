import * as React from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';

export default class FileInput extends React.Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.trainingName = React.createRef();
        this.trainingDescription = React.createRef();
        this.trainingPrice = React.createRef();
        this.priceCurrency = React.createRef();
        this.teacher = React.createRef();
        this.duration = React.createRef();
        this.startDate = React.createRef();
        this.setDateTime = this.handleDateTimeChange.bind(this);
        this.dateTime = Date.now();
    }

    handlePriceCurrencyChange = (event) => {
        console.log(event.target.value)
        this.priceCurrency.current.value = event.target.value;
    };

    handleDateTimeChange = (event) => {
        this.dateTime = event;
    };

    handleSubmit(event) {
        event.preventDefault();
        let training = {
            "name": this.trainingName.current.value,
            "description": this.trainingDescription.current.value,
            "price": this.trainingPrice.current.value,
            "currency": this.priceCurrency.current.value,
            "startDates": [
                { "startDate" : this.dateTime }
            ]
        }

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(training)
        };

        fetch('http://localhost:8080/v1/training', requestOptions)
            .then(response => response.json())
            .then(data => console.log(data));

        alert(
            `new training id - ${this.trainingId}`
        );
    }

    render() {
        return (
            <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                    <form onSubmit={this.handleSubmit}>
                        <label>
                            Name:
                            <input type="text" ref={this.trainingName} />
                        </label>
                        <br />
                        <label>
                            Description:
                            <input type="text" ref={this.trainingDescription} />
                        </label>
                        <br />
                        <label>
                            Price:
                            <input type="number" ref={this.trainingPrice} />
                        </label>
                        <br />
                        <label>
                            Price currency:
                            <Select
                                sx={{ minWidth: 50 }}
                                value={this.priceCurrency.value}
                                ref={this.priceCurrency}
                                onChange={this.handlePriceCurrencyChange}
                            >
                                <MenuItem value='EUR'>EUR</MenuItem>
                                <MenuItem value='USD'>USD</MenuItem>
                                <MenuItem value='BGN' >BGN</MenuItem>
                            </Select>
                        </label>
                        <br />
                        <br />
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DateTimePicker
                                renderInput={(props) => <TextField {...props} />}
                                label="DateTimePicker"
                                value={this.dateTime}
                                onChange={this.handleDateTimeChange}                               
                            />
                        </LocalizationProvider>
                        <br />
                        <button type="submit">Submit</button>
                    </form>
                </FormControl>
            </Box>
        );
    }
}