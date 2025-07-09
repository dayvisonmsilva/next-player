// src/components/Player.jsx

"use client"; // Marca este como um Componente de Cliente

import { useState } from 'react';
import Image from 'next/image';

// Importando o FontAwesome diretamente no componente que o utiliza
import '@fortawesome/fontawesome-free/css/all.min.css';

export default function Player() {
    // Gerencia o estado de "curtido"
    const [isLiked, setIsLiked] = useState(false);

    const handleLike = () => {
        setIsLiked(!isLiked); // Alterna o estado entre true e false
    };

    return (
        <div className="player-container">
            <div className="album-art-container">
                {/* Usando o componente Image do Next.js para otimização */}
                <Image 
                    src="/images/Doo-Wops_&_Hooligans.jpg" 
                    alt="Capa do álbum Doo-Wops & Hooligans" 
                    className="album-art"
                    width={350} // Largura original da imagem
                    height={350} // Altura original da imagem
                    priority // Carrega a imagem com prioridade
                />
            </div>

            <div className="song-info">
                <div className="song-details">
                    <h2 className="song-title">Bruno Mars - Runaway Baby</h2>
                    <p className="artist">Spotify</p>
                </div>
                {/* O className do ícone agora é dinâmico com base no estado 'isLiked'.
                  O onClick chama nossa função 'handleLike'.
                */}
                <i 
                    id="like-btn" 
                    className={`control-icon heart-icon ${isLiked ? 'fa-solid fa-heart liked' : 'fa-regular fa-heart'}`}
                    onClick={handleLike}
                ></i>
            </div>

            <div className="progress-container">
                <span className="time-current">0:00</span>
                <div className="progress-bar">
                    <div className="progress"></div>
                </div>
                <span className="time-total">2:29</span>
            </div>

            <div className="controls">
                <i className="fas fa-backward-step control-icon"></i>
                <div className="play-pause-btn">
                    <i className="fas fa-play play-icon"></i>
                </div>
                <i className="fas fa-forward-step control-icon"></i>
                <i className="fas fa-volume-high control-icon"></i>
            </div>
        </div>
    );
}