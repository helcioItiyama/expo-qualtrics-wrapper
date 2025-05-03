export type InitializationResult = Record<
  string,
  {
    passed: boolean;
    message: string;
  }
>;

export type TargetingResult = Record<
  string,
  {
    passed: boolean;
    surveyUrl: string;
    creativeType: string;
    targetingResultStatus: string;
    error?: string;
  }
>;

export type EvaluateProjectCb = (arg: TargetingResult) => void;

export type QualtricsEvents = {
  initializeProjectEvent: (res: InitializationResult) => void;
  evaluateProjectEvent: (res: TargetingResult) => void;
};

export type InitializeProjectCb = (arg: InitializationResult) => void;
