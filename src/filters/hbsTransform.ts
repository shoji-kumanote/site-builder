import fs from "fs";
import path from "path";

import imageSize from "image-size";

import { Context } from "../modules/Context";
import { Transit } from "../modules/Transit";
import { Filter } from "../types/Filter";

/** タイプ: Handlebarsに渡す共通のデータ */
type HbsData = {
  /** 対象となっているファイル */
  __FILE__: string;
};

/** タイプ: Handlebarsのコンテキスト */
type HbsContext = {
  data: {
    root: HbsData;
  };
};

/**
 * ファイルの特定
 *
 * @param baseDir - ベースディレクトリ
 * @param includeTargetDir - include元のファイルのあるディレクトリ
 * @param file - ファイルの記述
 * @returns ファイルパス
 * @throws ファイルがない場合
 */
const getFilePath = (
  baseDir: string,
  includeTargetDir: string,
  file: string
): string => {
  // 先頭が '/' ならベースディレクトリからの相対に変更
  // そうでなければinclude元のファイルのあるディレクトリからの相対
  const filePath = /^\//.test(file)
    ? path.resolve(baseDir, file.replace(/^\/+/, ""))
    : path.resolve(includeTargetDir, file);

  return filePath;
};

/**
 * includeするファイルの特定
 *
 * @param baseDir - ベースディレクトリ
 * @param includeTargetDir - include元のファイルのあるディレクトリ
 * @param file - ファイルの記述
 * @returns ファイルパス
 * @throws ファイルがない場合
 */
const findFile = (
  baseDir: string,
  includeTargetDir: string,
  file: string
): string => {
  const filePath = getFilePath(baseDir, includeTargetDir, file);
  const dirName = path.dirname(filePath);
  const baseName = path.basename(filePath);
  const targets: string[] = [filePath];

  if (!/\.php.hbs$/.test(baseName)) {
    targets.push(path.resolve(dirName, `_${baseName}.php`));
  }

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
    targets.push(path.resolve(dirName, `_${baseName}`));

    if (!/\.hbs$/.test(baseName)) {
      targets.push(path.resolve(dirName, `_${baseName}.hbs`));
    }

    if (!/\.tpl$/.test(baseName)) {
      targets.push(path.resolve(dirName, `_${baseName}.tpl`));
    }

    if (!/\.html$/.test(baseName)) {
      targets.push(path.resolve(dirName, `_${baseName}.html`));
    }
  }

  for (const target of targets) {
    if (fs.existsSync(target)) return target;
  }

  throw new Error(`include file not found: ${file}`);
};

/**
 * 作業データに特化した Handlebars プロセッサを作成
 *
 * @param transit - 作業データ
 * @returns Handlebars プロセッサ
 */
const create = async (
  transit: Transit,
  context: Context
): Promise<typeof Handlebars> => {
  const handlebars = await import("handlebars");

  const hbs = handlebars.default.create();

  const imageSrcSize = (
    file: string,
    hbsContext: HbsContext,
    srcAttr: string
  ): string => {
    // eslint-disable-next-line no-underscore-dangle
    const baseFilePath = hbsContext.data.root.__FILE__;
    const filePath = getFilePath(
      context.config.base,
      path.dirname(baseFilePath),
      file
    );

    const { width, height } = imageSize(fs.readFileSync(filePath));

    return `${srcAttr}="${file}" width="${width}" height="${height}"`;
  };

  const apply = (
    file: string,
    currentData: HbsData,
    hbsContext: HbsContext,
    include: boolean
  ): string => {
    // eslint-disable-next-line no-underscore-dangle
    const baseFilePath = hbsContext.data.root.__FILE__;
    const includeFilePath = findFile(
      context.config.base,
      path.dirname(baseFilePath),
      file
    );

    context.dependency.add(transit.srcFilePath, includeFilePath);

    const src = fs.readFileSync(includeFilePath, "utf-8").trim();

    if (!include) return src;

    const compiled = hbs.compile(src);

    return compiled({
      ...currentData,
      __FILE__: includeFilePath,
    });
  };

  hbs.registerHelper(
    "_",
    function includeHelper(this: HbsData, file, hbsContext) {
      return new handlebars.default.SafeString(
        apply(hbs.compile(file)(this), this, hbsContext, true)
      );
    }
  );
  hbs.registerHelper(
    "include",
    function includeHelper(this: HbsData, file, hbsContext) {
      return new handlebars.default.SafeString(
        apply(hbs.compile(file)(this), this, hbsContext, true)
      );
    }
  );
  hbs.registerHelper(
    "$",
    function insertHelper(this: HbsData, file, hbsContext) {
      return new handlebars.default.SafeString(
        apply(hbs.compile(file)(this), this, hbsContext, false)
      );
    }
  );
  hbs.registerHelper(
    "insert",
    function insertHelper(this: HbsData, file, hbsContext) {
      return new handlebars.default.SafeString(
        apply(hbs.compile(file)(this), this, hbsContext, false)
      );
    }
  );

  hbs.registerHelper(
    "image",
    function imgHelper(this: HbsData, file, arg1, arg2) {
      const attrName = typeof arg2 !== "undefined" ? arg1 : "src";
      const hbsContext = arg2 ?? arg1;

      return new handlebars.default.SafeString(
        imageSrcSize(hbs.compile(file)(this), hbsContext, attrName)
      );
    }
  );

  return hbs;
};

/** hbs transform フィルタ */
export const hbsTransform: Filter = async (transit, context) => {
  try {
    const hbs = await create(transit, context);
    const compiled = hbs.compile(transit.data);
    const stamp = `${Date.now()}-${Math.floor(Math.random() * 256)}`;
    const result = compiled({
      ...context.config.getData(transit.entryPath),
      __FILE__: transit.srcFilePath,
      __PATH__: path.relative(context.config.dist, transit.distFilePath ?? ""),
      __ROOT__: path.relative(transit.distFilePath ?? "", context.config.dist),
      __TIMESTAMP__: stamp,
      __TIMESTAMP_QUERY__: `?${stamp}`,
      ...(context.config.dev
        ? {
            __DEV__: true,
            __DEV_TIMESTAMP__: stamp,
            __DEV_TIMESTAMP_QUERY__: `?${stamp}`,
          }
        : {}),
    });

    context.dependency.commit();

    return transit.update(result, undefined);
  } catch (e) {
    context.dependency.rollback();
    throw e;
  }
};
