#!/usr/bin/env node
import * as commander from 'commander';
import { translate } from './main';
const program = new commander.Command();
program
    .version('0.0.1', '-v, --vers', 'output the current version')
    .name('translation')
    .usage('<English>')
    .arguments('<English>')
    .action((english) => {
        translate(english);
    });

program.parse(process.argv);
