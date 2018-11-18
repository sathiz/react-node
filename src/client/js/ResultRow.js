import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import '../css/ResultRow.css';

class ResultsRow extends PureComponent {
  render() {
    return (
      <div className="component-result-row"
           onClick={()=> window.open(this.props.url, "_blank")}>
        <div className="header-text">{this.props.companyName}</div>
        <p className="title">{this.props.title}</p>
        {this.props.level.map(lvl => (
          <span className="job-level">{lvl.name}</span>
        ))}
        {this.props.location.map(loc => (
          <span className="job-location">{loc.name}</span>
        ))}
      </div>
    );
  }
}
ResultsRow.propTypes = {
  title: PropTypes.string,
  companyName: PropTypes.string,
  location: PropTypes.array,
  level: PropTypes.array,
  description: PropTypes.string,
  url: PropTypes.string
};
export default ResultsRow;
