pipeline {
    agent any

    tools {
        nodejs "NodeJS"
    }

    stages {
        stage("Clear Docker Containers and Images in VM3") {
            agent {
                label 'preprod'
            }
            steps {
                script {
                    // Stop and remove all running containers
                    def runningContainers = sh(script: 'docker ps -q | wc -l', returnStdout: true).trim().toInteger()
                    if (runningContainers > 0) {
                        sh 'docker stop $(docker ps -a -q)'
                        sh 'docker rm $(docker ps -a -q)'
                    } else {
                        echo "No running containers to stop."
                    }

                    // Remove all Docker images
                    def dockerImages = sh(script: 'docker images -q | wc -l', returnStdout: true).trim().toInteger()
                    if (dockerImages > 0) {
                        sh 'docker rmi -f $(docker images -q)'
                    } else {
                        echo "No Docker images to remove."
                    }
                }
            }
        }

        stage("Install Environment") {
            agent {
                label 'test'
            }
            steps {
                echo 'Installing Environment'
                sh 'npm install'
            }
        }

        stage("Unit Test") {
            agent {
                label 'test'
            }
            steps {
                echo 'Run Unit Test'
                sh 'npm run test'
            }
        }

        stage("Docker Compose API UP"){
            agent {
                label 'test'
            }
            steps {
                echo 'Compose API UP'
                sh 'pwd && ls -al'
                sh 'docker-compose -f ./compose.dev.yml up -d --build'
                sh 'docker-compose ps'
                sh 'docker ps'
            }
        }

        stage("Run Robot") {
            agent {
                label 'test'
            }
            steps {
                echo 'Clone Robot'
                dir('./robot/') {
                    git branch: 'main', url: 'https://github.com/softdev-lab/jenkins-robot.git'
                }
                echo 'Run Robot'
                sh 'cd ./robot && python3 -m robot ./jenkins-test.robot'
            }
        }

        stage("Build & Push to Registry") {
            agent {
                label 'test'
            }
            steps {
                echo 'Build & Push'
                withCredentials([
                    usernamePassword(credentialsId: 'vm2version2', usernameVariable: 'DEPLOY_USER', passwordVariable: 'DEPLOY_TOKEN')
                ]) {
                    sh "docker login registry.gitlab.com -u ${DEPLOY_USER} -p ${DEPLOY_TOKEN}"
                }
                sh "docker build -t registry.gitlab.com/ajdvdsf.aj/jenkins-assignment ."
                sh "docker push registry.gitlab.com/ajdvdsf.aj/jenkins-assignment"
                echo 'Build & Push Success!'
            }
        }

        stage("Clean Everything in VM2") {
            agent {
                label 'test'
            }
            steps {
                echo 'Cleaning'
                sh 'docker-compose -f ./compose.dev.yml down'
                sh 'docker system prune -a -f'
            }
        }

        stage("Deploy in Pre-Prod") {
            agent {
                label 'preprod'
            }
            steps {
                echo 'Run on Pre-Prod'
                sh 'docker-compose up -d --build'
            }
        }
    }
}