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

val moveViaCheckpoint1 = flatStats.filter($"pod.nextCheckpointId" === 0 && $"pod.action.name" === "MoveViaCheckpoint1").orderBy('id, 'step
    ).select($"id", $"step", $"depth", floor("stats.podCheckpointsAngle").as("podCheckpointsAngle"), floor("stats.orientationPlusAngle").as("orientationPlusAngle"), $"pod.action.name", $"pod.action.thrust")

println(s"moveViaCheckpoint1 selected = ${moveViaCheckpoint1.count()}")

moveViaCheckpoint1.show(300)

moveViaCheckpoint1.agg(max("podCheckpointsAngle"), min("podCheckpointsAngle"), mean("podCheckpointsAngle"), max("orientationPlusAngle"), min("orientationPlusAngle"), mean("orientationPlusAngle"), max($"depth"), mean($"depth")).show()

val moveToCheckpoint1 = flatStats.filter($"pod.nextCheckpointId" === 0 && $"pod.action.name" === "MoveToCheckpoint1").orderBy('id, 'step
    ).select($"id", $"step", $"depth", floor("stats.podCheckpointsAngle").as("podCheckpointsAngle"), floor("stats.orientationPlusAngle").as("orientationPlusAngle"), $"pod.action.name", $"pod.action.thrust")

println(s"moveToCheckpoint1 selected = ${moveToCheckpoint1.count()}")

moveToCheckpoint1.show(300)

moveToCheckpoint1.agg(max("podCheckpointsAngle"), min("podCheckpointsAngle"), mean("podCheckpointsAngle"), max("orientationPlusAngle"), min("orientationPlusAngle"), mean("orientationPlusAngle"), max($"depth"), mean($"depth")).show()


val moveToCheckpoint2 = flatStats.filter($"pod.nextCheckpointId" === 0 && $"pod.action.name" === "MoveToCheckpoint2").orderBy('id, 'step
    ).select($"id", $"step", floor("stats.orientationPlusAngle"), $"pod.action.name", $"pod.action.thrust", $"pod.nextCheckpointId", $"stepsToCheckpoint1")

println(s"moveToCheckpoint2 selected = ${moveToCheckpoint2.count()}")

// val idsMoreThan7Steps = moveToCheckpoint2.filter($"stepsToCheckpoint1">7).select($"id").distinct()

moveToCheckpoint2.show(300)

//moveToCheckpoint2.join(idsMoreThan7Steps, "id").show(300)

moveToCheckpoint2.groupBy($"thrust").agg(max("stepsToCheckpoint1"), min("stepsToCheckpoint1"), mean("stepsToCheckpoint1"), stddev("stepsToCheckpoint1"), variance("stepsToCheckpoint1")).show(100)





System.exit(0)
