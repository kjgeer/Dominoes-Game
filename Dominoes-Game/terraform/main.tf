# S3 Bucket for Static Website Hosting
resource "aws_s3_bucket" "dominoes_game" {
  bucket = var.bucket_name

  tags = {
    Name        = "Dominoes Game"
    Environment = var.environment
    Project     = "dominoes-game"
  }
}

# S3 Bucket Website Configuration
resource "aws_s3_bucket_website_configuration" "dominoes_game" {
  bucket = aws_s3_bucket.dominoes_game.id

  index_document {
    suffix = "Dominoes.html"
  }

  error_document {
    key = "error.html"
  }
}

# S3 Bucket Public Access Block Configuration
resource "aws_s3_bucket_public_access_block" "dominoes_game" {
  bucket = aws_s3_bucket.dominoes_game.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

# S3 Bucket Policy for Public Read Access
resource "aws_s3_bucket_policy" "dominoes_game" {
  bucket = aws_s3_bucket.dominoes_game.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.dominoes_game.arn}/*"
      }
    ]
  })

  depends_on = [aws_s3_bucket_public_access_block.dominoes_game]
}

# Upload HTML file
resource "aws_s3_object" "html" {
  bucket       = aws_s3_bucket.dominoes_game.id
  key          = "Dominoes.html"
  source       = "../Dominoes.html"
  content_type = "text/html"
  etag         = filemd5("../Dominoes.html")
}

# Upload CSS file
resource "aws_s3_object" "css" {
  bucket       = aws_s3_bucket.dominoes_game.id
  key          = "Dominoes.css"
  source       = "../Dominoes.css"
  content_type = "text/css"
  etag         = filemd5("../Dominoes.css")
}

# Upload JS file
resource "aws_s3_object" "js" {
  bucket       = aws_s3_bucket.dominoes_game.id
  key          = "Dominoes.js"
  source       = "../Dominoes.js"
  content_type = "application/javascript"
  etag         = filemd5("../Dominoes.js")
}

# Upload error page
resource "aws_s3_object" "error" {
  bucket       = aws_s3_bucket.dominoes_game.id
  key          = "error.html"
  source       = "../error.html"
  content_type = "text/html"
  etag         = filemd5("../error.html")
}