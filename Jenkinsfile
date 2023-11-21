pipeline {
  agent any
  stages {
    stage('Docker Build') {
      steps {
        sh 'docker compose -f "docker-compose.yaml" up -d --build '
      }
    }

  }
}