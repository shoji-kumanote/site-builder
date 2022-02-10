import path from 'path';
import fs from 'fs';
import micromatch from 'micromatch';
import jsYaml from 'js-yaml';
import { globby } from 'globby';
import chalk from 'chalk';
import { format } from 'date-fns';
import terminalSize from 'term-size';
import url from 'url';
import { execFile } from 'child_process';
import { promisify } from 'util';

/** クラス: 作業データ */
class Transit {
    /** 内容 */
    data;
    /** ソースマップ */
    sourceMap;
    /** ソースファイルの相対パス */
    entryPath;
    /** ソースファイルのファイルパス */
    srcFilePath;
    /** ソースファイルのファイル名 */
    srcFileName;
    /** 出力ファイルのファイルパス */
    distFilePath;
    /** 出力ファイルのファイル名 */
    distFileName;
    /** コンストラクタ */
    constructor(data, sourceMap, entryPath, srcFilePath, srcFileName, distFilePath, distFileName) {
        this.data = data;
        this.sourceMap = sourceMap;
        this.entryPath = entryPath;
        this.srcFilePath = srcFilePath;
        this.srcFileName = srcFileName;
        this.distFilePath = distFilePath;
        this.distFileName = distFileName;
    }
    /**
     * 作業データを作成
     *
     * @param srcFilePath - ソースファイルパス
     */
    static async create(entryPath, srcFilePath, distFilePath) {
        const transit = new Transit(await fs.promises.readFile(srcFilePath, "utf-8"), undefined, entryPath, srcFilePath, path.basename(srcFilePath), distFilePath, distFilePath === undefined ? undefined : path.basename(distFilePath));
        return transit;
    }
    /**
     * 内容とソースマップを入れ替えた新しい作業データを作成
     *
     * @param data - 内容
     * @param sourceMap - ソースマップ
     */
    update(data, sourceMap) {
        return new Transit(data, sourceMap, this.entryPath, this.srcFilePath, this.srcFileName, this.distFilePath, this.distFileName);
    }
}

/**
 * ソースマップの注釈追加・削除
 *
 * @param data - 元データ
 * @param sourceMapFileName - ソースマップのファイル名 / 省略時は注釈削除
 */
const annotateSourceMap = (data, sourceMapFileName) => {
    const removed = data
        .replace(/\s*\/\*# sourceMappingURL.*?\*\/\s*/gm, "")
        .trim();
    if (sourceMapFileName === undefined)
        return removed;
    return `${removed}
/*# sourceMappingURL=${sourceMapFileName} */`;
};

/** 定義: フィルタ種別 */
const FILTER_TYPES = {
    /** フィルタ種別: 何もしない */
    thru: "thru",
    /** フィルタ種別: Smarty変換 */
    smarty: "smarty",
    /** フィルタ種別: Handlebars 変換 */
    hbsTransform: "hbsTransform",
    /** フィルタ種別: HTML 整形 */
    htmlFormat: "htmlFormat",
    /** フィルタ種別: CSS 最適化 */
    cssOptimize: "cssOptimize",
    /** フィルタ種別: CSS 整形 */
    cssFormat: "cssFormat",
    /** フィルタ種別: CSS 縮小 */
    cssMinify: "cssMinify",
    /** フィルタ種別: Sass コンパイル */
    sassCompile: "sassCompile",
    /** フィルタ種別: JavaScript 最適化 */
    jsOptimize: "jsOptimize",
    /** フィルタ種別: JavaScript 整形 */
    jsFormat: "jsFormat",
    /** フィルタ種別: JavaScript 縮小 */
    jsMinify: "jsMinify",
    /** フィルタ種別: CommonJS バンドル */
    mjsBundle: "mjsBundle",
    /** フィルタ種別: TypeScript コンパイル＋バンドル */
    tsBundle: "tsBundle",
    /** フィルタ種別: JPEG 最適化 */
    jpegOptimize: "jpegOptimize",
    /** フィルタ種別: PNG 最適化 */
    pngOptimize: "pngOptimize",
    /** フィルタ種別: GIF 最適化 */
    gifOptimize: "gifOptimize",
    /** フィルタ種別: SVG 最適化 */
    svgOptimize: "svgOptimize",
    /** フィルタ種別: コピー */
    copy: "copy",
};
/**
 * 文字列からフィルタ種別を取得
 *
 * @param value - 文字列
 */
const getFilterType = (value) => {
    if (value in FILTER_TYPES)
        return value;
    throw new Error(`フィルタ種別: ${value} は存在しません`);
};

/**
 * フィルタ種別に対応するフィルタ関数取得
 *
 * @param filterType - フィルタ種別
 * @returns フィルタ
 */
const getFilter = async (filterType) => {
    switch (filterType) {
        case FILTER_TYPES.thru:
            return (await Promise.resolve().then(function () { return thru$1; })).thru;
        case FILTER_TYPES.smarty:
            return (await Promise.resolve().then(function () { return smarty$1; })).smarty;
        case FILTER_TYPES.hbsTransform:
            return (await Promise.resolve().then(function () { return hbsTransform$1; })).hbsTransform;
        case FILTER_TYPES.htmlFormat:
            return (await Promise.resolve().then(function () { return htmlFormat$1; })).htmlFormat;
        case FILTER_TYPES.cssOptimize:
            return (await Promise.resolve().then(function () { return cssOptimize$1; })).cssOptimize;
        case FILTER_TYPES.cssFormat:
            return (await Promise.resolve().then(function () { return cssFormat$1; })).cssFormat;
        case FILTER_TYPES.cssMinify:
            return (await Promise.resolve().then(function () { return cssMinify$1; })).cssMinify;
        case FILTER_TYPES.sassCompile:
            return (await Promise.resolve().then(function () { return sassCompile$1; })).sassCompile;
        case FILTER_TYPES.jsOptimize:
            return (await Promise.resolve().then(function () { return jsOptimize$1; })).jsOptimize;
        case FILTER_TYPES.jsFormat:
            return (await Promise.resolve().then(function () { return jsFormat$1; })).jsFormat;
        case FILTER_TYPES.jsMinify:
            return (await Promise.resolve().then(function () { return jsMinify$1; })).jsMinify;
        case FILTER_TYPES.mjsBundle:
            return (await Promise.resolve().then(function () { return mjsBundle$1; })).mjsBundle;
        case FILTER_TYPES.tsBundle:
            return (await Promise.resolve().then(function () { return tsBundle$1; })).tsBundle;
        case FILTER_TYPES.jpegOptimize:
            return (await Promise.resolve().then(function () { return jpegOptimize$1; })).jpegOptimize;
        case FILTER_TYPES.pngOptimize:
            return (await Promise.resolve().then(function () { return pngOptimize$1; })).pngOptimize;
        case FILTER_TYPES.gifOptimize:
            return (await Promise.resolve().then(function () { return gifOptimize$1; })).gifOptimize;
        case FILTER_TYPES.svgOptimize:
            return (await Promise.resolve().then(function () { return svgOptimize$1; })).svgOptimize;
        case FILTER_TYPES.copy:
            return (await Promise.resolve().then(function () { return copy$1; })).copy;
        default:
            return (await Promise.resolve().then(function () { return thru$1; })).thru;
    }
};

/**
 * ワークフローを実行
 *
 * @param workFlow - ワークフロー
 * @param transit - 作業用データ
 * @param context - 実行時コンテキスト
 */
const applyWorkFlow = async (workFlow, transit, context) => {
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
        }
        else {
            const result = await filter(transit, context);
            if (workFlow.distPath !== undefined) {
                // ここで出力
                context.logger.begin();
                if (workFlow.sourceMap && result.sourceMap) {
                    await context.file.write(path.resolve(context.config.dist, workFlow.distPath), annotateSourceMap(result.data, `${path.basename(workFlow.distPath)}.map`));
                    await context.file.write(path.resolve(context.config.dist, `${workFlow.distPath}.map`), result.sourceMap);
                }
                else {
                    await context.file.write(path.resolve(context.config.dist, workFlow.distPath), annotateSourceMap(result.data));
                }
                context.logger.end();
                context.logger.info();
            }
            for (const next of workFlow.next ?? []) {
                /* eslint-disable no-await-in-loop */
                await applyWorkFlow(next, result, context);
            }
        }
    }
    catch (e) {
        context.logger.fileFailure("", transit.srcFilePath, e);
    }
    context.logger.end();
};

