# 당근마켓 클론코딩

## 프로젝트 설명

### 📆 기간

2023.03.29 ~ 2023.04.014<br/>


### 💡 당근마켓을 클론코딩한 이유

```
CRUD 기능 뿐만 아니라 실시간 채팅 기능, 회원 가입이나 로그인 회원정보 변경 기능, 
백엔드 서버를 통한 데이터 관리 등 많은 부분들을 구현해 볼 수 있을 것 같아 도전했습니다.  
```


## 🔎 기능 설명

### 1. 회원 관련 기능

<p align="center">
  <img width="200" src="https://user-images.githubusercontent.com/57396816/232033860-0d149503-bd39-4d8c-aa6b-4923065485ef.gif">
</p>
- 회원 가입은 이메일 가입과 구글 가입을 통해 가입 할 수 있도록 했으며, 가입 후 로그인을 하면 나오는 마이페이지에서는 회원의 닉네임과 프로필 사진을 변경할 수 있도록 했습니다.

### 2. 게시물 관련 기능

<p align="center">
  <img  width="200" src="https://user-images.githubusercontent.com/57396816/232147014-1cb2f391-0cf9-425a-9984-2c28bb9b97ba.gif">
  &nbsp &nbsp &nbsp &nbsp &nbsp&nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp&nbsp &nbsp &nbsp &nbsp &nbsp
  <img  width="200" src="https://user-images.githubusercontent.com/57396816/232147009-5af0c5c4-d6fb-4790-80d0-3642f1ecef3a.gif">
</p>

- 로그인을 해야 글쓰기 버튼이 나타나도록 하였으며 로그인 후 글쓰기 버튼을 클릭하면 카테고리, 제목, 사진 등을 빈칸없이 기입해야 글이 등록 됩니다.<br>
- 게시물을 등록시 작성자 법정동 정보와 게시글 작성 경과 시간을 나타내도록 하였습니다.
- 작성후에는 작성자만 볼 수 있는 우상단 버튼을 통해 게시물 수정, 삭제, 판매완료 등록 등을 할 수 있도록 했습니다.<br>
- 게시물 수정 시 새로운 내용을 등록하지 않으면 이 전 게시물 내용과 동일하게 유지되도록 하였습니다.<br>
- 게시물 조회시 조회 수가 증가하며 목록이나 디테일 페이지에서 좋아요 버튼 클릭시 실시간으로 좋아요 개수를 확인 할 수 있도록 했습니다.<br>(로그인 하지 않았거나 본인의 게시물은 좋아요 불가능하도록 설정)
- 판매목록과 구매목록을 만들어 확인 가능하도록 하였습니다.


### 3. 채팅 관련 기능

<p align="center">
  <img  width="700" src="https://user-images.githubusercontent.com/57396816/232154880-5c8aebc9-0bd0-4cd1-840e-5b76bc56463b.gif">    
  &nbsp &nbsp &nbsp &nbsp &nbsp&nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp&nbsp &nbsp &nbsp &nbsp &nbsp
  <img  width="700" src="https://user-images.githubusercontent.com/57396816/232155743-578311ac-cf86-4767-bd8f-5e27269a4773.gif">
</p>


- 게시물 디테일 페이지로 들어가면 채팅요청을 할 수 있습니다. <br>
- 판매 완료 시 더 이상 상대방이 채팅을 요청 할 수 없도록 하였으며 채팅을 통해 거래가 완료 되면 구매자 등록을 할 수 있게 해 구매목록에 게시물이 추가되도록 했습니다.



### 4. 카테고리별 게시물, 인기매물과 내근처 매물

- 일반적인 카테고리 선택 시 게시물 등록시간을 기준으로 최신 게시물이 상단에 표시되게 정렬했습니다.<br>
- 인기매물은 카테고리와 상관없이 좋아요가 많은 게시물을 기준으로 10개만 표시했습니다.<br>
- 내 근처 매물은 내 위치를 구해 원하는 거리 이내의 매물만 필터링해 표시하도록 했습니다. <br>(거리필터는 상단의 select의 option을 통해 사용자가 직접 고르도록 함)
- 게시글이 없을 경우 게시물이 없음을 나타내는 화면을 따로 구성해 나오도록 했습니다.<br>


### 5. 카테고리별 게시물, 인기매물과 내근처 매물

- 상단 돋보기버튼을 통해 사용자가 원하는 게시물을 검색해 필터링해서 볼 수 있도록 했습니다.<br>
- 검색 시 DB에 데이터를 저장하고 구독해 실시간으로 유저들이 가장 많이 검색한 상위 검색어들을 표시하도록 했습니다.<br>



## 아쉬웠던 점

 이 전 리액트로 프로젝트를 진행하며 SEO 문제가 있고 이를 NextJS를 사용해 서버사이드 랜더링을 통해 해결할 수 있음을 알게되고 이를 이용해보기 위해 NextJs로 프로젝트를 진행하게 되었습니다.<br>
이를 위해선 getServerSideprops라는 함수 사용이 필요했고 이를 사용해서 미리 데이터를 가져와 초기 랜더링 시에 html에도 모든 데이터가 나타나게 되었고 SEO문제가 해결 한 줄 알았습니다.<br>
하지만 당근마켓은 실시간으로 정보들이 바뀌는 사이트고 이를 위해선 서버 측에서 pre-rendering를 가져오는 것이 아닌 클라이언트측에서 데이터를 실시간으로 구독해야 계속해서 바뀌는 정보들을 실시간으로 불러 올 수 있었습니다. 그래서 중간에 모든 getServerSideprops를 이용해 pre-rendering했던 모든 코드들을 고치느라 대대적인 수정 작업을 거쳐야 했습니다.<br>
처음부터 조금 더 이러한 서버사이드 랜더링 개념에 대해 자세하고 이해하고 프로젝트를 시작했더라면 좀 더 효율적으로 진행할 수 있지 않았을까 하는 아쉬운 점이 있었습니다.

## 느낀 점
- 단순히 코드를 한 번 작성하고 끝낸 것이 아니라, 계속해서 코드 최적화를 하기 위해 고민하고 공부하면서 좀 더 효율적인 코드 작성 방식에 대해 생각해 볼 수 있었고, 추후 유지, 수정, 보완시에 나중에 다른 부분까지 문제가 번지지 않도록 초기에 코드의 구조를 잘 잡아놔야 한다는 것을 느낄 수 있었습니다.
