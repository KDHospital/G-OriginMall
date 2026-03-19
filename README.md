# 🚀 KD종합병원 프로젝트 Git 규칙

> **Git이 처음이어도 괜찮아요!** 이 문서만 따라하면 됩니다.

---

## 📁 브랜치 구조

```
main              ← 최종 배포용 (기능 검증 완료 후 팀장이 버전업)
└── dev           ← 팀 통합 브랜치 (PR 기본 타겟)
    ├── feature/member
    ├── feature/seller
    ├── feature/product
    └── feature/order
```

> ⚠️ **작업은 반드시 본인 feature 브랜치에서만 합니다.**  
> `main`, `dev`에 직접 push하면 팀 전체에 영향을 줍니다.

---

## 📋 하루 작업 요약 체크리스트

```
[ ] 아침: git pull origin dev → git merge dev
[ ] 작업 중: git add . → git commit -m "작업내용" → git push origin feature/기능명
[ ] 작업 완료: GitHub에서 PR 생성 (base: dev)
[ ] 기능 완성: 팀장에게 검증 요청 → 브랜치 삭제
```

---

## ☀️ 매일 아침 루틴 (작업 시작 전 필수!)

> 팀원이 어제 작업한 내용을 내 브랜치에 반영하는 과정입니다.

```bash
# 1. dev 브랜치로 이동해서 최신 코드 받기
git checkout dev
git pull origin dev

# 2. 내 브랜치로 이동
git checkout feature/기능명   # 예: git checkout feature/member

# 3. dev의 최신 내용을 내 브랜치에 합치기
git merge dev

# 4. 내 back(이클립스)쪽 새로고침하기!
```

> 💡 **이걸 안 하면?** 팀원 코드와 충돌(Conflict)이 발생할 수 있습니다.

---

## 💻 작업 중 (수시로 반복)

```bash
# 변경한 파일 저장하기
git add .

# 커밋 (기록 남기기)
git commit -m "feat: 로그인 기능 구현"

# GitHub에 올리기
git push origin feature/기능명   # 예: git push origin feature/login
```

### ✅ 커밋 메시지 규칙

| 태그 | 언제 쓰나요? | 예시 |
|------|------------|------|
| `feat:` | 새 기능 추가 | `feat: 회원가입 API 연결` |
| `fix:` | 버그 및 코드 수정 | `fix: 로그인 오류 수정` |
| `style:` | UI 스타일 수정 | `style: 버튼 색상 변경` |
| `refactor:` | 코드 정리 | `refactor: 함수 분리` |
| `docs:` | 문서 수정 | `docs: README 업데이트` |

---

## 📤 작업 완료 후 PR (Pull Request)

1. GitHub 저장소 접속
2. 상단에 뜨는 **"Compare & pull request"** 버튼 클릭
3. 아래 내용 작성:
   - **제목**: 무엇을 했는지 한 줄 요약
   - **내용**: 변경사항 간단히 설명
