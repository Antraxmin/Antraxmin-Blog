---
title: "[Spring Security] 스프링 시큐리티 시작하기"
author: Antraxmin
date: 2023-06-26 21:58:00 +0900
categories: [Study, Spring Security]
tags: [spring, springsecurity, java, intellij]
pin: true
---

## Spring Security란?

스프링 시큐리티(Spring Security)란 애플리케이션의 **보안** 과 **인증** 에 관련된 작업을 쉽게 처리할 수 있도록 도와주는 스프링의 하위 프레임워크로, 다음과 같은 보안 기능을 제공한다.

- 사용자 인증 및 권한 부여
- 세션 관리, 암호화, 웹 보안
- HTTP, OAuth, OpenID 등 다양한 인증 방식 지원

> 스프링 시큐리티는 스프링 프레임워크를 기반으로 하는 애플리케이션의 보안을 효과적으로 구현할 수 있는 강력한 도구이다.

## Spring Security 시작하기

### 프로젝트 설정

미리 준비된 스프링 시큐리티 프로젝트 폴더를 IntelliJ에서 열어주었다. (실습에는 JDK 11을 사용한다.)

![image](https://github.com/Antraxmin/Antraxmin-Blog/assets/77287236/f1759517-63ba-4061-a550-8598398f7c9e)

**프로젝트 설정 옵션**

- Gradle - Groovy
- Java 11
- Spring Boot 2.7.13
- Dependencies - Spring Web, Spring Security

### build.gradle 설정

build.gradle의 dependencies부분을 다음과 같이 설정한 다음 코끼리 버튼을 눌러 동기화해준다.

![image](https://github.com/Antraxmin/Antraxmin-Blog/assets/77287236/e2377bc1-50b5-43c3-9887-f7af417f1905)

우측 상단 ReRun 버튼을 클릭하여 열리는 로컬 서버로 접속하여 제대로 실행되는지 확인한다. localhost:8080 주소로 접속했을 때 아래와 같이 로그인 화면이 나와야 한다.

![image](https://github.com/Antraxmin/Antraxmin-Blog/assets/77287236/39d1a0fb-2465-47c9-81c1-052dc27cffc7)

스프링 시큐리티는 기본적으로 모든 서비스에 대해 인증된 사용자만 접속을 허용한다. 따라서
로그인 없이도 서비스에 접근할 수 있도록 SecurityConfig.java 코드를 수정한다.

메인 java 파일 경로에 `SecurityConfig.java` 를 생성하고 내부 URL 필터를 적용하여 모든 인증되지 않은 요청을 허락하도록 변경한다.

![image](https://github.com/Antraxmin/Antraxmin-Blog/assets/77287236/611db525-72bb-4901-9173-0bd8fd0f5192)

재실행 시 기존 로그인 화면 대신 Whitelabel Error 페이지로 접속된다.

![image](https://github.com/Antraxmin/Antraxmin-Blog/assets/77287236/ac77e199-342b-4279-85b2-05a15cbae460)

## 초기화 작업 및 보안 설정

스프링 시큐리티 프로젝트의 모든 기능에는 기본적으로 보안 기능이 적용되어 있다. 초기 설정 시 모든 요청은 인증이 되어야만 자원의 접근이 가능하므로 따로 설정해주어야 한다.

인증 방식으로는 form 로그인 방식과 httpbasic 로그인 방식이 제공된다. 로그인 가능한 기본 계정은 한 개만 제공되며 콘솔 창에 출력되는 랜덤 문자열을 입력하여 로그인할 수 있다.

![image](https://github.com/Antraxmin/Antraxmin-Blog/assets/77287236/f55231d9-7623-44be-bbb4-714eeaf81318)

다만 매번 생성되는 랜덤 문자열을 입력하여 로그인하는 것은 불편하기 때문에 다음과 같이 application.properties에서 기본 name과 password를 설정할 수 있다.

![image](https://github.com/Antraxmin/Antraxmin-Blog/assets/77287236/8ced5121-9e26-43f8-bc66-4618985a7d32)

스프링 시큐리티는 기본적인 보안 기능을 제공하지만 계정 및 권한을 추가하거나 데이터베이스를 연동하기 복잡하다는 단점이 있고, 시스템에서 필요한 추가적인 보안 기능을 설정해주어야 하는 경우가 있다.
