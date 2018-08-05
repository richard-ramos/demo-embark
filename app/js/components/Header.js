import React, {Component} from 'react';
import AddIcon from '@material-ui/icons/Add';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PropTypes from 'prop-types';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';

const styles = {
    root: {
      flexGrow: 1
    },
    flex: {
      flexGrow: 1
    }
  };

const options = [
 'Sort by age',
 'Sort by rating'
];

class Header extends Component {

  constructor(props){
    super(props);
    this.state = {
      anchorEl: null
    };
  }

  handleClick = event => {
    this.setState({anchorEl: event.currentTarget});
  };

  handleClose = () => {
    this.setState({anchorEl: null});
  };

  render(){
    const {classes, toggleForm} = this.props;
    const {anchorEl} = this.state;
    const open = Boolean(anchorEl);

    return (
        <div className={classes.root} >
          <AppBar position="fixed">
            <Toolbar className={classes.toolBar}>
              <Typography variant="display1" color="inherit" className={classes.flex}>
                Etherleaks
              </Typography>
              <Button color="inherit" onClick={toggleForm}>
                <AddIcon />
              </Button>
              <Button color="inherit" onClick={this.handleClick}>
                <MoreVertIcon />
              </Button>
              <Menu
                id="long-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={this.handleClose}
                PaperProps={{
                  style: {
                    width: 200
                  }
                }}>
                {options.map(option => (
                  <MenuItem key={option} selected={option === 'Pyxis'}>
                    {option}
                  </MenuItem>
                ))}
              </Menu>
            </Toolbar>
          </AppBar>
        </div>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired,
  toggleForm: PropTypes.func.isRequired
};

export default withStyles(styles)(Header);
