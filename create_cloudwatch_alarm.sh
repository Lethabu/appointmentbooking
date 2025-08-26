#!/bin/bash

aws cloudwatch put-metric-alarm --alarm-name booking-api-lambda-errors \
  --metric-name Errors --namespace AWS/Lambda \
  --statistic Sum --period 300 --threshold 1 \
  --comparison-operator GreaterThanOrEqualToThreshold \
  --dimensions Name=FunctionName,Value=booking-api-lambda \
  --evaluation-periods 1 --alarm-actions arn:aws:sns:af-south-1:YOUR_AWS_ACCOUNT_ID:your-sns-topic
