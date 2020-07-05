#!/bin/sh

cp _site/img/remote/* img/remote/
git status
git add img/remote/
git commit -m "Persist images"
