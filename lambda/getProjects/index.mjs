import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const db     = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  try {
    const { Items } = await db.send(
      new ScanCommand({ TableName: 'portfolio-projects' })
    );

    Items.sort((a, b) => a.index.localeCompare(b.index));

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://dvoorjnvhpajk.cloudfront.net/',
      },
      body: JSON.stringify(Items),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};