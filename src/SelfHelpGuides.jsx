import React from 'react';
import { useNavigate } from 'react-router-dom';
import './homepage.css';
import './Videos.css';

function SelfHelpGuidesContent() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = React.useState('all');

  const guides = [
    {
      id: 1,
      title: "Stress Management Toolkit",
      pages: "12 pages",
      category: "stress",
      description: "A comprehensive guide with practical exercises and techniques to manage daily stress effectively",
      thumbnail: "📋",
      views: "24.5K",
      download: true
    },
    {
      id: 2,
      title: "Sleep Better Guide",
      pages: "8 pages",
      category: "sleep",
      description: "Step-by-step strategies to improve your sleep hygiene and get better rest",
      thumbnail: "🌙",
      views: "19.8K",
      download: true
    },
    {
      id: 3,
      title: "Anxiety Workbook",
      pages: "15 pages",
      category: "anxiety",
      description: "Interactive exercises and worksheets to help you understand and manage anxiety",
      thumbnail: "📖",
      views: "28.3K",
      download: true
    },
    {
      id: 4,
      title: "Building Self-Esteem Guide",
      pages: "10 pages",
      category: "self-esteem",
      description: "Practical activities to boost your confidence and develop a positive self-image",
      thumbnail: "💪",
      views: "16.2K",
      download: true
    },
    {
      id: 5,
      title: "Mindfulness Practice Manual",
      pages: "14 pages",
      category: "mindfulness",
      description: "Complete guide to starting and maintaining a mindfulness practice",
      thumbnail: "🧘",
      views: "21.7K",
      download: true
    },
    {
      id: 6,
      title: "Time Management for Students",
      pages: "9 pages",
      category: "productivity",
      description: "Effective strategies to balance academics, work, and personal life",
      thumbnail: "⏰",
      views: "18.4K",
      download: true
    },
    {
      id: 7,
      title: "Coping with Exam Stress",
      pages: "7 pages",
      category: "academic",
      description: "Proven techniques to manage test anxiety and perform your best",
      thumbnail: "📝",
      views: "22.1K",
      download: true
    },
    {
      id: 8,
      title: "Social Skills Development",
      pages: "11 pages",
      category: "social",
      description: "Build confidence in social situations and improve your interpersonal skills",
      thumbnail: "👥",
      views: "15.9K",
      download: true
    },
    {
      id: 9,
      title: "Emotional Regulation Handbook",
      pages: "13 pages",
      category: "emotions",
      description: "Learn to identify, understand, and manage your emotions effectively",
      thumbnail: "💭",
      views: "20.6K",
      download: true
    },
    {
      id: 10,
      title: "Goal Setting and Achievement",
      pages: "8 pages",
      category: "productivity",
      description: "A structured approach to setting and achieving meaningful goals",
      thumbnail: "🎯",
      views: "17.3K",
      download: true
    },
    {
      id: 11,
      title: "Digital Wellness Guide",
      pages: "10 pages",
      category: "technology",
      description: "Maintain healthy relationships with technology and social media",
      thumbnail: "📱",
      views: "19.5K",
      download: true
    },
    {
      id: 12,
      title: "Grief and Loss Support Guide",
      pages: "9 pages",
      category: "grief",
      description: "Understanding grief and finding healthy ways to process loss",
      thumbnail: "🕯️",
      views: "14.8K",
      download: true
    }
  ];

  const categories = [
    { id: 'all', name: 'All Guides', icon: '📚' },
    { id: 'stress', name: 'Stress', icon: '⚡' },
    { id: 'anxiety', name: 'Anxiety', icon: '😰' },
    { id: 'sleep', name: 'Sleep', icon: '😴' },
    { id: 'mindfulness', name: 'Mindfulness', icon: '🧘' },
    { id: 'self-esteem', name: 'Self-Esteem', icon: '💪' },
    { id: 'productivity', name: 'Productivity', icon: '⏰' },
    { id: 'academic', name: 'Academic', icon: '📝' },
    { id: 'social', name: 'Social Skills', icon: '👥' },
    { id: 'emotions', name: 'Emotions', icon: '💭' },
    { id: 'technology', name: 'Technology', icon: '📱' },
    { id: 'grief', name: 'Grief', icon: '🕯️' }
  ];

  const filteredGuides = selectedCategory === 'all' 
    ? guides 
    : guides.filter(guide => guide.category === selectedCategory);

  return (
    <div className="videos-page">
      <header className="videos-header">
        <div>
          <button className="back-button" onClick={() => navigate('/homepage')}>
            <i className="fas fa-arrow-left"></i> Back to Home
          </button>
          <div className="brand">
            <span>♥</span> MindCare Self-Help Guides
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
              <i className="fas fa-book-open"></i> Self-Help Guides
            </h1>
            <p className="videos-count">{filteredGuides.length} guide{filteredGuides.length !== 1 ? 's' : ''} available</p>
          </div>

          <div className="videos-grid">
            {filteredGuides.map(guide => (
              <div key={guide.id} className="video-card">
                <div className="video-thumbnail">
                  <div className="thumbnail-emoji">{guide.thumbnail}</div>
                  <div className="video-duration">{guide.pages}</div>
                  {guide.download && (
                    <div className="download-badge">
                      <i className="fas fa-download"></i>
                    </div>
                  )}
                  <div className="play-overlay">
                    <i className="fas fa-file-pdf"></i>
                  </div>
                </div>
                <div className="video-info">
                  <h3>{guide.title}</h3>
                  <p className="video-description">{guide.description}</p>
                  <div className="video-meta">
                    <span className="video-views">
                      <i className="fas fa-eye"></i> {guide.views} views
                    </span>
                    <span className="video-category-badge">{guide.category}</span>
                  </div>
                  <button className="watch-button">
                    <i className="fas fa-download"></i> Download Guide
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

export default SelfHelpGuidesContent;

