import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import { FixedSizeList } from 'react-window';

import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import FileInput from './addTraining.js'

const backendUrl = "http://training-catalog.azurewebsites.net/v1/training";
function UsersComponent() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [expanded, setExpanded] = useState(null);

  const handlePanelChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  useEffect(() => {
    if (!isLoaded) {
      fetch(backendUrl)
        .then(res => res.json())
        .then(
          (result) => {
            setIsLoaded(true);
            setItems(result._embedded.training);
            console.log('fetched training count ' + items.length);
          },
          (error) => {
            setIsLoaded(true);
            setError(error);
          }
        )
    }
  })

  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

  function tabProperties(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (

      <div style={{ marginLeft: '5%', marginTop: '60px' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Available trainings" {...tabProperties(0)} />
            <Tab label="Add training" {...tabProperties(1)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <FixedSizeList
            height={800}
            width={700}
            itemSize={46}
            itemCount={items.length}
            overscanCount={10}
          >
            {renderTrainingInAccordion()}
          </FixedSizeList>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <FileInput />
        </TabPanel>
      </div>
    );
  }

  function renderTrainingInAccordion() {
    return ({ index }) => {
      var item = items[index];
      return (
        <Accordion expanded={expanded === index} onChange={handlePanelChange(index)}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header">
            <Typography component={'span'}>{item.name} - <i>{item.description}</i></Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography component={'span'}>

              Teacher: {item.teacher} Price: {item.price}{item.currency} Duration: {item.duration} {item.durationFormat}

              <List
                sx={{
                  width: '100%',
                  maxWidth: 700,
                  bgcolor: 'background.paper',
                  position: 'relative',
                  overflow: 'auto',
                  maxHeight: 300,
                  '& ul': { padding: 0 },
                }}
                subheader={<li />}
              >
                {item.startDates.map((trainingDate) => (
                  <ListItem key={`item-${trainingDate.id}`}>
                    <ListItemText primary={`Start date ${trainingDate.startDate} - ${trainingDate.freePlaces} free places`} />
                  </ListItem>
                ))}
              </List>
            </Typography>
          </AccordionDetails>
        </Accordion>
      );
    };
  }
}



ReactDOM.render(
  <UsersComponent />,
  document.getElementById('root')
);
