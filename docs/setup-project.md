## Install

```bash
# 패키지 업데이트
sudo apt update && sudo apt upgrade -y
# 필수 도구
sudo apt install -y build-essential git curl

# nvm 설치
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
# shell 재실행
source ~/.bashrc

nvm install --lts
nvm use --lts

# 확인
node -v
npm -v
```

## Init

```bash
mkdir my-node-api && cd my-node-api
# package.json 생성
npm init -y
# dependencies 
npm i express
# devDependencies 
    # ts-node-dev: 실행도구
    # @types... : 타입 정의 파일
npm i -D typescript ts-node-dev @types/node @types/express
# TypeScript 초기화: tsconfig.json 생성
    # `tsconfig.json` specifies the root files and the compiler options required to compile the project
npx tsc --init --rootDir src --outDir dist --esModuleInterop true --resolveJsonModule true --module commonjs --target es2020
```

### Directory Structure

```
node-upload-server/
 ├─ src/
 │   └─ index.ts
 ├─ package.json
 ├─ tsconfig.json
 └─ .gitignore
```

#### **`.gitignore`**

```
node_modules
dist
.env
```

## References
- [What is a tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)