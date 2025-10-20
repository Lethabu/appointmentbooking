#!/bin/bash

# Create a new IAM role for the Lambda function
aws iam create-role --role-name booking-api-lambda-role --assume-role-policy-document file://lambda-role-policy.json

# Attach the AWSLambdaBasicExecutionRole policy to the role
aws iam attach-role-policy --role-name booking-api-lambda-role --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

# Create the Lambda function
aws lambda create-function --function-name booking-api-lambda \
  --runtime nodejs18.x --handler booking-api-lambda.handler \
  --role arn:aws:iam::YOUR_AWS_ACCOUNT_ID:role/booking-api-lambda-role \
  --zip-file fileb://booking-api-lambda.zip

# Create a new API Gateway REST API
api_id=$(aws apigateway create-rest-api --name 'Booking API' --query 'id' --output text)

# Get the root resource ID
root_resource_id=$(aws apigateway get-resources --rest-api-id $api_id --query 'items[?path==`/`].id' --output text)

# Create a new resource under the root
resource_id=$(aws apigateway create-resource --rest-api-id $api_id --parent-id $root_resource_id --path-part booking --query 'id' --output text)

# Create a new POST method for the resource
aws apigateway put-method --rest-api-id $api_id --resource-id $resource_id --http-method POST --authorization-type NONE

# Set the Lambda function as the integration for the method
aws apigateway put-integration --rest-api-id $api_id --resource-id $resource_id --http-method POST --type AWS_PROXY \
  --integration-http-method POST --uri arn:aws:apigateway:af-south-1:lambda:path/2015-03-31/functions/arn:aws:lambda:af-south-1:YOUR_AWS_ACCOUNT_ID:function:booking-api-lambda/invocations

# Deploy the API
aws apigateway create-deployment --rest-api-id $api_id --stage-name prod

# Print the API endpoint URL
echo "API Gateway endpoint URL: https://$api_id.execute-api.af-south-1.amazonaws.com/prod/booking"
