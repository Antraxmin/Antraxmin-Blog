---
title: Spring Boot 개발환경 구축 (IntelliJ)
author: Antraxmin
date: 2023-05-27 14:58:00 +0900
categories: [Study, Spring Boot]
tags: [springboot, java]
pin: true
---

## 스프링부트란?

기존 스프링 프레임워크의 복잡한 환경 설정을 간소화하여 쉽고 빠르게 개발을 시작할 수 있도록 도와주는 경량화 프레임워크이다. 스프링부트는 다음과 같은 편리함을 제공한다.

- 내장 Tomcat 서버를 통한 빠르고 간편한 배포
- starter를 통한 의존성 관리 자동화
- xml 설정 자동화를 통한 복잡한 설정 간소화

## 스프링부트 개발환경 구축하기

> 해당 포스팅은 사전에 IntelliJ 및 Java JDK 11이 설치되어 있다고 가정하고 진행한다.

### Spring Initializer 구성

`Spring Initializer`란 스프링에서 공식 지원하는 웹 기반의 프로젝트 생성 도구이다. [start.spring.io](https://start.spring.io/)에 접속하여 본인이 사용할 빌드 툴, 언어, JDK 버전 및 Dependency를 설정한 후 zip 파일을 다운로드한다.

![image](https://github.com/Antraxmin/Antraxmin-Blog/assets/77287236/cc04b0ec-c005-4e3a-9c3e-3b3b3d332adc)

<br />

해당 포스팅에서 사용하는 기본 옵션은 다음과 같다.

- Project : Gradle-Groovy
- Language : Java 11
- Spring Boot 버전 : 2.7.12
- Packaging : Jar
- Dependency : Spring web 및 Lombok

`Dependency`를 추가하려면 우측 상단의 ADD DEPENDENCY 버튼을 클릭하여 `Spring web`과 `Lombok` 옵션을 선택한다.

![image](https://github.com/Antraxmin/Antraxmin-Blog/assets/77287236/2f78503c-029d-4ef7-a268-025b576ee23b)

Project Metadata는 임의로 설정 가능하다.

### IntelliJ에서 Spring Boot 프로젝트 열기

위에서 다운받은 zip 파일을 압축 해제한 후 `IntelliJ`에서 열면 자동으로 스프링부트 개발 환경이 세팅된다.

![image](https://github.com/Antraxmin/Antraxmin-Blog/assets/77287236/8d7563e1-bda5-406e-bc16-075a35adbbc4)

위와 같이 BUILD SUCCESSFUL 메시지가 출력된다면 프로젝트 빌드를 위한 환경 설정이 정상적으로 완료된 것이다.

### SpringBoot 프로젝트 구조

본격적인 개발을 시작하기 전에 스프링부트 프로젝트는 어떤 구조로 이루어져 있는지 살펴보자.

![image](https://github.com/Antraxmin/Antraxmin-Blog/assets/77287236/5f685437-9ece-4067-bf12-e277b431a0e5)

<br />

Initializer로 생성한 초기 프로젝트 폴더는 위와 같은데, 이 중 개발자가 알아야 할 부분은 src 폴더 및 build.gradle 정도라고 할 수 있다.

- src/main/java : Controller, DTO, Entity, Service 역할을 하는 여러 개의 java 파일이 저장된다.
- src/main/resource : html, css, javascript 등 java 파일을 제외한 템플릿 파일과 정적 리소스들이 위치한다.
- src/test : 프로젝트 파일을 테스트하기 위한 테스트 코드를 작성하는 공간이다. 규모 있는 애플리케이션을 만들고자 할 때 단위 테스트 등의 테스트 주도 방법론(TDD)을 도입하게 되는 경우가 많은데, 이때 JUnit 등의 테스트 도구를 이용하여 서버를 실행하지 않은 상태에서 src/main/java 내의 코드를 실행할 수 있다.
- build.gradle : Groovy를 기반으로 한 빌드 도구인 Gradle의 환경 설정을 위한 각종 플러그인과 라이브러리 정보가 저장된다.

이외에 다른 파일들은 개발자가 건드릴 필요가 없거나 스프링부트에 의해 자동으로 관리되는 파일이다. 설명이 필요할 때 다시 언급하도록 하겠다.

## SpringBoot 실행하기

지금까지 스프링부트 개발 환경 세팅을 완료하였으니 간단하게 Hello World를 출력해 보자. `src/main/java` 폴더 내에 `~Application.java` 이름으로 생성된 자바 파일을 보면 main 함수가 포함되어 있다. (해당 포스팅에서 설정한 패키지 이름은 start이므로 com.example.start 폴더 안에 StartApplication.java라는 파일이 존재한다.) 이 파일이 바로 스프링부트 코드가 실행되는 시작점이다.

![image](https://github.com/Antraxmin/Antraxmin-Blog/assets/77287236/f9997253-9f59-43bd-9ee4-3c18d45a6423)

해당 main 함수 안에 Hello World를 출력하는 코드를 추가하고 Run을 눌러 실행시키면 다음과 같이 정상적으로 실행된다.

![image](https://github.com/Antraxmin/Antraxmin-Blog/assets/77287236/d1e595cd-3445-43e0-9636-f4aada6d81ce)
