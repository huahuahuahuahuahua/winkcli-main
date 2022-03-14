#!/usr/bin/env node

import process from "process";

const inquirer = require("inquirer");
const program = require("commander");
const chalk = require("chalk");
const readline = require("readline");
// const shell = require("shelljs");

// 即用户新输入的参数值和当前已有的参数值
const optionFunc = (newValue: string, preValue) => {
  console.log(newValue, preValue);
};

program.parse(process.argv);
