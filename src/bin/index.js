#!/usr/bin/env node
"use strict";
const { judgeNodeVersion } = require("../scripts/judgeNodeVersion");
const { init } = require("../scripts/init");

judgeNodeVersion();
init();
