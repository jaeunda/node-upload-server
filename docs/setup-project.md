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
    # express
    # dotenv: zero-dependency module that loads environment variables from a `.env` file into `process.env`
npm i express dotenv
# devDependencies 
    # ts-node-dev: 실행도구
    # @types... : 타입 정의 파일
npm i -D typescript ts-node-dev @types/node @types/express
# TypeScript 초기화: tsconfig.json 생성
    # `tsconfig.json` specifies the root files and the compiler options required to compile the project
npx tsc --init --rootDir src --outDir dist --esModuleInterop true --resolveJsonModule true --module commonjs --target es2020
```
### `package.json` settings
```
{
    "private": true, # publish 방지
    "type": "commonjs", # tsconfig.json module과 통일
    "main": "dist/index.ts",
    "scripts": {
        "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
        "build": "tsc -p tsconfig.json"
        "start": "node dist/index.ts"
    },
}
```

#### `scripts`
##### `tsc`: TypeScript Compiler
##### `ts-node`: `.ts` 파일을 중간 파일 생성 없이 바로 실행
- `ts-node-dev`: `ts-node` 기능 + 코드 변경 시 서버 자동 재시작

##### Flow
```
$ npm run dev 
```
- 개발 시작 시 한 번만 실행
- 코드를 수정하고 저장할 때마다 서버 자동 재시작

```
$ npm run build
```
- 서버에 올릴 최종 결과물 생성 (`dist/`)

```
$ npm start
```
- `dist/` 디렉토리 내 최적화된 코드를 실행하여 실제 서비스 운영


#### `tsconfig.json` settings
```
{
    "compilerOptions": {
        // 추가(라이브러리 호환성)
        "skipLibCheck": true,
        "forceConsistentCasingInFileNames": true
    },
    "include": ["src"] // compile directory
}
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
- [npm Docs: `package.json`](https://docs.npmjs.com/cli/v10/configuring-npm/package-json)
- [npm Docs: `scripts` field](https://docs.npmjs.com/cli/v8/using-npm/scripts)