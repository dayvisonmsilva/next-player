"use client";

import { useState } from 'react';
// import VideoPlayer from '../components/VideoPlayer';
import Playlist from '../components/Playlist';
import { videoData } from '../data/videos';
import dynamic from 'next/dynamic';

const VideoPlayer = dynamic(() => import('../components/VideoPlayer'), {
  ssr: false, 
  loading: () => <div className="player-loading">Carregando Player...</div> 
});

export default function Home() {
  const [currentVideo, setCurrentVideo] = useState(videoData[0]);

  const handleSelectVideo = (video) => {
    setCurrentVideo(video);
  };

  return (
    <main className="app-container">
      <VideoPlayer video={currentVideo} />
      <Playlist 
        videos={videoData} 
        onSelectVideo={handleSelectVideo}
        currentVideoId={currentVideo.id}
      />
    </main>
  );
}