const buildEntry = async (context, entry) => {
    const distPath = entry.getPrimaryDistPath();
    // eslint-disable-next-line no-await-in-loop
    const transit = await Transit.create(entry.entryPath, entry.srcFilePath, distPath === undefined
        ? undefined
        : path.resolve(context.config.dist, distPath));
    context.logger.entry(entry);
    for (const workFlow of entry.getWorkFlows()) {
        // eslint-disable-next-line no-await-in-loop
        await applyWorkFlow(workFlow, transit, context);
    }
};

/** build コマンド */
const build = async (context) => {
    const { logger } = context;
    logger.banner("build", "blue");
    const entries = await context.getEntries();
    for (const entry of entries) {
        // eslint-disable-next-line no-await-in-loop
        await buildEntry(context, entry);
    }
    context.dependency.dump(context.logger);
};

/** clean コマンド */
const clean = async (context) => {
    const { logger, config } = context;
    logger.banner("clean", "blue");
    const entries = await context.getEntries();
    const files = entries
        .reduce((prev, x) => [...prev, ...x.getDistPaths(true)], [])
        .map((x) => path.resolve(config.dist, x));
    await Promise.all(files.map((x) => context.file.unlink(x)));
    await context.file.removeEmptyDirs(context.config.dist);
};

/** info コマンド */
const info = async (context) => {
    const { logger, config } = context;
    logger.banner("info", "blue");
    logger.banner("cli option");
    logger.info({
        config: config.config,
        dryRun: config.dryRun,
        dev: config.dev,
    });
    logger.banner("config");
    logger.info({
        base: config.base,
        dist: config.dist,
        src: config.src,
        vendor: config.vendor,
        ignore: config.ignore,
        disabled: config.disabled,
    });
    logger.banner("page data");
    logger.info(config.getData());
    logger.banner("entries");
    const entries = await context.getEntries();
    const showWorkFlowInfo = (workFlow) => {
        const next = workFlow.next ?? [];
        logger.filterType(workFlow.filterType, workFlow.distPath, workFlow.sourceMap);
        if (next.length > 0) {
            for (const x of next) {
                logger.begin();
                showWorkFlowInfo(x);
                logger.end();
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
        }
        else {
            logger.entry(entry, "dim");
        }
        logger.info("");
    }
};

/** 定義: エントリ種別 */
const ENTRY_TYPES = {
    /** エントリ種別: vendor css */
    vendorCss: "vendorCss",
    /** エントリ種別: vendor ファイル */
    vendorFile: "vendorFile",
    /** エントリ種別: sass ライブラリ */
    sassLib: "sassLib",
    /** エントリ種別: hbs ライブラリ */
    hbsLib: "hbsLib",
    /** エントリ種別: mjs ライブラリ */
    mjsLib: "mjsLib",
    /** エントリ種別: ts ライブラリ */
    tsLib: "tsLib",
    /** エントリ種別: css */
    css: "css",
    /** エントリ種別: sass */
    sass: "sass",
    /** エントリ種別: hbs */
    hbs: "hbs",
    /** エントリ種別: tpl */
    tpl: "tpl",
    /** エントリ種別: html */
    html: "html",
    /** エントリ種別: js */
    js: "js",
    /** エントリ種別: mjs */
    mjs: "mjs",
    /** エントリ種別: ts */
    ts: "ts",
    /** エントリ種別: jpeg */
    jpeg: "jpeg",
    /** エントリ種別: png */
    png: "png",
    /** エントリ種別: gif */
    gif: "gif",
    /** エントリ種別: svg */
    svg: "svg",
    /** エントリ種別: file */
    file: "file",
};
const getEntryType = (vendor, filePath) => {
    const extName = path.extname(filePath);
    const lib = /^_/.test(path.basename(filePath));
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
            return lib ? ENTRY_TYPES.hbsLib : ENTRY_TYPES.hbs;
        case ".tpl":
            return lib ? ENTRY_TYPES.hbsLib : ENTRY_TYPES.tpl;
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

const buildFile = async (context, filePath) => {
    const entry = context.getEntry(filePath);
    if (entry === undefined)
        return;
    switch (entry.entryType) {
        case ENTRY_TYPES.hbsLib:
        case ENTRY_TYPES.mjsLib:
        case ENTRY_TYPES.sassLib:
        case ENTRY_TYPES.tsLib:
            for (const parentFilePath of context.dependency.getByDepend(filePath)) {
                // eslint-disable-next-line no-await-in-loop
                await buildFile(context, parentFilePath);
            }
            break;
        default:
            await buildEntry(context, entry);
            break;
    }
};

/**
 * ファイルのビルド結果を削除
 *
 * @param context - コンテキスト
 * @param entry - エントリ
 */
const unBuildFile = async (context, filePath) => {
    const entry = context.getEntry(filePath);
    if (entry === undefined)
        return;
    const distFilePaths = entry.getDistPaths();
    if (distFilePaths.length > 0) {
        for (const distFilePath of distFilePaths) {
            // eslint-disable-next-line no-await-in-loop
            await context.file.unlink(path.resolve(context.config.dist, distFilePath));
        }
    }
};

/** watch コマンド */
const watch = async (context) => {
    const { logger } = context;
    await build(context);
    logger.banner("watch", "blue");
    const chokidar = await import('chokidar');
    const watcher = chokidar.watch([
        ...context.config.src.map((x) => path.resolve(x, "**", "*")),
        ...context.config.config,
    ], {
        atomic: true,
        awaitWriteFinish: {
            stabilityThreshold: 500,
            pollInterval: 100,
        },
        useFsEvents: true,
    });
    const isConfigFile = (filePath) => context.config.config.includes(filePath);
    watcher.on("ready", () => {
        context.logger.banner("start watching ...", "green");
        context.logger.info();
        watcher.on("add", async (filePath) => {
            context.logger.fileNotice("add", filePath);
            context.logger.begin();
            if (isConfigFile(filePath)) ;
            else {
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
            }
            else {
                await buildFile(context, filePath);
            }
            context.logger.end();
            context.logger.idle();
        });
        watcher.on("unlink", async (filePath) => {
            context.logger.fileNotice("unlink", filePath);
            context.logger.begin();
            if (isConfigFile(filePath)) ;
            else {
                await unBuildFile(context, filePath);
            }
            context.logger.end();
            context.logger.idle();
        });
    });
};

/**
 * 値を文字列の配列として解釈
 *
 * @param value - 値
 * @param strict - 厳密モード / trueの場合は不正データについて例外を投げる
 */
const getStringArray = (value, strict = false) => {
    if (value === undefined)
        return [];
    if (Array.isArray(value)) {
        const array = value.filter((x) => typeof x === "string");
        if (strict && value.length !== array.length) {
            throw new Error("配列に文字列以外が含まれています");
        }
        return array;
    }
    if (typeof value === "string")
        return [value];
    if (strict) {
        throw new Error("文字列または文字列の配列ではありません");
    }
    return [];
};

/** 複数の配列を重複は除去して合成 */
const mergeArray = (...args) => {
    const result = new Set();
    for (const arg of args) {
        for (const x of arg)
            result.add(x);
    }
    return [...result];
};

/**
 * 設定ファイル読み込み
 *
 * @param filePath - ファイルパス
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const load = async (filePath) => {
    try {
        return jsYaml.load(await fs.promises.readFile(filePath, "utf8"));
    }
    catch {
        throw new Error(`設定ファイルの読み込みに失敗しました: ${filePath}`);
    }
};
/**
 * 設定ファイルから設定ファイルデータを生成
 *
 * @param filePath - ファイルパス
 */
const loadConfigFile = async (filePath) => {
    const configFileData = await load(filePath);
    const configBaseDir = path.dirname(filePath);
    if (typeof configFileData !== "object" || configFileData === null) {
        throw new Error("設定ファイルの形式が正しくありません");
    }
    for (const key of ["base", "dist"]) {
        if (typeof configFileData[key] !== "string") {
            throw new Error(`設定ファイルに ${key} がないか、文字列ではありません`);
        }
    }
    for (const key of ["src", "vendor", "ignore"]) {
        if (key in configFileData) {
            try {
                getStringArray(configFileData[key], true);
            }
            catch (e) {
                throw new Error(`設定ファイルの ${key} が文字列または文字列の配列ではありません`);
            }
        }
    }
    const disabled = [];
    if ("disabled" in configFileData) {
        try {
            for (const x of getStringArray(configFileData.disabled, true)) {
                try {
                    disabled.push(getFilterType(x));
                }
                catch {
                    throw new Error(`設定ファイルの disabled に不明なフィルタ種別: ${x} が指定されています`);
                }
            }
        }
        catch (e) {
            throw new Error(`設定ファイルの disabled が文字列または文字列の配列ではありません`);
        }
    }
    const base = path.resolve(configBaseDir, configFileData.base);
    return {
        base,
        dist: path.resolve(configBaseDir, configFileData.dist),
        src: "src" in configFileData
            ? getStringArray(configFileData.src).map((x) => path.resolve(configBaseDir, x))
            : [base],
        vendor: "vendor" in configFileData
            ? getStringArray(configFileData.vendor).map((x) => path.resolve(configBaseDir, x))
            : ["**/vendor/**/*"],
        ignore: getStringArray(configFileData.ignore).map((x) => path.resolve(configBaseDir, x)),
        disabled,
        data: configFileData.data ?? {},
    };
};
/** 複数設定で同一かどうかをチェックするキー */
const CHECK_KEYS = ["base", "dist"];
/**
 * 複数の設定ファイルデータを合成
 *
 * @param args - 設定ファイルデータ
 */
const mergeConfigFile = (...args) => {
    if (args.length === 0)
        throw new Error("設定ファイルのデータがありません");
    if (args.length === 1)
        return args[0];
    const [a, b] = args;
    for (const key of CHECK_KEYS) {
        if (a[key] !== b[key]) {
            throw new Error(`複数の設定ファイルを使用する場合, ${key}の値は同じである必要があります`);
        }
    }
    return mergeConfigFile({
        base: a.base,
        dist: a.dist,
        src: mergeArray(getStringArray(a.src), getStringArray(b.src)),
        vendor: mergeArray(getStringArray(a.vendor), getStringArray(b.vendor)),
        ignore: mergeArray(getStringArray(a.ignore), getStringArray(b.ignore)),
        disabled: mergeArray(getStringArray(a.disabled).map(getFilterType), getStringArray(b.disabled).map(getFilterType)),
        data: { ...a.data, ...b.data },
    }, ...args.slice(2));
};

/** クラス: 設定 */
class Config {
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
    /**
     * 設定を作成
     *
     * @param cliOption - コマンドラインオプション
     */
    static async create(cliOption) {
        if (cliOption.config.length === 0) {
            throw new Error("設定ファイルが指定されていません");
        }
        const config = cliOption.config.map((x) => path.resolve(x));
        const allConfigFileData = await Promise.all(config.map((x) => loadConfigFile(x)));
        const configFileData = mergeConfigFile(...allConfigFileData);
        return new Config({
            ...cliOption,
            config,
            ...configFileData,
        }, configFileData.data);
    }
    constructor(data, pageData) {
        this.#config = data.config;
        this.dryRun = data.dryRun;
        this.dev = data.dev;
        this.base = data.base;
        this.dist = data.dist;
        this.#src = data.src;
        this.#vendor = data.vendor;
        this.#ignore = data.ignore;
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
    /**
     * ページデータ取得
     *
     * @param entryPath - 対象のファイルパス
     */
    getData(entryPath) {
        if (typeof entryPath === "string") {
            const specifiedData = this.#pageData[entryPath];
            if (typeof specifiedData === "object") {
                return {
                    ...this.#pageData,
                    ...specifiedData,
                };
            }
        }
        return {
            ...this.#pageData,
        };
    }
}

/**
 * 依存データをコピー
 *
 * @param src - コピー元
 * @param dest - コピー先
 */
const copy$2 = (src, dest) => {
    dest.clear();
    for (const [key, value] of src.entries()) {
        dest.set(key, new Set(value));
    }
};
/** クラス: 依存関係 */
class Dependency {
    #map = new Map();
    #backup = new Map();
    /** トランザクション開始 */
    beginTransaction() {
        copy$2(this.#map, this.#backup);
    }
    /** ロールバック */
    rollback() {
        copy$2(this.#backup, this.#map);
    }
    /** コミット */
    // eslint-disable-next-line class-methods-use-this
    commit() {
        //
    }
    /** すべての依存を削除 */
    clearAll() {
        this.#map.clear();
    }
    /**
     * 任意のファイルの依存を削除
     *
     * @param filePath - ファイルパス
     */
    clear(filePath) {
        const entry = this.#map.get(filePath);
        if (entry)
            entry.clear();
    }
    /**
     * 任意のファイルの依存を追加
     *
     * @param filePath - ファイルパス
     * @param dependFilePaths - 依存ファイルパスの配列
     */
    add(filePath, ...dependFilePaths) {
        const entry = this.#map.get(filePath) ?? new Set();
        for (const dependFilePath of dependFilePaths) {
            if (filePath !== dependFilePath) {
                entry.add(dependFilePath);
            }
        }
        this.#map.set(filePath, entry);
    }
    /**
     * あるファイルを依存に持つファイルパスを得る
     *
     * @param dependFilePath - 依存ファイル
     * @returns ファイルパスの配列
     */
    getByDepend(dependFilePath) {
        const result = new Set();
        for (const [filePath, dependFilePathSet] of this.#map.entries()) {
            if (dependFilePathSet.has(dependFilePath)) {
                result.add(filePath);
            }
        }
        return [...result];
    }
    /** 依存関係のデバッグ出力 */
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
}

/**
 * CSS向けのワークフロー作成
 *
 * @param entryPath - エントリパス
 * @param cssOptimize - cssOptimize フィルタの有無
 * @param cssMinify - cssMinify フィルタの有無
 * @param cssFormat - cssFormat フィルタの有無
 * @param smarty - smarty フィルタの有無
 */
const getCssWorkFlows = (entryPath, cssOptimize, cssMinify, cssFormat, smarty) => {
    const origDistPath = entryPath.replace(/\.css$/, ".orig.css");
    if (cssOptimize) {
        if (cssMinify) {
            if (cssFormat) {
                // all
                return [
                    {
                        filterType: FILTER_TYPES.cssOptimize,
                        next: [
                            {
                                filterType: FILTER_TYPES.cssMinify,
                                distPath: entryPath,
                                sourceMap: true,
                                next: smarty
                                    ? [
                                        {
                                            filterType: FILTER_TYPES.smarty,
                                            distPath: `${entryPath}.data`,
                                        },
                                    ]
                                    : [],
                            },
                            {
                                filterType: FILTER_TYPES.cssFormat,
                                distPath: origDistPath,
                            },
                        ],
                    },
                ];
            }
            // optimize + minify
            return [
                {
                    filterType: FILTER_TYPES.cssOptimize,
                    distPath: origDistPath,
                    next: [
                        {
                            filterType: FILTER_TYPES.cssMinify,
                            distPath: entryPath,
                            sourceMap: true,
                            next: smarty
                                ? [
                                    {
                                        filterType: FILTER_TYPES.smarty,
                                        distPath: `${entryPath}.data`,
                                    },
                                ]
                                : [],
                        },
                    ],
                },
            ];
        }
        if (cssFormat) {
            // optimize + format
            return [
                {
                    filterType: FILTER_TYPES.cssOptimize,
                    distPath: entryPath,
                    sourceMap: true,
                    next: [
                        {
                            filterType: FILTER_TYPES.cssFormat,
                            distPath: origDistPath,
                            next: smarty
                                ? [
                                    {
                                        filterType: FILTER_TYPES.smarty,
                                        distPath: `${entryPath}.data`,
                                    },
                                ]
                                : [],
                        },
                    ],
                },
            ];
        }
        // optimize
        return [
            {
                filterType: FILTER_TYPES.cssOptimize,
                distPath: entryPath,
                sourceMap: true,
                next: smarty
                    ? [
                        {
                            filterType: FILTER_TYPES.smarty,
                            distPath: `${entryPath}.data`,
                        },
                    ]
                    : [],
            },
        ];
    }
    if (cssMinify) {
        if (cssFormat) {
            // minify + format
            return [
                {
                    filterType: FILTER_TYPES.cssMinify,
                    distPath: entryPath,
                    sourceMap: true,
                    next: smarty
                        ? [
                            {
                                filterType: FILTER_TYPES.smarty,
                                distPath: `${entryPath}.data`,
                            },
                        ]
                        : [],
                },
                {
                    filterType: FILTER_TYPES.cssFormat,
                    distPath: origDistPath,
                },
            ];
        }
        // minify
        return [
            {
                filterType: FILTER_TYPES.cssMinify,
                distPath: entryPath,
                sourceMap: true,
                next: smarty
                    ? [
                        {
                            filterType: FILTER_TYPES.smarty,
                            distPath: `${entryPath}.data`,
                        },
                    ]
                    : [],
            },
        ];
    }
    if (cssFormat) {
        // format
        return [
            {
                filterType: FILTER_TYPES.cssFormat,
                distPath: entryPath,
                next: smarty
                    ? [
                        {
                            filterType: FILTER_TYPES.smarty,
                            distPath: `${entryPath}.data`,
                        },
                    ]
                    : [],
            },
        ];
    }
    // none
    return [];
};

const getHbsWorkFlows = (distPath, hbsTransform, htmlFormat) => {
    if (hbsTransform) {
        if (htmlFormat) {
            return [
                {
                    filterType: FILTER_TYPES.hbsTransform,
                    next: [
                        {
                            filterType: FILTER_TYPES.htmlFormat,
                            distPath,
                        },
                    ],
                },
            ];
        }
        return [
            {
                filterType: FILTER_TYPES.hbsTransform,
                distPath,
            },
        ];
    }
    if (htmlFormat) {
        return [
            {
                filterType: FILTER_TYPES.htmlFormat,
                distPath,
            },
        ];
    }
    return [];
};

/**
 * JavaScript向けのワークフロー作成
 *
 * @param entryPath - エントリパス
 * @param jsOptimize - jsOptimize フィルタの有無
 * @param jsMinify - jsMinify フィルタの有無
 * @param jsFormat - jsFormat フィルタの有無
 */
const getJsWorkFlows = (entryPath, jsOptimize, jsMinify, jsFormat) => {
    const origDistPath = entryPath.replace(/\.js$/, ".orig.js");
    if (jsOptimize) {
        if (jsMinify) {
            if (jsFormat) {
                // all
                return [
                    {
                        filterType: FILTER_TYPES.jsOptimize,
                        next: [
                            {
                                filterType: FILTER_TYPES.jsMinify,
                                distPath: entryPath,
                                sourceMap: true,
                            },
                            {
                                filterType: FILTER_TYPES.jsFormat,
                                distPath: origDistPath,
                            },
                        ],
                    },
                ];
            }
            // optimize + minify
            return [
                {
                    filterType: FILTER_TYPES.jsOptimize,
                    next: [
                        {
                            filterType: FILTER_TYPES.jsMinify,
                            distPath: entryPath,
                            sourceMap: true,
                        },
                    ],
                },
            ];
        }
        if (jsFormat) {
            // optimize + format
            return [
                {
                    filterType: FILTER_TYPES.jsOptimize,
                    distPath: entryPath,
                    sourceMap: true,
                    next: [
                        {
                            filterType: FILTER_TYPES.jsFormat,
                            distPath: origDistPath,
                        },
                    ],
                },
            ];
        }
        // optimize
        return [
            {
                distPath: entryPath,
                filterType: FILTER_TYPES.jsOptimize,
                sourceMap: true,
            },
        ];
    }
    if (jsMinify) {
        if (jsFormat) {
            // minify + format
            return [
                {
                    filterType: FILTER_TYPES.jsMinify,
                    distPath: entryPath,
                    sourceMap: true,
                },
                {
                    filterType: FILTER_TYPES.jsFormat,
                    distPath: origDistPath,
                },
            ];
        }
        // minify
        return [
            {
                filterType: FILTER_TYPES.jsMinify,
                distPath: entryPath,
                sourceMap: true,
            },
        ];
    }
    if (jsFormat) {
        // format
        return [
            {
                filterType: FILTER_TYPES.jsFormat,
                distPath: entryPath,
            },
        ];
    }
    // none
    return [];
};

/** クラス: エントリ */
class Entry {
    #disabled;
    /** エントリ種別 */
    entryType;
    /** ソースファイルパス */
    srcFilePath;
    /** ソースの相対パス */
    entryPath;
    /**
     * コンストラクタ
     *
     * @param config - 設定
     * @param filePath - ソースファイルパス
     */
    constructor(config, filePath) {
        this.#disabled = config.disabled;
        this.entryType = getEntryType(config.vendor, filePath);
        this.srcFilePath = filePath;
        this.entryPath = path.relative(config.base, filePath);
    }
    /**
     * フィルタが有効かどうか
     *
     * @param filterType - フィルタ種別
     */
    isFilterEnabled(filterType) {
        return !this.#disabled.includes(filterType);
    }
    /** ワークフロー作成 */
    getWorkFlows() {
        const workFlows = [];
        switch (this.entryType) {
            case ENTRY_TYPES.vendorCss:
                if (this.isFilterEnabled(FILTER_TYPES.thru)) {
                    workFlows.push({
                        filterType: FILTER_TYPES.thru,
                        distPath: this.entryPath,
                    });
                }
                if (this.isFilterEnabled(FILTER_TYPES.smarty)) {
                    workFlows.push({
                        filterType: FILTER_TYPES.smarty,
                        distPath: `${this.entryPath}.data`,
                    });
                }
                return workFlows;
            case ENTRY_TYPES.vendorFile:
                if (this.isFilterEnabled(FILTER_TYPES.thru)) {
                    return [
                        {
                            filterType: FILTER_TYPES.thru,
                            distPath: this.entryPath,
                        },
                    ];
                }
                return [];
            case ENTRY_TYPES.sassLib:
            case ENTRY_TYPES.hbsLib:
            case ENTRY_TYPES.mjsLib:
            case ENTRY_TYPES.tsLib:
                return [];
            case ENTRY_TYPES.css:
                return getCssWorkFlows(this.entryPath, this.isFilterEnabled(FILTER_TYPES.cssOptimize), this.isFilterEnabled(FILTER_TYPES.cssMinify), this.isFilterEnabled(FILTER_TYPES.cssFormat), this.isFilterEnabled(FILTER_TYPES.smarty));
            case ENTRY_TYPES.sass:
                workFlows.push(...getCssWorkFlows(this.entryPath.replace(/\.(sass|scss)$/, ".css"), this.isFilterEnabled(FILTER_TYPES.cssOptimize), this.isFilterEnabled(FILTER_TYPES.cssMinify), this.isFilterEnabled(FILTER_TYPES.cssFormat), this.isFilterEnabled(FILTER_TYPES.smarty)));
                return this.isFilterEnabled(FILTER_TYPES.sassCompile)
                    ? [
                        {
                            filterType: FILTER_TYPES.sassCompile,
                            next: workFlows,
                        },
                    ]
                    : workFlows;
            case ENTRY_TYPES.hbs:
                return getHbsWorkFlows(this.entryPath.replace(/\.hbs$/, ".html"), this.isFilterEnabled(FILTER_TYPES.hbsTransform), this.isFilterEnabled(FILTER_TYPES.htmlFormat));
            case ENTRY_TYPES.tpl:
                return getHbsWorkFlows(this.entryPath, this.isFilterEnabled(FILTER_TYPES.hbsTransform), false);
            case ENTRY_TYPES.html:
                return getHbsWorkFlows(this.entryPath, false, this.isFilterEnabled(FILTER_TYPES.htmlFormat));
            case ENTRY_TYPES.js:
                return getJsWorkFlows(this.entryPath, this.isFilterEnabled(FILTER_TYPES.jsOptimize), this.isFilterEnabled(FILTER_TYPES.jsMinify), this.isFilterEnabled(FILTER_TYPES.jsFormat));
            case ENTRY_TYPES.mjs:
                workFlows.push(...getJsWorkFlows(this.entryPath.replace(/\.mjs$/, ".js"), this.isFilterEnabled(FILTER_TYPES.jsOptimize), this.isFilterEnabled(FILTER_TYPES.jsMinify), this.isFilterEnabled(FILTER_TYPES.jsFormat)));
                return this.isFilterEnabled(FILTER_TYPES.mjsBundle)
                    ? [
                        {
                            filterType: FILTER_TYPES.mjsBundle,
                            next: workFlows,
                        },
                    ]
                    : workFlows;
            case ENTRY_TYPES.ts:
                workFlows.push(...getJsWorkFlows(this.entryPath.replace(/\.ts$/, ".js"), this.isFilterEnabled(FILTER_TYPES.jsOptimize), this.isFilterEnabled(FILTER_TYPES.jsMinify), this.isFilterEnabled(FILTER_TYPES.jsFormat)));
                return this.isFilterEnabled(FILTER_TYPES.tsBundle)
                    ? [
                        {
                            filterType: FILTER_TYPES.tsBundle,
                            next: workFlows,
                        },
                    ]
                    : workFlows;
            case ENTRY_TYPES.jpeg:
                return this.isFilterEnabled(FILTER_TYPES.jpegOptimize)
                    ? [
                        {
                            filterType: FILTER_TYPES.jpegOptimize,
                            distPath: this.entryPath,
                            binary: true,
                        },
                    ]
                    : [];
            case ENTRY_TYPES.png:
                return this.isFilterEnabled(FILTER_TYPES.pngOptimize)
                    ? [
                        {
                            filterType: FILTER_TYPES.pngOptimize,
                            distPath: this.entryPath,
                            binary: true,
                        },
                    ]
                    : [];
            case ENTRY_TYPES.gif:
                return this.isFilterEnabled(FILTER_TYPES.gifOptimize)
                    ? [
                        {
                            filterType: FILTER_TYPES.gifOptimize,
                            distPath: this.entryPath,
                            binary: true,
                        },
                    ]
                    : [];
            case ENTRY_TYPES.svg:
                return this.isFilterEnabled(FILTER_TYPES.svgOptimize)
                    ? [
                        {
                            filterType: FILTER_TYPES.svgOptimize,
                            distPath: this.entryPath,
                        },
                    ]
                    : [];
            // case ENTRY_TYPES.file: --> copy
            default:
                return this.isFilterEnabled(FILTER_TYPES.copy)
                    ? [
                        {
                            filterType: FILTER_TYPES.copy,
                            distPath: this.entryPath,
                            binary: true,
                        },
                    ]
                    : [];
        }
    }
    /** メインの出力ファイルパス取得 */
    getPrimaryDistPath() {
        const distPaths1 = [];
        const distPaths2 = [];
        const walk = (workFlowList) => {
            for (const workFlow of workFlowList) {
                if (workFlow.distPath !== undefined) {
                    (workFlow.sourceMap ? distPaths1 : distPaths2).push(workFlow.distPath);
                }
                else {
                    walk(workFlow.next ?? []);
                }
            }
        };
        walk(this.getWorkFlows());
        return (distPaths1[distPaths1.length - 1] ?? distPaths2[distPaths2.length - 1]);
    }
    /**
     * すべての出力ファイルパス取得
     *
     * @param includeSourceMap - ソースマップを含む
     */
    getDistPaths(includeSourceMap = false) {
        const distPaths = [];
        const walk = (workFlowList) => {
            for (const workFlow of workFlowList) {
                if (workFlow.distPath !== undefined) {
                    distPaths.push(workFlow.distPath);
                    if (includeSourceMap && workFlow.sourceMap) {
                        distPaths.push(`${workFlow.distPath}.map`);
                    }
                }
                else {
                    walk(workFlow.next ?? []);
                }
            }
        };
        walk(this.getWorkFlows());
        return distPaths;
    }
}

/**
 * 末尾に改行を入れる
 *
 * @param data - 元データ
 */
const insertLastNewLine = (data) => `${data.trim()}\n`;

/** クラス: ファイル操作 */
class File {
    /** ロガー */
    logger;
    /** dry-runモード */
    dryRun;
    /**
     * コンストラクタ
     *
     * @param logger - ロガー
     * @param dryRun - dry-runモード
     */
    constructor(logger, dryRun) {
        this.logger = logger;
        this.dryRun = dryRun;
    }
    /**
     * ファイル削除
     *
     * @param filePath - ファイルパス
     */
    async unlink(filePath) {
        try {
            if (!this.dryRun)
                await fs.promises.unlink(filePath);
            this.logger.fileSuccess("unlink", filePath);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }
        catch (e) {
            if (typeof e === "object" &&
                e !== null &&
                "code" in e &&
                e.code === "ENOENT") {
                this.logger.fileWarning("unlink", filePath, e);
            }
            else {
                this.logger.fileFailure("unlink", filePath, e);
            }
        }
    }
    /**
     * 再帰的に空のディレクトリを削除
     *
     * @param dirPath - ディレクトリパス
     * @param first - 初回コールフラグ
     */
    async removeDirs(dirPath, first) {
        try {
            if (!(await fs.promises.stat(dirPath)).isDirectory())
                return;
        }
        catch (e) {
            this.logger.fileFailure("rmdir", dirPath, e);
            return;
        }
        for (const entry of await fs.promises.readdir(dirPath)) {
            // eslint-disable-next-line no-await-in-loop
            await this.removeDirs(path.resolve(dirPath, entry), false);
        }
        if (first)
            return;
        const entries = await fs.promises.readdir(dirPath);
        if (entries.length === 0) {
            try {
                if (!this.dryRun)
                    await fs.promises.rmdir(dirPath);
                this.logger.fileSuccess("rmdir", dirPath);
            }
            catch (e) {
                this.logger.fileFailure("rmdir", dirPath, e);
            }
        }
    }
    /**
     * 空のディレクトリを削除
     *
     * @param dirPath - ディレクトリパス
     */
    async removeEmptyDirs(dirPath) {
        await this.removeDirs(dirPath, true);
    }
    /**
     * ファイル書き出しの準備としてファイルに至るディレクトリを作成
     *
     * @param filePath - ファイルパス
     * @param withUnlink - 削除フラグ / 指定時はファイルが存在した場合に削除する
     */
    async prepareWrite(filePath, withUnlink = false) {
        if (!this.dryRun) {
            await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
            if (withUnlink) {
                try {
                    await fs.promises.unlink(filePath);
                }
                catch {
                    //
                }
            }
        }
    }
    /**
     * テキストファイル書き出し（末尾に改行が入る）
     *
     * @param filePath - ファイルパス
     * @param data - 内容
     */
    async writeText(filePath, data) {
        await this.write(filePath, insertLastNewLine(data));
    }
    /**
     * ファイル書き出し
     *
     * @param filePath - ファイルパス
     * @param data - 内容
     */
    async write(filePath, data) {
        await this.prepareWrite(filePath);
        if (!this.dryRun) {
            try {
                await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
                await fs.promises.writeFile(filePath, data);
            }
            catch (e) {
                this.logger.fileFailure("write", filePath, e);
                return;
            }
        }
        this.logger.fileSuccess("write", filePath);
    }
    /**
     * ファイルコピー
     *
     * @param srcFilePath - コピー元
     * @param distFilePath - コピー先
     */
    async copy(srcFilePath, distFilePath) {
        if (distFilePath === undefined)
            return;
        await this.prepareWrite(distFilePath);
        if (!this.dryRun) {
            try {
                await fs.promises.copyFile(srcFilePath, distFilePath);
            }
            catch (e) {
                this.logger.fileFailure("copy", distFilePath, e);
                return;
            }
        }
        this.logger.fileSuccess("copy", distFilePath);
    }
}

/* eslint-disable class-methods-use-this */
/** コンソールの幅取得 */
const width = () => terminalSize().columns;
/**
 * 色指定を反映
 *
 * @param value - 文字列
 * @param colors - 色指定
 */
const applyColor = (value, ...colors) => {
    let result = value;
    for (const color of colors) {
        if (typeof color === "string") {
            result = chalk[color](result);
        }
        else {
            result = applyColor(result, ...color);
        }
    }
    return result;
};
/** クラス: ロガー */
class Logger {
    /** idle検出タイマー */
    #idleTimer;
    /** indent */
    #indent;
    /** ディレクトリ定義 */
    dirs;
    /**
     * コンストラクタ
     *
     * @param config - 設定
     */
    constructor(config) {
        this.#indent = "";
        this.dirs = [
            { name: "BASE", dirPath: config.base },
            { name: "DIST", dirPath: config.dist },
        ];
    }
    /** 字下げ開始 */
    begin() {
        this.#indent = `${this.#indent}  `;
    }
    /** 字下げ終了 */
    end() {
        this.#indent = this.#indent.slice(2);
    }
    /**
     * バナー出力
     *
     * @param title - タイトル
     * @param colors - 色指定
     */
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
        if (this.#idleTimer !== undefined)
            clearTimeout(this.#idleTimer);
        this.#idleTimer = setTimeout(() => {
            this.banner(format(new Date(), "HH:mm:ss"), "gray");
            console.info("");
        }, timeoutMs);
    }
    /**
     * 情報ログ出力
     *
     * @param args - 出力値
     */
    info(...args) {
        if (this.#indent === "") {
            console.info(...args);
        }
        else {
            console.info(this.#indent.slice(1), ...args);
        }
    }
    /**
     * 警告ログ出力
     *
     * @param args - 出力値
     */
    warn(...args) {
        if (this.#indent === "") {
            console.warn(...args);
        }
        else {
            console.warn(this.#indent.slice(1), ...args);
        }
    }
    /**
     * エラーログ出力
     *
     * @param args - 出力値
     */
    error(...args) {
        if (this.#indent === "") {
            console.error(...args);
        }
        else {
            console.error(this.#indent.slice(1), ...args);
        }
    }
    /**
     * ファイル情報取得
     *
     * @param filePath - ファイルパス
     */
    getFileInfo(filePath) {
        for (const { name, dirPath } of this.dirs) {
            const relPath = path.relative(dirPath, filePath);
            if (!relPath.includes(".."))
                return { name, relPath };
        }
        return { name: "", relPath: filePath };
    }
    /**
     * エラーメッセージの取得
     *
     * @param error - エラーオブジェクトなど
     * @param color - 色指定
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    /**
     * ファイルについてのログ出力
     *
     * @param label - ラベル
     * @param color - 色指定
     * @param filePath - ファイルパス
     * @param error - エラーオブジェクトなど
     */
    file(label, color, filePath, error = undefined) {
        const { name, relPath } = this.getFileInfo(filePath);
        const formattedLabel = label.length === 0 ? "" : `[${applyColor(label, color)}] `;
        const message = this.getErrorMessage(error, color);
        this.info(`${formattedLabel}${applyColor(`${name}: `, "dim")}${relPath}${message}`);
    }
    /**
     * ファイルについての成功ログ出力
     *
     * @param label - ラベル
     * @param filePath - ファイルパス
     * @param error - エラーオブジェクトなど
     */
    fileSuccess(label, filePath, error) {
        this.file(label, ["green"], filePath, error);
    }
    /**
     * ファイルについての情報ログ出力
     *
     * @param label - ラベル
     * @param filePath - ファイルパス
     * @param error - エラーオブジェクトなど
     */
    fileNotice(label, filePath, error) {
        this.file(label, ["cyan"], filePath, error);
    }
    /**
     * ファイルについての警告ログ出力
     *
     * @param label - ラベル
     * @param filePath - ファイルパス
     * @param error - エラーオブジェクトなど
     */
    fileWarning(label, filePath, error) {
        this.file(label, ["yellow"], filePath, error);
    }
    /**
     * ファイルについての失敗ログ出力
     *
     * @param label - ラベル
     * @param filePath - ファイルパス
     * @param error - エラーオブジェクトなど
     */
    fileFailure(label, filePath, error) {
        this.file(label, ["red"], filePath, error);
    }
    /**
     * エントリについてログ出力
     *
     * @param entry - エントリ
     * @param colors - 色指定
     */
    entry(entry, ...colors) {
        this.info(applyColor("*", "dim"), applyColor(entry.entryPath, colors.length === 0 ? "green" : colors));
    }
    /**
     * フィルタ種別についてログ出力
     *
     * @param filterType - フィルタ種別
     * @param distPath - 出力ファイルパス
     */
    filterType(filterType, distPath, sourceMap) {
        if (distPath === undefined) {
            this.info(applyColor(filterType, "yellow"));
        }
        else {
            this.info(applyColor(filterType, "yellow"), "-->", applyColor(distPath, "magenta"));
            if (sourceMap) {
                this.info(applyColor(filterType, "hidden"), applyColor("-->", "dim"), applyColor(`${distPath}.map`, "magenta"));
            }
        }
    }
}

/** 実行時コンテキスト */
class Context {
    /** 設定 */
    #config;
    /** ロガー */
    logger;
    /** ファイル操作 */
    file;
    /** 依存関係 */
    dependency;
    /**
     * コンストラクタ
     *
     * @param config - 設定
     */
    constructor(config) {
        this.#config = config;
        this.logger = new Logger(config);
        this.file = new File(this.logger, config.dryRun);
        this.dependency = new Dependency();
    }
    get config() {
        return this.#config;
    }
    /** 設定ファイルの再読み込み */
    async reloadConfig() {
        this.#config = await Config.create({
            config: this.#config.config,
            dev: this.#config.dev,
            dryRun: this.#config.dryRun,
        });
    }
    /** 全ソースファイルのエントリ取得 */
    async getEntries() {
        const filePaths = await globby([...this.config.src, ...this.config.ignore.map((x) => `!${x}`)], { onlyFiles: true });
        return filePaths.map((x) => new Entry(this.#config, x));
    }
    /** 指定ファイルのエントリ取得 */
    getEntry(filePath) {
        if (micromatch([filePath], this.config.ignore).length > 0) {
            return undefined;
        }
        return new Entry(this.#config, filePath);
    }
}

/** thru フィルタ */
const thru = async (transit) => transit;

var thru$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    thru: thru
});

/** smarty フィルタ */
const smarty = async (transit) => transit.update(`{literal}${transit.data}{/literal}`);

var smarty$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    smarty: smarty
});

/**
 * includeするファイルの特定
 *
 * @param baseDir - ベースディレクトリ
 * @param file - ファイルの記述
 * @returns ファイルパス
 * @throws ファイルがない場合
 */
const findFile = (baseDir, file) => {
    const filePath = path.resolve(baseDir, file);
    const dirName = path.dirname(filePath);
    const baseName = path.basename(filePath);
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
        if (fs.existsSync(target))
            return target;
    }
    throw new Error(`include file not found: ${file}`);
};
/**
 * 作業データに特化した Handlebars プロセッサを作成
 *
 * @param transit - 作業データ
 * @returns Handlebars プロセッサ
 */
const create = async (transit, context) => {
    const handlebars = await import('handlebars');
    const hbs = handlebars.default.create();
    const apply = (file, currentData, hbsContext, include) => {
        // eslint-disable-next-line no-underscore-dangle
        const baseFilePath = hbsContext.data.root.__FILE__;
        const includeFilePath = findFile(path.dirname(baseFilePath), file);
        context.dependency.add(transit.srcFilePath, includeFilePath);
        const src = fs.readFileSync(includeFilePath, "utf-8").trim();
        if (!include)
            return src;
        const compiled = hbs.compile(src);
        return compiled({
            ...currentData,
            __FILE__: includeFilePath,
        });
    };
    hbs.registerHelper("_", function includeHelper(file, hbsContext) {
        return new handlebars.default.SafeString(apply(file, this, hbsContext, true));
    });
    hbs.registerHelper("include", function includeHelper(file, hbsContext) {
        return new handlebars.default.SafeString(apply(file, this, hbsContext, true));
    });
    hbs.registerHelper("$", function insertHelper(file, hbsContext) {
        return new handlebars.default.SafeString(apply(file, this, hbsContext, false));
    });
    hbs.registerHelper("insert", function insertHelper(file, hbsContext) {
        return new handlebars.default.SafeString(apply(file, this, hbsContext, false));
    });
    return hbs;
};
/** hbs transform フィルタ */
const hbsTransform = async (transit, context) => {
    try {
        const hbs = await create(transit, context);
        const compiled = hbs.compile(transit.data);
        const stamp = `${Date.now()}-${Math.floor(Math.random() * 256)}`;
        const result = compiled({
            ...context.config.getData(transit.srcFilePath),
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
    }
    catch (e) {
        context.dependency.rollback();
        throw e;
    }
};

var hbsTransform$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    hbsTransform: hbsTransform
});

/**
 * htmlのdoctype宣言を追加 / すでにある分は削除
 *
 * @param data - 元データ
 * @param docType - 追加するdoctype
 */
const addDocType = (data, docType = "<!DOCTYPE html>") => `${docType}
${data.replace(/^\s*<!doctype html[^>]*>\s*/im, "")}`;

/** prettierのデフォルトオプション取得 */
const getDefaultPrettierConfig = () => ({
    endOfLine: "lf",
    htmlWhitespaceSensitivity: "css",
    printWidth: 80,
    semi: true,
    singleQuote: false,
    tabWidth: 2,
    trailingComma: "none",
    useTabs: false,
});

/** html format フィルタ */
const htmlFormat = async (transit, context) => {
    if (context.config.dev)
        return transit;
    const prettier = await import('prettier');
    const config = (await prettier.default.resolveConfig(transit.srcFilePath)) ??
        getDefaultPrettierConfig();
    return transit.update(addDocType(prettier.default.format(transit.data, {
        printWidth: 150,
        ...config,
        parser: "glimmer",
    })));
};

var htmlFormat$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    htmlFormat: htmlFormat
});

/** css optimize フィルタ */
const cssOptimize = async (transit, context) => {
    if (context.config.dev)
        return transit;
    const postcss = await import('postcss');
    const autoprefixer = await import('autoprefixer');
    const mqpacker = await import('css-mqpacker');
    const sorting = await import('postcss-sorting');
    const { css, map } = postcss
        .default([
        autoprefixer.default(),
        mqpacker.default(),
        sorting.default({
            "properties-order": "alphabetical",
        }),
    ])
        .process(transit.data, {
        from: transit.srcFileName,
        to: transit.distFileName,
        map: {
            inline: false,
            prev: transit.sourceMap ?? false,
        },
    });
    return transit.update(css, map?.toString() ?? undefined);
};

var cssOptimize$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    cssOptimize: cssOptimize
});

