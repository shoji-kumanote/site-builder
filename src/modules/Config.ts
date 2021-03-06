import path from "path";

import { CliOption } from "../types/CliOption";
import { PageData } from "../types/PageData";

import { ConfigFileData, loadConfigFile, mergeConfigFile } from "./ConfigFile";
import { FilterType } from "./FilterType";

/** タイプ: 設定データ */
type ConfigData = Omit<CliOption & ConfigFileData, "data">;

/** クラス: 設定 */
export class Config implements ConfigData {
  #config: string[];

  #src: string[];
  #vendor: string[];
  #ignore: string[];
  #disabled: FilterType[];
  #externalModules: string[];

  readonly dryRun: boolean;
  readonly dev: boolean;

  readonly base: string;
  readonly dist: string;

  #pageData: PageData;

  /**
   * 設定を作成
   *
   * @param cliOption - コマンドラインオプション
   */
  static async create(cliOption: CliOption): Promise<Config> {
    if (cliOption.config.length === 0) {
      throw new Error("設定ファイルが指定されていません");
    }

    const config = cliOption.config.map((x) => path.resolve(x));

    const allConfigFileData = await Promise.all(
      config.map((x) => loadConfigFile(x))
    );

    const configFileData = mergeConfigFile(...allConfigFileData);

    return new Config(
      {
        ...cliOption,
        config,
        ...configFileData,
      },
      configFileData.data
    );
  }

  private constructor(data: ConfigData, pageData: PageData) {
    this.#config = data.config;
    this.dryRun = data.dryRun;
    this.dev = data.dev;

    this.base = data.base;
    this.dist = data.dist;
    this.#src = data.src;
    this.#vendor = data.vendor;
    this.#ignore = data.ignore;
    this.#disabled = data.disabled;
    this.#externalModules = data.externalModules;

    this.#pageData = pageData;
  }

  get config(): string[] {
    return [...this.#config];
  }

  get src(): string[] {
    return [...this.#src];
  }

  get vendor(): string[] {
    return [...this.#vendor];
  }

  get ignore(): string[] {
    return [...this.#ignore];
  }

  get disabled(): FilterType[] {
    return [...this.#disabled];
  }

  get externalModules(): string[] {
    return [...this.#externalModules];
  }

  /**
   * ページデータ取得
   *
   * @param entryPath - 対象のファイルパス
   */
  getData(entryPath?: string): PageData {
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
