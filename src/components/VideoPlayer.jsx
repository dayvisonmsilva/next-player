"use client";
import { useState, useRef, useEffect } from "react";

import "@fortawesome/fontawesome-free/css/all.min.css";

export default function VideoPlayer() {
  const [isLiked, setIsLiked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [lastVolume, setLastVolume] = useState(1);
  const [isSeeking, setIsSeeking] = useState(false);
  const videoRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isSeeking && videoRef.current && progressRef.current) {
        const progressBar = progressRef.current;
        const rect = progressBar.getBoundingClientRect();
        const clickPositionX = e.clientX - rect.left;
        const progressBarWidth = rect.width;

        // Garante que o valor não seja menor que 0 ou maior que a largura da barra
        const newTimeRatio = Math.max(
          0,
          Math.min(1, clickPositionX / progressBarWidth)
        );
        const newTime = newTimeRatio * duration;

        videoRef.current.currentTime = newTime;
        setCurrentTime(newTime);
      }
    };

    const handleMouseUp = () => {
      if (isSeeking) {
        setIsSeeking(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isSeeking, duration]);

  const handleProgressMouseDown = (e) => {
    setIsSeeking(true);
    // Permite o clique simples também
    const progressBar = progressRef.current;
    const rect = progressBar.getBoundingClientRect();
    const clickPositionX = e.clientX - rect.left;
    const progressBarWidth = rect.width;
    const newTime = (clickPositionX / progressBarWidth) * duration;

    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume > 0) {
      setLastVolume(newVolume);
    }
  };

  const toggleMute = () => {
    if (volume > 0) {
      setLastVolume(volume);
      setVolume(0);
    } else {
      setVolume(lastVolume || 1);
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentVideoTime = videoRef.current.currentTime;
      const currentVideoDuration = videoRef.current.duration;
      if (
        isFinite(currentVideoDuration) &&
        currentVideoDuration > 0 &&
        duration !== currentVideoDuration
      ) {
        setDuration(currentVideoDuration);
      }

      if (!isSeeking) {
        setCurrentTime(currentVideoTime);
      }
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const getVolumeIcon = () => {
    if (volume === 0) return "fa-volume-xmark";
    if (volume < 0.5) return "fa-volume-low";
    return "fa-volume-high";
  };

  const handleForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(
        videoRef.current.duration,
        videoRef.current.currentTime + 10
      );
    }
  };

  const handleRewind = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(
        0,
        videoRef.current.currentTime - 10
      );
    }
  };

  return (
    <div className="player-container">
      <div className="album-art-container">
        <video
          className="video-screen"
          ref={videoRef}
          src="/videos/Runaway Baby - Bruno Mars (Lyrics).mp4"
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          onClick={togglePlayPause}
        />
      </div>

      <div className="song-info">
        <div className="song-details">
          <h2 className="song-title">Runaway Baby - Bruno Mars (Lyrics)</h2>
          <p className="artist">Bruno Mars</p>
        </div>
        <i
          id="like-btn"
          className={`control-icon heart-icon ${
            isLiked ? "fa-solid fa-heart liked" : "fa-regular fa-heart"
          }`}
          onClick={handleLike}
        ></i>
      </div>

      <div className="progress-container">
        <span className="time-current">{formatTime(currentTime)}</span>
        <div
          className="progress-bar"
          ref={progressRef}
          onMouseDown={handleProgressMouseDown}
        >
          <div
            className="progress"
            style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
          ></div>
        </div>
        <span className="time-total">{formatTime(duration)}</span>
      </div>

      <div className="controls">
        <i
          className="fas fa-rotate-left control-icon"
          onClick={handleRewind}
        ></i>

        <div className="play-pause-btn" onClick={togglePlayPause}>
          <i
            className={`fas ${isPlaying ? "fa-pause" : "fa-play"} play-icon`}
          ></i>
        </div>
        <i
          className="fas fa-rotate-right control-icon"
          onClick={handleForward}
        ></i>

        <div className="volume-controls">
          <i
            className={`fas ${getVolumeIcon()} control-icon`}
            onClick={toggleMute}
          ></i>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            className="volume-slider"
            onChange={handleVolumeChange}
          />
        </div>
      </div>
    </div>
  );
}
