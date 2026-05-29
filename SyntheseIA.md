## Utilisation:

# 1) Script SQL:

utilisation:
Je lui prompt la structure de table que je veux, l'ia me propose des amélioration, je les confirme et elle m'écris le fichier de migration

# 2) générer des fichier de config

utilisation:
Je lui ai demander de faire la connexion à la bd après avoir mis les variables dans le .env car je savais que la connexion avec supabase ne se fais pas simplement avec un connection string.

resultat:
Sur les 4 fichier générer 2 sont utile database.types.ts et env.ts mais l'ia a aussi généré clien.ts et server.ts qui sont des fonction qui connecte respectivement la base coté client et coté server mais qui ne sont pas utiliser dans l'app parce que le package supabase intègre déjà ces deux fonction... (du coup je les ai peu-être supprimer)

# 3) faire le style des page

utilisation:
J'ai demander un style simple en tailwind, maintenant mon site est toujours moche mais en couleur

# 4) coding/tabulation

utilisation:
Je n'écrit plus beaucoup de code de moi même depuis un moment, en entreprise je suis dans une petite startup et la boite vise la rentabilité sur la calité du code. Donc j'ai pris l'habitude pour faire une fonctionnalité de passé mon ia en mode plan lui décrire ma fonctionnalité en détails, corriger son plan si il me parait biaisé, une fois le plan me convenant je la lance en execution et pour finir je vais lire le code de chacuns des fichiers qu'elle me génère, je demande de me décrire si elle utilise une fonction que je ne connais/comprend pas, si le code ne me convient pas par non compréhension ou correction de bug je corrige à la main aidé par l'autocomplétion. Dans certain cas quand le bug s'étend sur plusieur page je lui demande de le corriger en lui précisant la façon de le corriger.

conlusion:
Je ne code plus les fichier de zero. J'essaie de faire avancé l'ia fonctionnalité par fonctionnalité pour ne pas juste la laisser faire tous le projet en 1h sans rien savoir de ce qui a été peoduit.


# 5) aide pour erreur de lint ou console

utilisation:
Quand j'ai des erreur que je comprend vraiment pas je lui envoie l'erreur et je la laisse corriger, puis je lit son récapitulatif de trouble shooting.

par exemple j'ai eu cette erreur:

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

La solution était de rename middleware.ts en proxy.ts, ce qui me surprend car je n'ai jamais eu l'erreur avant pendant l'atérnance et que l'erreur n'est pas apparu dès le début du developpement, toute la journé le middleware.ts fonctionnait sans problème.

# 6) Trouble shoot ISR

problème:
Dans mon projet dû au Header dans le layout le site entier était en SSR. J'ai donc du demander à l'ia de m'aider à corriger le problème.

Ce qui s'est passé:
Il m'a proposé plusieur façon de corriger le problème non pass en corrigeant l'appel à la session dans le header mais en faisant une refactorisation de toute l'app.

Au final je lui ai proposer de passer la session dans un appel api, et c'est à ce moment là qu'il m'a proposer de passer le header en composant client, ce qui a corriger le problème.