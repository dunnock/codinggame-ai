/* Load the content of times.json and load into the database to initiate data */
import com.mongodb.spark._
import com.mongodb.spark.config._
import org.bson.Document 
//import org.apache.spark.rdd._
import com.mongodb.spark.sql._
import org.apache.spark.sql._


val sqlContext = SQLContext.getOrCreate(sc)

val df = MongoSpark.load(sqlContext)  // Uses the SparkConf
df.printSchema()

df.registerTempTable("experiments")

val ds = sqlContext.sql("SELECT depth, stats.totalDistance AS totalDistance, stats.podCheckpointsAngle AS podCheckpointsAngle, stats.orientationToCheckpointAngle AS orientationToCheckpointAngle, stats.orientationPlusAngle AS orientationPlusAngle, scale FROM experiments")

//val rdd = MongoSpark.load(sc)

println("Input Count: " + rdd.count)

def convertToInt(x: Any): Integer = x match {
    case x : Double => x.toInt
    case x : Integer => x.toInt
    case x : String => x.toInt
  }

def createDoc (tuple: (Any, Integer), aType: String): Document = {
	val newdoc = new Document(); 
    newdoc.append("type", aType); 
    newdoc.append("value", tuple._1); 
    newdoc.append("depth", tuple._2); 
    newdoc 
}

def analyze(ds: DataSet, f: Document => Any, name: String) = {
	val result = ds.map((doc) => (f(doc), doc.getInteger("depth"))
    	).reduceByKey( (x,y) => if (x < y) x else y
    	).map((tuple) => createDoc(tuple, name))
	result.saveToMongoDB()
}

	analyze(rdd, (doc:Document) => doc.getInteger("scale"), "scale")

val rddFiltered = rdd.filter((doc) => (convertToInt(getDocumentSubField(doc, "stats.totalDistance")) < 8100))

	analyze(rddFiltered, (doc: Document) => convertToInt(getDocumentSubField(doc, "stats.podCheckpointsAngle")), "checkpoints_angle")

	analyze(rddFiltered, (doc: Document) => convertToInt(getDocumentSubField(doc, "stats.orientationToCheckpointAngle")) +
					convertToInt(getDocumentField(doc, "stats.podCheckpointsAngle")), "summary_angle")

	analyze(rddFiltered, (doc: Document) => convertToInt(getDocumentSubField(doc, "stats.orientationPlusAngle")), "summary_abs_angle")



System.exit(0)
