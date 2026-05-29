# Synthèse sur mon utilisation de l’IA dans le développement

## Introduction

Dans mon travail de développement, j’utilise l’intelligence artificielle comme un outil d’assistance pour gagner du temps, structurer mon travail et résoudre certains problèmes techniques.
Je ne l’utilise pas uniquement pour générer du code automatiquement, mais plutôt comme un assistant que je guide étape par étape.

Mon objectif est de faire avancer le projet fonctionnalité par fonctionnalité, tout en gardant une compréhension du code produit.
Je relis les fichiers générés, je corrige ce qui ne me convient pas et je demande des explications lorsque certaines fonctions ou logiques ne sont pas claires pour moi.

---

## 1. Génération de scripts SQL

### Utilisation

J’utilise l’IA pour m’aider à créer des scripts SQL, notamment pour les fichiers de migration.

En général, je lui donne la structure de table que je souhaite obtenir. L’IA me propose ensuite des améliorations possibles, par exemple sur :

* les types de colonnes ;
* les contraintes ;
* les relations entre les tables ;
* les clés primaires ou étrangères ;
* les valeurs par défaut ;
* la cohérence générale du modèle.

Une fois les propositions vérifiées et validées, je lui demande d’écrire le fichier de migration correspondant.

### Apport de l’IA

L’intérêt principal est que l’IA permet de gagner du temps sur la rédaction des migrations SQL. Elle aide aussi à éviter certains oublis dans la structure de la base de données.

Elle sert donc à la fois d’outil de génération et d’outil de relecture technique.

### Limites

Même si l’IA propose des améliorations utiles, il reste nécessaire de vérifier ce qu’elle génère.
La structure de la base de données doit correspondre au besoin réel du projet, et l’IA peut parfois proposer des éléments qui ne sont pas indispensables ou qui compliquent inutilement le modèle.

---

## 2. Génération de fichiers de configuration

### Utilisation

J’ai aussi utilisé l’IA pour générer des fichiers de configuration, notamment pour connecter l’application à la base de données.

Dans mon cas, j’avais déjà configuré les variables d’environnement dans le fichier `.env`, mais je savais que la connexion avec Supabase ne se faisait pas simplement avec une connection string classique.
J’ai donc demandé à l’IA de m’aider à mettre en place cette connexion proprement.

### Résultat obtenu

L’IA a généré quatre fichiers. Parmi eux, deux se sont révélés utiles :

* `database.types.ts`
* `env.ts`

Le fichier `database.types.ts` permet de typer la base de données, ce qui est utile dans un projet TypeScript.

Le fichier `env.ts` permet de centraliser et sécuriser l’accès aux variables d’environnement.

Cependant, l’IA a également généré deux autres fichiers :

* `client.ts`
* `server.ts`

Ces fichiers contenaient des fonctions permettant de connecter Supabase respectivement côté client et côté serveur.

### Problème rencontré

Ces deux fichiers n’étaient finalement pas utiles dans l’application, car le package Supabase intègre déjà les fonctions nécessaires pour gérer ces connexions.
Ils n’étaient donc pas utilisés dans le projet et ont probablement été supprimés par la suite.

### Analyse

Cet exemple montre que l’IA peut générer du code fonctionnel, mais pas forcément adapté au contexte exact du projet.

Elle peut créer des fichiers « propres » en théorie, mais inutiles en pratique si elle ne connaît pas parfaitement l’architecture déjà en place ou les fonctionnalités incluses dans les packages utilisés.

Il est donc important de vérifier si les fichiers générés sont réellement nécessaires avant de les conserver.

---

## 3. Création du style des pages

### Utilisation

J’ai demandé à l’IA de créer un style simple pour les pages du site en utilisant Tailwind CSS.

L’objectif n’était pas forcément d’obtenir un design très avancé, mais plutôt d’éviter d’avoir une interface totalement brute ou sans mise en forme.

### Résultat

Le résultat est basique : le site reste assez simple visuellement, voire encore peu esthétique, mais il possède maintenant une mise en forme minimale avec des couleurs.

On peut donc dire que l’IA m’a permis de passer d’un site non stylisé à un site un peu plus présentable.

### Analyse

L’IA est utile pour générer rapidement une première version de style, surtout avec Tailwind CSS.
Elle peut proposer des classes, structurer les composants visuellement et donner une cohérence minimale aux pages.

Cependant, le résultat reste souvent générique.
Pour obtenir un design vraiment propre, il faut ensuite retravailler l’interface à la main, ajuster les espacements, les couleurs, les composants et l’expérience utilisateur.

---

## 4. Coding et autocomplétion

### Utilisation générale

Depuis un certain temps, je n’écris plus beaucoup de fichiers entièrement à la main.

En entreprise, je travaille dans une petite startup où la priorité est davantage mise sur la rentabilité et la rapidité de production que sur la qualité parfaite du code.
Dans ce contexte, j’ai pris l’habitude d’utiliser l’IA comme un assistant de développement pour accélérer la création de fonctionnalités.

### Méthode de travail

Pour développer une fonctionnalité, je procède généralement par étapes :

