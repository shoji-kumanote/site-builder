var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/filters/thru.ts
var thru_exports = {};
__export(thru_exports, {
  thru: () => thru
});
var thru;
var init_thru = __esm({
  "src/filters/thru.ts"() {
    thru = async (transit) => transit;
  }
});

// src/filters/smarty.ts
var smarty_exports = {};
__export(smarty_exports, {
  smarty: () => smarty
});
var smarty;
var init_smarty = __esm({
  "src/filters/smarty.ts"() {
    smarty = async (transit) => transit.update(`{literal}${transit.data}{/literal}`);
  }
});

// src/filters/hbsTransform.ts
var hbsTransform_exports = {};
__export(hbsTransform_exports, {
  hbsTransform: () => hbsTransform
});
import fs2 from "fs";
import path2 from "path";
var findFile, create, hbsTransform;
var init_hbsTransform = __esm({
  "src/filters/hbsTransform.ts"() {
    findFile = (baseDir, file) => {
      const filePath = path2.resolve(baseDir, file);
      const dirName = path2.dirname(filePath);
      const baseName = path2.basename(filePath);
      const targets = [filePath];
      if (!/\.hbs$/.test(baseName)) {
        targets.push(`${filePath}.hbs`);
      }
      if (!/\.tpl$/.test(baseName)) {
        targets.push(`${filePath}.tpl`);
      }
      if (!/\.html$/.test(baseName)) {
        targets.push(`${filePath}.html`);
      }
      if (!/^_/.test(baseName)) {
        targets.push(path2.resolve(dirName, `_${baseName}`));
        if (!/\.hbs$/.test(baseName)) {
          targets.push(path2.resolve(dirName, `_${baseName}.hbs`));
        }
        if (!/\.tpl$/.test(baseName)) {
          targets.push(path2.resolve(dirName, `_${baseName}.tpl`));
        }
        if (!/\.html$/.test(baseName)) {
          targets.push(path2.resolve(dirName, `_${baseName}.html`));
        }
      }
      for (const target of targets) {
        if (fs2.existsSync(target))
          return target;
      }
      throw new Error(`include file not found: ${file}`);
    };
    create = async (transit, context) => {
      const handlebars = await import("handlebars");
      const hbs = handlebars.default.create();
      const apply = (file, currentData, hbsContext, include) => {
        const baseFilePath = hbsContext.data.root.__file__;
        const includeFilePath = findFile(path2.dirname(baseFilePath), file);
        context.dependency.add(transit.srcFilePath, includeFilePath);
        const src = fs2.readFileSync(includeFilePath, "utf-8").trim();
        if (!include)
          return src;
        const compiled = hbs.compile(src);
        return compiled(currentData);
      };
      hbs.registerHelper("include", function includeHelper(file, hbsContext) {
        return new handlebars.default.SafeString(apply(file, this, hbsContext, true));
      });
      hbs.registerHelper("insert", function insertHelper(file, hbsContext) {
        return new handlebars.default.SafeString(apply(file, this, hbsContext, false));
      });
      return hbs;
    };
    hbsTransform = async (transit, context) => {
      try {
        const hbs = await create(transit, context);
        const compiled = hbs.compile(transit.data);
        const result = compiled(__spreadProps(__spreadValues({}, context.config.getData(transit.srcFilePath)), {
          __file__: transit.srcFilePath
        }));
        context.dependency.commit();
        return transit.update(result, void 0);
      } catch (e) {
        context.dependency.rollback();
        throw e;
      }
    };
  }
});

// src/util/addDocType.ts
var addDocType;
var init_addDocType = __esm({
  "src/util/addDocType.ts"() {
    addDocType = (data, docType = "<!DOCTYPE html>") => `${docType}
${data.replace(/^\s*<!doctype html[^>]*>\s*/im, "")}`;
  }
});

// src/util/getDefaultPrettierConfig.ts
var getDefaultPrettierConfig;
var init_getDefaultPrettierConfig = __esm({
  "src/util/getDefaultPrettierConfig.ts"() {
    getDefaultPrettierConfig = () => ({
      endOfLine: "lf",
      htmlWhitespaceSensitivity: "css",
      printWidth: 80,
      semi: true,
      singleQuote: false,
      tabWidth: 2,
      trailingComma: "none",
      useTabs: false
    });
  }
});

// src/filters/htmlFormat.ts
var htmlFormat_exports = {};
__export(htmlFormat_exports, {
  htmlFormat: () => htmlFormat
});
var htmlFormat;
var init_htmlFormat = __esm({
  "src/filters/htmlFormat.ts"() {
    init_addDocType();
    init_getDefaultPrettierConfig();
    htmlFormat = async (transit, context) => {
      if (context.config.dev)
        return transit;
      const prettier = await import("prettier");
      const config = await prettier.default.resolveConfig(transit.srcFilePath) ?? getDefaultPrettierConfig();
      return transit.update(addDocType(prettier.default.format(transit.data, __spreadProps(__spreadValues({
        printWidth: 150
      }, config), {
        parser: "glimmer"
      }))));
    };
  }
});

// src/filters/cssOptimize.ts
var cssOptimize_exports = {};
__export(cssOptimize_exports, {
  cssOptimize: () => cssOptimize
});
var cssOptimize;
var init_cssOptimize = __esm({
  "src/filters/cssOptimize.ts"() {
    cssOptimize = async (transit, context) => {
      if (context.config.dev)
        return transit;
      const postcss = await import("postcss");
      const autoprefixer = await import("autoprefixer");
      const mqpacker = await import("css-mqpacker");
      const sorting = await import("postcss-sorting");
      const { css, map } = postcss.default([
        autoprefixer.default(),
        mqpacker.default(),
        sorting.default({
          "properties-order": "alphabetical"
        })
      ]).process(transit.data, {
        from: transit.srcFileName,
        to: transit.distFileName,
        map: {
          inline: false,
          prev: transit.sourceMap ?? false
        }
      });
      return transit.update(css, (map == null ? void 0 : map.toString()) ?? void 0);
    };
  }
});

// src/filters/cssFormat.ts
var cssFormat_exports = {};
__export(cssFormat_exports, {
  cssFormat: () => cssFormat
});
var cssFormat;
var init_cssFormat = __esm({
  "src/filters/cssFormat.ts"() {
    init_getDefaultPrettierConfig();
    cssFormat = async (transit, context) => {
      if (context.config.dev)
        return transit;
      const prettier = await import("prettier");
      const config = await prettier.default.resolveConfig(transit.srcFilePath) ?? getDefaultPrettierConfig();
      const result = prettier.default.format(transit.data, __spreadProps(__spreadValues({}, config), {
        parser: "css"
      }));
      return transit.update(result, transit.sourceMap);
    };
  }
});

// src/filters/cssMinify.ts
var cssMinify_exports = {};
__export(cssMinify_exports, {
  cssMinify: () => cssMinify
});
import path3 from "path";
import url from "url";
var cssMinify;
var init_cssMinify = __esm({
  "src/filters/cssMinify.ts"() {
    cssMinify = async (transit, context) => {
      if (context.config.dev)
        return transit;
      const postcss = await import("postcss");
      const csso = await import("postcss-csso");
      const { css, map } = postcss.default([csso.default({ restructure: false })]).process(transit.data, {
        from: transit.srcFileName,
        to: transit.distFileName,
        map: {
          inline: false,
          prev: transit.sourceMap ?? false
        }
      });
      if (!map) {
        return transit.update(css, void 0);
      }
      const mapJSON = map.toJSON();
      mapJSON.sources = mapJSON.sources.map((x) => {
        if (/^file/.test(x)) {
          return path3.relative(path3.dirname(transit.srcFilePath), new url.URL(x).pathname);
        }
        return x;
      });
      return transit.update(css, JSON.stringify(mapJSON));
    };
  }
});

