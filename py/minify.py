# -*-coding:utf-8-*-

import os
import re
import subprocess
import logging


class Minify(object):
    logger = None

    def __init__(self):
        self.setup_logging()
        self.root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))

    def setup_logging(self):
        logging.basicConfig(level=logging.INFO, format='[%(asctime)s] %(message)s', datefmt='%H:%M:%S')
        self.logger = logging.getLogger(__name__)

    def build(self):
        self.minify_js_files_with_grunt()
        minified_index = self.build_minified_index()
        self.write_minified_file(minified_index)
        self.logger.info('Done.')

    def minify_js_files_with_grunt(self):
        self.logger.info('Minifying js files with grunt')
        os.chdir(self.root_dir)
        subprocess.call('npm install', shell=True)
        subprocess.call('grunt uglify:build', shell=True)
        subprocess.call('grunt concat:build', shell=True)

    def build_minified_index(self):
        self.logger.info('Concatenating all files into "minified.html"')
        index = open(os.path.join(self.root_dir, 'index.html'), 'r').read()
        css = open(os.path.join(self.root_dir, 'css', 'style.css'), 'r').read()

        minified_index = re.sub(r'<link rel="stylesheet" href="css/style.css" />',
                                r'<style>{}</style>'.format(css),
                                index)

        minified_index = self.replace_all_scripts(minified_index)
        minified_index = re.sub(r' ?([=(){}:<>;,!+-]|/>) ?', r'\1', minified_index)
        minified_index = re.sub(r'\n\s*', r'', minified_index)
        return minified_index

    def replace_all_scripts(self, minified_index):
        js_files = os.listdir(os.path.join(self.root_dir, 'js'))
        grunt_concat_all = open(os.path.join(self.root_dir, 'build', 'grunt-concat-all.js'), 'r').read()

        minified_index = re.sub(r'<script src="js/main.js"></script>',
                                r'<script>{}</script>'.format(grunt_concat_all),
                                minified_index)

        for js_file in js_files:
            minified_index = re.sub(r'<script src="js/{}"></script>'.format(js_file), '', minified_index)

        return minified_index

    def write_minified_file(self, minified_index):
        minified_path = os.path.join(self.root_dir, 'minified.html')
        minified_file = open(minified_path, 'w')
        minified_file.write(minified_index)
        minified_file.close()


if __name__ == '__main__':
    Minify().build()
