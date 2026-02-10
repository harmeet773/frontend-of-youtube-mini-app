import React from 'react';

const About = () => {
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-body">
              <h1 className="card-title text-center mb-4">About Harmeet's YouTube</h1>
              <p className="card-text">
              Welcome to <strong>Harmeet's YouTube</strong>, a mini-application designed to provide a streamlined YouTube-like experience.
              </p>
              <h3>Key Features:</h3>
              <ul>
                <li>Browse and watch YouTube videos.</li>
                <li>Google Authentication for enabling users to post comments through my app.</li>
                <li>Responsive design for various devices.</li>
                <li>Built with React, Redux, and Bootstrap.</li>
              </ul>
              <h3 className="mt-4">Our Mission:</h3>
              <p className="card-text">
              My goal is to create a lightweight and efficient platform for users to enjoy videos posted on my YouTube channel.
              </p>
              <div className="text-center mt-5">
                <p className="text-muted">Developed with ❤️ by Harmeet</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
