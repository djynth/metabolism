import sys
import os
import time
import itertools

date_str = "2013-06-16"

header = """\documentclass[11pt]{article}
\usepackage{fullpage}
\usepackage{fancyhdr}
\setlength{\parindent}{0pt}
\setlength{\parskip}{5pt plus 1pt}
\pagestyle{empty}

\def\indented#1{\list{}{}\item[]}
\let\indented=\endlist

\\newcounter{questionCounter}
\\newcounter{partCounter}[questionCounter]
\\newenvironment{question}[2][\\arabic{questionCounter}]{%
    \setcounter{partCounter}{0}%
    \\vspace{.25in} \hrule \\vspace{0.5em}%
        \\noindent{\\bf #2}%
    \\vspace{0.8em} \hrule \\vspace{.10in}%
    \\addtocounter{questionCounter}{1}%
}{}
\\renewenvironment{part}[1][\\alph{partCounter}]{%
    \\addtocounter{partCounter}{1}%
    \\vspace{.10in}%
    \\begin{indented}%
       {\\bf (#1)} %
}{\end{indented}}

\\newcommand{\myname}{Dominic Zirbel}
\\newcommand{\mytitle}{Metabolism Fun}
\\newcommand{\mydate}{""" + date_str + """}

\\begin{document}
\\thispagestyle{plain}

\\begin{center}
{\Large \mytitle} \\\\
\myname \\\\
\mydate
\end{center}
\\begingroup
\\fontsize{6pt}{8pt}\\selectfont
"""
footer = """\\endgroup
\\end{document}"""

def export_file(filename, destination):
    file = open(filename)
    contents = file.read()
    destination.write("\\begin{question}{" + filename + "}\n\\begin{verbatim}\n")
    destination.write(contents)
    destination.write("\\end{verbatim}\n\\end{question}\n")

output = open('src-' + date_str + '.tex', 'w+')
output.write(header)

paths = ('js', 'sass', 'protected/components', 'protected/config',
         'protected/controllers', 'protected/models', 'protected/views')
for path, dirs, files in itertools.chain.from_iterable(os.walk(path) for path in paths):
    for file in files:
        export_file(os.path.join(path, file), output)

output.write(footer)