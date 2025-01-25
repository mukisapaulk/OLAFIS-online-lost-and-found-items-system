import React from 'react'
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Fade from '@mui/material/Fade';


const Accordin = () => {
    const accordionData = [
        {
          summary: "What are effective strategies to prevent items from being lost in the workplace?",
          details: `
            Effective strategies to prevent items from being lost in the workplace include:
            - Implementing a check-in and check-out system for equipment and tools.
            - Clearly labeling personal and company-owned items with names or identification numbers.
            - Providing designated storage areas for employees to keep their belongings.
            - Encouraging employees to keep their workspaces organized and clutter-free.
            - Conducting regular inventory checks to account for all items.
            - Using technology, such as RFID tags or barcode scanners, to track valuable assets.
          `,
        },
        {
          summary: "How can companies manage a lost and found system effectively?",
          details: `
            Companies can manage a lost and found system effectively by:
            - Establishing a central location for lost and found items that is easily accessible to employees and visitors.
            - Creating a logbook or digital database to record details of found items, including date, description, and finder’s contact information.
            - Clearly communicating the process for reporting lost items and retrieving found items to all employees.
            - Regularly reviewing and updating the lost and found inventory.
            - Donating unclaimed items to charity or disposing of them responsibly after a set period.
            - Assigning a dedicated person or team to oversee the lost and found system.
          `,
        },
        {
          summary: "What information should be recorded when an item is found and turned into lost and found?",
          details: `
            When an item is found and turned into lost and found, the following information should be recorded:
            - Date and time when the item was found.
            - Detailed description of the item (e.g., color, brand, any distinguishing features).
            - Location where the item was found.
            - Name and contact information of the person who found the item.
            - Any identification numbers or marks on the item.
            - Condition of the item when it was found.
          `,
        },
        {
          summary: "How can employees be encouraged to take responsibility for their belongings?",
          details: `
            Employees can be encouraged to take responsibility for their belongings by:
            - Providing secure storage options, such as lockers or personal drawers.
            - Encouraging employees to label their items with their names or unique identifiers.
            - Offering regular reminders about the importance of keeping track of personal and company property.
            - Implementing a culture of accountability where employees are reminded to respect others' property.
            - Providing training sessions on organizational skills and the benefits of maintaining a tidy workspace.
          `,
        },
        {
          summary: "What steps should be taken when an item is reported lost?",
          details: `
            When an item is reported lost, the following steps should be taken:
            - Record detailed information about the lost item, including description, last known location, and time it was last seen.
            - Check the lost and found inventory to see if the item has already been turned in.
            - Notify relevant departments or staff to be on the lookout for the lost item.
            - Communicate the loss to the workplace community via email or internal communication channels.
          `,
        },
      ];
      
        const [expanded, setExpanded] = React.useState(false);
      
        const handleExpansion = (panel) => (event, isExpanded) => {
          setExpanded(isExpanded ? panel : false);
        };
      
        return (
          <div>
            {accordionData.map((item, index) => (
              <Accordion
                key={index}
                expanded={expanded === index}
                onChange={handleExpansion(index)}
                style={{ 
                  border: '1px solid black',
                  margin:'0px 10px 20px 10px',
                  boxShadow:'none',
                  borderRadius:'10px',
                 }}
                sx={{
                  '& .MuiAccordion-region': { height: expanded === index ? 'auto' : 0 },
                  '& .MuiAccordionDetails-root': { display: expanded === index ? 'block' : 'none' },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel${index}-content`}
                  id={`panel${index}-header`}
                  style={{
                    color: 'white',
                    padding: '10px',
                    backgroundColor: 'rgb(220, 38, 38)',
                    borderRadius:'10px',
                  }}
                >
                  <Typography
                    style={{
                      fontWeight: 'medium',
                      fontSize: '1.2rem',
                      padding: '10px',
                    }}
                  >
                    {item.summary}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography
                    style={{
                      color: 'gray',
                      fontWeight: 'medium',
                      fontSize: '1.0rem',
                      padding: '10px',
                    }}
                  >
                    {item.details.trim().split('\n').map((line, i) => (
                      <span key={i}>
                        {line}
                        <br />
                      </span>
                    ))}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </div>
        );
      };
      
     

export default Accordin;