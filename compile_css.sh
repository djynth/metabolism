#!/bin/sh

echo -n 'removing css... '
rm -r css
echo 'done'

python themes/compile_themes.py

echo -n 'compiling SASS... '
compass compile -q
echo 'done'