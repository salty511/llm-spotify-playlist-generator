import React from 'react'

const AboutPage: React.FC = () => {
  return (
    <div className="container mt-5" style={{textAlign: "left"}}>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">About Statify</h2>
              <p className="card-text">
                Statify is a modern web application that provides detailed analytics and insights 
                about your Spotify listening habits. Built with React 18 and modern web technologies, 
                it offers a comprehensive view of your music preferences.
              </p>
              
              <h4>Features</h4>
              <ul>
                <li>View your top tracks across different time periods</li>
                <li>Analyze your favorite artists and genres</li>
                <li>Interactive charts and visualizations</li>
                <li>Real-time data from Spotify Web API</li>
                <li>Responsive design for all devices</li>
              </ul>
              
              <h4>Technology Stack</h4>
              <ul>
                <li>React 18 with Hooks</li>
                <li>Vite build tool</li>
                <li>Zustand state management</li>
                <li>Chart.js for visualizations</li>
                <li>Bootstrap 5 for styling</li>
              </ul>
              
              <h4>Privacy</h4>
              <p>
                Statify only accesses the data you explicitly authorize through Spotify. 
                We don't store any personal information or listening data on our servers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage