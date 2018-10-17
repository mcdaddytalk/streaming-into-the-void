import React from 'react';
import Stream from './Stream';
import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';

PouchDB.plugin(PouchDBFind);
const Voids = new PouchDB('http://localhost:5000/voids');

class StreamList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      streams: [],
    }
  }

  randInterval(min, max) {
      return Math.random()*(max-min+1)+min;
  }

  async getStreams(count = 25) {
    try {
      let queryAtTime = Math.floor(this.randInterval(0, 5) * 60 * 1000);
      let query = {
        selector: {
          created_at: {
            $gte: Date.now() - queryAtTime
          }
        },
        sort: [{'created_at': 'desc'}],
        limit: count
      };
      console.log(queryAtTime);
      const liveStreams = await Voids.find(query);

      return liveStreams.docs;
    } catch(e) {
      console.log(e);
    }
  }

  async componentDidMount() {
    try {
      this.setState({
        streams: await this.getStreams()
      });
    } catch(e) {
      console.error(e);
    }
  }

  render() {
    return (
      <div className="StreamList">
        {this.state.streams.map((stream, index) => (
          <Stream
            key={stream.id + '-' + index}
            data={stream}
          />
        ))}
      </div>
    );
  }
}

export default StreamList;