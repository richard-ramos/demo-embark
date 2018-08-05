import React, {Component, Fragment} from 'react';
import Create from './Create';
import EmbarkJS from 'Embark/EmbarkJS';
import Header from './Header';
import Report from './Report';
import ReportManager from 'Embark/contracts/ReportManager';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      'displayForm': false,
      'list': []
    };
  }

  componentDidMount() {
    EmbarkJS.onReady(() => {
      this._loadReports();
    });
  }

  toggleForm = () => {
    this.setState({displayForm: !this.state.displayForm});
  }

  _loadReports = async () => {
    const {reports, numReports} = ReportManager.methods;
    let list = [];
    const total = await numReports().call();
    if(total > 0){
        for (let i = 0; i < total; i++) {
            const report = reports(i).call();
            list.push(report);
        }

        list = await Promise.all(list);
        list = list.map((value, index) => { 
                      value.id = index; 
                      return value; 
                    });
    }
    this.setState({list});
  }

  render() {
    const {displayForm, list} = this.state;
    return (<Fragment>
        <Header toggleForm={this.toggleForm} />
        { displayForm && <Create afterPublish={this._loadReports} /> }
        { list.map((record, i) => <Report key={i} {...record} />) }
        </Fragment>
    );
  }
}

export default App;
