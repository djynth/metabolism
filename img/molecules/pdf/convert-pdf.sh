#!/bin/bash
PDF_FILES="*.pdf"
for f in $PDF_FILES
do
filename=$(basename $f)
extension="${filename##*.}"
filename="${filename%.*}"
gs -dNOPAUSE -dBATCH -sDEVICE=pngalpha -r96 -sOutputFile=$filename.png $f
done
