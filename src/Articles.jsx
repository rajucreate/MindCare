import React from 'react';
import { useNavigate } from 'react-router-dom';
import './homepage.css';
import './Videos.css';

function ArticlesContent() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = React.useState('all');

  const articles = [
    {
      id: 1,
      title: "Understanding Anxiety: A Comprehensive Guide",
      readTime: "8 min read",
      category: "anxiety",
      description: "Learn about the different types of anxiety, their causes, and evidence-based strategies for management",
      thumbnail: "📖",
      views: "18.5K"
    },
    {
      id: 2,
      title: "Building Resilience in Difficult Times",
      readTime: "10 min read",
      category: "resilience",
      description: "Discover how to develop mental resilience and bounce back from life's challenges",
      thumbnail: "💪",
      views: "15.2K"
    },
    {
      id: 3,
      title: "The Science of Sleep: Improving Your Rest",
      readTime: "12 min read",
      category: "sleep",
      description: "Evidence-based tips and techniques to improve your sleep quality and duration",
      thumbnail: "😴",
      views: "22.8K"
    },
    {
      id: 4,
      title: "Mindfulness: A Beginner's Guide",
      readTime: "6 min read",
      category: "mindfulness",
      description: "Introduction to mindfulness practices and how they can improve your mental well-being",
      thumbnail: "🧘",
      views: "19.3K"
    },
    {
      id: 5,
      title: "Managing Stress in College",
      readTime: "9 min read",
      category: "stress",
      description: "Practical strategies for managing academic and personal stress during your college years",
      thumbnail: "📚",
      views: "16.7K"
    },
    {
      id: 6,
      title: "Depression: Signs, Symptoms, and Support",
      readTime: "11 min read",
      category: "depression",
      description: "Understanding depression, recognizing the signs, and knowing when to seek help",
      thumbnail: "💙",
      views: "21.4K"
    },
    {
      id: 7,
      title: "Self-Care Strategies for Mental Health",
      readTime: "7 min read",
      category: "self-care",
      description: "Essential self-care practices to maintain and improve your mental health",
      thumbnail: "✨",
      views: "17.9K"
    },
    {
      id: 8,
      title: "Coping with Grief and Loss",
      readTime: "9 min read",
      category: "grief",
      description: "Understanding the grieving process and healthy ways to cope with loss",
      thumbnail: "🕯️",
      views: "14.6K"
    },
    {
      id: 9,
      title: "Social Media and Mental Health",
      readTime: "8 min read",
      category: "technology",
      description: "How social media affects mental health and strategies for healthy digital habits",
      thumbnail: "📱",
      views: "20.1K"
    },
    {
      id: 10,
      title: "Building Healthy Relationships",
      readTime: "10 min read",
      category: "relationships",
      description: "Tips for developing and maintaining healthy, supportive relationships",
      thumbnail: "💝",
      views: "13.8K"
    },
    {
      id: 11,
      title: "Time Management for Better Mental Health",
      readTime: "6 min read",
      category: "productivity",
      description: "How effective time management can reduce stress and improve well-being",
      thumbnail: "⏰",
      views: "15.5K"
    },
    {
      id: 12,
      title: "Nutrition and Mental Health Connection",
      readTime: "9 min read",
      category: "nutrition",
      description: "Exploring the link between what you eat and how you feel mentally",
      thumbnail: "🥗",
      views: "12.3K"
    }
  ];

  const categories = [
    { id: 'all', name: 'All Articles', icon: '📚' },
    { id: 'anxiety', name: 'Anxiety', icon: '😰' },
    { id: 'depression', name: 'Depression', icon: '💙' },
    { id: 'stress', name: 'Stress', icon: '⚡' },
    { id: 'sleep', name: 'Sleep', icon: '😴' },
    { id: 'mindfulness', name: 'Mindfulness', icon: '🧘' },
    { id: 'self-care', name: 'Self-Care', icon: '✨' },
    { id: 'resilience', name: 'Resilience', icon: '💪' },
    { id: 'relationships', name: 'Relationships', icon: '💝' },
    { id: 'grief', name: 'Grief', icon: '🕯️' },
    { id: 'productivity', name: 'Productivity', icon: '⏰' },
    { id: 'nutrition', name: 'Nutrition', icon: '🥗' },
    { id: 'technology', name: 'Technology', icon: '📱' }
  ];

  const filteredArticles = selectedCategory === 'all' 
    ? articles 
    : articles.filter(article => article.category === selectedCategory);

  return (
    <div className="videos-page">
      <header className="videos-header">
        <div>
          <button className="back-button" onClick={() => navigate('/homepage')}>
            <i className="fas fa-arrow-left"></i> Back to Home
          </button>
          <div className="brand">
            <span>♥</span> MindCare Articles
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
              <i className="fas fa-book"></i> All Articles
            </h1>
            <p className="videos-count">{filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} available</p>
          </div>

          <div className="videos-grid">
            {filteredArticles.map(article => (
              <div key={article.id} className="video-card">
                <div className="video-thumbnail">
                  <div className="thumbnail-emoji">{article.thumbnail}</div>
                  <div className="video-duration">{article.readTime}</div>
                  <div className="play-overlay">
                    <i className="fas fa-book-open"></i>
                  </div>
                </div>
                <div className="video-info">
                  <h3>{article.title}</h3>
                  <p className="video-description">{article.description}</p>
                  <div className="video-meta">
                    <span className="video-views">
                      <i className="fas fa-eye"></i> {article.views} views
                    </span>
                    <span className="video-category-badge">{article.category}</span>
                  </div>
                  <button className="watch-button">
                    <i className="fas fa-book-reader"></i> Read Article
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

export default ArticlesContent;

