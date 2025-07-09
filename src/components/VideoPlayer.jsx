"use client";
import { useState, useRef, useEffect } from 'react';

import '@fortawesome/fontawesome-free/css/all.min.css';

export default function VideoPlayer() {
    const [isLiked, setIsLiked] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [volume, setVolume] = useState(1); // 1 = 100% de volume
    const [lastVolume, setLastVolume] = useState(1); // Guarda o último volume antes de mutar

    const videoRef = useRef(null);

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
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleLoadedMetadata = () => {
        setDuration(videoRef.current.duration);
    };

    const handleTimeUpdate = () => {
        setCurrentTime(videoRef.current.currentTime);
    };

    const handleEnded = () => {
        setIsPlaying(false);
    };
    
    const handleLike = () => {
        setIsLiked(!isLiked);
    };

    const getVolumeIcon = () => {
        if (volume === 0) return 'fa-volume-xmark';
        if (volume < 0.5) return 'fa-volume-low';
        return 'fa-volume-high';
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
                    className={`control-icon heart-icon ${isLiked ? 'fa-solid fa-heart liked' : 'fa-regular fa-heart'}`}
                    onClick={handleLike}
                ></i>
            </div>

            <div className="progress-container">
                <span className="time-current">{formatTime(currentTime)}</span>
                <div className="progress-bar">
                    <div 
                        className="progress" 
                        style={{ width: `${(currentTime / duration) * 100 || 0}%` }}
                    ></div>
                </div>
                <span className="time-total">{formatTime(duration)}</span>
            </div>

            <div className="controls">
                <i className="fas fa-backward-step control-icon"></i>
                <div className="play-pause-btn" onClick={togglePlayPause}>
                    <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} play-icon`}></i>
                </div>
                <i className="fas fa-forward-step control-icon"></i>

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