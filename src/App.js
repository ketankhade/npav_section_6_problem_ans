import React, { Component } from 'react';
import './App.css';
// import fetchJsonp from 'fetch-jsonp';

const statiic_data = [
  { country: "Pakistan", score: 23 },
  { country: "Pakistan", score: 127 },
  { country: "India", score: 3 },
  { country: "India", score: 71 },
  { country: "Australia", score: 31 },
  { country: "India", score: 22 },
  { country: "Pakistan", score: 81 },
];

const server_url = 'http://www2.rsphinx.com/static/misc/cric_scores.json';
// const server_url = 'https://assessments.reliscore.com/api/cric-scores/';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: 'Test Data',
      selectedCountry: '',
      selectedCountryScore: '',
      isCountryListOpen: false,
      renderData: statiic_data,
      serverErr: '',
    };
  }

  // below function used for change data source
  changeSource = (e) => {
    this.setState({
      dataSource: e,
      selectedCountry: '',
      selectedCountryScore: '',
      isCountryListOpen: false,
      renderData: [],
      serverErr: '',
    }, () => {
      if (this.state.dataSource === 'Server Data') {
        /* facing CORS issue while making server API call */
        fetch(`${server_url}`)
          .then(response => response.json())
          .then(data => {
            this.setState({
              renderData: data || statiic_data,
            });
          }).catch(e => {
            this.setState({
              serverErr: 'Data fetching error',
            });
          })

        /* as jsonp not configured at server side so below code is not working */

        // fetchJsonp(`${server_url}`)
        //   .then(function (response) {
        //     return response.json()
        //   }).then(function (json) {
        //     this.setState({
        //       renderData: data || statiic_data,
        //     });
        //   }).catch(function (ex) {
        //     console.log('parsing failed>>', ex)
        //     this.setState({
        //       serverErr: 'Error',
        //     });
        //   })
      } else {
        this.setState({
          renderData: statiic_data,
        });
      }
    });
  }

  // below function used for open country list for selection
  openCountryList = (e) => {
    console.log(e.target.value)
    this.setState({
      selectedCountry: e.target.value,
      selectedCountryScore: '',
      isCountryListOpen: true,
    });
  }

  // below function used for select country
  changeCountry = (item) => {
    this.setState({
      selectedCountry: item.country,
      selectedCountryScore: item.score,
      isCountryListOpen: false,
    })
  }

  render() {
    const { renderData } = this.state;
    return (
      <div>
        <form class="top-section">
          <span class="title">Source of data:</span>
          <input onClick={e => this.changeSource('Test Data')} id="src-test" type="radio" name="data-source" value="Test Data" checked={this.state.dataSource === 'Test Data'} />
          <label for="src-local">Test Data</label>
          <input onClick={e => this.changeSource('Server Data')} id="src-server" type="radio" name="data-source" value="Server Data" checked={this.state.dataSource === 'Server Data'} />
          <label for="src-server">Server Data</label>
          <span class="error">{this.state.serverErr}</span>
        </form>
        <div class="row">
          <div class="country">
            <form>
              <span class="title">The Country : </span>
              <input onChange={(e) => this.openCountryList(e)} class="country-input" value={this.state.selectedCountry} />
              {this.state.isCountryListOpen &&
                <div class="country-list">
                  {renderData && renderData.length > 0 && renderData.map((item, index) => (
                    this.state.selectedCountry.toLowerCase() === item.country.toLowerCase() &&
                    // item.country.includes(this.state.selectedCountry) &&
                    <div class="c-name" onClick={() => { this.changeCountry(item) }}>
                      {`${item.country}(${item.score})` || ''}
                    </div>
                  ))
                  }
                </div>
              }
            </form>
          </div>
          <div class="average">
            <span class="title">The Average : </span> {this.state.selectedCountryScore}
          </div>
          <div class="common-progress-bar">
            <div class="progress">
              <div class="horiz-bar"
                style={{
                  backgroundColor: '#003868',
                  height: '100%',
                  width: `${(Number(this.state.selectedCountryScore) / 100) * 100}%`,
                  borderRadius: '2px',
                }}
              >
                &nbsp;</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
