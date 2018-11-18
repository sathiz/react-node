import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ResultRow from './ResultRow';
import '../css/Results.css';

function NoResultBanner(props) {
  if (props.warn.length) {
    return null;
  }

  return (
    <div>
      No Result
    </div>
  );
}

class Results extends PureComponent {
  render() {
    return (
      <div className="component-results">
        <NoResultBanner warn={this.props.jobList}/>
        {this.props.jobList.map(job => (
          <ResultRow
            companyName={job.company.name}
            title={job.name}
            location={job.locations}
            level={job.levels}
            description={job.contents}
            url={job.refs.landing_page}
          />
        ))}
      </div>
    );
  }
}

Results.propTypes = {
  jobList: PropTypes.array
};

export default Results;
