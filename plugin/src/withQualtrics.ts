import { ConfigPlugin, createRunOncePlugin } from "expo/config-plugins";
import { withBuildProperties } from "expo-build-properties";

const pkg = require("../../package.json");

const withQualtrics: ConfigPlugin = (config) => {
  return withBuildProperties(config, {
    android: {
      extraMavenRepos: [
        { url: "https://s3-us-west-2.amazonaws.com/si-mobile-sdks/android/" },
      ],
    },
  });
};

export default createRunOncePlugin(withQualtrics, pkg.name, pkg.version);
