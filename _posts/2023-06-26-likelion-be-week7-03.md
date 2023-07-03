---
title: "[Spring Security] 동시 세션 제어와 세션 고정 보호, CSRF"
author: Antraxmin
date: 2023-06-26 22:00:00 +0900
categories: [Study, Spring Security]
tags: [spring, springsecurity, java, session, cookie]
pin: true
---

## 동시 세션 제어

동시 세션 제어란 사용자가 <span style="color: red">**동시에 여러 개의 세션을 가질 수 없도록**</span> 제한하는 기능을 말한다.

동시 세션 제어를 통해 한 사용자가 동시에 여러 세션을 열지 못하도록 하거나, 여러 개의 세션 중 하나만 유효하도록 설정할 수 있다. 동시 세션 제어가 필요한 이유는 **사용자의 보안을 강화** 하기 위해서이다.

만약 동일한 사용자 계정으로 여러 세션을 동시에 열 수 있게 허용한다면 사용자가 자신의 계정 정보를 다른 사람과 공유하거나, 다른 사람이 사용자의 계정에 접근할 수 있게 된다. 예를 들면 OTT나 인터넷 강의의 ID를 여러 사람이 돌려 사용하거나 중국 해커들과 동시에 서비스를 사용할 수 있게 된다는 말이다.

이는 보안 측면에서 굉장히 위험하므로 동시 세션 제어 기능을 통해 <span style="color: red">**사용자가 한 번에 하나의 세션만 활성화할 수 있도록**</span> 설정하는 것이 필요하다.

동시 세션 제어를 구현하는 방법으로는 크게 <span style="color: red">**이전 사용자의 세션을 만료시키는 방법**</span>과 <span style="color: red">**현재 사용자의 인증을 실패 처리하는 방법**</span> 이 있다.

![image](https://github.com/Antraxmin/Antraxmin-Blog/assets/77287236/1e230bd8-657d-42cc-8865-a3e8b41a0e6a)

### 이전 사용자 세션 만료 방식

사용자가 새로운 로그인을 시도할 때 <span style="color: red">**이전 세션을 무효화**</span> 하는 방식이다.

만약 사용자 1의 계정으로 로그인되어 있는 상태에서 사용자 2가 동일한 계정으로 로그인을 시도했을 때 이전에 로그인된 사용자 1의 세션이 만료되고 사용자 2가 해당 계정으로 로그인을 유지할 수 있도록 처리한다.

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            // 다른 보안 설정 구성
            .sessionManagement()
                .maximumSessions(1) // 최대 허용 세션 수
                .maxSessionsPreventsLogin(false) // false로 설정하여 새로운 로그인 허용
                .expiredUrl("/session-expired") // 세션이 만료될 때 이동할 URL
                .and()
                .invalidSessionUrl("/invalid-session") // 유효하지 않은 세션일 때 이동할 URL
                .sessionAuthenticationErrorUrl("/session-error"); // 세션 인증 오류 시 이동할 URL
    }
}

```

위 코드는 스프링 시큐리티에서 **이전 사용자의 세션을 만료** 시키는 방식의 동시 세션 제어를 구현한 것이다.

- maximumSessions() : 최대 허용 세션 수 설정
- maxSessionsPreventsLogin() : 동시 세션 허용 여부 설정
- expireUrl() : 세션이 만료될 때 이동할 URL 설정
- invalidSessionUrl() : 유효하지 않은 세션일 때 이동할 URL 설정
- sessionAuthenticationErrorUrl() : 세션 인증 오류 시 이동한 URL 설정

`maxSessionsPreventsLogin()` 메소드의 값을 `false`로 설정하면 새로운 로그인을 허용하고 이전 세션을 만료 처리한다.

### 현재 사용자 인증 실패 방식

<span style="color: red">**현재 로그인을 시도하는 사용자에 대해 인증 예외를 발생** </span> 시키는 방식이다.

사용자 1의 계정으로 로그인되어있는 상태에서 사용자 2가 동일한 계정으로 로그인을 시도하면 서버는 현재 접속하려는 사용자 2에 대해 인증 예외를 발생시키도록 처리한다. 즉 이전 사용자만 계속 사용할 수 있다.

아래는 스프링 시큐리티 내부에서 현재 사용자 인증 예외 처리 방식을 구현한 예제의 일부이다.

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private AuthenticationExceptionHandler authenticationExceptionHandler;

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            // 다른 보안 설정 구성
            .sessionManagement()
                .maximumSessions(1) // 최대 허용 세션 수
                .maxSessionsPreventsLogin(true) // 새로운 로그인 막음
                .expiredUrl("/session-expired") // 세션이 만료될 때 이동할 URL
                .and()
                .invalidSessionUrl("/invalid-session") // 유효하지 않은 세션일 때 이동할 URL
                .sessionAuthenticationErrorUrl("/session-error") // 세션 인증 오류 시 이동할 URL
                .and()
                .authenticationExceptionHandling() // authenticationExceptionHandling 메소드 호출
                    .accessDeniedHandler(authenticationExceptionHandler);

        http
            .authenticationProvider(authenticationProvider())
            .addFilterAfter(new ConcurrentSessionFilter(sessionRegistry(), "/session-expired"), UsernamePasswordAuthenticationFilter.class);
    }
}

```

