import React, {Component, Fragment} from 'react';
import Create from './Create';
import ELeaks from 'Embark/contracts/ELeaks';
import EmbarkJS from 'Embark/EmbarkJS';
import Header from './Header';
import Leak from './Leak';
import _ from 'lodash';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      'displayForm': false,
      'list': [],
      'sortBy': 'age',
      'sortOrder': 'desc'
    };
  }

  componentDidMount() {
    EmbarkJS.onReady(() => {
      this._loadReports();
    });
  }

  _toggleForm = () => {
    this.setState({displayForm: !this.state.displayForm});
  }

  _setSortOrder = (sortBy) => {
    const sortOrder = (this.state.sortOrder == 'asc' && this.state.sortBy == sortBy) || this.state.sortBy != sortBy ? 'desc' : 'asc';
    this.setState({sortBy, sortOrder});
  }

  _loadReports = async () => {
    const {leaks, num} = ELeaks.methods;
    let list = [];
    const total = await num().call();
    if(total > 0){
        for (let i = 0; i < total; i++) {
            const leak = leaks(i).call();
            list.push(leak);
        }

        list = await Promise.all(list);
        list = list.map((value, index) => { 
                      value.id = index; 
                      value.upvotes = parseInt(value.upvotes, 10);
                      value.downvotes = parseInt(value.downvotes, 10);
                      return value; 
                    });
    }
    this.setState({list});
  }

  render() {
    const {displayForm, list, sortBy, sortOrder} = this.state;

    let orderedList;
    if(sortBy == 'rating'){
      orderedList = _.orderBy(list, [function(o) { return o.upvotes - o.downvotes; }, 'creationDate'], [sortOrder, sortOrder]);
    } else {
      orderedList = _.orderBy(list, 'creationDate', sortOrder);
    }

    return (<Fragment>
        <Header toggleForm={this._toggleForm} sortOrder={this._setSortOrder} />
        { displayForm && <Create afterPublish={this._loadLeaks} /> }
        { orderedList.map((record) => <Leak key={record.id} {...record} />) }
        </Fragment>
    );
  }
}

export default App;
