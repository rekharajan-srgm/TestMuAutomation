pipeline {
    agent any

    environment {
        CI           = 'true'
        NODE_VERSION = '20.19.0'
        NODE_HOME    = "/var/jenkins_home/node-${NODE_VERSION}"
        PATH         = "/var/jenkins_home/node-${NODE_VERSION}/bin:${env.PATH}"
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

        stage('Install Node.js') {
            steps {
                sh '''
                    if [ ! -d "$NODE_HOME" ]; then
                        echo "Downloading Node.js ${NODE_VERSION}..."
                        curl -fsSL https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-linux-x64.tar.gz \
                            -o /tmp/node.tar.gz
                        mkdir -p $NODE_HOME
                        tar -xzf /tmp/node.tar.gz -C $NODE_HOME --strip-components=1
                        rm /tmp/node.tar.gz
                        echo "Node.js installed."
                    else
                        echo "Node.js ${NODE_VERSION} already cached."
                    fi
                '''
                sh 'node --version'
                sh 'npm --version'
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
                artifacts         : 'playwright-report/**, test-results/**',
                allowEmptyArchive : true
            )
            echo 'Playwright report and test results archived.'
        }
        success {
            echo "All tests passed for project: ${params.TEST_PROJECT}"
        }
        failure {
            echo "Tests failed for project: ${params.TEST_PROJECT}. Check the Playwright report for details."
        }
    }
}
