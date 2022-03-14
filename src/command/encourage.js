"use strict";

const process = require("process");
const chalk = require("chalk");
const readline = require("readline");

module.exports = () => {
  const outStream = process.stdout;
  const rl = readline.createInterface({
    input: process.stdin,
    output: outStream,
  });
  const textArr = [
    "2022",
    "辞旧",
    "2023",
    "迎新",
    "新的一年",
    "加油写作",
    "Fight",
    "Together！",
  ];
  const randomPos = () => {
    const x = Math.floor(30 * Math.random());
    const y = Math.floor(30 * Math.random());
    return [x, y];
  };
  const randomTextStyle = (text) => {
    const styles = [
      "redBright",
      "yellowBright",
      "blueBright",
      "cyanBright",
      "greenBright",
      "magentaBright",
      "whiteBright",
    ];
    const color = styles[Math.floor(Math.random() * styles.length)];
    return chalk[color](text);
  };
  const delay = (time) => {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, time);
    });
  };
  setTimeout(async () => {
    for (let i = 0; i < textArr.length; i++) {
      readline.cursorTo(outStream, ...randomPos());
      rl.write(randomTextStyle(textArr[i]));

      await delay(1000);
      readline.cursorTo(outStream, 0, 0);
      readline.clearScreenDown(outStream);
    }
  }, 1000);
};
