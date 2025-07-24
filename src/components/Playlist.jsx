"use client";

export default function Playlist({ videos, onSelectVideo, currentVideoId }) {
  return (
    <div className="playlist-container">
      <h2 className="playlist-title">Próximos na Fila</h2>
      <ul className="playlist-list">
        {videos.map((video) => (
          <li
            key={video.id}
            className={`playlist-item ${
              currentVideoId === video.id ? "active" : ""
            }`}
            onClick={() => onSelectVideo(video)}
          >
            <img
              src={video.thumbnail}
              alt={video.title}
              className="playlist-item-thumb"
            />
            <div className="playlist-item-details">
              <span className="playlist-item-title">{video.title}</span>
              <span className="playlist-item-artist">{video.artist}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
