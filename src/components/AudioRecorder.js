import React, { useState, useRef, useEffect } from 'react';

const AudioRecorder = ({ onRecordingComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const audioContextRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const analyserRef = useRef(null);
  const dataArrayRef = useRef(null);
  const canvasRef = useRef(null);
  const chunksRef = useRef([]);
  const mediaRecorderRef = useRef(null);
  const animationFrameRef = useRef(null);
  const playbackSourceRef = useRef(null);
  const streamSourceRef = useRef(null);

  useEffect(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
    }
  }, []);

  const resetVisualization = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (playbackSourceRef.current) {
      playbackSourceRef.current.disconnect();
      playbackSourceRef.current.stop();
      playbackSourceRef.current = null;
    }
    if (streamSourceRef.current) {
      streamSourceRef.current.disconnect();
    }
    const canvas = canvasRef.current;
    const canvasContext = canvas.getContext('2d');
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  };

  const resetAudioContext = () => {
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
    }
  };

  const handleStartRecording = async () => {
    try {
      resetVisualization();
      resetAudioContext();

      if (playbackSourceRef.current) {
        playbackSourceRef.current.stop();
        playbackSourceRef.current.disconnect();
        playbackSourceRef.current = null;
      }

      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
        mediaStreamRef.current = null;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        chunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
        chunksRef.current = [];
        const audioURL = URL.createObjectURL(blob);

        if (onRecordingComplete) {
          onRecordingComplete(audioURL);
        }
        setHasRecording(true);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      visualizeRecording(stream);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setIsRecording(false);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    }
  };

  const visualizeRecording = (stream) => {
    streamSourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
    streamSourceRef.current.connect(analyserRef.current);

    analyserRef.current.fftSize = 2048;
    const bufferLength = analyserRef.current.frequencyBinCount;
    dataArrayRef.current = new Uint8Array(bufferLength);

    drawWaveform();
  };

  const drawWaveform = () => {
    const canvas = canvasRef.current;
    const canvasContext = canvas.getContext('2d');
    const bufferLength = analyserRef.current.frequencyBinCount;

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw);
      analyserRef.current.getByteTimeDomainData(dataArrayRef.current);

      canvasContext.fillStyle = '#f3f3f3';
      canvasContext.fillRect(0, 0, canvas.width, canvas.height);
      canvasContext.lineWidth = 2;
      canvasContext.strokeStyle = '#4a90e2';

      canvasContext.beginPath();
      const sliceWidth = (canvas.width * 1.0) / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArrayRef.current[i] / 128.0;
        const y = (v * canvas.height) / 2;

        if (i === 0) {
          canvasContext.moveTo(x, y);
        } else {
          canvasContext.lineTo(x, y);
        }

        x += sliceWidth;
      }
      canvasContext.lineTo(canvas.width, canvas.height / 2);
      canvasContext.stroke();
    };

    draw();
  };

  const handleDeleteRecording = () => {
    setHasRecording(false);
    resetVisualization();

    if (onRecordingComplete) {
      onRecordingComplete(null);
    }
  };

  return (
    <div className="sm:w-3/4 w-full sm:mx-auto sm:p-8 p-4flex flex-col items-center justify-center bg-gray-100 rounded-lg shadow-lg space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-center mb-4 space-y-4 sm:space-y-0 sm:space-x-4">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded w-full sm:w-auto"
          onClick={handleStartRecording}
          disabled={hasRecording}
        >
          Start Recording
        </button>

        {isRecording && (
          <button
            className="bg-red-500 text-white px-4 py-2 rounded w-full sm:w-auto"
            onClick={handleStopRecording}
          >
            Stop Recording
          </button>
        )}

        {hasRecording && (
          <button
            className="bg-red-500 text-white px-4 py-2 rounded w-full sm:w-auto"
            onClick={handleDeleteRecording}
            disabled={isRecording}
          >
            Delete Recording
          </button>
        )}
      </div>

      {hasRecording && (
        <div className="text-center mb-4">
          <p className="text-sm text-red-600 font-bold">
            Please delete the recorded audio before recording new audio.
          </p>
        </div>
      )}

      <canvas ref={canvasRef} className="w-full max-w-lg h-32 bg-gray-200 rounded shadow-md mx-auto"></canvas>
    </div>
  );
};

export default AudioRecorder;
