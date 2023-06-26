---
title: Jekyll Chirpy 테마 오류 해결 일지
author: Antraxmin
date: 2023-06-26 13:31:00 +0900
categories: [Blog]
tags: [jekyll, ruby, blog, vercel]
pin: true
---

지난 포스팅에서 Chirpy 테마를 이용해 Jekyll 테마를 성공적으로 배포하였다고 생각하였으나 예상치 못한 오류가 발생하였다. 발생한 오류는 다음과 같다.

- 다크모드 적용 X
- TOC 자동 생성 X
- 모바일 화면에서 사이드바 및 검색 기능 작동 X

chirpy 테마가 자랑하는 핵심적인 기능이 작동하지 않았기 때문에 `github issue`와 `stackoverflow`를 열심히 뒤져서 오류를 해결하였다. 해결하는 과정에서 도움이 되었던 한국어 문서는 단 한 건도 없었기 때문에 똑같은 오류를 겪고 있는 분들이 내 블로그를 보고 시간낭비 없이 오류를 해결하였으면 한다.

먼저 강조하고 싶은 것은 본인의 로컬 환경이 아닌 Jekyll 블로그 테마 상의 문제라고 생각되었을 때 가장 먼저 찾아봐야 하는 것은 구글링이 아니라 해당 테마의 `github issue` 탭이다.

내가 겪고 있는 오류는 해당 테마를 사용하는 사람들 중 단 한 사람이라도 먼저 겪었을 확률이 높다. 그렇기에 `github issue` 탭에는 해당 테마를 다양한 환경에서 적용하였을 때 발생할 수 있는 거의 모든 상황들에 대한 해결책이 언급되어 있다.

거두절미하고, 여러가지 삽질을 반복하며 오류를 해결한 결과 위의 3가지 오류는 모두 같은 원인에 의해 발생한 문제였다. 시간이 꽤나 걸린 이유는 저 3가지 오류가 발생하였음에도 불구하고 로컬 환경과 빌드 환경에서 모두 정상적으로 배포되었기 때문이다.

일단 내가 놓친 오류 메시지부터 읽어보았다. 로컬에서 서버가 실행중이라는 메시지에 가려졌던 한 가지 오류 메시지가 보였다.

![image](https://github.com/Antraxmin/Antraxmin-Blog/assets/77287236/fe8d4400-3b15-4c13-ab1c-3219e088050e)

`/assets/js/dist/` 경로에 위치한 `home.min.js` 와 `post.min.js` 파일을 찾을 수 없다는 것인데, 프로젝트 폴더 내의 해당 위치로 가서 파일을 찾아보았으나 애초에 `assets` 폴더 안에 `dist`라는 폴더 자체가 존재하지 않았다. 원래부터 없는 파일을 어떻게 찾아야 하나 고민하던 중 일단 `github issue` 를 참고하기로 했다. 아니나 다를까 닫힌 이슈 문서들 중 내가 마주한 오류 상황을 여러 건 볼 수 있었다.

![image](https://github.com/Antraxmin/Antraxmin-Blog/assets/77287236/213098b2-ab88-4c38-aa8b-1e0a0b419229)
![image](https://github.com/Antraxmin/Antraxmin-Blog/assets/77287236/b131ae6a-6cdc-4096-b32c-960d26b4a3e0)
![image](https://github.com/Antraxmin/Antraxmin-Blog/assets/77287236/2c30e635-2f6f-4fbc-8cf9-7c3b07c8815f)
![image](https://github.com/Antraxmin/Antraxmin-Blog/assets/77287236/9c082317-39b5-4b3a-9d18-3dadd00b71bb)

몇 가지의 `issue` 를 더 읽어보던 중 가장 도움이 되었던 issue는 [이것](https://github.com/cotes2020/jekyll-theme-chirpy/issues/942#issuecomment-1479552757)이었다. `.gitignore` 파일에 `asset/js/dist` 가 등록되어 있는 상황에서 해당 파일을 찾지 못한 것이 원인이었고, 해당 파일은 애초에 내가 테마를 clone받을 때부터 프로젝트 폴더 내에 존재하지 않았던 것이다. 이로 인해 개발자님께서 따로 Repo를 생성하여 `asset/js/dist` 에 포함될 정적 파일들을 따로 업로드하여 관리하고 계셨다.

이슈 메시지를 읽어본 결과 내가 해석한 바로는 [chirpy-demo](https://github.com/cotes2020/chirpy-demo) 저장소에 들어가서 로컬에 없는 파일들을 수동으로 추가한 후 `.gitignore`에서 `asset/js/dist`를 제거하면 해결되는 문제였다.

![image](https://github.com/Antraxmin/Antraxmin-Blog/assets/77287236/52c74f3a-26ab-4963-84be-dff980b2d128)

[이곳](https://github.com/cotes2020/chirpy-demo/tree/main/assets/js/dist)에 올려져 있는 6개의 js 파일을 복사하여 로컬에 추가한 후 `.gitignore` 설정에서 `asset/js/dist` 경로를 주석 처리하고 커밋했더니 toc, 다크모드, 모바일 사이드바 문제가 한번에 해결되었다.

![image](https://github.com/Antraxmin/Antraxmin-Blog/assets/77287236/2fc5cc36-51fa-4208-a0d2-4aa05d114279)
