## Utilisation:

1) lui dire les table et colomne pour qu'elle me fasse le script sql

2) générer des fichier de config

3) faire le style des page

4) tabulation

5) aide pour erreur de lint ou console

⚠ The "middleware" file convention is deprecated. Please use "proxy" instead. Learn more: https://nextjs.org/docs/messages/middleware-to-proxy

Node.js fs rename failed after 101 retries with error Error: EPERM: operation not permitted, rename 'C:\dev\license\blog_app\.next\dev\server\server-reference-manifest.js.tmp.5cb8tw99urs' -> 'C:\dev\license\blog_app\.next\dev\server\server-reference-manifest.js'
⨯ Error: EPERM: operation not permitted, rename 'C:\dev\license\blog_app\.next\dev\server\server-reference-manifest.js.tmp.5cb8tw99urs' -> 'C:\dev\license\blog_app\.next\dev\server\server-reference-manifest.js'
    at ignore-listed frames {
  errno: -4048,
  code: 'EPERM',
  syscall: 'rename',
  path: 'C:\\dev\\license\\blog_app\\.next\\dev\\server\\server-reference-manifest.js.tmp.5cb8tw99urs',
  dest: 'C:\\dev\\license\\blog_app\\.next\\dev\\server\\server-reference-manifest.js'
}
 GET /blog/msMan/post/add 500 in 515ms (next.js: 297ms, proxy.ts: 90ms, application-code: 128ms)
[browser] Uncaught Error: EPERM: operation not permitted, rename 'C:\dev\license\blog_app\.next\dev\server\server-reference-manifest.js.tmp.5cb8tw99urs' -> 'C:\dev\license\blog_app\.next\dev\server\server-reference-manifest.js'

rename middleware -> proxy