# booklist-manager

✅ Project Title: BookList Manager – Full Stack App with CI/CD on AWS
A basic CRUD web app for managing a book list with:
 
Frontend: React
 
Backend API: Node.js (Express)
 
Database: MongoDB (on Atlas)
 
CI/CD Tool: GitHub Actions
 
Infrastructure: Terraform on AWS
 
Deployment Target: EC2 instance
 
 
✅ Project Title:
BookList Manager – Full Stack App with CI/CD on AWS
 
🚀 Project Summary
This is a full stack web application that allows users to manage a list of books using a simple, intuitive interface. The app supports CRUD operations (Create, Read, Update, Delete) and is built with modern web technologies. It’s fully deployed on AWS, with automation pipelines for continuous integration and deployment using GitHub Actions and infrastructure managed through Terraform.
 
🧱 Tech Stack Overview
 
Component	Technology Used
🖼️ Frontend	React
🧠 Backend API	Node.js with Express
🗄️ Database	MongoDB (Hosted on Atlas)
🔁 CI/CD	GitHub Actions
☁️ Cloud Infra	Terraform + AWS
📦 Deployment	AWS EC2 (or ECS optionally)
 
🖥️ Frontend – React
A React app provides the user interface for managing books.
 
Users can view, add, edit, and delete books via forms and UI components.
 
It communicates with the backend via RESTful API calls.
 
⚙️ Backend – Node.js (Express)
A lightweight Express.js server handles all HTTP requests.
 
 
Implements API endpoints for CRUD actions:
 
GET /books
 
POST /books
 
PUT /books/:id
 
DELETE /books/:id
 
Uses Mongoose to interact with MongoDB in a structured way.
 
🗃️ Database – MongoDB Atlas
Book data is stored in MongoDB Atlas, a fully managed NoSQL database in the cloud.
 
Collections store documents with fields like:
 
json
Copy
Edit
{
  "title": "The Alchemist",
  "author": "Paulo Coelho",
  "genre": "Fiction",
  "year": 1988
}
🔁 CI/CD – GitHub Actions
Automates the process of building, testing, and deploying the app.
 
On every push or pull request, GitHub Actions:
 
Installs dependencies
 
Runs tests
 
Deploys the backend/frontend to EC2 using SSH or SCP
 
☁️ Infrastructure – Terraform + AWS
Infrastructure as Code (IaC) using Terraform:
 
Provisions EC2 instance
 
Creates security groups, IAM roles, etc.
 
Ensures reproducible, version-controlled cloud environments.
 
📦 Deployment Target – EC2
The app is hosted on an EC2 instance:
 
Node.js backend and React frontend run together or on separate instances
 
MongoDB is external (Atlas), so no local DB setup needed
 
EC2 public IP is used to access the app via browser
