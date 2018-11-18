import React, { PureComponent } from 'react';
import Autosuggest from 'react-autosuggest';
import AutosuggestHighlightMatch from 'autosuggest-highlight/umd/match';
import AutosuggestHighlightParse from 'autosuggest-highlight/umd/parse';
import axios from 'axios';
import Results from './Results';
import jobLevelList from "../levels.json";
import '../css/Search.css';
import config from '../../config';

const getSuggestionValue = suggestion => suggestion;

const renderSuggestion = (suggestion, { query }) => {
  const matches = AutosuggestHighlightMatch(suggestion, query);
  const parts = AutosuggestHighlightParse(suggestion, matches);

  return (
    <span>
      {parts.map((part, index) => {
        const className = part.highlight ? 'react-autosuggest__suggestion-match' : null;

        return (
          <span className={className} key={index}>
            {part.text}
          </span>
        );
      })}
    </span>
  );
};

class Search extends PureComponent {
  constructor() {
    super();

    this.state = {
      location: '',
      keyword: '',
      category: '',
      company: '',
      keyList: [],
      companyName: [],
      jobLocation: [],
      industries: [],
      levels: [],
      suggestions: [],
      jobList: []
    };
  }

  componentDidMount() {
    return axios.get(`http://${config.host}:5000/jobs`)
      .then(res => {
        this.setState({
          companyName: res.data.companyName,
          jobLocation: res.data.jobLocation,
          industries: res.data.industries,
          levels: jobLevelList,
          keyList: res.data.companyName.concat(res.data.industries, jobLevelList)
        });
      })
      .catch((error) => {
        console.warn(error);
      });
  }

  onKeywordChange = (event, { newValue }) => {
    this.setState({
      keyword: newValue
    });
  };

  onLocationChange = (event, { newValue }) => {
    this.setState({
      location: newValue
    });
  };

  getSuggestions = (value, type) => {
    const inputValue = value.trim().toLowerCase();
    const inputLength = inputValue.length;

    switch (type) {
      case 'keyword':
        return inputLength === 0 ? [] : this.state.keyList.filter(lang =>
          lang.toLowerCase().slice(0, inputLength) === inputValue
        );
      case 'location':
        return inputLength === 0 ? [] : this.state.jobLocation.filter(lang =>
          lang.toLowerCase().slice(0, inputLength) === inputValue
        );
      default:
        return '-'
    }
  };

  onKeywordSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value, 'keyword')
    });
  };

  onKeywordSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  onLocationSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  onLocationSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value, 'location')
    });
  };

  searchJob = () => {
    const company = this.state.companyName.find(key => key === this.state.keyword);
    const category = this.state.industries.find(key => key === this.state.keyword);
    const level = this.state.levels.find(key => key === this.state.keyword);

    return axios.get(`http://${config.host}:5000/search`, {
      params: {
        company,
        location: this.state.location,
        category,
        level
      }
    }).then(({ data }) => {
        this.setState({
          jobList: data
        });
      })
      .catch((error) => {
        console.warn(error);
      });
  };

  render() {
    const { location, suggestions, keyword } = this.state;
    const keywordProps = {
      placeholder: 'Job title, keywords or company',
      value: keyword,
      onChange: this.onKeywordChange
    };
    const locationProps = {
      placeholder: 'Location',
      value: location,
      onChange: this.onLocationChange
    };

    return (
      <div>
        <div className="container search-input">
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={this.onKeywordSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onKeywordSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={keywordProps}
          />
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={this.onLocationSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onLocationSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={locationProps}
          />
          <div className="search-button">
            <input type="submit" value="Search" onClick={this.searchJob}/>
          </div>
        </div>
        <Results jobList={this.state.jobList} />
      </div>
    );
  }
}

export default Search;
