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
      frameborder="0"
      allowfullscreen="true"
      scrolling="no"
      height="378"
      width="620"
      title={stream.title}
      key={stream._id}
    />
  )
};

export default Stream;