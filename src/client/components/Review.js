import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  btn: {
    backgroundColor: '#0E402D',
    color: 'white',
    marginTop: '1rem'
  }
}));

const list = [
  "The organization shall ensure that its FSC-certified products conform to all applicable timber legality legislation",
  "Ensure that FSC-certified products containing pre-consumer reclaimed wood (except reclaimed paper) being sold to companies located in countries where timber legality legislation applies",
  "Only include pre-consumer reclaimed wood materials that conform to FSC Controlled Wood requirements in accordance with FSC-STD-40-005",
  "Inform their customers about the presence of pre-consumer reclaimed wood in the product and support their due diligence system as required by applicable timber legality legislation",
  "All products shall have the same conversion factor. If not, they may still be grouped under the same product group, but the applicable conversion factors shall be applied to the corresponding products for the calculation of the amount of output",
  "All products shall be made of the same input material (e.g. pine lumber) or same combination of input materials (e.g. a product group of veneered particle boards, where all products are made of a combination of particle board and veneer of equival",
  "Only FSC products that are eligible for FSC labelling may be promoted with the FSC trademarks",
  "Products exclusively made of input materials from small and/or community producers are eligible to carry the FSC Small and Community Label",
  "Activities that are subject to outsourcing agreements are those that are included in the scope of the organization’s CoC certificate, such as purchase, processing, storage, labelling and invoicing of products",
  "The organization shall establish an outsourcing agreement with each non-FSC-certified contractor, specifying at minimum",
  "Notify the organization within the period of 10 business days if the contractor is included in the list of organizations that are disassociated from FSC, in accordance with the FSC-POL-01-004, and therefore subsequently ineligible to provide outsourcing"
]

export default function Review() {
  const classes = useStyles();
  const [checked, setChecked] = React.useState([0]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  return (
    <>
      <Typography variant="h4" paragraph>
        Checklist
      </Typography>
      <List className={classes.root}>
        {list.map((value) => {
          const labelId = `checkbox-list-label-${value}`;

          return (
            <ListItem key={value} role={undefined} dense button onClick={handleToggle(value)}>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={value} />
            </ListItem>
          );
        })}
      </List>
      <Button className={classes.btn} variant="contained" size="large">
        Issue Certificate
      </Button>
    </>
  );
}