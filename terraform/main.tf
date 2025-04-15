provider "aws" {
  region = "us-east-1"
}

variable "key_name" {
  default = "my-keypair"  # 🔁 Replace this with your actual key pair name (no .pem)
}

# VPC
resource "aws_vpc" "booklist_vpc" {
  cidr_block = "10.0.0.0/16"
  tags = {
    Name = "booklist-vpc"
  }
}

# Subnet
resource "aws_subnet" "booklist_subnet" {
  vpc_id            = aws_vpc.booklist_vpc.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "us-east-1a"
  tags = {
    Name = "booklist-subnet"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "booklist_igw" {
  vpc_id = aws_vpc.booklist_vpc.id
  tags = {
    Name = "booklist-igw"
  }
}

# Route Table
resource "aws_route_table" "booklist_rt" {
  vpc_id = aws_vpc.booklist_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.booklist_igw.id
  }

  tags = {
    Name = "booklist-rt"
  }
}

# Route Table Association
resource "aws_route_table_association" "booklist_rta" {
  subnet_id      = aws_subnet.booklist_subnet.id
  route_table_id = aws_route_table.booklist_rt.id
}

# Security Group
resource "aws_security_group" "booklist_sg" {
  name        = "booklist-sg"
  description = "Allow SSH, HTTP, and port 5000 for Node app"
  vpc_id      = aws_vpc.booklist_vpc.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "booklist-sg"
  }
}

# EC2 Instance
resource "aws_instance" "booklist_ec2" {
  ami                         = "ami-0c2b8ca1dad447f8a" # Amazon Linux 2 (for us-east-1)
  instance_type               = "t2.micro"
  subnet_id                   = aws_subnet.booklist_subnet.id
  vpc_security_group_ids      = [aws_security_group.booklist_sg.id]
  associate_public_ip_address = true
  key_name                    = var.key_name

  user_data = <<-EOF
              #!/bin/bash
              yum update -y
              curl -sL https://rpm.nodesource.com/setup_16.x | bash -
              yum install -y nodejs git
              git clone https://github.com/YOUR_GITHUB_REPO/booklist-app.git
              cd booklist-app/backend
              npm install
              nohup node server.js > output.log 2>&1 &
              EOF

  tags = {
    Name = "booklist-manager-instance"
  }
}
