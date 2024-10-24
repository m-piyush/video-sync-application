import React, { useState } from 'react';
import AudioRecorder from './AudioRecorder';
import VideoPlayerWithAudioSyncAndSubtitleSwitch from './VideoPlayer';

const AudioVideoContainer = () => {
  const [recordedAudioURL, setRecordedAudioURL] = useState('');

  const handleRecordingComplete = (audioURL) => {
    setRecordedAudioURL(audioURL); // Set the recorded audio URL
  };

  return (
    <div className="container mx-auto p-4">
      {/* Video Player Component */}
      <VideoPlayerWithAudioSyncAndSubtitleSwitch audioURL={recordedAudioURL || '/sample-audio.mp3'} />

      {/* Audio Recorder Component */}
      <AudioRecorder onRecordingComplete={handleRecordingComplete} />

    </div>
  );
};

export default AudioVideoContainer;
