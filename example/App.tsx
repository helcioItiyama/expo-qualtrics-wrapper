import Qualtrics from "expo-qualtrics";
import { Button, SafeAreaView, ScrollView, Text } from "react-native";

export const QualtricsKey = {
  screen_name: "screen_name",
  link_name: "link_name",
  locale: "locale",
  code_version: "code_version",
  operating_system: "operating_system",
  loyalty_state_tier: "loyalty_state_tier",
  error_code: "error_code",
  random_number: "random_number",
};

export type QualtricsKeyType = (typeof QualtricsKey)[keyof typeof QualtricsKey]

export type QualtricsVariables = {
  [key in QualtricsKeyType]: string | number;
};

export const qualtricsFeedbackValues: QualtricsVariables = {}

export default function App() {
  function updateQualtricsParameter(
    key: QualtricsKeyType,
    value: string | number,
  ): void {
    switch (typeof value) {
      case "number":
        Qualtrics.setNumber(key, value as number);
        break;
      case "string":
        Qualtrics.setString(key, value as string);
        break;
      default:
        console.log(`invalid value: ${value} for updating the key: ${key}`);
        break;
    }
    qualtricsFeedbackValues[key] = encodeURIComponent(value);
    console.log(`key ${key} updated with value: ${value}`);
  }

  function updateGlobalVariables(): void {
    updateQualtricsParameter(QualtricsKey.locale, "en_US");
    updateQualtricsParameter(QualtricsKey.code_version, "1.0.0");
    updateQualtricsParameter(QualtricsKey.operating_system, "Android");
    updateQualtricsParameter(QualtricsKey.error_code, "");
    updateQualtricsParameter(
      QualtricsKey.random_number,
      Math.floor(Math.random() * 100),
    );
  }

  const onClicked = () => {
    console.log("clicked");
    try {
      Qualtrics.initializeProject(
        "<brand_id>",
        "<zone_id>",
        (initializationResult) => {
          if (
            Object.values(initializationResult).some((value) => value.passed)
          ) {
            console.log("initializationResult", initializationResult);
            updateGlobalVariables();
          }
        },
      );
    } catch (error) {
      console.error("Error initializing project:", error);
    }
  };

  const onEvaluate = () => {
    console.log("evaluate");
    try {
      Qualtrics.setString("link_name", "Debug Menu Site Intercept");
      Qualtrics.evaluateProject((targetingResult) => {
        Object.entries(targetingResult).forEach(([key, value]) => {
          if (value.passed) {
            Qualtrics.displayIntercept(key);
          }
        });
        console.log("Targeting result:", targetingResult);
      });
    } catch (error) {
      console.error("Error initializing project:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <Text style={styles.header}>Module API Example</Text>
        <Button title="Initialize Qualtrics" onPress={onClicked} />
        <Button title="Show Intercept" onPress={onEvaluate} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = {
  header: {
    fontSize: 30,
    margin: 20,
  },
  groupHeader: {
    fontSize: 20,
    marginBottom: 20,
  },
  group: {
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#eee',
  },
  view: {
    flex: 1,
    height: 200,
  },
};
