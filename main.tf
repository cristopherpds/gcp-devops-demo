provider "google" {
  project = var.project_id
  region  = var.region
}

resource "google_project_service" "firestore" {
  service = "firestore.googleapis.com"
  disable_on_destroy = false
}

resource "google_firestore_database" "database" {
  project     = var.project_id
  name        = "(default)"
  location_id = "nam5"
  type        = "FIRESTORE_NATIVE"

  depends_on = [google_project_service.firestore]
}

resource "google_project_service" "run_api" {
  service = "run.googleapis.com"
  disable_on_destroy = false
}

resource "google_cloud_run_service" "nextjs_app" {
  name     = "nextjs-app"
  location = var.region

  template {
    spec {
      containers {
        image = "gcr.io/${var.project_id}/nextjs-app:latest"
        env {
          name  = "NEXT_PUBLIC_FIREBASE_API_KEY"
          value = var.firebase_api_key
        }
        env {
          name  = "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
          value = var.firebase_auth_domain
        }
        env {
          name  = "NEXT_PUBLIC_FIREBASE_PROJECT_ID"
          value = var.project_id
        }
        env {
          name  = "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"
          value = var.firebase_storage_bucket
        }
        env {
          name  = "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
          value = var.firebase_messaging_sender_id
        }
        env {
          name  = "NEXT_PUBLIC_FIREBASE_APP_ID"
          value = var.firebase_app_id
        }
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }

  depends_on = [google_project_service.run_api]
}

resource "google_cloud_run_service_iam_member" "run_all_users" {
  service  = google_cloud_run_service.nextjs_app.name
  location = google_cloud_run_service.nextjs_app.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}

variable "project_id" {
  description = "The ID of the  GCP project"
}

variable "region" {
  description = "The region to deploy to"
  default     = "us-central1"
}

variable "firebase_api_key" {
  description = "Firebase API Key"
}

variable "firebase_auth_domain" {
  description = "Firebase Auth Domain"
}

variable "firebase_storage_bucket" {
  description = "Firebase Storage Bucket"
}

variable "firebase_messaging_sender_id" {
  description = "Firebase Messaging Sender ID"
}

variable "firebase_app_id" {
  description = "Firebase App ID"
}

output "service_url" {
  value = google_cloud_run_service.nextjs_app.status[0].url
}