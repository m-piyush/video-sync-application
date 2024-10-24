import React, { useRef, useState, useEffect } from 'react';
import { FaPlay, FaPause, FaStop } from 'react-icons/fa';

const VideoPlayerWithAudioSyncAndSubtitleSwitch = ({ audioURL }) => {
  const videoRef = useRef(null);
  const audioRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [audioDelay, setAudioDelay] = useState(0);
  const [subtitleLanguage, setSubtitleLanguage] = useState('en');
  const [isRecordedAudio, setIsRecordedAudio] = useState(false);
  const [playBtn, setPlayBtn] = useState(<FaPlay color='white' />);

  // Determine if the audio being played is recorded or sample
  useEffect(() => {
    setIsRecordedAudio(audioURL !== '/sample-audio.mp3');
  }, [audioURL]);

  // Switch subtitles when the language changes
  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
      for (let i = 0; i < videoElement.textTracks.length; i++) {
        const track = videoElement.textTracks[i];
        track.mode = track.language === subtitleLanguage ? 'showing' : 'hidden';
      }
    }
  }, [subtitleLanguage]);

  // Play or pause both video and audio
  const handlePlayPause = () => {
    if (videoRef.current.paused) {
      setPlayBtn(<FaPause color='white' />);
      videoRef.current.play();
      if (audioRef.current) {
        audioRef.current.play();
      }
    } else {
      setPlayBtn(<FaPlay color='white' />);
      videoRef.current.pause();
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  };

  const handleStop = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setPlayBtn(<FaPlay color='white' />);
    setProgress(0);
  };

  // Sync playback time between video and audio
  const handleTimeUpdate = () => {
    const videoCurrentTime = videoRef.current.currentTime;
    setProgress((videoCurrentTime / videoRef.current.duration) * 100);

    if (audioRef.current && !audioRef.current.paused) {
      const expectedAudioTime = videoCurrentTime + audioDelay;
      if (Math.abs(audioRef.current.currentTime - expectedAudioTime) > 0.1) {
        audioRef.current.currentTime = expectedAudioTime;
      }
    }
  };

  const handleSeek = (event) => {
    const newTime = (event.target.value / 100) * videoRef.current.duration;
    videoRef.current.currentTime = newTime;
    if (audioRef.current) {
      audioRef.current.currentTime = newTime + audioDelay;
    }
  };

  // Handle delay change
  const handleAudioDelayChange = (event) => {
    setAudioDelay(parseFloat(event.target.value));
  };

  // Handle subtitle language change
  const handleSubtitleLanguageChange = (event) => {
    setSubtitleLanguage(event.target.value);
  };

  return (
    <div className="sm:w-3/4 w-full sm:mx-auto sm:p-8 p-4 flex flex-col items-center justify-center bg-gray-100 rounded-lg shadow-lg space-y-6">
      {/* Video Player */}
      <div className="flex flex-col mx-auto w-full">
        <video
          ref={videoRef}
          onTimeUpdate={handleTimeUpdate}
          controls={false}
          width="640"
          height="360"
          src="/sample-video.mp4"
          className="rounded-lg w-full shadow-lg border-2 border-gray-300 mb-2"
        >
          {/* Subtitle Tracks */}
          {
            !isRecordedAudio && (<track
              label="English"
              kind="subtitles"
              srcLang="en"
              src="/subtitles-en.vtt"
              default={subtitleLanguage === 'en'}
            />)

          }
          {
            !isRecordedAudio && (<track
              label="Español"
              kind="subtitles"
              srcLang="es"
              src="/subtitles-es.vtt"
              default={subtitleLanguage === 'es'}
            />)
          }

        </video>
        <div className="flex w-full gap-2 items-baseline">
          <button
            onClick={handlePlayPause}
            className="flex items-center justify-center sm:p-2 p-[5px] bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-200 sm:h-10 sm:w-10 h-5 w-5"
          >
            {playBtn}
          </button>
          <button
            onClick={handleStop}
            className="flex items-center justify-center sm:p-2 p-[5px] bg-red-600 text-white rounded-full hover:bg-red-700 transition duration-200 sm:h-10 sm:w-10 h-5 w-5"
          >
            <FaStop color='white' />
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleSeek}
            className='w-full cursor-pointer mt-2'
          />
        </div>

        {/* Audio */}
        <audio ref={audioRef} src={audioURL} />

        {/* Audio Delay Control */}
        <div className='w-full flex flex-col'>
          <div className="audio-delay-control mt-4 w-full flex flex-col sm:flex-row justify-between">
            <div className='flex'>
              <label htmlFor="audioDelay" className="mr-1 font-bold">Audio Delay (sec):</label>
              <select
                id="audioDelay"
                value={audioDelay}
                onChange={handleAudioDelayChange}
                disabled={isRecordedAudio}
                className={`border rounded px-2 py-1 ${isRecordedAudio ? 'bg-gray-200 cursor-not-allowed' : 'border-gray-400'}`}
              >
                <option value="-2">-2 sec</option>
                <option value="-1">-1 sec</option>
                <option value="0">0 sec</option>
                <option value="1">1 sec</option>
                <option value="2">2 sec</option>
              </select>
            </div>

            {isRecordedAudio && (
              <p className="text-sm contents text-center text-red-600 font-bold mt-1 sm:mt-0 sm:ml-2">
                Audio delay adjustment is disabled while using recorded audio.
              </p>
            )}
          </div>

          {/* Subtitle Language Control */}
          <div className="subtitle-control mt-4 w-full flex flex-col sm:flex-row justify-between">
            <div className='flex'>
              <label htmlFor="subtitleLanguage" className="mr-1 font-bold">Subtitle Lang:</label>
              <select
                id="subtitleLanguage"
                value={subtitleLanguage}
                onChange={handleSubtitleLanguageChange}
                disabled={isRecordedAudio}
                className={`border rounded px-2 py-1 ${isRecordedAudio ? 'bg-gray-200 cursor-not-allowed' : 'border-gray-400'}`}
              >
                <option value="en">English</option>
                <option value="es">Español</option>
              </select>
            </div>
            {isRecordedAudio && (
              <p className="text-sm contents text-center text-red-600 font-bold mt-1 sm:mt-0 sm:ml-2">
                Subtitle language selection is disabled while using recorded audio.
              </p>
            )}
          </div>
        </div>


      </div>


    </div>
  );
};

export default VideoPlayerWithAudioSyncAndSubtitleSwitch;
