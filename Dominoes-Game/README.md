# Dominoes Game

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Demo](#demo)
- [Quick Start](#quick-start)
- [Game Rules](#game-rules)
- [Development](#development)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Contributing](#contributing)

---

## Overview

This project is a **browser-based dominoes game** built with vanilla JavaScript, HTML, and CSS. It features both human vs human and human vs AI gameplay modes with a complete deployment infrastructure using Docker and AWS S3.

---

## Features

### Game Features

- **Two Game Modes:**
  - 2 Player Hot-Seat Mode
  - Player vs Computer (AI)
- **Score Tracking:** Points or wins based scoring
- **Responsive Design:** Works on desktop, tablet, and mobile
- **Visual Feedback:**
  - Color-coded domino pips
  - Red highlighting for playable tiles
  - Smooth animations
- **Game Log:** Track all moves and game events
- **Customizable Settings:** Adjust target score and scoring type
- **Console Version:** Node.js implementation with multi-threaded AI players

### Infrastructure Features

- **Docker Support:** Containerized deployment with health checks
- **AWS S3 Deployment:** Static website hosting on AWS
- **Custom Error Pages:** Professional 404 error handling
- **Terraform IaC:** Automated infrastructure provisioning

---

## Demo

### Game Screenshots

**Landing Page:**
```
Clean, modern interface with game mode selection
```

**Game Board:**
```
Interactive domino tiles with visual feedback
Real-time score tracking and game log
```

---

## Quick Start

### Prerequisites

- **For Local Play:** Modern web browser (Chrome, Firefox, Safari, Edge)
- **For Docker:** Docker Desktop installed
- **For AWS Deployment:** AWS CLI, Terraform, and AWS account
- **For Console Version:** Node.js (v14 or higher)

### Option 1: Play Locally (Simplest)

```bash
# Clone the repository
git clone https://github.com/ArsalanAnwer0/Dominoes-Game.git
cd Dominoes-Game/Dominoes-Game

# Open in browser
open Dominoes.html
# Or double-click the file
```

### Option 2: Run with Docker

```bash
# Build and run with Docker Compose
docker-compose up

# Or build manually
docker build -t dominoes-game .
docker run -p 8081:8080 dominoes-game

# Open browser
open http://localhost:8081
```

### Option 3: Console Version

```bash
# Navigate to console version
cd console-version

# Install dependencies
npm install

# Run the game
node dominoes-game.js

# Run tests
node test-game.js
```

### Option 4: AWS S3 Deployment

See [Deployment Guide](#deployment) below.

---

## Game Rules

### Setup
- **28 Domino Tiles:** 0-0 through 6-6
- **Each Player:** 10 tiles
- **Boneyard:** 8 remaining tiles

### How to Play

1. **Starting:** Random player begins by playing any tile
2. **Playing:**
   - Match one half of your tile to the chain's head (left) or tail (right)
   - Click on highlighted red tiles to play
   - Choose placement if both ends match
3. **Drawing:**
   - Click "Draw from Boneyard" if you can't play
   - Draw until you get a playable tile or boneyard is empty
   - Pass if boneyard is empty and no playable tile
4. **Winning a Round:**
   - Empty your hand first, OR
   - Have lowest pip count if game is blocked

### Scoring

- **Points Mode:** Score equals opponent's remaining pip count
- **Wins Mode:** Track number of rounds won
- **Game Winner:** First to reach target score (default: 100)

### Game Modes

**2 Players:**
- Hot-seat play on same device
- Active player sees their tiles
- Opponent's tiles shown face-down

**vs Computer:**
- You're Player 1
- AI automatically plays as Player 2
- Basic AI strategy implemented

---

## Development

### Local Development Setup

```bash
# Clone repository
git clone https://github.com/ArsalanAnwer0/Dominoes-Game.git
cd Dominoes-Game/Dominoes-Game

# Open in your favorite editor
code .

# Make changes to:
# - Dominoes.html (structure)
# - Dominoes.css (styling)
# - Dominoes.js (logic)

# Test locally
open Dominoes.html
```

### Development Workflow

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Edit files
   - Test locally in browser

3. **Test with Docker**
   ```bash
   docker-compose up --build
   ```

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add your feature"
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request**
   - GitHub will show "Create Pull Request" button
   - Request review
   - Merge to main after approval

### Code Structure

**`Dominoes.html`**
- Game UI structure
- Three pages: Landing, Instructions, Game
- Canvas elements for domino rendering

**`Dominoes.css`**
- Responsive styling
- Modern design with clean aesthetics
- Smooth animations and transitions

**`Dominoes.js`**
- Game logic and state management
- Canvas rendering for dominoes
- AI opponent implementation
- Event handling and DOM manipulation

**`error.html`**
- Custom 404 error page
- Professional error handling UI
- Navigation back to game

### Console Version

The `console-version/` directory contains a Node.js implementation:

**`dominoes-game.js`**
- Core game engine
- Multi-threaded AI players using Worker threads
- Command-line interface

**`player-worker.js`**
- AI player logic in separate thread
- Concurrent move calculation

**`test-game.js`**
- Automated testing suite
- Game simulation and validation

---

## Deployment

### Docker Deployment

**Build Image:**
```bash
docker build -t dominoes-game:v1.0.0 .
```

**Run Container:**
```bash
docker run -d -p 8081:8080 --name dominoes dominoes-game:v1.0.0
```

**Using Docker Compose:**
```bash
# Start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

**Docker Features:**
- Nginx web server
- Health check endpoint
- Automatic restart policy
- Port mapping: 8081 (host) → 8080 (container)

### AWS S3 Static Website Deployment

**Prerequisites:**
```bash
# Configure AWS credentials
aws configure

# Or set environment variables
export AWS_ACCESS_KEY_ID="your-access-key"
export AWS_SECRET_ACCESS_KEY="your-secret-key"
export AWS_DEFAULT_REGION="us-east-1"
```

**Deployment Steps:**

```bash
# Navigate to terraform directory
cd terraform

# Initialize Terraform
terraform init

# Review deployment plan
terraform plan

# Deploy to AWS
terraform apply

# Get website URL
terraform output website_endpoint
```

**Customization:**

Create a `terraform.tfvars` file:
```hcl
bucket_name  = "my-dominoes-game"
aws_region   = "us-east-1"
environment  = "prod"
```

Or use command-line variables:
```bash
terraform apply -var="bucket_name=my-dominoes-game" -var="environment=prod"
```

**Updating the Website:**
```bash
# Make changes to game files
# Then reapply Terraform
terraform apply
# Terraform will detect file changes via MD5 hash and update only modified files
```

**Destroying Resources:**
```bash
terraform destroy
```

**Cost Estimate:**
- Storage: ~$0.023 per GB per month
- Data transfer: First 1GB free, then $0.09 per GB
- Requests: $0.0004 per 1,000 GET requests
- Expected: Under $1/month for moderate traffic

**Automated Deployment:**

Use the provided deployment script:
```bash
cd terraform
chmod +x deploy.sh
./deploy.sh
```

---

## Project Structure

```
Dominoes-Game/
│
├── Dominoes.html                 # Main game HTML
├── Dominoes.css                  # Game styling
├── Dominoes.js                   # Game logic and AI
├── error.html                    # Custom 404 error page
│
├── Dockerfile                    # Container definition
├── docker-compose.yml            # Local Docker development
├── .dockerignore                 # Docker build exclusions
├── .gitignore                    # Git exclusions
│
├── console-version/              # Node.js implementation
│   ├── dominoes-game.js         # Core game engine
│   ├── player-worker.js         # Multi-threaded AI
│   ├── test-game.js             # Test suite
│   ├── package.json             # Node dependencies
│   └── README.md                # Console version docs
│
├── terraform/                    # Infrastructure as Code
│   ├── main.tf                  # Main Terraform config
│   ├── variables.tf             # Input variables
│   ├── outputs.tf               # Output values
│   ├── providers.tf             # AWS provider config
│   ├── terraform.tfvars         # Variable values
│   ├── deploy.sh                # Deployment script
│   └── README.md                # Terraform documentation
│
└── README.md                    # This file
```

---

## Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the Repository**
   - Click "Fork" on GitHub

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Dominoes-Game.git
   cd Dominoes-Game
   ```

3. **Create a Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

4. **Make Your Changes**
   - Add new features
   - Fix bugs
   - Improve documentation
   - Add tests

5. **Test Your Changes**
   ```bash
   # Test in browser
   open Dominoes.html

   # Test with Docker
   docker-compose up --build

   # Test console version
   cd console-version && npm test
   ```

6. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

7. **Push to Your Fork**
   ```bash
   git push origin feature/amazing-feature
   ```

8. **Open a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your feature branch
   - Describe your changes

### Development Guidelines

- Follow existing code style
- Add comments for complex logic
- Test on multiple browsers
- Update README if needed
- Keep commits focused and atomic

---

## Troubleshooting

### Docker Issues

**Problem:** Port already in use
```bash
# Solution: Use different port
docker run -p 8082:8080 dominoes-game
```

**Problem:** Container won't start
```bash
# Solution: Check logs
docker-compose logs
```

### AWS Deployment Issues

**Problem:** Bucket name already exists
```bash
# Solution: Use unique bucket name in terraform.tfvars
bucket_name = "my-unique-dominoes-game-123"
```

**Problem:** Access denied
```bash
# Solution: Check AWS credentials and permissions
aws sts get-caller-identity
```

### Game Issues

**Problem:** Tiles not displaying
```bash
# Solution: Clear browser cache and reload
Cmd/Ctrl + Shift + R
```

**Problem:** AI not responding
```bash
# Solution: Check browser console for errors
Open DevTools → Console tab
```

---

## License

This project is open source and available for educational purposes.

---

## Acknowledgments

- Built with vanilla JavaScript for maximum compatibility
- Designed with responsive web design principles
- Infrastructure follows AWS best practices
- Docker configuration optimized for production

---

**Enjoy playing Dominoes!** 🎲

For issues or questions, please open an issue on GitHub.
