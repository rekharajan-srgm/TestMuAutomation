pipeline {
    agent any

    environment {
        CI = 'true'
    }

    parameters {
        choice(
            name: 'TEST_PROJECT',
            choices: ['testmu-cloud', 'chromium', 'firefox'],
            description: 'Select which Playwright project to run.\n' +
                         'testmu-cloud → runs on LambdaTest (needs LT_USERNAME & LT_ACCESS_KEY)\n' +
                         'chromium / firefox → runs locally on the Jenkins agent'
        )
    }

    stages {

        stage('Clean Workspace') {
            steps {
                deleteDir()
                echo 'Workspace cleaned.'
            }
        }

        stage('Checkout') {
            steps {
                checkout([
                    $class           : 'GitSCM',
                    branches         : [[name: '*/main']],
                    userRemoteConfigs: [[
                        url          : 'https://github.com/rekharajan-srgm/TestMuAutomation.git',
                        credentialsId: 'github-pat-credentials'
                    ]]
                ])
                echo 'Repository cloned successfully.'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'node --version'
                sh 'npm --version'
                sh 'npm ci'
                echo 'npm dependencies installed.'
            }
        }

        stage('Install Playwright Browsers') {
            // Only needed for local browser projects (chromium / firefox)
            when {
                expression { params.TEST_PROJECT != 'testmu-cloud' }
            }
            steps {
                sh 'npx playwright install --with-deps ${TEST_PROJECT}'
                echo "Playwright browser installed: ${params.TEST_PROJECT}"
            }
        }

        stage('Run Playwright Tests') {
            steps {
                withCredentials([
                    string(credentialsId: 'LT_USERNAME',   variable: 'LT_USERNAME'),
                    string(credentialsId: 'LT_ACCESS_KEY', variable: 'LT_ACCESS_KEY')
                ]) {
                    sh """
                        npx playwright test \
                            --project=${params.TEST_PROJECT} \
                            --reporter=html
                    """
                }
            }
        }

        stage('Publish HTML Report') {
            steps {
                publishHTML([
                    allowMissing         : false,
                    alwaysLinkToLastBuild: true,
                    keepAll              : true,
                    reportDir            : 'playwright-report',
                    reportFiles          : 'index.html',
                    reportName           : 'Playwright Test Report'
                ])
            }
        }

    }

    post {
        always {
            archiveArtifacts(
                artifacts         : 'playwright-report/**',
                allowEmptyArchive : true
            )
            echo 'Playwright report archived.'
        }
        success {
            echo "All tests passed for project: ${params.TEST_PROJECT}"
        }
        failure {
            echo "Tests failed for project: ${params.TEST_PROJECT}. Check the Playwright report for details."
        }
    }
}