/** css format フィルタ */
const cssFormat = async (transit, context) => {
    if (context.config.dev)
        return transit;
    const prettier = await import('prettier');
    const config = (await prettier.default.resolveConfig(transit.srcFilePath)) ??
        getDefaultPrettierConfig();
    const result = prettier.default.format(transit.data, {
        ...config,
        parser: "css",
    });
    return transit.update(result, transit.sourceMap);
};

var cssFormat$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    cssFormat: cssFormat
});

/** css minify フィルタ */
const cssMinify = async (transit, context) => {
    if (context.config.dev)
        return transit;
    const postcss = await import('postcss');
    const csso = await import('postcss-csso');
    const { css, map } = postcss
        .default([csso.default({ restructure: false })])
        .process(transit.data, {
        from: transit.srcFileName,
        to: transit.distFileName,
        map: {
            inline: false,
            prev: transit.sourceMap ?? false,
        },
    });
    if (!map) {
        return transit.update(css, undefined);
    }
    const mapJSON = map.toJSON();
    mapJSON.sources = mapJSON.sources.map((x) => {
        if (/^file/.test(x)) {
            return path.relative(path.dirname(transit.srcFilePath), new url.URL(x).pathname);
        }
        return x;
    });
    return transit.update(css, JSON.stringify(mapJSON));
};

