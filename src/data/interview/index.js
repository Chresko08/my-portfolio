import { interviewTopics } from './topics.js';

// Modular question imports
import { advancedSqlQuestions } from './questions/advancedSql.js';
import { hadoopHiveQuestions } from './questions/hadoopHive.js';
import { pysparkQuestions } from './questions/pyspark.js';
import { pythonQuestions } from './questions/python.js';
import { azureQuestions } from './questions/azure.js';
import { databricksQuestions } from './questions/databricks.js';
import { distributedSystemsQuestions } from './questions/distributedSystems.js';
import { dataModelingQuestions } from './questions/dataModeling.js';
import { dataprocQuestions } from './questions/dataproc.js';
import { dataflowQuestions } from './questions/dataflow.js';
import { cloudComposerQuestions } from './questions/cloudComposer.js';
import { bigqueryQuestions } from './questions/bigquery.js';
import { dbtQuestions } from './questions/dbt.js';
import { unixShellQuestions } from './questions/unixShell.js';
import { cicdDevopsQuestions } from './questions/cicdDevops.js';
import { dataGovernanceQuestions } from './questions/dataGovernance.js';
import { pubsubKafkaQuestions } from './questions/pubsubKafka.js';

// Aggregated raw questions
const allQuestionsUnsorted = [
  ...advancedSqlQuestions,
  ...hadoopHiveQuestions,
  ...pysparkQuestions,
  ...pythonQuestions,
  ...azureQuestions,
  ...databricksQuestions,
  ...distributedSystemsQuestions,
  ...dataModelingQuestions,
  ...dataprocQuestions,
  ...dataflowQuestions,
  ...cloudComposerQuestions,
  ...bigqueryQuestions,
  ...dbtQuestions,
  ...unixShellQuestions,
  ...cicdDevopsQuestions,
  ...dataGovernanceQuestions,
  ...pubsubKafkaQuestions
];

// Export canonical questions sorted by qNo
export const interviewQuestions = [...allQuestionsUnsorted].sort((a, b) => a.qNo - b.qNo);

// Export canonical 17 topics metadata
export { interviewTopics } from './topics.js';

// Export backward-compatible computed categories with questions matching each topic
export const interviewCategories = interviewTopics.map(topic => ({
  id: topic.id,
  title: topic.title,
  icon: topic.icon,
  description: topic.description,
  tags: topic.tags,
  questions: interviewQuestions.filter(q => q.topics && q.topics.includes(topic.id))
}));