// src/filters/sassCompile.ts
var sassCompile_exports = {};
__export(sassCompile_exports, {
  sassCompile: () => sassCompile
});
import path4 from "path";
var sassCompile;
var init_sassCompile = __esm({
  "src/filters/sassCompile.ts"() {
    sassCompile = async (transit, context) => {
      const sass = await import("sass");
      const result = await sass.default.compileStringAsync(transit.data, {
        syntax: /sass$/.test(transit.srcFileName) ? "indented" : "scss",
        loadPaths: [path4.dirname(transit.srcFilePath)],
        sourceMap: true,
        sourceMapIncludeSources: true
      });
      context.dependency.add(transit.srcFilePath, ...result.loadedUrls.map((x) => x.pathname));
      const next = transit.update(result.css, result.sourceMap ? JSON.stringify(result.sourceMap) : void 0);
      return next;
    };
  }
});

// src/filters/jsOptimize.ts
var jsOptimize_exports = {};
__export(jsOptimize_exports, {
  jsOptimize: () => jsOptimize
});
var transpile, jsOptimize;
var init_jsOptimize = __esm({
  "src/filters/jsOptimize.ts"() {
    transpile = async (transit) => {
      const babel = await import("@babel/core");
      const env = (await import("@babel/preset-env")).default;
      return new Promise((resolve, reject) => {
        const options2 = {
          comments: false,
          presets: [env]
        };
        if (transit.sourceMap !== null && transit.sourceMap !== void 0) {
          options2.inputSourceMap = JSON.parse(transit.sourceMap);
        } else {
          options2.sourceMaps = true;
          options2.sourceFileName = transit.srcFileName;
        }
        babel.transform(transit.data, options2, (err, result) => {
          if (err) {
            reject(err);
          } else if (result === null) {
            reject(new Error("unknown babel error"));
          } else {
            resolve(result);
          }
        });
      });
    };
    jsOptimize = async (transit, context) => {
      if (context.config.dev)
        return transit;
      const result = await transpile(transit);
      if (result.map === null || result.map === void 0) {
        return transit.update(result.code ?? "", void 0);
      }
      return transit.update(result.code ?? "", JSON.stringify(result.map));
    };
  }
});

// src/filters/jsFormat.ts
var jsFormat_exports = {};
__export(jsFormat_exports, {
  jsFormat: () => jsFormat
});
var jsFormat;
var init_jsFormat = __esm({
  "src/filters/jsFormat.ts"() {
    init_getDefaultPrettierConfig();
    jsFormat = async (transit, context) => {
      if (context.config.dev)
        return transit;
      const prettier = await import("prettier");
      const config = await prettier.default.resolveConfig(transit.srcFilePath) ?? getDefaultPrettierConfig();
      const result = prettier.default.format(transit.data, __spreadProps(__spreadValues({}, config), {
        parser: "babel"
      }));
      return transit.update(result, transit.sourceMap);
    };
  }
});

// src/filters/jsMinify.ts
var jsMinify_exports = {};
__export(jsMinify_exports, {
  jsMinify: () => jsMinify
});
var getSourceMap, jsMinify;
var init_jsMinify = __esm({
  "src/filters/jsMinify.ts"() {
    getSourceMap = (result) => {
      if (result.map === void 0 || typeof result.map === "string") {
        return result.map;
      }
      return JSON.stringify(result.map);
    };
    jsMinify = async (transit, context) => {
      if (context.config.dev)
        return transit;
      const terser = await import("terser");
      const result = await terser.minify(transit.data, {
        sourceMap: {
          content: transit.sourceMap
        }
      });
      return transit.update(result.code ?? "", getSourceMap(result));
    };
  }
});

// src/util/getEsBuildResult.ts
import path5 from "path";
var getEsBuildResult;
var init_getEsBuildResult = __esm({
  "src/util/getEsBuildResult.ts"() {
    getEsBuildResult = (esBuildResult, srcDirPath) => {
      var _a;
      const result = [
        "",
        void 0,
        Object.keys(((_a = esBuildResult.metafile) == null ? void 0 : _a.inputs) ?? {}).map((x) => path5.resolve(srcDirPath, path5.relative(srcDirPath, x)))
      ];
      for (const file of esBuildResult.outputFiles) {
        if (/\.map$/.test(file.path)) {
          result[1] = file.text;
        } else {
          result[0] = file.text;
        }
      }
      return result;
    };
  }
});

// src/filters/mjsBundle.ts
var mjsBundle_exports = {};
__export(mjsBundle_exports, {
  mjsBundle: () => mjsBundle
});
var mjsBundle;
var init_mjsBundle = __esm({
  "src/filters/mjsBundle.ts"() {
    init_getEsBuildResult();
    mjsBundle = async (transit, context) => {
      const esbuild = await import("esbuild");
      const result = await esbuild.build({
        bundle: true,
        entryPoints: [transit.srcFilePath],
        splitting: false,
        sourcemap: "external",
        write: false,
        outdir: "out",
        metafile: true
      });
      const [data, sourceMap, deps] = getEsBuildResult(result, context.config.base);
      context.dependency.add(transit.srcFilePath, ...deps);
      return transit.update(data, sourceMap);
    };
  }
});

// src/filters/tsBundle.ts
var tsBundle_exports = {};
__export(tsBundle_exports, {
  tsBundle: () => tsBundle
});
var tsBundle;
var init_tsBundle = __esm({
  "src/filters/tsBundle.ts"() {
    init_getEsBuildResult();
    tsBundle = async (transit, context) => {
      const esbuild = await import("esbuild");
      const result = await esbuild.build({
        bundle: true,
        entryPoints: [transit.srcFilePath],
        splitting: false,
        sourcemap: "external",
        write: false,
        outdir: "out",
        metafile: true
      });
      const [data, sourceMap, deps] = getEsBuildResult(result, context.config.base);
      context.dependency.add(transit.srcFilePath, ...deps);
      return transit.update(data, sourceMap);
    };
  }
});

// src/filters/jpegOptimize.ts
var jpegOptimize_exports = {};
__export(jpegOptimize_exports, {
  jpegOptimize: () => jpegOptimize
});
import { execFile } from "child_process";
import { promisify } from "util";
var jpegOptimize;
var init_jpegOptimize = __esm({
  "src/filters/jpegOptimize.ts"() {
    jpegOptimize = async (transit, context) => {
      if (context.config.dev) {
        await context.file.copy(transit.srcFilePath, transit.distFilePath);
        return transit;
      }
      const jpegTran = await import("jpegtran-bin");
      if (transit.distFilePath === void 0) {
        throw new Error(`distFilePath not set`);
      }
      await context.file.prepareWrite(transit.distFilePath, true);
      await promisify(execFile)(jpegTran.default, [
        "-progressive",
        "-optimize",
        "-outfile",
        transit.distFilePath,
        transit.srcFilePath
      ]);
      return transit;
    };
  }
});

// src/filters/pngOptimize.ts
var pngOptimize_exports = {};
__export(pngOptimize_exports, {
  pngOptimize: () => pngOptimize
});
import { execFile as execFile2 } from "child_process";
import { promisify as promisify2 } from "util";
var pngOptimize;
var init_pngOptimize = __esm({
  "src/filters/pngOptimize.ts"() {
    pngOptimize = async (transit, context) => {
      if (context.config.dev) {
        await context.file.copy(transit.srcFilePath, transit.distFilePath);
        return transit;
      }
      const optipng = await import("optipng-bin");
      if (transit.distFilePath === void 0) {
        throw new Error(`distFilePath not set`);
      }
      await context.file.prepareWrite(transit.distFilePath, true);
      await promisify2(execFile2)(optipng.default, [
        "-clobber",
        "-i",
        "1",
        "-out",
        transit.distFilePath,
        transit.srcFilePath
      ]);
      return transit;
    };
  }
});