var cssMinify$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    cssMinify: cssMinify
});

/** sass compile フィルタ */
const sassCompile = async (transit, context) => {
    const sass = await import('sass');
    const result = await sass.default.compileStringAsync(transit.data, {
        syntax: /sass$/.test(transit.srcFileName) ? "indented" : "scss",
        loadPaths: [path.dirname(transit.srcFilePath)],
        sourceMap: true,
        sourceMapIncludeSources: true,
    });
    context.dependency.add(transit.srcFilePath, ...result.loadedUrls.map((x) => x.pathname));
    const next = transit.update(result.css, result.sourceMap ? JSON.stringify(result.sourceMap) : undefined);
    return next;
};

var sassCompile$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    sassCompile: sassCompile
});

/**
 * babelによる js transpile
 *
 * @param transit - 作業用データ
 * @returns babelの結果
 */
const transpile = async (transit) => {
    const babel = await import('@babel/core');
    const env = (await import('@babel/preset-env')).default;
    return new Promise((resolve, reject) => {
        const options = {
            comments: false,
            presets: [env],
        };
        if (transit.sourceMap !== null && transit.sourceMap !== undefined) {
            options.inputSourceMap = JSON.parse(transit.sourceMap);
        }
        else {
            options.sourceMaps = true;
            options.sourceFileName = transit.srcFileName;
        }
        babel.transform(transit.data, options, (err, result) => {
            if (err) {
                reject(err);
            }
            else if (result === null) {
                reject(new Error("unknown babel error"));
            }
            else {
                resolve(result);
            }
        });
    });
};
/** js optimize フィルタ */
const jsOptimize = async (transit, context) => {
    if (context.config.dev)
        return transit;
    const result = await transpile(transit);
    if (result.map === null || result.map === undefined) {
        return transit.update(result.code ?? "", undefined);
    }
    return transit.update(result.code ?? "", JSON.stringify(result.map));
};

