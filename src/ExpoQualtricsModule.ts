import { NativeModule, requireNativeModule } from "expo";

import { QualtricsEvents } from "./ExpoQualtrics.types";

declare class ExpoQualtricsModule extends NativeModule<QualtricsEvents> {
  initializeProject(brandId: string, zoneId: string): void;
  evaluateProject(): void;
  displayIntercept(interceptId: string): void;
  setString(key: string, value: string): void;
  setNumber(key: string, value: number): void;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ExpoQualtricsModule>("ExpoQualtrics");
