package expo.modules.qualtrics

import com.qualtrics.digital.*
import android.content.Context
import android.os.Bundle
import android.util.Log
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoQualtricsModule : Module() {

  private val qualtrics by lazy { Qualtrics.instance() }

  private val reactContext: Context
    get() = requireNotNull(appContext.reactContext) { "React Application Context is null" }

  override fun definition() = ModuleDefinition {

    Name("ExpoQualtrics")

    Events(INITIALIZE_PROJECT_EVENT, EVALUATE_PROJECT_EVENT)

    Function("initializeProject") { brandId: String, zoneId: String ->
      qualtrics.initializeProject(brandId, zoneId, reactContext) { initializationResult ->
        val initializeProjectResult = mutableMapOf<String, Map<String, Any>>()

        initializationResult.forEach { (interceptId, initializeResult) ->
          val resultMap = mapOf<String, Any>(
            PASSED to initializeResult.passed(),
            MESSAGE to initializeResult.message
          )

          initializeProjectResult[interceptId] = resultMap
        }
        sendEvent(INITIALIZE_PROJECT_EVENT, initializeProjectResult)
      }
    }

    Function("evaluateProject") {
      qualtrics.evaluateProject { targetingResults ->
        val evaluateProjectResult = mutableMapOf<String, MutableMap<String, Any?>>()

        targetingResults.forEach { (interceptId, targetResult) ->
          val resultMap = mutableMapOf<String, Any?>(
            PASSED to targetResult.passed(),
            SURVEY_URL to targetResult.surveyUrl,
            CREATIVE_TYPE to targetResult.creativeType?.name,
            TARGETING_RESULT_STATUS to targetResult.targetingResultStatus.toString()
          )

          if (targetResult.error != null) {
            resultMap[ERROR] = targetResult.error.message
          }

          evaluateProjectResult[interceptId] = resultMap
        }

        sendEvent(EVALUATE_PROJECT_EVENT, evaluateProjectResult)
      }
    }

    Function("displayIntercept") { interceptId: String ->
      appContext.currentActivity?.run {
        runOnUiThread {
          qualtrics.displayIntercept(this, interceptId)
        }
      }
    }

    Function("setString") { key: String, value: String ->
      qualtrics.properties.setString(key, value)
    }

    Function("setNumber") { key: String, value: Double ->
      qualtrics.properties.setNumber(key, value)
    }
  }

  companion object {
    private const val PASSED = "passed"
    private const val SURVEY_URL = "surveyUrl"
    private const val CREATIVE_TYPE = "creativeType"
    private const val TARGETING_RESULT_STATUS = "targetingResultStatus"
    private const val ERROR = "Error"
    private const val MESSAGE = "message"
    private const val INITIALIZE_PROJECT_EVENT = "initializeProjectEvent"
    private const val EVALUATE_PROJECT_EVENT = "evaluateProjectEvent"
  }
}