var jsOptimize$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    jsOptimize: jsOptimize
});

/** js format フィルタ */
const jsFormat = async (transit, context) => {
    if (context.config.dev)
        return transit;
    const prettier = await import('prettier');
    const config = (await prettier.default.resolveConfig(transit.srcFilePath)) ??
        getDefaultPrettierConfig();
    const result = prettier.default.format(transit.data, {
        ...config,
        parser: "babel",
    });
    return transit.update(result, transit.sourceMap);
};

var jsFormat$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    jsFormat: jsFormat
});

/**
 * terser の結果からソースマップを得る
 *
 * @param result - terser の結果
 * @returns ソースマップ
 */
const getSourceMap = (result) => {
    if (result.map === undefined || typeof result.map === "string") {
        return result.map;
    }
    return JSON.stringify(result.map);
};
/** js minify フィルタ */
const jsMinify = async (transit, context) => {
    if (context.config.dev)
        return transit;
    const terser = await import('terser');
    const result = await terser.minify(transit.data, {
        sourceMap: {
            content: transit.sourceMap,
        },
    });
    return transit.update(result.code ?? "", getSourceMap(result));
};

var jsMinify$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    jsMinify: jsMinify
});

/**
 * esbuild の出力からコードとソースマップを抽出
 *
 * @param outputFiles - 出力ファイルリスト
 * @returns コード, ソースマップ, 依存ファイルの配列
 */
