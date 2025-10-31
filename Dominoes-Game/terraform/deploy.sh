#!/bin/bash

# Dominoes Game Deployment Script
# This script automates the deployment of the Dominoes game to AWS S3

set -e  # Exit on error

echo "Dominoes Game S3 Deployment Script"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo -e "${RED}Error: AWS CLI is not installed.${NC}"
    echo "Please install AWS CLI: https://aws.amazon.com/cli/"
    exit 1
fi

# Check if Terraform is installed
if ! command -v terraform &> /dev/null; then
    echo -e "${RED}Error: Terraform is not installed.${NC}"
    echo "Please install Terraform: https://www.terraform.io/downloads"
    exit 1
fi

# Check AWS credentials
echo -e "${YELLOW}Checking AWS credentials...${NC}"
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}Error: AWS credentials not configured.${NC}"
    echo "Please run: aws configure"
    exit 1
fi

echo -e "${GREEN}AWS credentials verified!${NC}"
echo ""

# Get AWS account info
AWS_ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
AWS_REGION=$(aws configure get region || echo "us-east-1")

echo "AWS Account: $AWS_ACCOUNT"
echo "AWS Region: $AWS_REGION"
echo ""

# Prompt for bucket name
read -p "Enter S3 bucket name (or press Enter for default 'dominoes-game-static-website'): " BUCKET_NAME
BUCKET_NAME=${BUCKET_NAME:-dominoes-game-static-website}

# Check if bucket name is available
echo -e "${YELLOW}Checking bucket name availability...${NC}"
if aws s3 ls "s3://$BUCKET_NAME" 2>&1 | grep -q 'NoSuchBucket'; then
    echo -e "${GREEN}Bucket name is available!${NC}"
elif aws s3 ls "s3://$BUCKET_NAME" 2>&1 | grep -q 'An error occurred'; then
    echo -e "${GREEN}Bucket name is available!${NC}"
else
    echo -e "${RED}Warning: Bucket name '$BUCKET_NAME' may already exist.${NC}"
    read -p "Continue anyway? (y/n): " CONTINUE
    if [[ $CONTINUE != "y" ]]; then
        echo "Deployment cancelled."
        exit 1
    fi
fi


# Initialize Terraform
echo -e "${YELLOW}Initializing Terraform...${NC}"
terraform init


# Create or update terraform.tfvars
cat > terraform.tfvars << EOF
bucket_name = "$BUCKET_NAME"
aws_region  = "$AWS_REGION"
environment = "prod"
EOF

echo -e "${GREEN}Created terraform.tfvars${NC}"
echo ""

# Plan deployment
echo -e "${YELLOW}Creating deployment plan...${NC}"
terraform plan

echo ""
echo "Ready to deploy!"
echo ""
read -p "Do you want to proceed with deployment? (y/n): " DEPLOY

if [[ $DEPLOY == "y" ]]; then
    echo ""
    echo -e "${YELLOW}Deploying...${NC}"
    terraform apply -auto-approve

    echo ""
    echo "Deployment Complete!"
    echo ""

    # Get website URL
    WEBSITE_URL=$(terraform output -raw website_endpoint 2>/dev/null || echo "")

    if [[ -n $WEBSITE_URL ]]; then
        echo -e "${GREEN}Your website is now live at:${NC}"
        echo -e "${GREEN}$WEBSITE_URL${NC}"
        echo ""
        echo "Note: It may take a few minutes for the website to become accessible."
    fi

    echo ""
    echo "To update your website, modify the HTML/CSS/JS files and run:"
    echo "  terraform apply"
    echo ""
    echo "To destroy all resources, run:"
    echo "  terraform destroy"
else
    echo "Deployment cancelled."
fi
