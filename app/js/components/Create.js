import React, {Component} from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import EmbarkJS from 'Embark/EmbarkJS';
import PropTypes from 'prop-types';
import ReportManager from 'Embark/contracts/ReportManager';
import Spinner from 'react-spinkit';
import TextField from '@material-ui/core/TextField';
import web3 from 'Embark/web3';
import {withStyles} from '@material-ui/core/styles';


const styles = theme => ({
  textField: {
    marginRight: theme.spacing.unit * 2
  }
});

class Create extends Component{

  constructor(props){
    super(props);
    this.state = {
      'text': '',
      'isSubmitting': false
    };
  }

  handleClick = event => {
    event.preventDefault();

    this.setState({isSubmitting: true});

    const {create} = ReportManager.methods;
    
    let toSend;

    EmbarkJS.Storage.saveText(this.state.text)
    .then(ipfsHash => {
      toSend = create(web3.utils.toHex(ipfsHash));
      return toSend.estimateGas();
    })
    .then(estimatedGas => {
      return toSend.send({gas: estimatedGas + 1000});
    })
    .then(receipt => {
      console.log(receipt);
      this.setState({
        text: ''
      });
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      this.setState({isSubmitting: false});
      this.props.afterPublish();
    });
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  render(){
    const {classes} = this.props;

    return (
      <Card>
        <CardContent>
          <TextField
            id="description"
            label="Descripci&oacute;n"
            multiline
            rowsMax="20"
            fullWidth
            value={this.state.text}
            onChange={this.handleChange('text')}
            className={classes.textField}
            margin="normal" />
          {
            this.state.isSubmitting ? <Spinner name="circle" color="blue"/> : <Button variant="contained" color="primary" onClick={this.handleClick}>Publicar</Button>
          }
        </CardContent>
      </Card>
    );
  }
}

Create.propTypes = {
  classes: PropTypes.object.isRequired,
  afterPublish: PropTypes.func.isRequired
};

export default withStyles(styles)(Create);