const getEsBuildResult = (esBuildResult, srcDirPath) => {
    const result = [
        "",
        undefined,
        Object.keys(esBuildResult.metafile?.inputs ?? {}).map((x) => path.resolve(srcDirPath, path.relative(srcDirPath, x))),
    ];
    for (const file of esBuildResult.outputFiles) {
        if (/\.map$/.test(file.path)) {
            result[1] = file.text;
        }
        else {
            result[0] = file.text;
        }
    }
    return result;
};

/** mjs bundle フィルタ */
const mjsBundle = async (transit, context) => {
    const esbuild = await import('esbuild');
    const result = await esbuild.build({
        bundle: true,
        entryPoints: [transit.srcFilePath],
        splitting: false,
        sourcemap: "external",
        write: false,
        outdir: "out",
        metafile: true,
    });
    const [data, sourceMap, deps] = getEsBuildResult(result, context.config.base);
    context.dependency.add(transit.srcFilePath, ...deps);
    return transit.update(data, sourceMap);
};

var mjsBundle$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    mjsBundle: mjsBundle
});

/** ts bundle フィルタ */
const tsBundle = async (transit, context) => {
    const esbuild = await import('esbuild');
    const result = await esbuild.build({
        bundle: true,
        entryPoints: [transit.srcFilePath],
        splitting: false,
        sourcemap: "external",
        write: false,
        outdir: "out",
        metafile: true,
    });
    const [data, sourceMap, deps] = getEsBuildResult(result, context.config.base);
    context.dependency.add(transit.srcFilePath, ...deps);
    return transit.update(data, sourceMap);
};

