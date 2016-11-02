// Works only on spark 2.0.0

/* Load the content of times.json and load into the database to initiate data */
//import org.apache.spark.rdd._
import org.apache.spark.sql._
import org.apache.spark.sql.types._
import org.apache.spark.sql.functions._
import org.apache.spark.ml.linalg.Vector
import org.apache.spark.ml.linalg.SQLDataTypes._
import org.apache.spark.ml.feature.ElementwiseProduct
import org.apache.spark.ml.feature.RFormula
import org.apache.spark.ml.classification.LogisticRegression
import org.apache.spark.ml.classification.BinaryLogisticRegressionSummary


case class Action(name: String, thrust: Long)
case class FlatPoint(x: Double, y: Double)
case class PodStep(orientation: FlatPoint, nextCheckpointId: Long, position: FlatPoint, velocity: FlatPoint, target: String, action: Action)
//case class PodStep(action: Action)
case class Stats(totalDistance: Double, podCheckpointsAngle: Double, orientationToCheckpointAngle: Double, orientationPlusAngle:Double)
case class Experiment(depth: Double, stats: Stats)
case class ExperimentFlat(id: String, depth: Double, stats: Stats, step: Long, pod: PodStep)

def extractStats = (stats: Stats) => Array(stats.totalDistance, stats.podCheckpointsAngle, stats.orientationToCheckpointAngle, stats.orientationPlusAngle)

val sqlContext = SQLContext.getOrCreate(sc)

import spark.implicits._

val df = spark.read.json("./experiments.json")  //.as[Experiment]
df.printSchema()

val stepsToCheckpoint1 = hypot($"pod.action.p1.x" - $"pod.position.x", $"pod.action.p1.y" - $"pod.position.y") / hypot($"pod.velocity.x", $"pod.velocity.y")

val flat = df.select($"_id.$$oid".as("id"), $"stats", $"depth", explode($"result").as("pod")).withColumn("step", $"pod.depth") // .withColumn("stepsToCheckpoint1", stepsToCheckpoint1)

println(s"Total flattened results = ${flat.count()}")


val velocityAngle = atan2($"pod.velocity.x", $"pod.velocity.y")
val orientationAngle = atan2($"pod.orientation.x", $"pod.orientation.y")

val flatForRegression = flat.filter($"pod.nextCheckpointId" === 0 && not(isnull($"pod.action.name"))
  ).select(($"pod.action.name" === "MoveToCheckpoint2").as("name"),
          hypot($"pod.velocity.x", $"pod.velocity.y").as("velocity"), 
          $"pod.checkpoint1Distance", 
          $"pod.checkpoint2Distance", 
          ($"pod.checkpoint1Angle" - $"pod.checkpoint2Angle").as("betweenCheckpointsAngle"),
          abs($"pod.checkpoint1Angle" - velocityAngle).as("velocityAngle"), 
          abs($"pod.checkpoint1Angle" - orientationAngle).as("orientationAngle")
  )

/* DOES NOT WORK WHEN SOURCE VALUE IS NULL!!! REPORT */
val transform = new RFormula(
  ).setFormula("name ~ velocity + checkpoint1Distance + betweenCheckpointsAngle + velocityAngle"
  ).setFeaturesCol("features"
  ).setLabelCol("label")

val parsedData = transform.fit(flatForRegression).transform(flatForRegression).cache()

parsedData.show(3)


val lir = new LogisticRegression(
      ).setFeaturesCol("features"
      ).setLabelCol("label"
      ).setPredictionCol("prediction"
      ).setProbabilityCol("probability"
      ).setRegParam(0.00
      ).setElasticNetParam(0.8
      ).setMaxIter(100)

val model = lir.fit(parsedData)

println(s"Weights: ${model.coefficients} Intercept: ${model.intercept}")

val applicationData = parsedData.select($"name", $"velocity", $"checkpoint1Distance", $"label", $"features").cache()

model.transform(applicationData).show(500)

val trainingSummary =  model.summary

// Obtain the objective per iteration.
val objectiveHistory = trainingSummary.objectiveHistory
println("objectiveHistory:")
objectiveHistory.foreach(loss => println(loss))

// Obtain the metrics useful to judge performance on test data.
// We cast the summary to a BinaryLogisticRegressionSummary since the problem is a
// binary classification problem.
val binarySummary = trainingSummary.asInstanceOf[BinaryLogisticRegressionSummary]

// Obtain the receiver-operating characteristic as a dataframe and areaUnderROC.
val roc = binarySummary.roc
//roc.show()
println(s"areaUnderROC: ${binarySummary.areaUnderROC}")
//binarySummary.precisionByThreshold.show(10)



import org.apache.spark.sql.functions.udf

def sumproduct(a1: Array[Double], a2: Array[Double]) = {
  var sum: Double = 0
  for(i <- 0 to (a1.length-1)) {
    sum += a1(i)*a2(i)
  }
  sum
}

val sumproductUDF = udf { (v1: org.apache.spark.ml.linalg.Vector, v2: org.apache.spark.ml.linalg.Vector) => sumproduct(v1.toArray, v2.toArray) }

case class Coeff (coeff: org.apache.spark.ml.linalg.Vector)
val coeff = sqlContext.createDataset(Seq(Coeff(model.coefficients)))
applicationData.join(coeff).withColumn("probability", pow((exp(-(sumproductUDF($"features", $"coeff") + model.intercept)) + 1), -1)).show(300)



//res.show(100)

System.exit(0)
