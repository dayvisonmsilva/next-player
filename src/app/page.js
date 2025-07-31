"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Playlist from '../components/Playlist';
import { videoData } from '../data/videos';

// Carrega o player dinamicamente para evitar erros de hidratação
const VideoPlayer = dynamic(() => import('../components/VideoPlayer'), {
  ssr: false,
  loading: () => <div className="player-loading">Carregando Player...</div>
});

export default function Home() {
  const [currentVideo, setCurrentVideo] = useState(videoData[0]);

  const handleSelectVideo = (video) => {
    setCurrentVideo(video);
  };

  // NOVO: Função para tocar o próximo vídeo da lista
  const handleVideoEnd = () => {
    // Encontra o índice do vídeo atual na lista
    const currentIndex = videoData.findIndex(video => video.id === currentVideo.id);
    const nextIndex = (currentIndex + 1) % videoData.length;
    
    // Seleciona o próximo vídeo
    const nextVideo = videoData[nextIndex];
    setCurrentVideo(nextVideo);
  };

  return (
    <main className="app-container">
      <VideoPlayer 
        video={currentVideo} 
        onVideoEnd={handleVideoEnd}
      />
      <Playlist 
        videos={videoData} 
        onSelectVideo={handleSelectVideo}
        currentVideoId={currentVideo.id}
      />
    </main>
  );
}