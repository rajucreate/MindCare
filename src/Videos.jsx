import React from 'react';
import { useNavigate } from 'react-router-dom';
import './homepage.css';
import './Videos.css';

function VideosContent() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = React.useState('all');

  const videos = [
    {
      id: 1,
      title: "Breathing Exercises for Anxiety",
      duration: "10 min",
      category: "meditation",
      description: "Learn simple breathing techniques to calm your mind and reduce anxiety",
      thumbnail: "🧘",
      views: "12.5K"
    },
    {
      id: 2,
      title: "Progressive Muscle Relaxation",
      duration: "15 min",
      category: "relaxation",
      description: "A guided session to help you release tension and achieve deep relaxation",
      thumbnail: "💆",
      views: "8.3K"
    },
    {
      id: 3,
      title: "Mindfulness Meditation for Beginners",
      duration: "20 min",
      category: "meditation",
      description: "Start your mindfulness journey with this beginner-friendly guided meditation",
      thumbnail: "🧘‍♀️",
      views: "15.2K"
    },
    {
      id: 4,
      title: "Sleep Meditation: Deep Sleep",
      duration: "30 min",
      category: "sleep",
      description: "Fall asleep faster with this calming bedtime meditation",
      thumbnail: "😴",
      views: "22.1K"
    },
    {
      id: 5,
      title: "Stress Relief Yoga Flow",
      duration: "25 min",
      category: "exercise",
      description: "Gentle yoga movements to release stress and tension from your body",
      thumbnail: "🧘‍♂️",
      views: "9.7K"
    },
    {
      id: 6,
      title: "Body Scan Meditation",
      duration: "18 min",
      category: "meditation",
      description: "A full body awareness practice to ground yourself in the present moment",
      thumbnail: "🧘",
      views: "11.4K"
    },
    {
      id: 7,
      title: "Morning Energy Boost",
      duration: "12 min",
      category: "exercise",
      description: "Start your day with positive energy and intention",
      thumbnail: "☀️",
      views: "7.8K"
    },
    {
      id: 8,
      title: "Anxiety Relief: 5-4-3-2-1 Technique",
      duration: "8 min",
      category: "anxiety",
      description: "Learn the grounding technique to manage anxiety in the moment",
      thumbnail: "🌿",
      views: "18.9K"
    },
    {
      id: 9,
      title: "Loving Kindness Meditation",
      duration: "22 min",
      category: "meditation",
      description: "Cultivate compassion and kindness towards yourself and others",
      thumbnail: "💝",
      views: "13.6K"
    },
    {
      id: 10,
      title: "Quick Stress Relief",
      duration: "5 min",
      category: "stress",
      description: "Fast-acting techniques for immediate stress relief",
      thumbnail: "⚡",
      views: "25.3K"
    },
    {
      id: 11,
      title: "Evening Wind-Down Routine",
      duration: "15 min",
      category: "sleep",
      description: "Unwind after a long day with this peaceful evening practice",
      thumbnail: "🌙",
      views: "14.2K"
    },
    {
      id: 12,
      title: "Confidence Building Affirmations",
      duration: "10 min",
      category: "self-care",
      description: "Boost your self-esteem with positive affirmations and visualization",
      thumbnail: "✨",
      views: "16.8K"
    }
  ];

  const categories = [
    { id: 'all', name: 'All Videos', icon: '📹' },
    { id: 'meditation', name: 'Meditation', icon: '🧘' },
    { id: 'relaxation', name: 'Relaxation', icon: '💆' },
    { id: 'sleep', name: 'Sleep', icon: '😴' },
    { id: 'anxiety', name: 'Anxiety', icon: '🌿' },
    { id: 'stress', name: 'Stress Relief', icon: '⚡' },
    { id: 'exercise', name: 'Exercise', icon: '🏃' },
    { id: 'self-care', name: 'Self-Care', icon: '✨' }
  ];

  const filteredVideos = selectedCategory === 'all' 
    ? videos 
    : videos.filter(video => video.category === selectedCategory);

  return (
    <div className="videos-page">
      <header className="videos-header">
        <div>
          <button className="back-button" onClick={() => navigate('/homepage')}>
            <i className="fas fa-arrow-left"></i> Back to Home
          </button>
          <div className="brand">
            <span>♥</span> MindCare Videos
          </div>
        </div>
      </header>

      <div className="videos-container">
        <div className="videos-sidebar">
          <h3><i className="fas fa-filter"></i> Categories</h3>
          <div className="category-list">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <span className="category-icon">{category.icon}</span>
                <span>{category.name}</span>
                {selectedCategory === category.id && (
                  <i className="fas fa-check"></i>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="videos-main">
          <div className="videos-header-section">
            <h1>
              <i className="fas fa-video"></i> All Videos
            </h1>
            <p className="videos-count">{filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''} available</p>
          </div>

          <div className="videos-grid">
            {filteredVideos.map(video => (
              <div key={video.id} className="video-card">
                <div className="video-thumbnail">
                  <div className="thumbnail-emoji">{video.thumbnail}</div>
                  <div className="video-duration">{video.duration}</div>
                  <div className="play-overlay">
                    <i className="fas fa-play"></i>
                  </div>
                </div>
                <div className="video-info">
                  <h3>{video.title}</h3>
                  <p className="video-description">{video.description}</p>
                  <div className="video-meta">
                    <span className="video-views">
                      <i className="fas fa-eye"></i> {video.views} views
                    </span>
                    <span className="video-category-badge">{video.category}</span>
                  </div>
                  <button className="watch-button">
                    <i className="fas fa-play-circle"></i> Watch Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideosContent;

