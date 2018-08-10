import {Card, CardActions, CardContent, CardHeader} from '@material-ui/core';
import React, {Component} from 'react';
import Blockies from 'react-blockies';
import Button from '@material-ui/core/Button';
import DownvoteIcon from '@material-ui/icons/ExpandMore';
import EmbarkJS from 'Embark/EmbarkJS';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import PropTypes from 'prop-types';
import ReportManager from 'Embark/contracts/ReportManager';
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
      margin: theme.spacing.unit * 3
    },
    title: {
        borderBottom: '1px solid #ccc',
        color: '#666'
    }
});  

const ballot = {
    NONE: 0,
    UPVOTE: 1,
    DOWNVOTE: 2
};

class Report extends Component {
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

        const {canVote, getVote} = ReportManager.methods;

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

        const {vote} = ReportManager.methods;
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
        const {title, content, upvotes, downvotes} = this.state;
        const {creationDate, classes, owner} = this.props;
        const disabled = this.state.isSubmitting || !this.state.canVote;
        const formattedDate = dateformat(new Date(creationDate * 1000), "dddd, mmmm dS, yyyy, h:MM:ss TT");
        const mdText = markdown.toHTML(content);

        return <Card className={classes.card}>
            <CardHeader title={owner} subheader={formattedDate}
                avatar={
                    <Blockies seed={owner} size={8} scale={6} />
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
          </CardActions>
        </Card>;
    }
}

Report.propTypes = {
    upvotes: PropTypes.number.isRequired,
    downvotes: PropTypes.number.isRequired,
    classes: PropTypes.object.isRequired,
    id: PropTypes.number.isRequired,
    owner: PropTypes.string.isRequired,
    creationDate: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired
  };
  

export default withStyles(styles)(Report);