1. Je passe l’IA en mode plan.
2. Je lui décris précisément la fonctionnalité que je veux développer.
3. Elle me propose un plan de réalisation.
4. Je corrige ce plan s’il me paraît incomplet, biaisé ou mal adapté.
5. Une fois le plan validé, je lui demande de passer à l’exécution.
6. Elle génère ou modifie les fichiers nécessaires.
7. Je relis ensuite chaque fichier produit.
8. Si une fonction ou une logique m’est inconnue, je lui demande de me l’expliquer.
9. Si le code ne me convient pas, je le corrige à la main, souvent avec l’aide de l’autocomplétion.
10. Si un bug concerne plusieurs fichiers, je peux demander à l’IA de le corriger en lui précisant la méthode à suivre.

### Rôle de l’autocomplétion

L’autocomplétion me sert surtout lors des corrections manuelles.
Elle permet d’aller plus vite lorsque je modifie une fonction, complète une condition, corrige une erreur ou adapte une partie du code généré.

L’IA produit donc une base de travail, puis l’autocomplétion m’aide à faire les ajustements plus rapidement.

### Avantages

Cette méthode permet de gagner beaucoup de temps.
Elle évite de repartir de zéro pour chaque fichier et permet de se concentrer davantage sur la logique de la fonctionnalité.

L’IA est aussi utile pour organiser le travail. Le mode plan permet de découper une fonctionnalité en étapes et de réfléchir à l’implémentation avant d’écrire le code.

### Limites

Le risque principal est de laisser l’IA produire trop de code sans le comprendre.

Pour éviter cela, j’essaie de ne pas lui confier tout le projet d’un seul coup.
Je préfère avancer fonctionnalité par fonctionnalité, afin de garder le contrôle sur ce qui est généré.

Je prends aussi le temps de lire les fichiers produits, de poser des questions et de corriger ce qui ne me semble pas clair ou adapté.

### Conclusion sur cette pratique

Je ne code plus forcément les fichiers de zéro, mais je ne laisse pas non plus l’IA faire tout le projet sans contrôle.

Mon objectif est d’utiliser l’IA comme un accélérateur, pas comme un remplacement total de ma compréhension.
Je veux rester capable d’expliquer, modifier et maintenir le code produit.

---

## 5. Aide pour les erreurs de lint ou de console

### Utilisation

J’utilise également l’IA pour comprendre et corriger des erreurs de lint, de console ou de build.

Lorsque je rencontre une erreur que je ne comprends pas vraiment, je lui envoie le message complet.
L’IA analyse ensuite l’erreur, propose une cause probable et peut suggérer une correction.

Après correction, je lis son récapitulatif de troubleshooting pour comprendre ce qui s’est passé.

### Exemple d’erreur rencontrée

J’ai eu l’erreur suivante dans un projet Next.js :

```txt
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
```

### Solution trouvée

La solution a été de renommer le fichier :

```txt
middleware.ts
```

en :

```txt
proxy.ts
```

Après ce changement, l’erreur a été corrigée.

### Ce qui m’a surpris

Ce qui m’a surpris, c’est que je n’avais jamais rencontré cette erreur auparavant pendant l’alternance.

L’erreur n’est pas apparue dès le début du développement.
Pendant toute la journée, le fichier `middleware.ts` fonctionnait correctement, puis le problème est apparu plus tard.

Cela donne l’impression que l’erreur peut apparaître à cause d’un changement de comportement du serveur de développement, d’un cache, d’une mise à jour de Next.js, ou d’un fichier temporaire bloqué par Windows.

### Analyse

Dans ce cas, l’IA a été utile parce qu’elle a permis de faire le lien entre deux informations :

* l’avertissement indiquant que `middleware` est déprécié ;
* l’erreur `EPERM` liée au renommage d’un fichier temporaire dans `.next`.

L’erreur `EPERM` peut sembler au départ être uniquement un problème Windows ou un fichier bloqué.
Mais le message sur `middleware` donnait aussi une piste importante : Next.js attend maintenant l’utilisation de `proxy.ts` à la place de `middleware.ts`.

L’IA permet donc de croiser plusieurs messages d’erreur et de proposer une solution plus rapidement que si je devais chercher chaque partie séparément.

---

## Conclusion générale

Mon utilisation de l’IA dans le développement est devenue assez centrale, mais elle reste encadrée.

Je l’utilise principalement pour :

* générer des scripts SQL ;
* créer des fichiers de configuration ;
* produire une première version du style des pages ;
* m’aider à développer des fonctionnalités ;
* comprendre et corriger des erreurs techniques.

L’IA me permet de gagner du temps, de structurer mon travail et de débloquer des situations où je ne comprends pas immédiatement l’erreur.

Cependant, elle produit parfois du code inutile, trop générique ou mal adapté au contexte du projet.
C’est pour cela que je relis les fichiers générés et que je cherche à comprendre ce qu’elle fait.

Je ne cherche pas à laisser l’IA développer tout le projet seule.
Je préfère avancer étape par étape, fonctionnalité par fonctionnalité, afin de garder une vision claire du code produit.

En résumé, l’IA me sert d’assistant de développement : elle accélère la production, aide à résoudre des problèmes et propose des solutions, mais elle doit rester supervisée par le développeur.
