---
title: "[Spring Security] 로그인과 로그아웃 처리 과정 이해하기"
author: Antraxmin
date: 2023-06-26 21:58:00 +0900
categories: [Study, Spring Security]
tags: [spring, springsecurity, java, session, cookie]
pin: true
---

앞선 포스팅에서 스프링 시큐리티의 개념과 간단한 실습 과정을 정리하였다. 이번에는 스프링 시큐리티가 로그인과 로그아웃 요청을 어떻게 처리하는지에 대해 자세히 짚어보고자 한다.

## 로그인 동작 방식

스프링 시큐리티에서 로그인 요청이 들어왔을때 처리하는 전체적인 흐름은 아래와 같다.

![image](https://github.com/Antraxmin/Antraxmin-Blog/assets/77287236/c35ebcf2-5fca-44da-8bf1-e82ff02a1b98)

1. 클라이언트 측에서 `/home`이라는 GET 요청을 보낸다.
2. 만약 인증되지 않은 사용자라면 로그인 페이지로 연결되도록 **리다이렉트** 한다. 따라서 사용자는 가운데에 있는 로그인 화면을 보게 된다.
3. 사용자가 로그인 페이지에서 username과 password를 입력한 후 POST 요청을 통해 `form data`를 서버로 전송한다.
4. 해당 사용자에 대한 `인증 토큰`을 생성하고 저장한다.
5. 이후 인증된 사용자가 다시 /home이라는 GET 요청을 보내면 **세션에 저장된 인증 토큰** 을 통해 해당 페이지에 접근할 수 있게 된다.

위 과정을 구현한 `SecurityConfig.java` 코드는 아래와 같다.

```java
@Configuration
@EnableWebSecurity
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .authorizeRequests()
                .anyRequest().authenticated()
        .and()
                .formLogin()    // form 로그인 인증 기능이 작동
                .loginPage("/login.html")    // 사용자 정의 로그인 페이지
                .defaultSuccessUrl("/home")  // 로그인 성공 후 이동 페이지
                .failureUrl("/login.html?error=true")   // 로그인 실패 후 이동 페이지
                .usernameParameter("username")      // 아이디 파라미터명 설정
                .passwordParameter("password")  // 패스워드 파라미터명 설정
                .loginProcessingUrl("/login")       // 로그인 form action url
                .successHandler(loginSuccessHandler())  // 로그인 성공 후 핸들러 (해당 핸들러를 생성하여 핸들링해준다.)
                .failureHandler(loginFailureHandler()) // 로그인 실패 후 핸들러 (해당 핸들러를 생성하여 핸들링해준다.)
                .permitAll();   // 사용자 정의 로그인 페이지 접근 권한 승인

    }
}
```

### 로그인 요청 처리 과정

스프링 시큐리티 내부에서 사용자의 로그인 요청을 어떻게 처리하는지에 대해 알아보자.

먼저 아래 흐름도에서 무엇이 어떤 역할을 하는지 정리하였다.

- UsernamePasswordAuthenticationFilter : 로그인 인증 요청을 처리하는 필터
- AntPathRequestmatcher() : 사용자가 요청한 요청 정보의 url을 검사
- Authentication : 사용자가 로그인 페이지에서 입력한 정보를 인증 객체로 저장
- AuthenticationManager : 인증 객체를 Provider에게 위임, 인증 처리 후 반환받은 인증 객체를 SecurityContext 객체에 저장
- AuthenticationProvider : 실제 인증 처리를 담당하는 클래스로 인증 성공/실패를 반환
- SuccessHandler : 인증 성공 시 처리할 로직

로그인 요청이 들어왔을 때 각각의 요소들이 어떻게 상호작용하여 요청을 처리하는지 알아보자.

사용자가 요청을 보내면 먼저 `UsernamePasswordAuthenticationFilter`를 통해 요청 정보가 매칭되는지 확인한다. `AniPathRequestMatcher` 는 사용자가 보낸 요청 url이 /login으로 시작하는지 확인한다. 이때 url이 일치한다면 인증 처리 과정으로 넘어가고, 일치하지 않는다면 `chain.doFilter`로 넘어간다.

![image](https://github.com/Antraxmin/Antraxmin-Blog/assets/77287236/4f573bcd-382c-4948-b8a9-2cbff5e077d4)

`Authentication` 에서는 사용자가 로그인 페이지에서 입력한 username과 password를 인증 객체에 저장하여 `AuthenticaitonManager` 에 전달한다.

인증 관리자인 `AuthenticationManager`은 인증 처리를 담당하는 클래스인 `AuthenticationProvider`에게 처리 작업을 위임하여 인증 성공/실패를 반환한다. 만약 인증에 성공하였다면 인증 객체를 생성하여 유저(User) 객체와 유저권한정보(Authorities) 객체를 담은 후 `AuthenticationManager`에게 반환한다.

인증에 실패하였다면 `UsernamePasswordAuthenticationFilter`에 `AuthenticationException`이라는 예외를 반환하여 예외처리를 수행한다.

인증 성공 시 `AuthenticationManager`는 반환받은 인증 객체를 `SecurityContext` 객체에 저장한다. 이때 `SecurityContext`는 세션에도 저장되어 **전역적** 으로 SecurityContext를 참조할 수 있다.

인증 성공 이후에는 `SuccessHandler`에 해당하는 로직을 수행하게 된다.

**요약**

- UsernamePasswordAuthenticationFilter는 인증 전과 인증 후의 작업들을 관리하는 인증처리 필터
- 인증 처리 전에는 인증 관리자인 AuthenticationManager에게 사용자 인증정보를 전달하여 인증처리 작업을 수행
- 인증 성공시 인증객체를 반환받아서 SecurityContext에 저장하고 인증 성공 후의 로직 수행 (SuccessHandler)
- 인증 실패 시 UsernamePasswordAuthenticationFilter로 다시 돌아가서 예외 처리

## 로그아웃 동작 방식

스프링 시큐리티에서 로그아웃을 처리하는 전체 흐름은 아래와 같다.

![image](https://github.com/Antraxmin/Antraxmin-Blog/assets/77287236/925b1287-1c05-4109-b86f-3420a1d13c24)

사용자가 `/logout`이라는 GET 요청을 보내면 서버에서 세션을 무효화하고 인증 토큰과 쿠키 정보를 삭제한 후 로그인 페이지로 **리다이렉트** 한다.

### 로그아웃 요청 처리 과정

로그아웃 요청이 들어왔을 때 내부에서 처리하는 과정은 다음과 같다.

![image](https://github.com/Antraxmin/Antraxmin-Blog/assets/77287236/36e9c947-92e1-4329-bdb4-65aa083daa9c)

먼저 LogoutFilter를 거쳐 `AntPathRequestMatcher()`를 통해 요청이 로그아웃 url인지 검사한다. 맞을 경우 `SecurityContext`로부터 **인증 객체(Authentication)** 를 꺼내어 `SecurityContextLogoutHandler`에 전달한다.

`SecurityContextLogoutHandler`는 전달받은 인증 객체에 대한 **세션을 무효화** 하고 **쿠키와 인증 토큰을 삭제** 한다. `SecurityContext` 객체 역시 삭제된다.

이후 `SimpleUrlLogoutSuccessHandler`를 호출하여 로그인 페이지로 이동하도록 한다.
