import ExpoModulesCore
import Qualtrics
import UIKit

public class ExpoQualtricsModule: Module {
    private let PASSED = "passed"
    private let SURVEY_URL = "surveyUrl"
    private let CREATIVE_TYPE = "creativeType"
    private let TARGETING_RESULT_STATUS = "targetingResultStatus"
    private let ERROR = "Error"
    private let MESSAGE = "message"
    private let QUALTRICS_INITIALIZATION_ERROR = "QUALTRICS_INITIALIZATION_ERROR"
    private let INITIALIZE_PROJECT_EVENT = "initializeProjectEvent"
    private let EVALUATE_PROJECT_EVENT = "evaluateProjectEvent"
    
    private func displayIntercept(for interceptId: String, viewController: UIViewController) -> Bool {
        Qualtrics.shared.displayIntercept(for: interceptId, viewController: viewController)
    }

    public func definition() -> ModuleDefinition {

    Name("ExpoQualtrics")
        
    Events(self.INITIALIZE_PROJECT_EVENT, self.EVALUATE_PROJECT_EVENT)
        
    AsyncFunction("displayIntercept") { (interceptId: String) -> Void in
        if let viewController = self.appContext?.utilities?.currentViewController() {
            DispatchQueue.main.async {
                _ = Qualtrics.shared.displayIntercept(for: interceptId, viewController: viewController)
            }
        }
    }
      
    Function("initializeProject") { (brandId: String, projectId: String) in
        Qualtrics.shared.initializeProject(brandId: brandId, projectId: projectId) { initializationResult in
            var initializeProjectResult = [String: [String: Any?]]()
            
            initializationResult.forEach { (interceptId, targetResult) in
                let resultMap: [String: Any?] = [
                    self.PASSED: targetResult.passed(),
                    self.MESSAGE: targetResult.getMessage()
                ]
               
                initializeProjectResult[interceptId] = resultMap
            }
            
            self.sendEvent(self.INITIALIZE_PROJECT_EVENT, initializeProjectResult)
        }
    }
        
    Function("evaluateProject") {
        Qualtrics.shared.evaluateProject { targetingResult in
            var evaluateProjectResult = [String: [String: Any?]]()
            
            targetingResult.forEach { (interceptId, targetResult) in     
                var resultMap: [String: Any?] = [
                    self.PASSED: targetResult.passed(),
                    self.SURVEY_URL: targetResult.getSurveyUrl(),
                    self.CREATIVE_TYPE: targetResult.getCreativeType(),
                    self.TARGETING_RESULT_STATUS: targetResult.getTargetingResult(),
                ]
                
                if let error = targetResult.getError() { resultMap[self.ERROR] = error.getErrorMessage() }
                evaluateProjectResult[interceptId] = resultMap
            }
                
            self.sendEvent(self.EVALUATE_PROJECT_EVENT, evaluateProjectResult)
        }
    }
      
    Function("setString") {(key: String, value: String) in
        Qualtrics.shared.properties.setString(string: value, for: key)
    }
      
    Function("setNumber") {(key: String, value: Double) in
        Qualtrics.shared.properties.setNumber(number: value, for: key)
    }
  }
}
