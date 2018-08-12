import {Card, CardActions, CardContent, CardHeader} from '@material-ui/core';
import React, {Component} from 'react';
import Blockies from 'react-blockies';
import CircularProgress from '@material-ui/core/CircularProgress';
import DownvoteIcon from '@material-ui/icons/ExpandMore';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import UpvoteIcon from '@material-ui/icons/ExpandLess';
import dateformat from 'dateformat';
import markdownJS from "markdown";
import {withStyles} from '@material-ui/core/styles';

// TODO: importar embark/EmbarkJS
// TODO: importar embark/web3
// TODO: importar embark/contracts/EtherPress

const markdown = markdownJS.markdown;

const styles = theme => ({
    actions: {
      marginRight: theme.spacing.unit * 5,
      fontSize: 15,
      display: 'flex'
    },
    card: {
      margin: theme.spacing.unit,
      marginTop: theme.spacing.unit * 4,
      position: 'relative'
    },
    title: {
        borderBottom: '1px solid #ccc',
        color: '#666'
    },
    spinner: {
        position: 'absolute',
        right: theme.spacing.unit * 3
    }
});  

const ballot = {
    NONE: 0,
    UPVOTE: 1,
    DOWNVOTE: 2
};

class Post extends Component {

    constructor(props){
        super(props);

        this.state = {
            title: '',
            content: '',
            isSubmitting: false,
            canVote: true,
            upvotes: props.upvotes,
            downvotes: props.downvotes
        };
    }

    componentDidMount(){
        // TODO: buscar atributos del post cuando Embark termine de cargar
        this._loadAttributes();
    }

    _loadAttributes = async () => {
        const ipfsHash = web3.utils.toAscii(this.props.description);

        // TODO: Obtener el contenido de IPFS

        // TODO: Determinar si msg.sender puede votar o no

        this.setState({
            title: "Tres leyes de la robótica",
            content: `1. Un robot no hará daño a un ser humano o, por inacción, permitir que un ser humano sufra daño.\n
2. Un robot debe cumplir las órdenes dadas por los seres humanos, a excepción de aquellas que entrasen en conflicto con la primera ley.\n
3. Un robot debe proteger su propia existencia en la medida en que esta protección no entre en conflicto con la primera o con la segunda ley\n
Isaac Asimov`,
            canVote: true
        });
    }

    _vote = choice => event => {
        event.preventDefault();
        this.setState({isSubmitting: true});

        // TODO: Estima el costo de llamar a la funcion vote
        
        // TODO: Llamar al contrato a la funcion vote. 
        
        this.setState({
            canVote: false,
            upvotes: this.state.upvotes + (choice == ballot.UPVOTE ? 1 : 0),
            downvotes: this.state.downvotes + (choice == ballot.DOWNVOTE ? 1 : 0)
        });

        this.setState({isSubmitting: false});
    }

    render(){
        const {title, content, upvotes, downvotes, isSubmitting, canVote} = this.state;
        const {creationDate, classes, owner} = this.props;
        const disabled = isSubmitting || !canVote;
        const formattedDate = dateformat(new Date(creationDate * 1000), "yyyy-mm-dd HH:MM:ss");
        const mdText = markdown.toHTML(content);

        return <Card className={classes.card}>
            <CardHeader title={owner} subheader={formattedDate}
                avatar={
                    <Blockies seed={owner} size={7} scale={5} />
                }
                action={
                <IconButton>
                    <MoreVertIcon />
                </IconButton>
              } />
            <CardContent>
                <Typography variant="title"  className={classes.title}  gutterBottom>
                {title}
                </Typography>
                <Typography component="div" dangerouslySetInnerHTML={{__html: mdText}} />
            </CardContent>
            <CardActions disableActionSpacing>
                <IconButton className={classes.actions} disabled={disabled} onClick={this._vote(ballot.UPVOTE)}>
                <UpvoteIcon />
                {upvotes}
                </IconButton>
                <IconButton className={classes.actions} disabled={disabled} onClick={this._vote(ballot.DOWNVOTE)}>
                <DownvoteIcon />
                {downvotes}
                </IconButton>
                { isSubmitting && <CircularProgress size={14} className={classes.spinner} /> }
          </CardActions>
        </Card>;
    }
    
}

Post.propTypes = {
    upvotes: PropTypes.number.isRequired,
    downvotes: PropTypes.number.isRequired,
    classes: PropTypes.object.isRequired,
    id: PropTypes.number.isRequired,
    owner: PropTypes.string.isRequired,
    creationDate: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired
  };
  

export default withStyles(styles)(Post);
