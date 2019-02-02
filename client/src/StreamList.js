import React from 'react';
import Stream from './Stream';
import classNames from 'classnames';

const streamApi = 'https://sitv-api.herokuapp.com/';

class StreamList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fetching: true,
      fetchSecs: 0,
      streams: [],
      seen_stream_ids: []
    };
    this.db = null;
    this.interval = null;
  }

  getStreams = async (count = 8) => {
    try {
      // fetch streams
      const data = {
        seen_stream_ids: this.state.seen_stream_ids,
        count
      };

      console.log('Sending data', data);

      const response = await fetch(streamApi, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const streams = await response.json();

      if (streams.length === 0) {
        console.log('received no streams');
        return this.getStreams();
      }

      console.log('got streams', streams);

      // Otherwise, update state with the new streams.
      this.setState(state => ({
        fetching: false,
        fetchSecs: 0,
        streams,
        seen_stream_ids: [
          ...state.seen_stream_ids,
          ...streams.reduce((arr, stream) => {
            arr.push(stream.stream_id);
            return arr;
          }, [])
        ]
      }));

      // // Clear the fetch counter.
      clearInterval(this.interval);
    } catch (e) {
      console.log('Failed to get streams', e);

      // Try again!
      this.getStreams();
    }
  };

  tickTock = () => {
    this.setState({
      fetchSecs: this.state.fetchSecs + 1
    });
  };

  fetchMoreStreams = () => {
    // set fetching state
    this.setState({
      fetching: true
    });

    // start an interval for our cute message
    this.interval = setInterval(() => this.tickTock(), 1000);

    // grab streams
    this.getStreams();
  };

  componentDidMount() {
    this.fetchMoreStreams();
  }

  render() {
    let buttonMessage = 'go deeper';
    if (this.state.fetching) {
      buttonMessage = 'contacting the void';
      if (this.state.fetchSecs > 3) {
        buttonMessage = 'the void is cranky...';
      }
      if (this.state.fetchSecs > 6) {
        buttonMessage =
          'sorry, the void is too deep right now. please return to the void later.';
      }
    }

    return (
      <div className="StreamList">
        {this.state.streams.map((stream, index) => (
          <Stream key={stream.id + '-' + index} data={stream} />
        ))}
        <button
          className={classNames('next', {
            loading: this.state.fetching,
            only: this.state.streams.length === 0
          })}
          onClick={this.fetchMoreStreams}
        >
          {buttonMessage}
        </button>
      </div>
    );
  }
}

export default StreamList;
