import { z } from "zod";
import { ConfigSchema } from "../base/interfaces/IConfig";
import fs from "fs";

function readConfigFile(configPath: string): string {
  try {
    return fs.readFileSync(configPath, "utf-8");
  } catch (error) {
    if (error instanceof Error && (error as NodeJS.ErrnoException).code === "ENOENT") {
      throw new Error(`Config file not found: ${(error as NodeJS.ErrnoException).message}`);
    } else if (error instanceof Error) {
      throw new Error(`An error occurred while reading the config file: ${error.message}`);
    } else {
      throw new Error("An unknown error occurred while reading the config file.");
    }
  }
}

function parseConfigFile(configFile: string): unknown {
  try {
    return JSON.parse(configFile);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON format: ${error.message}`);
    } else if (error instanceof Error) {
      throw new Error(`An error occurred while parsing the config file: ${error.message}`);
    } else {
      throw new Error("An unknown error occurred while parsing the config file.");
    }
  }
}

function validateConfig(configJson: unknown): z.infer<typeof ConfigSchema> {
  try {
    return ConfigSchema.parse(configJson);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Configuration validation errors: ${JSON.stringify(error.errors, null, 2)}`);
    } else if (error instanceof Error) {
      throw new Error(`An error occurred during configuration validation: ${error.message}`);
    } else {
      throw new Error("An unknown error occurred during configuration validation.");
    }
  }
}

export function loadAndValidateConfig(configPath: string): z.infer<typeof ConfigSchema> | never {
  try {
    const configFile = readConfigFile(configPath);
    const configJson = parseConfigFile(configFile);
    return validateConfig(configJson);
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error("An unknown error occurred.");
    }
    process.exit(1);
  }
}
