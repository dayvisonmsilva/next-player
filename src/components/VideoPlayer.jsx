"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function VideoPlayer({ video, onVideoEnd }) {
  // --- Estados ---
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [lastVolume, setLastVolume] = useState(1);
  const [isSeeking, setIsSeeking] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // --- Refs ---
  const videoRef = useRef(null);
  const progressRef = useRef(null);

  // --- Efeitos ---

  // Efeito que reage APENAS à mudança do vídeo selecionado.
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.log("Autoplay foi prevenido pelo navegador:", error);
            setIsPlaying(false);
          });
      }

      setCurrentTime(0);
    }
  }, [video]);

  // Efeito que reage APENAS à mudança de volume.
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
    }
    if (volume > 0) {
      setLastVolume(volume);
    }
  }, [volume]);

  // Gerencia o arraste da barra de progresso
  const seekToTime = useCallback(
    (clientX) => {
      if (!duration || !progressRef.current || !videoRef.current) return;
      const progressBar = progressRef.current;
      const rect = progressBar.getBoundingClientRect();
      const seekRatio = Math.max(
        0,
        Math.min(1, (clientX - rect.left) / rect.width)
      );
      const newTime = seekRatio * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    },
    [duration]
  );

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isSeeking) seekToTime(e.clientX);
    };
    const handleMouseUp = () => {
      if (isSeeking) setIsSeeking(false);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isSeeking, seekToTime]);

  // --- Funções de Controle (Memoizadas com useCallback) ---

  const handleProgressMouseDown = useCallback(
    (e) => {
      if (!duration) return;
      setIsSeeking(true);
      seekToTime(e.clientX);
    },
    [duration, seekToTime]
  );

  const togglePlayPause = useCallback(() => {
    if (videoRef.current) {
      const video = videoRef.current;
      if (isPlaying) video.pause();
      else video.play();
      setIsPlaying((prev) => !prev);
    }
  }, [isPlaying]);

  const handleForward = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(
        duration,
        videoRef.current.currentTime + 10
      );
    }
  }, [duration]);

  const handleRewind = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(
        0,
        videoRef.current.currentTime - 10
      );
    }
  }, []);

  const handleLike = useCallback(() => setIsLiked((prev) => !prev), []);
  const handleVolumeChange = useCallback(
    (e) => setVolume(parseFloat(e.target.value)),
    []
  );
  const toggleMute = useCallback(
    () => setVolume(volume > 0 ? 0 : lastVolume || 1),
    [volume, lastVolume]
  );

  // --- Handlers de Eventos do Vídeo ---

  const handleTimeUpdate = useCallback(() => {
    if (videoRef.current) {
      const { currentTime: currentVideoTime, duration: currentVideoDuration } =
        videoRef.current;
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
  }, [duration, isSeeking]);

  const handleLoadedMetadata = useCallback(() => {
    if (videoRef.current) setDuration(videoRef.current.duration);
    videoRef.current.volume = volume;
  }, [volume]);

  const handleEnded = useCallback(() => {
    if (onVideoEnd) {
      onVideoEnd();
    } else {
      setIsPlaying(false);
    }
  }, [onVideoEnd]);

  // --- Funções Utilitárias ---

  const getVolumeIcon = () => {
    if (volume === 0) return "fa-volume-xmark";
    if (volume < 0.5) return "fa-volume-low";
    return "fa-volume-high";
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // --- Renderização ---
  return (
    <div className="player-container">
      <div className="album-art-container">
        <video
          className="video-screen"
          ref={videoRef}
          key={video.src}
          onClick={togglePlayPause}
          onLoadedMetadata={handleLoadedMetadata}
          onDurationChange={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
        >
          <source src={video.src} type="video/mp4" />
          Seu navegador não suporta a tag de vídeo.
        </video>
      </div>
      <div className="song-info">
        <div className="song-details">
          <h2 className="song-title">{video.title}</h2>
          <p className="artist">{video.artist}</p>
        </div>
        <i
          className={`control-icon heart-icon ${
            isLiked ? "fa-solid fa-heart liked" : "fa-regular fa-heart"
          }`}
          onClick={handleLike}
        />
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
          />
        </div>
        <span className="time-total">{formatTime(duration)}</span>
      </div>
      <div className="controls">
        <i className="fas fa-rotate-left control-icon" onClick={handleRewind} />
        <div className="play-pause-btn" onClick={togglePlayPause}>
          <i
            className={`fas ${isPlaying ? "fa-pause" : "fa-play"} play-icon`}
          />
        </div>
        <i
          className="fas fa-rotate-right control-icon"
          onClick={handleForward}
        />
        <div className="volume-controls">
          <i
            className={`fas ${getVolumeIcon()} control-icon`}
            onClick={toggleMute}
          />
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
