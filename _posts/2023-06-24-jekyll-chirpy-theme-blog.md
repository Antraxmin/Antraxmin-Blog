---
title: Jekyll Chirpy 테마로 나만의 기술 블로그 만들기
author: Antraxmin
date: 2023-06-24 17:17:00 +0900
categories: [Blog]
tags: [jekyll, ruby, blog, vercel]
pin: true
---

Jekyll의 인기있는 테마 중 하나인 `Chirpy`를 이용해 기술 블로그를 만들어 보려고 한다. 전에 github pages를 이용하여 배포를 시도하였으나, 유독 Chirpy 테마만 제대로 빌드되지 않았던 기억이 있다. 현재는 개인 커스텀 도메인도 소유하고 있어 굳이 [github.io](http://github.io) 를 사용할 필요가 없기에 배포는 `Vercel` 을 이용하여 진행할 것이다. <br />

## 1. Ruby 설치

Jekyll을 사용하여 기술 블로그를 만들기 위해서는 먼저 `Ruby`와 `jekyll` 을 로컬 컴퓨터에 설치해야 한다. 윈도우 환경에서는 [Ruby 공식 사이트](https://www.ruby-lang.org/en/downloads/)를 통해 다운받거나 `chocolatey` 같은 패키지 매니저를 이용하여 Ruby를 설치한다.

Ruby를 설치하였다면 터미널에 접속하여 다음 명령어로 `jekyll`을 설치한다. 이때 반드시 **관리자 권한**으로 접속해야 한다. 그렇지 않으면 아예 bundler 자체가 설치되지 않는다. <br /><br />

```bash
gem install jekyll bundler
```

![1](https://github.com/Antraxmin/Antraxmin-Blog/assets/77287236/c8296624-ff1b-4ca5-b294-b8f630895e84)

이제 원하는 커스텀 테마를 적용해 볼 것이다. 해당 포스팅은 **Chirpy** 테마를 기준으로 설명한다. 각 테마마다 설정이 조금씩 다를 수 있으니 공식 Repo의 README를 잘 읽어보도록 하자. <br />

<br />

## 2. Chirpy 테마 다운로드

chirpy 테마의 공식 Repo는 이곳에서 확인할 수 있다. 로컬 폴더에 git을 연결하고 아래와 같이 chirpy 테마의 최신 버전을 clone한다.

```bash
git clone https://github.com/cotes2020/jekyll-theme-chirpy.git
```

chirpy 테마에 필요한 **의존성**을 설치하기 위해 다음 명령을 입력한다.

```ruby
bundle install
```

![2](https://github.com/Antraxmin/Antraxmin-Blog/assets/77287236/3e9cfa19-1311-4e88-b707-b1f926afb7f4)

<br />

**Bundle complete**라는 메시지가 뜨면 정상적으로 설치된 것이다. 설정 파일을 수정하지 않은 초기 테마가 잘 적용되는지 확인하기 위해 로컬 서버를 구동해 보자.

```ruby
bundle exec jekyll serve
```

![3](https://github.com/Antraxmin/Antraxmin-Blog/assets/77287236/abaabe0b-9fa1-447e-a8a0-18454b11b118)

<br />

Server address 부분을 보면 로컬 서버의 주소가 [**http://127.0.0.1:4000**](http://127.0.0.1:4000) 인 것을 알 수 있다. 해당 주소에 접속하여 제대로 실행되는지 확인해 보자.

![4](https://github.com/Antraxmin/Antraxmin-Blog/assets/77287236/3700e2f2-058d-4b4a-ab14-0e9e7e0678ec)

다음과 같이 chirpy 테마가 적용된 사이트에 연결된다면 로컬 설정은 끝났다.

<br />

## 3. 테마 초기화 작업

앞에서 clone받아 로컬에서 실행한 화면은 chirpy 테마의 Demo 사이트이기에 개발자의 마음대로 커스텀되어 있는 상태이다. 테마를 초기화하고 설정 정보를 수정하여 나만의 블로그로 세팅한 후 배포하여야 한다.

먼저 아래 명령을 입력하여 chirpy 테마를 초기화한다.

```ruby
bash tools/init
```

윈도우 터미널 환경에서는 위 명령어가 작동하지 않는데, `git bash`나 `WSL` 를 이용하면 된다. 초기화 작업을 완료하였다면 임시 post 와 로컬 파일의 초기 정보들이 삭제되었을 것이다.

<br />

## 4. \_config.yml 파일 수정하기

Jekyll 블로그의 기본적인 설정 정보는 `_config.yml` 파일에 포함되어 있다. 해당 파일을 수정하여 나만의 블로그를 커스텀해보자.

![6](https://github.com/Antraxmin/Antraxmin-Blog/assets/77287236/7af686b9-039b-4b67-8c1a-caded32cb1bf)

chirpy 테마는 아주 친절한 편이라 각 속성에 어떤 정보를 입력해야 하는지 주석으로 알려주고 있다. 세부적인 속성에 대한 설명은 [이곳](https://www.irgroup.org/posts/jekyll-chirpy/)에 더 자세하게 설명되어 있으니 참고하면 좋을 것 같다.

원하는 대로 설정 정보를 변경한 후 다시 로컬 서버를 구동하면 변경 사항이 적용된 블로그 사이트가 보일 것이다. 이제 vercel에서 커스텀 도메인을 연결하여 배포하기만 하면 된다. <br /><br />

## 5. Vercel을 이용하여 배포하기

지금까지 설정한 jekyll 파일들을 github 원격 저장소에 업로드한 후 `Vercel`로 배포해 보겠다.
새로운 Repository를 생성한 후 로컬 폴더를 push하고 Vercel Dashboard로 들어가서 배포를 진행한다. ([github.io](http://github.io) 도메인을 사용하지 않을 것이라면 굳이 repository 이름을 github.io로 설정할 필요는 없다)

![5](https://github.com/Antraxmin/Antraxmin-Blog/assets/77287236/99a71d8e-e83c-4d67-a352-e14cb27ebf53)

이때 가끔 \_site 폴더가 .gitignore에 등록되어 있는 경우가 있다. Vercel은 Jekyll을 빌드한 후 \_site 폴더를 찾아서 배포하기 때문에 프로젝트 폴더 내에 `_site`가 존재해야 한다.

![7](https://github.com/Antraxmin/Antraxmin-Blog/assets/77287236/7b6548ad-30b2-4b37-a444-54f908903066)

`Domains` 속성에 커스텀 도메인 주소를 추가하면 해당 링크로 블로그에 접속할 수 있다.
<br /><br />

---

수많은 Jekyll 테마를 봐 왔지만 **chirpy**만큼 디자인이 깔끔하면서도 기술적으로 다양한 기능을 제공하는 테마는 없는 것 같다. 기술 블로그로 활용하기에 최적의 테마가 아닐까 싶다.
