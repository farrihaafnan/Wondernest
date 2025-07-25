# WonderNest - Interactive AI-Powered Educational Platform

WonderNest is an interactive, AI-powered educational platform designed for children, providing playful learning experiences through various activities like storytelling, puzzles, sentence correction, word matching, and flashcards.

## Features

- Parent and Child Profile Management
- AI-Powered Story Generation
- Word Flashcards
- Picture Puzzles
- Sentence Correction and Learning
- Word Matching
- Behavior Monitoring
- Screen Time Tracking
- Progress Analysis & Recommendations

## Tech Stack

- Frontend: React
- Backend: Spring Boot (Microservices)
- Database: PostgreSQL
- Containerization: Docker
- CI/CD: GitHub Actions

## Project Structure 

```
CSE408/
├── backend/                      # Spring Boot backend project
│   ├── user-learning-service/   # User & Learning microservice
│   └── evaluation-analytics-service/  # Evaluation & Analytics microservice
├── frontend/                    # React frontend app
├── docker-compose.yml           # Docker compose configuration
└── .github/                    # GitHub Actions workflows
```

## Getting Started

### Prerequisites

- Docker and Docker Compose
- JDK 17 or later
- Node.js 16 or later
- PostgreSQL 14 or later

### Running the Application

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/wondernest.git
   cd wondernest
   ```

2. Start the application using Docker Compose:
   ```bash
   docker-compose up -d
   ```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend Services: 
     - User & Learning Service: http://localhost:8081
     - Evaluation & Analytics Service: http://localhost:8082

## Development

### Backend Development

The backend consists of two microservices:
- User & Learning Service: Handles user profiles and learning activities
- Evaluation & Analytics Service: Manages evaluations and analytics

### Frontend Development

The frontend is built with React and provides a user-friendly interface for both children and parents.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
