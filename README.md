# 목적

-   PC 버전에서만 구매할 수 있는 온라인 로또를 간편하게 모바일로도 구매할 수 있게 한다
-   제외수 및 밴 패턴을 적용하여 임의의 범위안에 랜덤 로또를 추출하여 구매 할 수 있게 한다.

# 구현된 기능

-   동행복권 계정 로그인 기능 & 잔여 금액 문구 확인
    -   동행복권 웹 페이지를 분석하여 로그인 api의 url, request를 동일하게 요청
-   1회 or 5회 자동 구매 기능
    -   동행복권 웹 페에지를 분석하여 로또 구매 api의 url, request, session 을 동일하게 요청
-   특정 번호 선택하여 제외수를 제외 및 밴 패턴 적용하여 랜덤하게 로또 번호 추출 & 해당 번호 구매 기능

# URL

http://121.138.176.164/
