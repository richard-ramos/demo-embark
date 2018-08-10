import React, {Component, Fragment} from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import EmbarkJS from 'Embark/EmbarkJS';
import EtherPress from 'Embark/contracts/EtherPress';
import LinearProgress from '@material-ui/core/LinearProgress';
import PropTypes from 'prop-types';
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
      'title': '',
      'content': '',
      'isSubmitting': false,
      'error': ''
    };
  }

  handleClick = event => {
    event.preventDefault();

    if(this.state.title.trim() == ''){
      this.setState({'error': 'Campo Requerido'});
      return;
    }

    this.setState({
      isSubmitting: true, 
      error: ''
    });

    const {create} = EtherPress.methods;
    
    let toSend;

    const textToSave = {
      'title': this.state.title,
      'content': this.state.content
    };

    EmbarkJS.Storage.saveText(JSON.stringify(textToSave))
    .then(ipfsHash => {
      toSend = create(web3.utils.toHex(ipfsHash));
      return toSend.estimateGas();
    })
    .then(estimatedGas => {
      return toSend.send({from: web3.eth.defaultAccount, 
                          gas: estimatedGas + 1000});
    })
    .then(receipt => {
      console.log(receipt);
      this.setState({
        content: '',
        title: ''
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
    const {error, content, title, isSubmitting} = this.state;

    return (<Fragment>
      <Card>
        <CardContent>
          <TextField
            id="title"
            label="T&iacute;tulo"
            error={error != ""}
            multiline
            rowsMax="20"
            fullWidth
            value={title}
            helperText={error}
            onChange={this.handleChange('title')}
            className={classes.textField}
            margin="normal" />
          <TextField
            id="description"
            label="Descripci&oacute;n"
            error={error != ""}
            multiline
            rowsMax="20"
            fullWidth
            value={content}
            helperText={error}
            onChange={this.handleChange('content')}
            className={classes.textField}
            margin="normal" />
          {
            <Button variant="contained" color="primary" onClick={this.handleClick} disabled={isSubmitting }>Publicar</Button>
          }
        </CardContent>
      </Card>
      { this.state.isSubmitting && <LinearProgress /> }
      </Fragment>
    );
  }
}

Create.propTypes = {
  classes: PropTypes.object.isRequired,
  afterPublish: PropTypes.func.isRequired
};

export default withStyles(styles)(Create);
