import { EvaluateProjectCb, InitializationResult, InitializeProjectCb, TargetingResult } from "./ExpoQualtrics.types";
import ExpoQualtricsModule from "./ExpoQualtricsModule";

export * from "./ExpoQualtrics.types";

const INITIALIZE_PROJECT_EVENT = "initializeProjectEvent";
const EVALUATE_PROJECT_EVENT = "evaluateProjectEvent";

function isEventInProgress(eventType: string) {
  return ExpoQualtricsModule.eventEmitter?.listenerCount?.(eventType) > 0;
}

function initializeProject(
  brandId: string,
  zoneId: string,
  callback: InitializeProjectCb,
): void {
  try {
    if (isEventInProgress(INITIALIZE_PROJECT_EVENT)) {
      const result = {
        ERROR: {
          passed: false,
          message: "Qualtrics module not initialized",
        },
      };

      callback(result);
    }

    ExpoQualtricsModule.addListener(INITIALIZE_PROJECT_EVENT, (result) => {
      if (result === null || Object.keys(result).length === 0) {
        const errorResult = {
          ERROR: {
            passed: false,
            message: "Invalid InitializationResult Received",
          },
        };

        callback(errorResult);
      } else {
        const initializationResults: InitializationResult = {};

        Object.entries(result).forEach(([key, value]) => {
          if (value.message && value.passed) {
            initializationResults[key] = {
              passed: value.passed,
              message: value.message,
            };
          }
        });

        callback(initializationResults);
      }

      ExpoQualtricsModule.removeAllListeners(INITIALIZE_PROJECT_EVENT);
    });

    ExpoQualtricsModule.initializeProject(brandId, zoneId);
  } catch (error) {
    console.log("error initializing Qualtrics project", error);
  }
}

function evaluateProject(callback: EvaluateProjectCb): void {
  try {
    if (isEventInProgress(EVALUATE_PROJECT_EVENT)) {
      const result = {
        ERROR: {
          passed: false,
          targetingResultStatus: "error",
          error: "Evaluation already in progress",
          surveyUrl: "Evaluation already in progress",
          creativeType: "",
        },
      };

      callback(result);
    }

    ExpoQualtricsModule.addListener(EVALUATE_PROJECT_EVENT, (result) => {
      if (result === null || Object.keys(result).length === 0) {
        const errorResult = {
          ERROR: {
            passed: false,
            targetingResultStatus: "error",
            error: "Invalid TargetingResult Received",
            surveyUrl: "Invalid TargetingResult Received",
            creativeType: "",
          },
        };

        callback(errorResult);
      } else {
        const targetingResults: TargetingResult = {};

        Object.entries(result).forEach(([key, value]) => {
          targetingResults[key] = {
            passed: value.passed,
            targetingResultStatus: value.targetingResultStatus,
            error: value.error,
            surveyUrl: value.surveyUrl,
            creativeType: value.creativeType,
          };
        });

        callback(targetingResults);
      }

      ExpoQualtricsModule.removeAllListeners(EVALUATE_PROJECT_EVENT);
    });

    ExpoQualtricsModule.evaluateProject();
  } catch (error) {
    console.log("error evaluating Qualtrics project", error);
  }
}

function displayIntercept(interceptId: string): void {
  try {
    ExpoQualtricsModule.displayIntercept(interceptId);
  } catch (error) {
    console.log("error displaying intercept", error);
  }
}

function setString(key: string, value: string): void {
  ExpoQualtricsModule.setString(key, value);
}

function setNumber(key: string, value: number): void {
  ExpoQualtricsModule.setNumber(key, value);
}

export default {
  initializeProject,
  evaluateProject,
  displayIntercept,
  setString,
  setNumber,
};
