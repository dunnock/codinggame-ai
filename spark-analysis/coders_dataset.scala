// Works only on spark 1.6.x

/* Load the content of times.json and load into the database to initiate data */
import com.mongodb.spark._
import com.mongodb.spark.config._
import org.bson.Document 
//import org.apache.spark.rdd._
import com.mongodb.spark.sql._
import org.apache.spark.sql._


val sqlContext = SQLContext.getOrCreate(sc)

case class Stats(totalDistance: Double, podCheckpointsAngle: Double, orientationToCheckpointAngle: Double, orientationPlusAngle:Double)
case class Experiment(depth: Integer, stats: Stats, scale: Integer)

val df = MongoSpark.load[Experiment](sqlContext)  // Uses the SparkConf
df.printSchema()

val ds = df.as[Experiment]

/*
df.registerTempTable("experiments")

val ds = sqlContext.sql("SELECT depth, stats.totalDistance AS totalDistance, stats.podCheckpointsAngle AS podCheckpointsAngle, stats.orientationToCheckpointAngle AS orientationToCheckpointAngle, stats.orientationPlusAngle AS orientationPlusAngle, stats.orientationToCheckpointAngle + stats.podCheckpointsAngle AS summaryAngle, scale FROM experiments")

ds.printSchema()

val minDepth = min($"depth").alias("min_depth")

val conditions = Seq($"totalDistance" > 0, $"totalDistance" < 8100, $"totalDistance" < 16100 && $"totalDistance" > 8100, $"totalDistance" > 16100)
val columns = Seq("totalDistance", "podCheckpointsAngle", "summaryAngle", "orientationPlusAngle")

conditions.foreach(cond =>
	columns.foreach( col =>
  			println (cond.toString() + " " + col + " " + ds.filter(cond).stat.corr(col, "depth"))
  		)
	)
*/


import org.apache.spark.mllib.linalg.Vectors
import org.apache.spark.mllib.regression.LabeledPoint
//import org.apache.spark.mllib.regression.LinearRegressionModel
//import org.apache.spark.mllib.regression.LinearRegressionWithSGD
import org.apache.spark.ml.regression.LinearRegression


val parsedData = ds.map { exp =>
		LabeledPoint(exp.depth.toDouble, Vectors.dense(exp.stats.totalDistance, exp.stats.orientationPlusAngle))
	}.toDF().cache()

parsedData.show(10)

//val numIterations = 100
//val stepSize = 0.00001
//val model = LinearRegressionWithSGD.train(parsedData, numIterations, stepSize)

val lir = new LinearRegression(
      ).setFeaturesCol("features"
      ).setLabelCol("label"
      ).setRegParam(0.15
      ).setElasticNetParam(0.1
      ).setMaxIter(100)

val model = lir.fit(parsedData)

println(s"Weights: ${model.coefficients} Intercept: ${model.intercept}")

println(s"Errors meanSquaredError=${model.summary.meanSquaredError}")


/*
val dsScale = ds.groupBy("scale").agg(minDepth)
val dsNearest = ds.filter($"totalDistance" < 8100)
val dsCheckpointsAngle = dsNearest.groupBy("podCheckpointsAngle").agg(minDepth)
val dsSummaryAngle = dsNearest.groupBy("SummaryAngle").agg(minDepth)
val dsorientationPlusAngle = dsNearest.groupBy("orientationPlusAngle").agg(minDepth)

MongoSpark.write(dsScale).option("collection", "stats_scale").mode("overwrite").save()
MongoSpark.write(dsCheckpointsAngle).option("collection", "stats_checkpoints_angle").mode("overwrite").save()
MongoSpark.write(dsSummaryAngle).option("collection", "stats_summary_angle").mode("overwrite").save()
MongoSpark.write(dsorientationPlusAngle).option("collection", "stats_total_angle").mode("overwrite").save()
*/

System.exit(0)
