import url from "node:url";
import path from "node:path";

import { info, Config, Context } from "../lib/index.mjs";

const DIR = path.dirname(
  new url.URL(import.meta.url).pathname.replace(
    /^\//,
    path === path.win32 ? "" : "/"
  )
);

const example = async () => {
  const config = await Config.create({
    config: [path.resolve(DIR, "config1.yml")],
  });
  const context = new Context(config);
  info(context);
};

example().catch(console.error);
