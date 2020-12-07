import React, { useRef } from 'react';
import { TwitchPlayer } from 'react-twitch-embed';

const Stream = (props) => {
  const volumeRef = useRef();
  const playerObjRef = useRef();
  const mutedRef = useRef(true);
  let stream = props.data;

  // size the thumbnail url
  stream.thumbnail_url = stream.thumbnail_url
    .replace(/{width}/, 300)
    .replace(/{height}/, 200);

  // extract username
  let usernameExtraction = /(?:live_user_)(.+)(?:-.*)/gi;
  stream.username = usernameExtraction.exec(stream.thumbnail_url)[1];

  return (
    <TwitchPlayer
      className="twitchplayer"
      id={stream.username}
      muted
      channel={stream.username}
      hideControls
      width="auto"
      height="auto"
      onEnded={() => console.log('stream ended', stream.username)}
      onReady={(player) => {
        playerObjRef.current = player;
      }}
    >
      <div
        className="volume"
        ref={volumeRef}
        onClick={() => {
          if (playerObjRef.current && volumeRef.current) {
            playerObjRef.current.setMuted(!mutedRef.current);
            mutedRef.current = !mutedRef.current;
            volumeRef.current.parentElement.classList.toggle('playing');
          }
        }}
      />
    </TwitchPlayer>
  );
};

export default Stream;
