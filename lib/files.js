import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

function read() {
  return JSON.parse(readFileSync(resolve("database", "news.json"), "utf-8"));
}

function write(data) {
  return writeFileSync(resolve("database", "news.json"), JSON.stringify(data,null,2));
}

export { write, read };
