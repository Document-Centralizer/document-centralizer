pipeline {
    agent any

    environment {
        // Change this to your actual Docker Hub username
        DOCKER_HUB_USER = 'yourdockerhubuser'
        
        // Define Image Names
        FRONTEND_IMAGE = "${DOCKER_HUB_USER}/document-centralizer-frontend"
        BACKEND_IMAGE = "${DOCKER_HUB_USER}/document-centralizer-backend"
        OCR_IMAGE = "${DOCKER_HUB_USER}/document-centralizer-ocr"
        CHATBOT_IMAGE = "${DOCKER_HUB_USER}/document-centralizer-chatbot"
        NOTIFY_IMAGE = "${DOCKER_HUB_USER}/document-centralizer-notify"
        
        // Docker credentials ID configured in Jenkins
        DOCKER_CREDS_ID = 'docker-hub-credentials'
    }

    stages {
        stage('Build Frontend Image') {
            steps {
                script {
                    dir('frontend') {
                        dockerImage = docker.build("${FRONTEND_IMAGE}:latest")
                    }
                }
            }
        }
        
        stage('Build Backend Image') {
            steps {
                script {
                    dir('backend/document-core-service') {
                        dockerImage = docker.build("${BACKEND_IMAGE}:latest")
                    }
                }
            }
        }
        
        stage('Build OCR Image') {
            steps {
                script {
                    dir('python-ocr-service') {
                        dockerImage = docker.build("${OCR_IMAGE}:latest")
                    }
                }
            }
        }
        
        stage('Build Chatbot Image') {
            steps {
                script {
                    dir('ai-chatbot-service') {
                        dockerImage = docker.build("${CHATBOT_IMAGE}:latest")
                    }
                }
            }
        }
        
        stage('Build Notification Image') {
            steps {
                script {
                    dir('notification-service') {
                        dockerImage = docker.build("${NOTIFY_IMAGE}:latest")
                    }
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', DOCKER_CREDS_ID) {
                        docker.image("${FRONTEND_IMAGE}:latest").push()
                        docker.image("${BACKEND_IMAGE}:latest").push()
                        docker.image("${OCR_IMAGE}:latest").push()
                        docker.image("${CHATBOT_IMAGE}:latest").push()
                        docker.image("${NOTIFY_IMAGE}:latest").push()
                    }
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
