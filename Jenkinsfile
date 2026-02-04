pipeline {
    agent { node { label 'docker-agent-node' } }
    
    triggers {
        pollSCM('H/5 * * * *') // Poll SCM every 5 minutes
    }

    stages {
        stage('Build') {
            steps {
                // Install dependencies
                sh 'npm install'
            }
        }
        stage('Test') {
            steps {
                // Run tests
                sh 'npm test'
            }
        }
    }
}