// src/filters/gifOptimize.ts
var gifOptimize_exports = {};
__export(gifOptimize_exports, {
  gifOptimize: () => gifOptimize
});
import { execFile as execFile3 } from "child_process";
import { promisify as promisify3 } from "util";
var gifOptimize;
var init_gifOptimize = __esm({
  "src/filters/gifOptimize.ts"() {
    gifOptimize = async (transit, context) => {
      if (context.config.dev) {
        await context.file.copy(transit.srcFilePath, transit.distFilePath);
        return transit;
      }
      const gifsicle = await import("gifsicle");
      if (transit.distFilePath === void 0) {
        throw new Error(`distFilePath not set`);
      }
      await context.file.prepareWrite(transit.distFilePath, true);
      await promisify3(execFile3)(gifsicle.default, [
        "--interlace",
        "--output",
        transit.distFilePath,
        transit.srcFilePath
      ]);
      return transit;
    };
  }
});

// src/filters/svgOptimize.ts
var svgOptimize_exports = {};
__export(svgOptimize_exports, {
  svgOptimize: () => svgOptimize
});
var removeViewBox, removeAttrs, options, svgOptimize;
var init_svgOptimize = __esm({
  "src/filters/svgOptimize.ts"() {
    removeViewBox = {
      name: "removeViewBox",
      active: false
    };
    removeAttrs = {
      name: "removeAttrs",
      params: {
        attrs: ["data-.*", "id"]
      }
    };
    options = {
      plugins: [removeViewBox, removeAttrs]
    };
    svgOptimize = async (transit, context) => {
      if (context.config.dev)
        return transit;
      const svgo = await import("svgo");
      const result = svgo.optimize(transit.data, options);
      if (!("data" in result)) {
        context.logger.fileFailure("svg", transit.srcFilePath, result.error);
        return transit;
      }
      return transit.update(result.data.toString());
    };
  }
});

// src/index.ts
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

// src/util/buildEntry.ts
import path7 from "path";

// src/modules/Transit.ts
import fs from "fs";
import path from "path";
var Transit = class {
  data;
  sourceMap;
  entryPath;
  srcFilePath;
  srcFileName;
  distFilePath;
  distFileName;
  constructor(data, sourceMap, entryPath, srcFilePath, srcFileName, distFilePath, distFileName) {
    this.data = data;
    this.sourceMap = sourceMap;
    this.entryPath = entryPath;
    this.srcFilePath = srcFilePath;
    this.srcFileName = srcFileName;
    this.distFilePath = distFilePath;
    this.distFileName = distFileName;
  }
  static async create(entryPath, srcFilePath, distFilePath) {
    const transit = new Transit(await fs.promises.readFile(srcFilePath, "utf-8"), void 0, entryPath, srcFilePath, path.basename(srcFilePath), distFilePath, distFilePath === void 0 ? void 0 : path.basename(distFilePath));
    return transit;
  }
  update(data, sourceMap) {
    return new Transit(data, sourceMap, this.entryPath, this.srcFilePath, this.srcFileName, this.distFilePath, this.distFileName);
  }
};

// src/util/applyWorkFlow.ts
import path6 from "path";

// src/modules/FilterType.ts
var FILTER_TYPES = {
  thru: "thru",
  smarty: "smarty",
  hbsTransform: "hbsTransform",
  htmlFormat: "htmlFormat",
  cssOptimize: "cssOptimize",
  cssFormat: "cssFormat",
  cssMinify: "cssMinify",
  sassCompile: "sassCompile",
  jsOptimize: "jsOptimize",
  jsFormat: "jsFormat",
  jsMinify: "jsMinify",
  mjsBundle: "mjsBundle",
  tsBundle: "tsBundle",
  jpegOptimize: "jpegOptimize",
  pngOptimize: "pngOptimize",
  gifOptimize: "gifOptimize",
  svgOptimize: "svgOptimize"
};
var getFilterType = (value) => {
  if (value in FILTER_TYPES)
    return value;
  throw new Error(`\u30D5\u30A3\u30EB\u30BF\u7A2E\u5225: ${value} \u306F\u5B58\u5728\u3057\u307E\u305B\u3093`);
};

// src/filters/getFilter.ts
var getFilter = async (filterType) => {
  switch (filterType) {
    case FILTER_TYPES.thru:
      return (await Promise.resolve().then(() => (init_thru(), thru_exports))).thru;
    case FILTER_TYPES.smarty:
      return (await Promise.resolve().then(() => (init_smarty(), smarty_exports))).smarty;
    case FILTER_TYPES.hbsTransform:
      return (await Promise.resolve().then(() => (init_hbsTransform(), hbsTransform_exports))).hbsTransform;
    case FILTER_TYPES.htmlFormat:
      return (await Promise.resolve().then(() => (init_htmlFormat(), htmlFormat_exports))).htmlFormat;
    case FILTER_TYPES.cssOptimize:
      return (await Promise.resolve().then(() => (init_cssOptimize(), cssOptimize_exports))).cssOptimize;
    case FILTER_TYPES.cssFormat:
      return (await Promise.resolve().then(() => (init_cssFormat(), cssFormat_exports))).cssFormat;
    case FILTER_TYPES.cssMinify:
      return (await Promise.resolve().then(() => (init_cssMinify(), cssMinify_exports))).cssMinify;
    case FILTER_TYPES.sassCompile:
      return (await Promise.resolve().then(() => (init_sassCompile(), sassCompile_exports))).sassCompile;
    case FILTER_TYPES.jsOptimize:
      return (await Promise.resolve().then(() => (init_jsOptimize(), jsOptimize_exports))).jsOptimize;
    case FILTER_TYPES.jsFormat:
      return (await Promise.resolve().then(() => (init_jsFormat(), jsFormat_exports))).jsFormat;
    case FILTER_TYPES.jsMinify:
      return (await Promise.resolve().then(() => (init_jsMinify(), jsMinify_exports))).jsMinify;
    case FILTER_TYPES.mjsBundle:
      return (await Promise.resolve().then(() => (init_mjsBundle(), mjsBundle_exports))).mjsBundle;
    case FILTER_TYPES.tsBundle:
      return (await Promise.resolve().then(() => (init_tsBundle(), tsBundle_exports))).tsBundle;
    case FILTER_TYPES.jpegOptimize:
      return (await Promise.resolve().then(() => (init_jpegOptimize(), jpegOptimize_exports))).jpegOptimize;
    case FILTER_TYPES.pngOptimize:
      return (await Promise.resolve().then(() => (init_pngOptimize(), pngOptimize_exports))).pngOptimize;
    case FILTER_TYPES.gifOptimize:
      return (await Promise.resolve().then(() => (init_gifOptimize(), gifOptimize_exports))).gifOptimize;
    case FILTER_TYPES.svgOptimize:
      return (await Promise.resolve().then(() => (init_svgOptimize(), svgOptimize_exports))).svgOptimize;
    default:
      return (await Promise.resolve().then(() => (init_thru(), thru_exports))).thru;
  }
};