4. **base: `dev`** ← **compare: `feature/기능명`** 확인 후 PR 생성
>  ( 💡 1 ~ 4 까지는 전원가능한 작업, 5 ~ 6 은 검증하는 인원 )
5. (PR승인 시)팀장 + 팀원 1명 코드 검토 후 Merge 완료
6. (PR승인 시)PR->Merge 시 Merge pull request #숫자 뒤에 어느정도 제목 적어주기 
>  (예 : Merge pull request #100 fix: 버그수정 )

> ⚠️ PR 없이 dev, main에 직접 merge 금지!

---

## 🚨 실수했을 때 대처법

### ❌ Case 1. dev 브랜치에 실수로 커밋한 경우

```bash
# dev 브랜치 상태 확인
git checkout dev
git log --oneline -5   # 실수한 커밋 해시 복사 (예: a1b2c3d)

# 실수한 커밋을 내 브랜치에 가져오기
git checkout feature/기능명
git cherry-pick a1b2c3d

# dev에서 잘못된 커밋 취소
git checkout dev
git revert a1b2c3d
git push origin dev
```

> 💡 `revert`는 기존 기록을 지우지 않고 "되돌리는 커밋"을 새로 만듭니다. 가장 안전한 방법입니다.

---

### ❌ Case 2. main 브랜치에 실수로 커밋한 경우

> main은 브랜치 보호 규칙 때문에 push가 막혀 있습니다.  
> 만약 로컬에서만 커밋이 쌓인 상태라면:

```bash
# 실수한 커밋 해시 확인
git checkout main
git log --oneline -5

# 실수한 커밋을 내 브랜치에 옮기기
git checkout feature/기능명
git cherry-pick 커밋해시

# main 되돌리기 (push 전이라면 reset 사용 가능)
git checkout main
git reset --hard HEAD~1   # 마지막 커밋 1개 취소 (로컬만 해당)
```

> ⚠️ `reset --hard`는 커밋이 **완전히 삭제**됩니다.  
> push된 이후라면 절대 사용하지 말고 **팀장에게 즉시 연락하세요.**

---

### ❌ Case 3. 충돌(Conflict)이 발생한 경우

```bash
# 충돌 메시지 예시
CONFLICT (content): Merge conflict in src/components/Login.jsx
```

**해결 방법:**

1. VSCode에서 충돌 파일 열기
2. 아래와 같은 표시를 찾기:
   ```
   <<<<<<< HEAD
   내가 작성한 코드
   =======
   팀원이 작성한 코드
   >>>>>>> dev
   ```
3. 원하는 코드만 남기고 `<<<<`, `====`, `>>>>` 표시 모두 삭제
4. 저장 후:
   ```bash
   git add .
   git commit -m "fix: 충돌 해결"
   git push origin feature/기능명
   ```

> 💡 어떤 코드를 남겨야 할지 모를 때는 **팀원과 상의**하세요!

---

### ❌ Case 4. .metadata의 내용이 변경사항으로 들어가는 경우

**해결 방법:**

1. git checkout dev

2. git pull origin dev

3. git rm -r --cached .metadata



---

## 🚫 절대 금지 사항

| ❌ 금지 | ✅ 대신 이렇게 |
|--------|-------------|
| `dev`, `main`에 직접 push | feature 브랜치에 push 후 PR 생성 |
| `application-local.properties` 올리기 | `.gitignore`에 등록되어 있음, 신경 끄기 |
| 에러 나는 코드 push | 로컬에서 먼저 실행 확인 후 push |
| `git push --force` 사용 | 팀장에게 문의 |
| 완료된 브랜치 방치 | PR merge 후 브랜치 삭제 |

---

## 📞 문의

Git 관련 문제가 생기면 혼자 해결하려 하지 말고 **바로 팀장에게 연락하세요!**  
실수해도 괜찮습니다. 빠르게 연락할수록 더 쉽게 해결됩니다. 😊


## 🌿 브랜치 생성 (담당 기능 시작할 때 1회)

```bash
# dev 기준으로 feature 브랜치 생성
git checkout dev
git pull origin dev
git checkout -b feature/기능명   # 예: git checkout -b feature/login
git push -u origin feature/기능명
```

---

## 🗑️ 기능 완성 후 브랜치 삭제 (PR merge 완료 후)

```bash
# 로컬 브랜치 삭제
git branch -d feature/기능명   # 예: git branch -d feature/login

# 원격 브랜치 삭제
git push origin --delete feature/기능명
```

> 💡 기능이 완전히 완료되어 dev에 merge된 브랜치만 삭제합니다.

---

## 🚀 dev → main 버전업 (팀장 담당)

기능 완성 후 팀장 + 담당자 + 팀원 1명, **3인 검증 완료 시** 팀장이 진행합니다.

```bash
git checkout main
git merge dev
git tag v1.0.0       # 버전 태그 부여
git push origin main
git push origin v1.0.0
```

| 버전 | 의미 | 예시 |
|------|------|------|
| `v1.0.0` | 첫 번째 기능 완성 | 로그인/회원가입 |
| `v1.1.0` | 두 번째 기능 완성 | 게시판 CRUD |
| `v1.2.0` | 세 번째 기능 완성 | 댓글 기능 |

---
