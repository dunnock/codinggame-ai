// Works only on spark 2.0.0

/* Load the content of times.json and load into the database to initiate data */
//import org.apache.spark.rdd._
import org.apache.spark.sql._
import org.apache.spark.sql.types._
import org.apache.spark.sql.functions._
import org.apache.spark.ml.linalg.DenseVector
import org.apache.spark.ml.feature.LabeledPoint
import org.apache.spark.ml.feature.VectorAssembler
import org.apache.spark.ml.regression.LinearRegression
import spark.implicits._


case class Action(name: String, thrust: Long)
case class FlatPoint(x: Double, y: Double)
case class PodStep(orientation: FlatPoint, nextCheckpointId: Long, position: FlatPoint, velocity: FlatPoint, target: String, action: Action)
//case class PodStep(action: Action)
case class Stats(totalDistance: Double, podCheckpointsAngle: Double, orientationToCheckpointAngle: Double, orientationPlusAngle:Double)
case class Experiment(depth: Double, stats: Stats)
case class ExperimentFlat(id: String, depth: Double, stats: Stats, step: Long, pod: PodStep)

def extractStats = (stats: Stats) => Array(stats.totalDistance, stats.podCheckpointsAngle, stats.orientationToCheckpointAngle, stats.orientationPlusAngle)

val sqlContext = SQLContext.getOrCreate(sc)

val df = spark.read.json("./experiments.json")  //.as[Experiment]
df.printSchema()

val stepsToCheckpoint1 = hypot($"pod.action.p1.x" - $"pod.position.x", $"pod.action.p1.y" - $"pod.position.y") / hypot($"pod.velocity.x", $"pod.velocity.y")

val flat = df.select($"_id.$$oid".as("id"), $"stats", $"depth", explode($"result").as("pod")).withColumn("step", $"pod.depth").withColumn("stepsToCheckpoint1", stepsToCheckpoint1)

println(s"Total flattened results = ${flat.count()}")

if(false) {

  val flatStats = flat.filter($"stats.totalDistance" < 8100)


  println(s"Selected = ${flatStats.count()}")
  /*
  val grouped = flatStats.select($"id", floor("stats.orientationPlusAngle").as("orientationPlusAngle"), $"depth", $"step", $"pod.action.name", $"pod.action.thrust", $"pod.nextCheckpointId"
      ).groupBy($"id", $"orientationPlusAngle", $"nextCheckpointId", $"depth", $"name", $"thrust"
      ).agg(max($"step").as("step"))

  println(s"Grouped = ${grouped.count()}")

  grouped.orderBy('id.asc, 'step.asc).show(100)
  */

  //val ids10 = df.select($"_id.$$oid".as("id")).limit(10)
  //flat.join(ids10, "id").orderBy('id, 'step).select($"step", floor("stats.orientationPlusAngle"), $"pod.action.name", $"pod.action.thrust", $"pod.nextCheckpointId", $"stepsToCheckpoint1").show(300)

  val moveToCheckpoint2 = flatStats.filter($"pod.nextCheckpointId" === 0 && $"pod.action.name" === "MoveToCheckpoint2").orderBy('id, 'step
      ).select($"id", $"step", floor("stats.orientationPlusAngle"), $"pod.action.name", $"pod.action.thrust", $"pod.nextCheckpointId", $"stepsToCheckpoint1")

  println(s"moveToCheckpoint2 selected = ${moveToCheckpoint2.count()}")

  // val idsMoreThan7Steps = moveToCheckpoint2.filter($"stepsToCheckpoint1">7).select($"id").distinct()

  moveToCheckpoint2.show(300)

  //moveToCheckpoint2.join(idsMoreThan7Steps, "id").show(300)

  moveToCheckpoint2.groupBy($"thrust").agg(max("stepsToCheckpoint1"), min("stepsToCheckpoint1"), mean("stepsToCheckpoint1"), stddev("stepsToCheckpoint1"), variance("stepsToCheckpoint1")).show(100)


}


val flatForRegression = flat.filter($"step" === 0
  ).select(rint("depth").as("depth"), 
//          $"pod.checkpoint1Angle", 
          $"pod.checkpoint1Distance", 
//          $"pod.checkpoint2Angle", 
          $"pod.checkpoint2Distance", 
          $"stats.totalDistance", 
//          $"stats.podCheckpointsAngle", 
//          $"stats.orientationToCheckpointAngle", 
          $"stats.orientationPlusAngle".as("alpha"),
          cos(toRadians($"stats.orientationPlusAngle")).as("cosAlpha")
  )
val columnsToVector = new VectorAssembler(
//  ).setInputCols(Array("checkpoint1Angle", "checkpoint1Distance", "checkpoint2Angle", "checkpoint2Distance", "totalDistance", "alpha", "cosAlpha", "sinAlpha") //, "podCheckpointsAngle", "orientationToCheckpointAngle", "orientationPlusAngle")
  ).setInputCols(Array("checkpoint1Distance", "checkpoint2Distance", "totalDistance", "alpha", "cosAlpha")
  ).setOutputCol("features")

val parsedData = columnsToVector.transform(flatForRegression)

parsedData.show(3)

/*
flatStats.filter($"step" === 0
  ).withColumn("checkpoint1Angle", $"pod.checkpoint1Angle"
  ).withColumn("checkpoint1Distance", $"pod.checkpoint1Distance"
  ).withColumn("checkpoint2Angle", $"pod.checkpoint2Angle"
  ).withColumn("checkpoint2Distance", $"pod.checkpoint2Distance")
  ).withColumn("totalDistance", $"stats.totalDistance"
  ).withColumn("podCheckpointsAngle", $"stats.podCheckpointsAngle"
  ).withColumn("orientationToCheckpointAngle", $"stats.orientationToCheckpointAngle"
  ).withColumn("orientationPlusAngle", $"stats.orientationPlusAngle")
*/

/*
val parsedData2 = df.as[Experiment].map { r:Experiment =>
    LabeledPoint(r.depth, new DenseVector( extractStats(r.stats) ))
  }.toDF().cache()

parsedData2.show(3)

*/


val lir = new LinearRegression(
      ).setFeaturesCol("features"
      ).setLabelCol("depth"
      ).setRegParam(0.00
      ).setElasticNetParam(0.8
      ).setMaxIter(100)

val model = lir.fit(parsedData)

println(s"Weights: ${model.coefficients} Intercept: ${model.intercept}")

println(s"Errors meanSquaredError=${model.summary.meanSquaredError}")



System.exit(0)
