# wview_rag_1

 Version: 0.9.1

 date    : 2026/07/24

 update :

***

C++ Webview2 , Windows RAG Qdrant OpenRouter

* OpenRouter
* LLVM CLang
* SQLite history data save
* visual studio 2026 community
* node 24
* React
* embedding : gemini-embedding-001
* windows11

***
### vector data add

https://github.com/kuc-arc-f/cpp_12ex/tree/main/rag_13qd

***
### Image

* chat

![img1](/images/wview_rag_1_1.png)

* history

![img1](/images/wview_rag_1_2.png)


***
### related

https://www.sqlite.org/download.html

* sqlite-amalgamation-*.zip , download
* sqlite3.h , sqlite3.c

***
### .env

```
OPENROUTER_API_KEY=
OPENROUTER_MODEL=deepseek/deepseek-v4-flash
GEMINI_API_KEY=
```

***
### vcpkg install
```
vcpkg install webview2:x64-windows
vcpkg install nlohmann-json:x64-windows
vcpkg install curl:x64-windows
vcpkg install cpr:x64-windows
```

***
### front build

```
npm i
npm run build
```

***
### build

```
clang++ -target x86_64-pc-windows-msvc -m64 -std=c++17 -O2 main.cpp -o wview_rag_1.exe ^
  -I/prog/vcpkg/installed/x64-windows/include ^
  -L/prog/vcpkg/installed/x64-windows/lib ^
  -L./lib ^
  -lWebView2Loader.dll -luser32 -lgdi32 -lole32 -loleaut32  -llibcurl -lcpr -lsqlite3

```

* OR
```
build.bat
```

***
### front build

```
npm i
npm run build
```

***
* start

```
.\wview_rag_1.exe
```

***
### blog

