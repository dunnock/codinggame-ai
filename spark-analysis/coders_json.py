from pyspark.mllib.regression import LabeledPoint
from pyspark.ml.linalg import DenseVector
from pyspark.ml.regression import LinearRegression
# $example off$
#from pyspark.sql import SQLContext

#val sqlContext = SQLContext.getOrCreate(sc)

df = spark.read.json("./experiments.json")
df.printSchema()

def extractStats (stats: Stats):
  "converts stats json section into array of values"
  return (stats.totalDistance, stats.podCheckpointsAngle, stats.orientationToCheckpointAngle, stats.orientationPlusAngle)

parsedData = df.map(lambda r: LabeledPoint(r.depth, DenseVector(extractStats(r.stats)))).cache()

lir = LinearRegression(maxIter=100, regParam=0.15, elasticNetParam=0.1)

model = lir.fit(parsedData)

print("Coefficients: %s" % str(model.coefficients))
print("Intercept: %s" % str(model.intercept))

trainingSummary = model.summary
print("numIterations: %d" % trainingSummary.totalIterations)
print("objectiveHistory: %s" % str(trainingSummary.objectiveHistory))
trainingSummary.residuals.show()
print("RMSE: %f" % trainingSummary.rootMeanSquaredError)
print("r2: %f" % trainingSummary.r2)
System.exit(0)
