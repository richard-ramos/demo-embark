import {Card, CardActions, CardContent, CardHeader} from '@material-ui/core';
import React, {Component} from 'react';
import Blockies from 'react-blockies';
import CircularProgress from '@material-ui/core/CircularProgress';
import DownvoteIcon from '@material-ui/icons/ExpandMore';
import EmbarkJS from 'Embark/EmbarkJS';
import EtherPress from 'Embark/contracts/EtherPress';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import UpvoteIcon from '@material-ui/icons/ExpandLess';
import dateformat from 'dateformat';
import markdownJS from "markdown";
import web3 from 'Embark/web3';
import {withStyles} from '@material-ui/core/styles';

const markdown = markdownJS.markdown;
const styles = theme => ({
    actions: {
      marginRight: theme.spacing.unit * 5,
      fontSize: 15,
      display: 'flex'
    },
    card: {
      margin: theme.spacing.unit * 2,
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
            vote: 0,
            upvotes: props.upvotes,
            downvotes: props.downvotes
        };
    }

    componentDidMount(){
        EmbarkJS.onReady(() => {
            this._loadAttributes();
        });
    }

    _loadAttributes = () => {
        const ipfsHash = web3.utils.toAscii(this.props.description);
        EmbarkJS.Storage.get(ipfsHash)
        .then(ipfsText => {
            const jsonContent = JSON.parse(ipfsText);
            const title = jsonContent.title;
            const content = jsonContent.content;
            this.setState({title, content});
        });

        const {canVote, getVote} = EtherPress.methods;

        canVote(this.props.id).call().then((canVote) => {
            this.setState({canVote});
        });

        getVote(this.props.id).call().then((vote) => {
            this.setState({vote});
        });
    }

    _vote = choice => event => {
        event.preventDefault();

        this.setState({isSubmitting: true});

        const {vote} = EtherPress.methods;
        let toSend = vote(this.props.id, choice);
        
        toSend.estimateGas()
        .then(estimatedGas => {
            return toSend.send({gas: estimatedGas + 1000});
        })
        .then(receipt => {
            this.setState({
                canVote: false,
                upvotes: this.state.upvotes + (choice == ballot.UPVOTE ? 1 : 0),
                downvotes: this.state.downvotes + (choice == ballot.DOWNVOTE ? 1 : 0)
            });

            console.log(receipt);
        })
        .catch((err) => {
            console.error(err);
        })
        .finally(() => {
            this.setState({isSubmitting: false});
        });
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