`maxSessionsPreventsLogin()` 값을 `true`로 변경하면 동시에 로그인한 세션이 최대 허용 세션 수를 초과하는 경우 **현재 로그인을 시도한 사용자** 에 대해 인증 예외를 발생시킨다.

인증 예외처리는 `authenticationExceptionHandling()` 를 통해 이루어진다. `accessDeniedHandler`를 사용하여 접근 거부 예외 발생 시 `authenticationExceptionHandler`를 호출하여 예외를 처리한다.

## 세션 고정 보호

세션 고정 보호란 **악의적인 세션 공격을 막기 위한 보안 기능** 이다.

간단하게 설명하자면 **공격자가 사용자의 세션을 획득** 하여 인증을 우회하거나 권한을 부여받도록 하는 공격을 말한다.

![image](https://github.com/Antraxmin/Antraxmin-Blog/assets/77287236/727e4c2b-5c6e-463b-a34c-ee6a0035ec14)

일반적으로 세션 고정 공격은 공격자가 **악성 사이트를 통해 `세션 ID`를 얻는 것** 으로부터 시작된다. 획득한 세션 ID를 이용하여 로그인에 성공한 후 사용자의 세션을 공유하여 권한을 획득하는 것이다.

스프링 시큐리티에서는 이러한 공격을 막기 위한 **세션 고정 보호 기능** 을 제공한다.

세션 고정 보호의 핵심은 <span style="color: red">**로그인을 시도할때마다 새로운 세션 ID를 발급하여 제공**</span>한다는 것이다.

이때 사용자가 공격자의 세션 쿠키로 로그인하더라도 **매번 새로운 세션 ID가 발급** 되기 때문에 공격자는 같은 쿠키값으로 사용자의 정보를 공유받을 수 없다.

## 사이트 간 요청 위조 (CSRF)

사이트 간 요청 위조(CSRF, Cross Site Request Forgery)란 웹 취약점 공격의 하나로, **사용자의 의도와 무관하게 공격자가 의도한 행위를 특정 웹사이트에 요청하도록 하는 것** 을 말한다.

![image](https://github.com/Antraxmin/Antraxmin-Blog/assets/77287236/3a7b1604-2cd1-40e8-bddf-d992ff55dd7b)

사용자가 웹사이트에 로그인하여 정상적인 쿠키를 발급받은 상태에서 공격자가 보낸 공격용 링크에 접속하면 사용자의 의도와는 무관하게 **공격용 웹사이트와 사용자의 웹 브라우저 간 상호작용** 이 이루어져 다양한 공격이 가능하게 된다.

### CsrFilter

이와 같은 CSRF 공격을 방지하기 위해 스프링 시큐리티에서는 `CsrFilter` 라는 필터를 제공한다.

**CsrFilter의 역할**

- 웹사이트에 접속한 사용자마다 고유한 `CSRF 토큰`을 생성하여 브라우저 쿠키에 저장되도록 한다. 해당 쿠키는 사용자의 세션과 연결된다.
- 요청이 들어왔을 때 요청 헤더나 파라미터에 포함된 `CSRF 토큰`을 검증하여 유효한 요청인지 검사한다.

**CsrFilter 구현**

아래는 스프링 시큐리티에서 CSRF 설정을 구성하는 간단한 코드이다.

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
            .csrf()
                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse()); // CSRF 토큰을 쿠키에 저장
    }
}

```

`configure()` 메소드 내부에 `csrf()` 메소드를 호출하여 CSRF 설정을 구성한다.

`csrfTokenRepository()` 메소드를 이용하여 CSRF 토큰을 쿠키에 저장한 후 `withHttpOnlyFalse()`를 통해 자바스크립트 환경에서도 쿠키에 접근 가능하도록 설정한다.

이렇게 설정하면 스프링 시큐리티는 모든 HTTP 요청에 대해 CSRF 토큰을 요구하고, 요청 헤더나 파라미터에 포함된 CSRF 토큰을 검증한다.

토큰이 없거나 일치하지 않는 경우 `InvalidCsrfTokenException` 예외가 발생하여 요청을 거부하게 된다.