// src/util/annotateSourceMap.ts
var annotateSourceMap = (data, sourceMapFileName) => {
  const removed = data.replace(/\s*\/\*# sourceMappingURL.*?\*\/\s*/gm, "").trim();
  if (sourceMapFileName === void 0)
    return removed;
  return `${removed}
/*# sourceMappingURL=${sourceMapFileName} */`;
};

// src/util/applyWorkFlow.ts
var applyWorkFlow = async (workFlow, transit, context) => {
  const filter = await getFilter(workFlow.filterType);
  context.logger.begin();
  context.logger.filterType(workFlow.filterType);
  try {
    if (workFlow.binary) {
      await filter(transit, context);
      context.logger.begin();
      context.logger.fileSuccess("write", transit.distFilePath ?? "");
      context.logger.end();
      context.logger.info();
    } else {
      const result = await filter(transit, context);
      if (workFlow.next.length === 0) {
        context.logger.begin();
        if (workFlow.sourceMap && result.sourceMap) {
          await context.file.write(path6.resolve(context.config.dist, workFlow.distPath), annotateSourceMap(result.data, `${path6.basename(workFlow.distPath)}.map`));
          await context.file.write(path6.resolve(context.config.dist, `${workFlow.distPath}.map`), result.sourceMap);
        } else {
          await context.file.write(path6.resolve(context.config.dist, workFlow.distPath), annotateSourceMap(result.data));
        }
        context.logger.end();
        context.logger.info();
      } else {
        for (const next of workFlow.next) {
          await applyWorkFlow(next, result, context);
        }
      }
    }
  } catch (e) {
    context.logger.fileFailure("", transit.srcFilePath, e);
  }
  context.logger.end();
};

// src/util/buildEntry.ts
var buildEntry = async (context, entry) => {
  const distPath = entry.getPrimaryDistPath();
  const transit = await Transit.create(entry.entryPath, entry.srcFilePath, distPath === void 0 ? void 0 : path7.resolve(context.config.dist, distPath));
  context.logger.entry(entry);
  for (const workFlow of entry.getWorkFlows()) {
    await applyWorkFlow(workFlow, transit, context);
  }
};

// src/commands/build.ts
var build = async (context) => {
  const { logger } = context;
  logger.banner("build", "blue");
  const entries = await context.getEntries();
  for (const entry of entries) {
    await buildEntry(context, entry);
  }
  context.dependency.dump(context.logger);
};

// src/commands/clean.ts
import path8 from "path";
var clean = async (context) => {
  const { logger, config } = context;
  logger.banner("clean", "blue");
  const entries = await context.getEntries();
  const files = entries.reduce((prev, x) => [...prev, ...x.getDistPaths(true)], []).map((x) => path8.resolve(config.dist, x));
  await Promise.all(files.map((x) => context.file.unlink(x)));
  await context.file.removeEmptyDirs(context.config.dist);
};

// src/commands/info.ts
var info = async (context) => {
  const { logger, config } = context;
  logger.banner("info", "blue");
  logger.banner("cli option");
  logger.info({
    config: config.config,
    dryRun: config.dryRun,
    dev: config.dev
  });
  logger.banner("config");
  logger.info({
    base: config.base,
    dist: config.dist,
    src: config.src,
    vendor: config.vendor,
    ignore: config.ignore
  });
  logger.banner("page data");
  logger.info(config.getData());
  logger.banner("entries");
  const entries = await context.getEntries();
  const showWorkFlowInfo = (workFlow) => {
    if (workFlow.next.length > 0) {
      logger.filterType(workFlow.filterType);
      for (const x of workFlow.next) {
        logger.begin();
        showWorkFlowInfo(x);
        logger.end();
      }
    } else {
      logger.filterType(workFlow.filterType, workFlow.distPath);
      if (workFlow.sourceMap) {
        logger.filterType(workFlow.filterType, `${workFlow.distPath}.map`);
      }
    }
  };
  for (const entry of entries) {
    const workFlows = entry.getWorkFlows();
    if (workFlows.length > 0) {
      logger.entry(entry);
      for (const workFlow of workFlows) {
        logger.begin();
        showWorkFlowInfo(workFlow);
        logger.end();
      }
    } else {
      logger.entry(entry, "dim");
    }
    logger.info("");
  }
};

// src/commands/watch.ts
import path11 from "path";

// src/modules/EntryType.ts
import path9 from "path";
import micromatch from "micromatch";
var ENTRY_TYPES = {
  vendorCss: "vendorCss",
  vendorFile: "vendorFile",
  sassLib: "sassLib",
  hbsLib: "hbsLib",
  mjsLib: "mjsLib",
  tsLib: "tsLib",
  css: "css",
  sass: "sass",
  hbs: "hbs",
  html: "html",
  js: "js",
  mjs: "mjs",
  ts: "ts",
  jpeg: "jpeg",
  png: "png",
  gif: "gif",
  svg: "svg",
  file: "file"
};
var getEntryType = (vendor, filePath) => {
  const extName = path9.extname(filePath);
  const lib = /^_/.test(path9.basename(filePath));
  if (micromatch([filePath], vendor).length === 1) {
    return extName === ".css" ? ENTRY_TYPES.vendorCss : ENTRY_TYPES.vendorFile;
  }
  switch (extName) {
    case ".css":
      return ENTRY_TYPES.css;
    case ".sass":
    case ".scss":
      return lib ? ENTRY_TYPES.sassLib : ENTRY_TYPES.sass;
    case ".hbs":
    case ".tpl":
      return lib ? ENTRY_TYPES.hbsLib : ENTRY_TYPES.hbs;
    case ".html":
      return lib ? ENTRY_TYPES.hbsLib : ENTRY_TYPES.html;
    case ".js":
      return ENTRY_TYPES.js;
    case ".mjs":
      return lib ? ENTRY_TYPES.mjsLib : ENTRY_TYPES.mjs;
    case ".ts":
      return lib ? ENTRY_TYPES.tsLib : ENTRY_TYPES.ts;
    case ".jpeg":
    case ".jpg":
      return ENTRY_TYPES.jpeg;
    case ".png":
      return ENTRY_TYPES.png;
    case ".gif":
      return ENTRY_TYPES.gif;
    case ".svg":
      return ENTRY_TYPES.svg;
    default:
      return ENTRY_TYPES.file;
  }
};

// src/util/buildFile.ts
var buildFile = async (context, filePath) => {
  const entry = context.getEntry(filePath);
  if (entry === void 0)
    return;
  switch (entry.entryType) {
    case ENTRY_TYPES.hbsLib:
    case ENTRY_TYPES.mjsLib:
    case ENTRY_TYPES.sassLib:
    case ENTRY_TYPES.tsLib:
      for (const parentFilePath of context.dependency.getByDepend(filePath)) {
        await buildFile(context, parentFilePath);
      }
      break;
    default:
      await buildEntry(context, entry);
      break;
  }
};

// src/util/unBuildFile.ts
import path10 from "path";
var unBuildFile = async (context, filePath) => {
  const entry = context.getEntry(filePath);
  if (entry === void 0)
    return;
  const distFilePaths = entry.getDistPaths();
  if (distFilePaths.length > 0) {
    for (const distFilePath of distFilePaths) {
      await context.file.unlink(path10.resolve(context.config.dist, distFilePath));
    }
  }
};

// src/commands/watch.ts
var watch = async (context) => {
  const { logger } = context;
  await build(context);
  logger.banner("watch", "blue");
  const chokidar = await import("chokidar");
  const watcher = chokidar.watch([
    ...context.config.src.map((x) => path11.resolve(x, "**", "*")),
    ...context.config.config
  ], {
    atomic: true,
    awaitWriteFinish: {
      stabilityThreshold: 500,
      pollInterval: 100
    },
    useFsEvents: true
  });
  const isConfigFile = (filePath) => context.config.config.includes(filePath);
  watcher.on("ready", () => {
    context.logger.banner("start watching ...", "green");
    context.logger.info();
    watcher.on("add", async (filePath) => {
      context.logger.fileNotice("add", filePath);
      context.logger.begin();
      if (isConfigFile(filePath)) {
      } else {
        await buildFile(context, filePath);
      }
      context.logger.end();
      context.logger.idle();
    });
    watcher.on("change", async (filePath) => {
      context.logger.fileNotice("update", filePath);
      context.logger.begin();
      if (isConfigFile(filePath)) {
        await context.reloadConfig();
        await build(context);
      } else {
        await buildFile(context, filePath);
      }
      context.logger.end();
      context.logger.idle();
    });
    watcher.on("unlink", async (filePath) => {
      context.logger.fileNotice("unlink", filePath);
      context.logger.begin();
      if (isConfigFile(filePath)) {
      } else {
        await unBuildFile(context, filePath);
      }
      context.logger.end();
      context.logger.idle();
    });
  });
};

// src/modules/Config.ts
import path12 from "path";

// src/modules/ConfigFile.ts
import fs3 from "fs";
import jsYaml from "js-yaml";

// src/util/getStringArray.ts
var getStringArray = (value, strict = false) => {
  if (value === void 0)
    return [];
  if (Array.isArray(value)) {
    const array = value.filter((x) => typeof x === "string");
    if (strict && value.length !== array.length) {
      throw new Error("\u914D\u5217\u306B\u6587\u5B57\u5217\u4EE5\u5916\u304C\u542B\u307E\u308C\u3066\u3044\u307E\u3059");
    }
    return array;
  }
  if (typeof value === "string")
    return [value];
  if (strict) {
    throw new Error("\u6587\u5B57\u5217\u307E\u305F\u306F\u6587\u5B57\u5217\u306E\u914D\u5217\u3067\u306F\u3042\u308A\u307E\u305B\u3093");
  }
  return [];
};

// src/util/mergeArray.ts
var mergeArray = (...args) => {
  const result = /* @__PURE__ */ new Set();
  for (const arg of args) {
    for (const x of arg)
      result.add(x);
  }
  return [...result];
};

// src/modules/ConfigFile.ts
var load = async (filePath) => {
  try {
    return jsYaml.load(await fs3.promises.readFile(filePath, "utf8"));
  } catch {
    throw new Error(`\u8A2D\u5B9A\u30D5\u30A1\u30A4\u30EB\u306E\u8AAD\u307F\u8FBC\u307F\u306B\u5931\u6557\u3057\u307E\u3057\u305F: ${filePath}`);
  }
};
var loadConfigFile = async (filePath) => {
  const configFileData = await load(filePath);
  if (typeof configFileData !== "object" || configFileData === null) {
    throw new Error("\u8A2D\u5B9A\u30D5\u30A1\u30A4\u30EB\u306E\u5F62\u5F0F\u304C\u6B63\u3057\u304F\u3042\u308A\u307E\u305B\u3093");
  }
  for (const key of ["base", "dist"]) {
    if (typeof configFileData[key] !== "string") {
      throw new Error(`\u8A2D\u5B9A\u30D5\u30A1\u30A4\u30EB\u306B ${key} \u304C\u306A\u3044\u304B\u3001\u6587\u5B57\u5217\u3067\u306F\u3042\u308A\u307E\u305B\u3093`);
    }
  }
  for (const key of ["src", "vendor", "ignore"]) {
    if (key in configFileData) {
      try {
        getStringArray(configFileData[key], true);
      } catch (e) {
        throw new Error(`\u8A2D\u5B9A\u30D5\u30A1\u30A4\u30EB\u306E ${key} \u304C\u6587\u5B57\u5217\u307E\u305F\u306F\u6587\u5B57\u5217\u306E\u914D\u5217\u3067\u306F\u3042\u308A\u307E\u305B\u3093`);
      }
    }
  }
  let disabled = [];
  if ("disabled" in configFileData) {
    try {
      disabled = getStringArray(configFileData.disabled, true);
    } catch (e) {
      throw new Error(`\u8A2D\u5B9A\u30D5\u30A1\u30A4\u30EB\u306E disabled \u304C\u6587\u5B57\u5217\u307E\u305F\u306F\u6587\u5B57\u5217\u306E\u914D\u5217\u3067\u306F\u3042\u308A\u307E\u305B\u3093`);
    }
    for (const filterType of disabled) {
      if (!(filterType in FILTER_TYPES)) {
        throw new Error(`\u8A2D\u5B9A\u30D5\u30A1\u30A4\u30EB\u306E disabled \u306B\u4E0D\u660E\u306A\u30D5\u30A3\u30EB\u30BF\u7A2E\u5225: ${filterType} \u304C\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u3059`);
      }
    }
  }
  return __spreadProps(__spreadValues({}, configFileData), {
    src: getStringArray(configFileData.src),
    vendor: getStringArray(configFileData.vendor),
    ignore: getStringArray(configFileData.ignore),
    disabled
  });
};
var CHECK_KEYS = ["base", "dist"];
var mergeConfigFile = (...args) => {
  if (args.length === 0)
    throw new Error("\u8A2D\u5B9A\u30D5\u30A1\u30A4\u30EB\u306E\u30C7\u30FC\u30BF\u304C\u3042\u308A\u307E\u305B\u3093");
  if (args.length === 1)
    return args[0];
  const [a, b] = args;
  for (const key of CHECK_KEYS) {
    if (a[key] !== b[key]) {
      throw new Error(`\u8907\u6570\u306E\u8A2D\u5B9A\u30D5\u30A1\u30A4\u30EB\u3092\u4F7F\u7528\u3059\u308B\u5834\u5408, ${key}\u306E\u5024\u306F\u540C\u3058\u3067\u3042\u308B\u5FC5\u8981\u304C\u3042\u308A\u307E\u3059`);
    }
  }
  return mergeConfigFile({
    base: a.base,
    dist: a.dist,
    src: mergeArray(getStringArray(a.src), getStringArray(b.src)),
    vendor: mergeArray(getStringArray(a.vendor), getStringArray(b.vendor)),
    ignore: mergeArray(getStringArray(a.ignore), getStringArray(b.ignore)),
    disabled: mergeArray(getStringArray(a.disabled).map(getFilterType), getStringArray(b.disabled).map(getFilterType)),
    data: __spreadValues(__spreadValues({}, a.data), b.data)
  }, ...args.slice(2));
};

// src/modules/Config.ts
var Config = class {
  #config;
  #src;
  #vendor;
  #ignore;
  #disabled;
  dryRun;
  dev;
  base;
  dist;
  #pageData;
  static async create(cliOption) {
    if (cliOption.config.length === 0) {
      throw new Error("\u8A2D\u5B9A\u30D5\u30A1\u30A4\u30EB\u304C\u6307\u5B9A\u3055\u308C\u3066\u3044\u307E\u305B\u3093");
    }
    const config = cliOption.config.map((x) => path12.resolve(x));
    const allConfigFileData = await Promise.all(config.map((x) => loadConfigFile(x)));
    const configFileData = mergeConfigFile(...allConfigFileData);
    return new Config(__spreadValues(__spreadProps(__spreadValues({}, cliOption), {
      config
    }), configFileData), configFileData.data);
  }
  constructor(data, pageData) {
    this.#config = data.config;
    this.dryRun = data.dryRun;
    this.dev = data.dev;
    this.base = path12.resolve(data.base);
    this.dist = path12.resolve(data.dist);
    this.#src = data.src.map((x) => path12.resolve(x));
    this.#vendor = data.vendor.map((x) => path12.resolve(x));
    this.#ignore = data.ignore.map((x) => path12.resolve(x));
    this.#disabled = data.disabled;
    this.#pageData = pageData;
  }
  get config() {
    return [...this.#config];
  }
  get src() {
    return [...this.#src];
  }
  get vendor() {
    return [...this.#vendor];
  }
  get ignore() {
    return [...this.#ignore];
  }
  get disabled() {
    return [...this.#disabled];
  }
  getData(entryPath) {
    if (typeof entryPath === "string") {
      const specifiedData = this.#pageData[entryPath];
      if (typeof specifiedData === "object") {
        return __spreadValues(__spreadValues({}, this.#pageData), specifiedData);
      }
    }
    return __spreadValues({}, this.#pageData);
  }
};

// src/modules/Context.ts
import { globby } from "globby";
import micromatch2 from "micromatch";

// src/modules/Dependency.ts
var copy = (src, dest) => {
  dest.clear();
  for (const [key, value] of src.entries()) {
    dest.set(key, new Set(value));
  }
};
var Dependency = class {
  #map = /* @__PURE__ */ new Map();
  #backup = /* @__PURE__ */ new Map();
  beginTransaction() {
    copy(this.#map, this.#backup);
  }
  rollback() {
    copy(this.#backup, this.#map);
  }
  commit() {
  }
  clearAll() {
    this.#map.clear();
  }
  clear(filePath) {
    const entry = this.#map.get(filePath);
    if (entry)
      entry.clear();
  }
  add(filePath, ...dependFilePaths) {
    const entry = this.#map.get(filePath) ?? /* @__PURE__ */ new Set();
    for (const dependFilePath of dependFilePaths) {
      if (filePath !== dependFilePath) {
        entry.add(dependFilePath);
      }
    }
    this.#map.set(filePath, entry);
  }
  getByDepend(dependFilePath) {
    const result = /* @__PURE__ */ new Set();
    for (const [filePath, dependFilePathSet] of this.#map.entries()) {
      if (dependFilePathSet.has(dependFilePath)) {
        result.add(filePath);
      }
    }
    return [...result];
  }
  dump(logger) {
    logger.banner("dependency");
    for (const [a, b] of this.#map.entries()) {
      logger.fileSuccess("", a);
      logger.begin();
      for (const x of b) {
        logger.fileSuccess("", x);
      }
      logger.end();
      logger.info();
    }
  }
};

// src/modules/Entry.ts
import path13 from "path";

// src/util/getCssWorkFlows.ts
var getCssWorkFlows = (entryPath, optimize, minify, format2) => {
  if (optimize) {
    if (minify) {
      if (format2) {
        return [
          {
            distPath: entryPath,
            binary: false,
            sourceMap: true,
            filterType: FILTER_TYPES.cssOptimize,
            next: [
              {
                distPath: entryPath,
                binary: false,
                sourceMap: true,
                filterType: FILTER_TYPES.cssMinify,
                next: []
              },
              {
                distPath: entryPath.replace(/\.css$/, ".orig.css"),
                binary: false,
                sourceMap: false,
                filterType: FILTER_TYPES.cssFormat,
                next: []
              }
            ]
          }
        ];
      }
      return [
        {
          distPath: entryPath,
          binary: false,
          sourceMap: true,
          filterType: FILTER_TYPES.cssOptimize,
          next: [
            {
              distPath: entryPath,
              binary: false,
              sourceMap: true,
              filterType: FILTER_TYPES.cssMinify,
              next: []
            }
          ]
        }
      ];
    }
    if (format2) {
      return [
        {
          distPath: entryPath,
          binary: false,
          sourceMap: true,
          filterType: FILTER_TYPES.cssOptimize,
          next: [
            {
              distPath: entryPath,
              binary: false,
              sourceMap: true,
              filterType: FILTER_TYPES.cssFormat,
              next: []
            }
          ]
        }
      ];
    }
    return [
      {
        distPath: entryPath,
        binary: false,
        sourceMap: true,
        filterType: FILTER_TYPES.cssOptimize,
        next: []
      }
    ];
  }
  if (minify) {
    if (format2) {
      return [
        {
          distPath: entryPath,
          binary: false,
          sourceMap: true,
          filterType: FILTER_TYPES.cssMinify,
          next: []
        },
        {
          distPath: entryPath.replace(/\.css$/, ".orig.css"),
          binary: false,
          sourceMap: false,
          filterType: FILTER_TYPES.cssFormat,
          next: []
        }
      ];
    }
    return [
      {
        distPath: entryPath,
        binary: false,
        sourceMap: true,
        filterType: FILTER_TYPES.cssMinify,
        next: []
      }
    ];
  }
  if (format2) {
    return [
      {
        distPath: entryPath,
        binary: false,
        sourceMap: true,
        filterType: FILTER_TYPES.cssFormat,
        next: []
      }
    ];
  }
  return [
    {
      distPath: entryPath,
      binary: false,
      sourceMap: true,
      filterType: FILTER_TYPES.thru,
      next: []
    }
  ];
};

// src/util/getJsWorkFlows.ts
var getJsWorkFlows = (entryPath, optimize, minify, format2) => {
  if (optimize) {
    if (minify) {
      if (format2) {
        return [
          {
            distPath: entryPath,
            binary: false,
            sourceMap: true,
            filterType: FILTER_TYPES.jsOptimize,
            next: [
              {
                distPath: entryPath,
                binary: false,
                sourceMap: true,
                filterType: FILTER_TYPES.jsMinify,
                next: []
              },
              {
                distPath: entryPath.replace(/\.js$/, ".orig.js"),
                binary: false,
                sourceMap: false,
                filterType: FILTER_TYPES.jsFormat,
                next: []
              }
            ]
          }
        ];
      }
      return [
        {
          distPath: entryPath,
          binary: false,
          sourceMap: true,
          filterType: FILTER_TYPES.jsOptimize,
          next: [
            {
              distPath: entryPath,
              binary: false,
              sourceMap: true,
              filterType: FILTER_TYPES.jsMinify,
              next: []
            }
          ]
        }
      ];
    }
    if (format2) {
      return [
        {
          distPath: entryPath,
          binary: false,
          sourceMap: true,
          filterType: FILTER_TYPES.jsOptimize,
          next: [
            {
              distPath: entryPath,
              binary: false,
              sourceMap: true,
              filterType: FILTER_TYPES.jsFormat,
              next: []
            }
          ]
        }
      ];
    }
    return [
      {
        distPath: entryPath,
        binary: false,
        sourceMap: true,
        filterType: FILTER_TYPES.jsOptimize,
        next: []
      }
    ];
  }
  if (minify) {
    if (format2) {
      return [
        {
          distPath: entryPath,
          binary: false,
          sourceMap: true,
          filterType: FILTER_TYPES.jsMinify,
          next: []
        },
        {
          distPath: entryPath.replace(/\.js$/, ".orig.js"),
          binary: false,
          sourceMap: false,
          filterType: FILTER_TYPES.jsFormat,
          next: []
        }
      ];
    }
    return [
      {
        distPath: entryPath,
        binary: false,
        sourceMap: true,
        filterType: FILTER_TYPES.jsMinify,
        next: []
      }
    ];
  }
  if (format2) {
    return [
      {
        distPath: entryPath,
        binary: false,
        sourceMap: true,
        filterType: FILTER_TYPES.jsFormat,
        next: []
      }
    ];
  }
  return [
    {
      distPath: entryPath,
      binary: false,
      sourceMap: true,
      filterType: FILTER_TYPES.thru,
      next: []
    }
  ];
};

// src/modules/Entry.ts
var Entry = class {
  #disabled;
  entryType;
  srcFilePath;
  entryPath;
  constructor(config, filePath) {
    this.#disabled = config.disabled;
    this.entryType = getEntryType(config.vendor, filePath);
    this.srcFilePath = filePath;
    this.entryPath = path13.relative(config.base, filePath);
  }
  isFilterEnabled(filterType) {
    return !this.#disabled.includes(filterType);
  }
  getWorkFlows() {
    const workFlows = [];
    switch (this.entryType) {
      case ENTRY_TYPES.vendorCss:
        workFlows.push({
          distPath: this.entryPath,
          binary: false,
          sourceMap: false,
          filterType: FILTER_TYPES.thru,
          next: []
        });
        if (this.isFilterEnabled(FILTER_TYPES.smarty)) {
          workFlows.push({
            distPath: `${this.entryPath}.data`,
            binary: false,
            sourceMap: false,
            filterType: FILTER_TYPES.smarty,
            next: []
          });
        }
        return workFlows;
      case ENTRY_TYPES.vendorFile:
        return [
          {
            distPath: this.entryPath,
            binary: false,
            sourceMap: false,
            filterType: FILTER_TYPES.thru,
            next: []
          }
        ];
      case ENTRY_TYPES.sassLib:
      case ENTRY_TYPES.hbsLib:
      case ENTRY_TYPES.mjsLib:
      case ENTRY_TYPES.tsLib:
        return [];
      case ENTRY_TYPES.css:
        return getCssWorkFlows(this.entryPath, this.isFilterEnabled(FILTER_TYPES.cssOptimize), this.isFilterEnabled(FILTER_TYPES.cssMinify), this.isFilterEnabled(FILTER_TYPES.cssFormat));
      case ENTRY_TYPES.sass:
        if (this.isFilterEnabled(FILTER_TYPES.sassCompile)) {
          return [
            {
              distPath: this.entryPath.replace(/\.(sass|scss)$/, ".css"),
              binary: false,
              sourceMap: true,
              filterType: FILTER_TYPES.sassCompile,
              next: getCssWorkFlows(this.entryPath.replace(/\.(sass|scss)$/, ".css"), this.isFilterEnabled(FILTER_TYPES.cssOptimize), this.isFilterEnabled(FILTER_TYPES.cssMinify), this.isFilterEnabled(FILTER_TYPES.cssFormat))
            }
          ];
        }
        return getCssWorkFlows(this.entryPath.replace(/\.(sass|scss)$/, ".css"), this.isFilterEnabled(FILTER_TYPES.cssOptimize), this.isFilterEnabled(FILTER_TYPES.cssMinify), this.isFilterEnabled(FILTER_TYPES.cssFormat));
      case ENTRY_TYPES.hbs:
        if (this.isFilterEnabled(FILTER_TYPES.hbsTransform)) {
          return [
            {
              distPath: this.entryPath.replace(/\.(hbs|tpl)$/, ".html"),
              binary: false,
              sourceMap: false,
              filterType: FILTER_TYPES.hbsTransform,
              next: this.isFilterEnabled(FILTER_TYPES.htmlFormat) ? [
                {
                  distPath: this.entryPath.replace(/\.hbs$/, ".html"),
                  binary: false,
                  sourceMap: false,
                  filterType: FILTER_TYPES.htmlFormat,
                  next: []
                }
              ] : []
            }
          ];
        }
        if (this.isFilterEnabled(FILTER_TYPES.htmlFormat)) {
          return [
            {
              distPath: this.entryPath.replace(/\.(hbs|tpl)$/, ".html"),
              binary: false,
              sourceMap: false,
              filterType: FILTER_TYPES.htmlFormat,
              next: []
            }
          ];
        }
        return [
          {
            distPath: this.entryPath.replace(/\.(hbs|tpl)$/, ".html"),
            binary: false,
            sourceMap: false,
            filterType: FILTER_TYPES.thru,
            next: []
          }
        ];
      case ENTRY_TYPES.html:
        if (this.isFilterEnabled(FILTER_TYPES.htmlFormat)) {
          return [
            {
              distPath: this.entryPath,
              binary: false,
              sourceMap: false,
              filterType: FILTER_TYPES.htmlFormat,
              next: []
            }
          ];
        }
        return [
          {
            distPath: this.entryPath,
            binary: false,
            sourceMap: false,
            filterType: FILTER_TYPES.thru,
            next: []
          }
        ];
      case ENTRY_TYPES.js:
        return getJsWorkFlows(this.entryPath, this.isFilterEnabled(FILTER_TYPES.jsOptimize), this.isFilterEnabled(FILTER_TYPES.jsMinify), this.isFilterEnabled(FILTER_TYPES.jsFormat));
      case ENTRY_TYPES.mjs:
        if (this.isFilterEnabled(FILTER_TYPES.mjsBundle)) {
          return [
            {
              distPath: this.entryPath.replace(/\.mjs$/, ".js"),
              binary: false,
              sourceMap: true,
              filterType: FILTER_TYPES.mjsBundle,
              next: getJsWorkFlows(this.entryPath.replace(/\.mjs$/, ".js"), this.isFilterEnabled(FILTER_TYPES.jsOptimize), this.isFilterEnabled(FILTER_TYPES.jsMinify), this.isFilterEnabled(FILTER_TYPES.jsFormat))
            }
          ];
        }
        return getJsWorkFlows(this.entryPath.replace(/\.mjs$/, ".js"), this.isFilterEnabled(FILTER_TYPES.jsOptimize), this.isFilterEnabled(FILTER_TYPES.jsMinify), this.isFilterEnabled(FILTER_TYPES.jsFormat));
      case ENTRY_TYPES.ts:
        if (this.isFilterEnabled(FILTER_TYPES.tsBundle)) {
          return [
            {
              distPath: this.entryPath.replace(/\.ts$/, ".js"),
              binary: false,
              sourceMap: true,
              filterType: FILTER_TYPES.tsBundle,
              next: getJsWorkFlows(this.entryPath.replace(/\.ts$/, ".js"), this.isFilterEnabled(FILTER_TYPES.jsOptimize), this.isFilterEnabled(FILTER_TYPES.jsMinify), this.isFilterEnabled(FILTER_TYPES.jsFormat))
            }
          ];
        }
        return getJsWorkFlows(this.entryPath.replace(/\.ts$/, ".js"), this.isFilterEnabled(FILTER_TYPES.jsOptimize), this.isFilterEnabled(FILTER_TYPES.jsMinify), this.isFilterEnabled(FILTER_TYPES.jsFormat));
      case ENTRY_TYPES.jpeg:
        return [
          {
            distPath: this.entryPath,
            binary: true,
            sourceMap: false,
            filterType: this.isFilterEnabled(FILTER_TYPES.jpegOptimize) ? FILTER_TYPES.jpegOptimize : FILTER_TYPES.thru,
            next: []
          }
        ];
      case ENTRY_TYPES.png:
        return [
          {
            distPath: this.entryPath,
            binary: true,
            sourceMap: false,
            filterType: this.isFilterEnabled(FILTER_TYPES.pngOptimize) ? FILTER_TYPES.pngOptimize : FILTER_TYPES.thru,
            next: []
          }
        ];
      case ENTRY_TYPES.gif:
        return [
          {
            distPath: this.entryPath,
            binary: true,
            sourceMap: false,
            filterType: this.isFilterEnabled(FILTER_TYPES.gifOptimize) ? FILTER_TYPES.gifOptimize : FILTER_TYPES.thru,
            next: []
          }
        ];
      case ENTRY_TYPES.svg:
        return [
          {
            distPath: this.entryPath,
            binary: false,
            sourceMap: false,
            filterType: this.isFilterEnabled(FILTER_TYPES.svgOptimize) ? FILTER_TYPES.svgOptimize : FILTER_TYPES.thru,
            next: []
          }
        ];
      default:
        return [
          {
            distPath: this.entryPath,
            binary: false,
            sourceMap: false,
            filterType: FILTER_TYPES.thru,
            next: []
          }
        ];
    }
  }
  getPrimaryDistPath() {
    const distPaths1 = [];
    const distPaths2 = [];
    const walk = (workFlowList) => {
      for (const workFlow of workFlowList) {
        if (workFlow.next.length === 0) {
          (workFlow.sourceMap ? distPaths1 : distPaths2).push(workFlow.distPath);
        } else {
          walk(workFlow.next);
        }
      }
    };
    walk(this.getWorkFlows());
    return distPaths1[distPaths1.length - 1] ?? distPaths2[distPaths2.length - 1];
  }
  getDistPaths(includeSourceMap = false) {
    const distPaths = [];
    const walk = (workFlowList) => {
      for (const workFlow of workFlowList) {
        if (workFlow.next.length === 0) {
          distPaths.push(workFlow.distPath);
          if (includeSourceMap && workFlow.sourceMap) {
            distPaths.push(`${workFlow.distPath}.map`);
          }
        } else {
          walk(workFlow.next);
        }
      }
    };
    walk(this.getWorkFlows());
    return distPaths;
  }
};

// src/modules/File.ts
import fs4 from "fs";
import path14 from "path";

// src/util/insertLastNewLine.ts
var insertLastNewLine = (data) => `${data.trim()}
`;

// src/modules/File.ts
var File = class {
  logger;
  dryRun;
  constructor(logger, dryRun) {
    this.logger = logger;
    this.dryRun = dryRun;
  }
  async unlink(filePath) {
    try {
      if (!this.dryRun)
        await fs4.promises.unlink(filePath);
      this.logger.fileSuccess("unlink", filePath);
    } catch (e) {
      if (typeof e === "object" && e !== null && "code" in e && e.code === "ENOENT") {
        this.logger.fileWarning("unlink", filePath, e);
      } else {
        this.logger.fileFailure("unlink", filePath, e);
      }
    }
  }
  async removeDirs(dirPath, first) {
    try {
      if (!(await fs4.promises.stat(dirPath)).isDirectory())
        return;
    } catch (e) {
      this.logger.fileFailure("rmdir", dirPath, e);
      return;
    }
    for (const entry of await fs4.promises.readdir(dirPath)) {
      await this.removeDirs(path14.resolve(dirPath, entry), false);
    }
    if (first)
      return;
    const entries = await fs4.promises.readdir(dirPath);
    if (entries.length === 0) {
      try {
        if (!this.dryRun)
          await fs4.promises.rmdir(dirPath);
        this.logger.fileSuccess("rmdir", dirPath);
      } catch (e) {
        this.logger.fileFailure("rmdir", dirPath, e);
      }
    }
  }
  async removeEmptyDirs(dirPath) {
    await this.removeDirs(dirPath, true);
  }
  async prepareWrite(filePath, withUnlink = false) {
    if (!this.dryRun) {
      await fs4.promises.mkdir(path14.dirname(filePath), { recursive: true });
      if (withUnlink) {
        try {
          await fs4.promises.unlink(filePath);
        } catch {
        }
      }
    }
  }
  async writeText(filePath, data) {
    await this.write(filePath, insertLastNewLine(data));
  }
  async write(filePath, data) {
    await this.prepareWrite(filePath);
    if (!this.dryRun) {
      try {
        await fs4.promises.mkdir(path14.dirname(filePath), { recursive: true });
        await fs4.promises.writeFile(filePath, data);
      } catch (e) {
        this.logger.fileFailure("write", filePath, e);
        return;
      }
    }
    this.logger.fileSuccess("write", filePath);
  }
  async copy(srcFilePath, distFilePath) {
    if (distFilePath === void 0)
      return;
    await this.prepareWrite(distFilePath);
    if (!this.dryRun) {
      try {
        await fs4.promises.copyFile(srcFilePath, distFilePath);
      } catch (e) {
        this.logger.fileFailure("copy", distFilePath, e);
        return;
      }
    }
    this.logger.fileSuccess("copy", distFilePath);
  }
};

// src/modules/Logger.ts
import path15 from "path";
import chalk from "chalk";
import { format } from "date-fns";
import terminalSize from "term-size";
var width = () => terminalSize().columns;
var applyColor = (value, ...colors) => {
  let result = value;
  for (const color of colors) {
    if (typeof color === "string") {
      result = chalk[color](result);
    } else {
      result = applyColor(result, ...color);
    }
  }
  return result;
};
var Logger = class {
  #idleTimer;
  #indent;
  dirs;
  constructor(config) {
    this.#indent = "";
    this.dirs = [
      { name: "BASE", dirPath: config.base },
      { name: "DIST", dirPath: config.dist }
    ];
  }
  begin() {
    this.#indent = `${this.#indent}  `;
  }
  end() {
    this.#indent = this.#indent.slice(2);
  }
  banner(title, ...colors) {
    if (colors.length === 0) {
      this.banner(title, "green");
      return;
    }
    console.info("");
    console.info(applyColor("__", colors, "inverse"), title, applyColor("_".repeat(width() - title.length - 4), colors, "inverse"));
    console.info("");
  }
  idle(timeoutMs = 150) {
    if (this.#idleTimer !== void 0)
      clearTimeout(this.#idleTimer);
    this.#idleTimer = setTimeout(() => {
      this.banner(format(new Date(), "HH:mm:ss"), "gray");
      console.info("");
    }, timeoutMs);
  }
  info(...args) {
    if (this.#indent === "") {
      console.info(...args);
    } else {
      console.info(this.#indent.slice(1), ...args);
    }
  }
  warn(...args) {
    if (this.#indent === "") {
      console.warn(...args);
    } else {
      console.warn(this.#indent.slice(1), ...args);
    }
  }
  error(...args) {
    if (this.#indent === "") {
      console.error(...args);
    } else {
      console.error(this.#indent.slice(1), ...args);
    }
  }
  getFileInfo(filePath) {
    for (const { name, dirPath } of this.dirs) {
      const relPath = path15.relative(dirPath, filePath);
      if (!relPath.includes(".."))
        return { name, relPath };
    }
    return { name: "", relPath: filePath };
  }
  getErrorMessage(error, color) {
    if (typeof error === "object" && error !== null) {
      if ("code" in error) {
        return applyColor(` (${error.code})`, color);
      }
      if ("message" in error) {
        return applyColor(` (${error.message})`, color);
      }
    }
    return "";
  }
  file(label, color, filePath, error = void 0) {
    const { name, relPath } = this.getFileInfo(filePath);
    const formattedLabel = label.length === 0 ? "" : `[${applyColor(label, color)}] `;
    const message = this.getErrorMessage(error, color);
    this.info(`${formattedLabel}${applyColor(`${name}: `, "dim")}${relPath}${message}`);
  }
  fileSuccess(label, filePath, error) {
    this.file(label, ["green"], filePath, error);
  }
  fileNotice(label, filePath, error) {
    this.file(label, ["cyan"], filePath, error);
  }
  fileWarning(label, filePath, error) {
    this.file(label, ["yellow"], filePath, error);
  }
  fileFailure(label, filePath, error) {
    this.file(label, ["red"], filePath, error);
  }
  entry(entry, ...colors) {
    this.info(applyColor("*", "dim"), applyColor(entry.entryPath, colors.length === 0 ? "green" : colors));
  }
  filterType(filterType, distPath) {
    if (distPath === void 0) {
      this.info(applyColor(filterType, "yellow"));
    } else {
      this.info(applyColor(filterType, "yellow"), "-->", applyColor(distPath, "magenta"));
    }
  }
};

// src/modules/Context.ts
var Context = class {
  #config;
  logger;
  file;
  dependency;
  constructor(config) {
    this.#config = config;
    this.logger = new Logger(config);
    this.file = new File(this.logger, config.dryRun);
    this.dependency = new Dependency();
  }
  get config() {
    return this.#config;
  }
  async reloadConfig() {
    this.#config = await Config.create({
      config: this.#config.config,
      dev: this.#config.dev,
      dryRun: this.#config.dryRun
    });
  }
  async getEntries() {
    const filePaths = await globby([...this.config.src, ...this.config.ignore.map((x) => `!${x}`)], { onlyFiles: true });
    return filePaths.map((x) => new Entry(this.#config, x));
  }
  getEntry(filePath) {
    if (micromatch2([filePath], this.config.ignore).length > 0) {
      return void 0;
    }
    return new Entry(this.#config, filePath);
  }
};

// src/index.ts
var main = async () => {
  const argv = await yargs(hideBin(process.argv)).strict(true).locale("en").scriptName("site-builder").usage("$0 [options] -- <command>").help().version().option("config", {
    description: "Set configuration file(s).",
    array: true,
    type: "string",
    alias: "c",
    demandOption: true
  }).option("dry-run", {
    description: "Don't create files.",
    type: "boolean",
    alias: "N",
    default: false
  }).option("dev", {
    description: "Skip time-consuming processes.",
    type: "boolean",
    alias: "D",
    default: false
  }).demandCommand(1, 1, "Command not found.", "").command("info", "Show information.").command("clean", "Remove distributed files.").command("build", "Build all files.").command("watch", "Watch file and process after build.").argv;
  const config = await Config.create(argv);
  const context = new Context(config);
  switch (argv._[0]) {
    case "info":
      await info(context);
      break;
    case "clean":
      await clean(context);
      break;
    case "build":
      await build(context);
      break;
    case "watch":
      await watch(context);
      break;
    default:
  }
};
main().catch(console.error);