var tsBundle$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    tsBundle: tsBundle
});

/** jpeg optimize フィルタ */
const jpegOptimize = async (transit, context) => {
    if (context.config.dev) {
        await context.file.copy(transit.srcFilePath, transit.distFilePath);
        return transit;
    }
    const jpegTran = await import('jpegtran-bin');
    if (transit.distFilePath === undefined) {
        throw new Error(`distFilePath not set`);
    }
    await context.file.prepareWrite(transit.distFilePath, true);
    await promisify(execFile)(jpegTran.default, [
        "-progressive",
        "-optimize",
        "-outfile",
        transit.distFilePath,
        transit.srcFilePath,
    ]);
    return transit;
};

var jpegOptimize$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    jpegOptimize: jpegOptimize
});

/** png optimize フィルタ */
const pngOptimize = async (transit, context) => {
    if (context.config.dev) {
        await context.file.copy(transit.srcFilePath, transit.distFilePath);
        return transit;
    }
    const optipng = await import('optipng-bin');
    if (transit.distFilePath === undefined) {
        throw new Error(`distFilePath not set`);
    }
    await context.file.prepareWrite(transit.distFilePath, true);
    await promisify(execFile)(optipng.default, [
        "-clobber",
        "-i",
        "1",
        "-out",
        transit.distFilePath,
        transit.srcFilePath,
    ]);
    return transit;
};

