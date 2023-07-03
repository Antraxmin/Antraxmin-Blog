---
title: "[AWS] EC2 Free Tier 탄력적 IP 과금 발생 및 소액결제 해결 후기"
author: Antraxmin
date: 2023-07-02 23:36:00 +0900
categories: [Study, AWS]
tags: [aws, ec2, elasticip, freetier]
pin: true
---

광고성 메일을 정리하기 위해 메일함에 접속했는데 AWS 고객센터로부터 다음과 같은 메일이 도착해 있었다.

![image](https://github.com/Antraxmin/Antraxmin-Blog/assets/77287236/465f39a8-10d4-4e9a-aa08-d6f52cdd1494)

6월 28일, 7월 1일에도 같은 메일이 와 있었는데 내가 바로 확인하지 못했다. 이 글을 작성하는 와중에 내 계좌에서 760원이 결제되었다는 메일이 새로 날아왔고, 뭐지 싶어 안내 메일을 자세히 읽어보았다. 내용인즉슨, AWS Free Tier 사용 한도의 85%를 사용했다는 건데.. 지난주 멋사 백엔드 세션 AWS 실습 시간에 프리티어 요금제로 EC2 서버를 실행하는 과정에서 문제가 생긴 건가 싶었다.

그런데 당시 운영진분께서 EC2를 종료하고 삭제하는 방법까지 알려주셔서 서버가 돌아가고 있을 리는 없는데, 내가 빠트린 것이 있나 해서 일단 EC2 대시보드에 접속해 보았다.

![image](https://github.com/Antraxmin/Antraxmin-Blog/assets/77287236/2ff501f2-053e-4bbd-a8de-9a44f398a744)

예상대로 실행중인 인스턴스가 없는데...

![image](https://github.com/Antraxmin/Antraxmin-Blog/assets/77287236/8fa66032-6c43-4e51-a912-fc1471e65fe9)

혹시나 힌트를 얻을 수 있을까 해서 여기저기 뒤져보다가 AWS 프리티어 사용량 관리 페이지로 들어가 보았다. 현재 사용량이 16h에 대해 1h만큼 사용했는데 MTD 실제 사용량 100%는 뭐고 예상 사용량 1550%는 뭔지... 아직 모르는 개념이 너무 많아서 그냥 구글링으로 원인을 찾아보기로 했다.

여러 블로그를 참고한 결과 나같이 몇백원대의 소액 결제가 진행된 사람들이 꽤 있어 보였다. AWS에서 무료로 제공하는 EC2 클라우드와 탄력적 IP(Elastic IP) 중 EC2만 삭제하고 탄력적 IP를 그냥 놔둘 경우 **사용자가 낭비를 하고 있다고 간주** 하고 사용료를 청구한다고 한다.

결론적으로 <span style="color: red">**EC2는 껐지만 탄력적 IP가 삭제되지 않아서 생긴 문제**</span>라고 볼 수 있다. 하하 내 실수..

현재로서는 백원 단위의 소액 결제가 청구되었지만, 탄력적 IP 요금은 <span style="color: red">**시간당 청구**</span>되기 때문에 더 늦기 전에 문제를 해결해야 했다.

인스턴스는 지난주에 사용 후 바로 삭제했기 때문에 대시보드에 아무것도 없는 상태이고, Elastic IP를 완전히 사용 종료해야 한다.

EC2 대시보드에 접속하여 **네트워크 및 보안 > 탄력적 IP 주소** 탭으로 들어가면 실행중인 IP 정보가 보인다.

![image](https://github.com/Antraxmin/Antraxmin-Blog/assets/77287236/596ddfca-a1ec-43a8-82de-fb6a6c56e170)

정말 탄력적 IP가 돌아가고 있었다. 우측 상단 **작업 > 탄력적 IP 릴리즈** 옵션을 눌러 삭제해 주어야 한다.

![image](https://github.com/Antraxmin/Antraxmin-Blog/assets/77287236/720bef2f-ece7-47bd-a31f-dfad8a4e6cc6)

![image](https://github.com/Antraxmin/Antraxmin-Blog/assets/77287236/4a8762c9-fb02-4aa9-b58c-384f104e3cf7)

또 한 가지 중요한 것은, 나같이 EC2 서버를 생성하면서 보안 정책까지 설정한 경우 <span style="color: red">**보안 그룹까지 삭제**</span>해주어야 한다.

![image](https://github.com/Antraxmin/Antraxmin-Blog/assets/77287236/26792702-a6b8-47c2-b8fb-9cd937dc11b9)

전에 만든 보안 그룹 역시 모두 활성화되어 있었기에 체크박스를 눌러 삭제하였다. default 보안 그룹은 기본 설정 그룹이기 때문에 삭제할 수 없다고 한다.

![image](https://github.com/Antraxmin/Antraxmin-Blog/assets/77287236/544821bc-8372-455f-ac07-282a5eaed2fd)

연결되어 있는 **탄력적 IP와 보안 그룹을 모두 제거** 하면 요금 청구가 중지될 것이다.

아무튼 이번 사태는 AWS EC2 인스턴스 구성과 프리티어 한도에 대해 잘 알지 못해서 일어난 일이었다.

EC2만 종료하면 되는 줄 알았는데 탄력적 IP도 모두 제거해주어야 추가적인 비용 청구를 막을 수 있다. 혹시 모르니 실습에 사용한 키 페어도 삭제하였다.

변태같아보일 수 있겠지만, 사실 이 상황이 꽤나 흥미로웠다. 무료가 다 같은 무료가 아니고, 내가 잘못 구성하면 거액의 요금이 청구될수 있다는 시스템이 **공부를 위한 동기부여** 를 주는 것 같았다.

복잡하고 거대한 AWS라는 서비스를 더 잘 다루고 싶어졌고, 이번 기회에 EC2 프리티어 요금제를 사용할 때 주의할 점을 알게 되어 오히려 좋았다.

~~(다시 생각해 보면 소액 결제라 이렇게 여유로운거지 몇천만원이 청구되었다고 생각하면 좀 아찔하기도 할듯? 어떻게든 해결하긴 하겠지만..)~~

### 한줄 요약

> AWS EC2 Free Tier 요금제를 사용할 때 EC2 인스턴스와 탄력적 IP를 모두 제거해주어야 비용 청구를 막을 수 있다.
