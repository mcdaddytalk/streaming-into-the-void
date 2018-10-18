import React from 'react';

const Stream = props => {
  let stream = props.data;
  
  // size the thumbnail url
  stream.thumbnail_url = stream.thumbnail_url.replace(/{width}/, 300).replace(/{height}/, 200);

  // extract username
  let usernameExtraction = /(?:live_user_)(.+)(?:-.*)/gi;
  stream.username = usernameExtraction.exec(stream.thumbnail_url)[1];

  return (
    <iframe
      src={'https://player.twitch.tv/?channel=' + stream.username}
      frameBorder="0"
      allowFullScreen
      muted
      scrolling="no"
      title={stream.title}
      key={stream._id}
    />
  )
};

export default Stream;