var pngOptimize$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    pngOptimize: pngOptimize
});

/** GIF optimize フィルタ */
const gifOptimize = async (transit, context) => {
    if (context.config.dev) {
        await context.file.copy(transit.srcFilePath, transit.distFilePath);
        return transit;
    }
    const gifsicle = await import('gifsicle');
    if (transit.distFilePath === undefined) {
        throw new Error(`distFilePath not set`);
    }
    await context.file.prepareWrite(transit.distFilePath, true);
    await promisify(execFile)(gifsicle.default, [
        "--interlace",
        "--output",
        transit.distFilePath,
        transit.srcFilePath,
    ]);
    return transit;
};

var gifOptimize$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    gifOptimize: gifOptimize
});

/** viewBoxを削除しない設定 */
const removeViewBox = {
    name: "removeViewBox",
    active: false,
};
/** id属性やdata-*属性を削除する設定 */
const removeAttrs = {
    name: "removeAttrs",
    params: {
        attrs: ["data-.*", "id"],
    },
};
/** svgoの最適化競って */
const options = {
    plugins: [removeViewBox, removeAttrs],
};
/** svg optimize フィルタ */
const svgOptimize = async (transit, context) => {
    if (context.config.dev)
        return transit;
    const svgo = await import('svgo');
    const result = svgo.optimize(transit.data, options);
    if (!("data" in result)) {
        context.logger.fileFailure("svg", transit.srcFilePath, result.error);
        return transit;
    }
    return transit.update(result.data.toString());
};

var svgOptimize$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    svgOptimize: svgOptimize
});

/** copy フィルタ */
const copy = async (transit, context) => {
    await context.file.copy(transit.srcFilePath, transit.distFilePath);
    return transit;
};

var copy$1 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    copy: copy
});

export { Config, Context, Dependency, Entry, File, Logger, Transit, build, clean, info, watch };
