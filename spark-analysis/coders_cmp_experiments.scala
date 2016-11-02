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

val sqlContext = SQLContext.getOrCreate(sc)

val df = spark.read.json("./experiments3.json")  //.as[Experiment]
df.printSchema()

val flat = df.select($"experiment".as("id"), $"series", $"treeSize", $"depth", $"time", $"stats").cache()

println(s"Total flattened results = ${flat.count()}")


val sinit = flat.filter($"series" === 1471180484030L).select($"id", $"stats.orientationToCheckpointAngle".as("o2CAng"), $"stats.podCheckpointsAngle".as("p2CAng"), $"stats.totalDistance".as("total"))

//1471165157258L, 1471180484030L, 1471183752160L, 1471208554812L, 1471257012670L, 1471258882029L, 1471279087076L, 1471536597552L, 1471559636876L, 1471601673001L

def getSeries (ds: DataFrame)(serie: Long, fields: Seq[Column]): DataFrame = ds.filter($"series" === serie).select(fields:_*)

def getSeriesDF = getSeries(df)(_,_)

def seriesArray(ds: DataFrame, series: Seq[Long], seriesFields: Seq[String]): Seq[DataFrame] = {
  return (1 to series.length).map( i => {
      val fields = seriesFields.map(field => col(field).as(field + i));
      getSeries(ds)(series(i-1), fields)
  } )
}

val stats = Seq("treeSize", "depth", "time")
val series = Seq(1471258882029L, 1471279087076L, 1471536597552L, 1471601673001L)
val indexes = 1 to series.length
val s = seriesArray(flat, series, Seq("id") ++ stats)
val cmp = s.reduce((s1, s2) => s1.join(s2, col(s1.columns(0)) === col(s2.columns(0)))).cache()

val cmpV = cmp.join(sinit,  $"id1" === $"id").drop(indexes.map("id" + _):_*)

cmpV.show(300)

//s1.join(s5, $"id" === $"id5").filter($"depth" < $"depth5").show(100)
//s2.join(s8, $"id" === $"id8").filter($"depth2" < $"depth8").show(100)

val statsAgg = Seq("max", "mean").flatMap (aggr => stats.map (field => indexes.map(i => (field + i, aggr) ).toMap))

statsAgg.foreach(aggr => { cmp.agg(aggr).show() })

//val fs = df.filter($"series" === 1471180484030L || $"series" === 1471258882029L)
//val fsSel = fs.select(explode($"result").as("pod"), $"pod.nextCheckpointId", rint($"pod.velocityCheckpointAngle").as("velChkpAngle"), $"pod.action.name", $"pod.action.thrust", rint($"pod.velocityValue").as("velocity"), rint($"pod.checkpoint1Distance").as("c1_distance"), rint($"pod.checkpoint1Angle").as("c1angl"), $"pod.depth", $"pod.totalCostEstimate").drop("pod")

val explColumns = Seq($"experiment".as("id"), $"stats.orientationToCheckpointAngle".as("o2CAng"), $"stats.podCheckpointsAngle".as("p2CAng"), $"stats.totalDistance".as("total"), $"result".as("pod"), $"success", $"depth")

def experimentDetails(id: Int, series: Long) { 
  df.filter($"experiment"===id && $"series" === series).select(explode($"trackData"), $"pod1.x", $"pod1.y", $"pod1.angle").show()
}

//System.exit(0)
