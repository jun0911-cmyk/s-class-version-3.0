# s-class-version-3.0ㅡmain
webRTC를 이용한 화상 수업 (비공개) - 데이터 버전 3.0 (최신)

### 서버 실행 방법
1. 레포지토리 클론
    git clone https://github.com/jun0911-cmyk/s-class-version-3.0.git
2. 디렉토리 이동
    cd s-class-version-3.0 <- path
3. 모듈 설치
    path -> s-class-version-3.0 
    npm install
    cd s-class-version-3.0/server <- path
    path -> s-class-version-3.0/server
    npm install
    서버 디렉토리와 메인 디렉토리의 기본 모듈 설치
3. 서버 실행
    npm i -g nodemon
    nodemon server
    OR
    node server.js

### pull request 방법
1. 레포지토리 클론
    git clone https://github.com/jun0911-cmyk/s-class-version-3.0.git
2. pull request
    처음 만들때만 -> git checkout -b [branchName]
    처음 만들때만 -> git remote add origin(별칭) https://github.com/jun0911-cmyk/s-class-version-3.0.git
    git add .
    git commit -sm "commit message"
    git push origin branch name