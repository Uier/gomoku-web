#!/usr/bin/env sh

set -e

npm run build

cd dist

# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

git push -f git@github.com:Uier/gomoku-web.git master:gh-pages

cd -