import React, {Component, Fragment} from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import LinearProgress from '@material-ui/core/LinearProgress';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import {withStyles} from '@material-ui/core/styles';

// TODO: importar embark/EmbarkJS
// TODO: importar embark/web3
// TODO: importar embark/contracts/EtherPress

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

  handleClick = async event => {
    event.preventDefault();

    if(this.state.title.trim() == ''){
      this.setState({'error': 'Campo Requerido'});
      return;
    }

    this.setState({
      isSubmitting: true, 
      error: ''
    });

    // TODO: Guardar este objeto en IPFS
    const textToSave = {
      'title': this.state.title,
      'content': this.state.content
    };

    // TODO: Estimar gas para invocar a `create`

    // TODO: Crear transacción

    this.setState({
      isSubmitting: false,
      content: '',
      title: ''
    });

    this.props.afterPublish();
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
