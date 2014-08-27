import xml.etree.ElementTree as xml
import glob
import sys
import os
import re

sys.stdout.write('reading template SASS... ')
template = open('sass/themes/_template.scss').read()
sys.stdout.write('done\n')

for theme in glob.glob('themes/*.xml'):
    sys.stdout.write('reading ' + theme + '... ')
    root = xml.parse(theme).getroot()
    name = root.get('name')
    type = root.get('type')
    css = template.replace('{name}', name)

    for category in root.find('colors'):
        for data in category:
            color = {}
            for primary in data:
                color[primary.tag] = primary.text

            if ('a' in color):
                color_text = 'rgba({r},{g},{b},{a})'.format(**color)
            else:
                color_text = 'rgb({r},{g},{b})'.format(**color)

            css = css.replace('\'{' + category.tag + '/' + data.tag + '}\'', color_text)

    any_missing = False
    for missing in re.finditer('{.*}', css):
        sys.stdout.write('\n  [WARNING] no match for ' + missing.group())
        any_missing = True
    if any_missing:
        sys.stdout.write('\n')

    sys.stdout.write('done\n')

    sys.stdout.write('exporting ' + theme + '... ')
    directory = 'sass/themes/' + type + '/'
    if not os.path.exists(directory):
        os.makedirs(directory)
    file = open(directory + name + '.scss', 'w+')
    file.write(css)
    sys.stdout.write('done\n')