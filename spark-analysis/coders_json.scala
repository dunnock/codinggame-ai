// Works only on spark 2.0.0

/* Load the content of times.json and load into the database to initiate data */
//import org.apache.spark.rdd._
import org.apache.spark.sql._
import org.apache.spark.sql.types._
import org.apache.spark.ml.linalg.DenseVector
import org.apache.spark.ml.feature.LabeledPoint
import org.apache.spark.ml.regression.LinearRegression


val sqlContext = SQLContext.getOrCreate(sc)

case class Stats(totalDistance: Double, podCheckpointsAngle: Double, orientationToCheckpointAngle: Double, orientationPlusAngle:Double)
case class Experiment(depth: Double, stats: Stats)


def extractFieldNames[T<:Product:Manifest] = {
  implicitly[Manifest[T]].erasure.getDeclaredFields.map(_.getName)
}


val scheme = StructType( Seq(
        StructField("depth", DoubleType, true),
        StructField("stats", 
          StructType(extractFieldNames[Stats].map(StructField(_, DoubleType, true))), 
          true) ) )

//val df = sqlContext.read.schema(scheme).json("./experiments.json").as[Experiment]
val df = spark.read.json("./experiments.json").as[Experiment]
df.printSchema()

//ds.printSchema()   

//val stats = Array("totalDistance", "podCheckpointsAngle", "orientationToCheckpointAngle", "orientationPlusAngle")
//val statsFields = stats.map($_.cast(DoubleType))
def extractStats = (stats: Stats) => Array(stats.totalDistance, stats.podCheckpointsAngle, stats.orientationToCheckpointAngle, stats.orientationPlusAngle)
val parsedData = df.map { r:Experiment =>
    LabeledPoint(r.depth, new DenseVector( extractStats(r.stats) ))
  }.toDF().cache()


val lir = new LinearRegression(
      ).setFeaturesCol("features"
      ).setLabelCol("label"
      ).setRegParam(0.15
      ).setElasticNetParam(0.1
      ).setMaxIter(100)

val model = lir.fit(parsedData)

println(s"Weights: ${model.coefficients} Intercept: ${model.intercept}")

println(s"Errors meanSquaredError=${model.summary.meanSquaredError}")

System.exit(0)
