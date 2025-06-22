# Load secret or private environment variables (e.g. registry path)
-include .make.env

# Image names and tags
APP_IMAGE_NAME ?= $(REGISTRY)/${APP_NAME}
TAG ?=

# Directories
CONTEXT ?= .

.PHONY: all check-tag build-app build-migrate clean-prisma

# Build both images
all: check-tag build-app build-migrate

# Ensure TAG is provided
check-tag:
ifndef TAG
	$(error TAG is required. Usage: make TAG=v1.2.3)
endif

# Build app image
build-app: check-tag
	docker build -t $(APP_IMAGE_NAME):$(TAG) $(CONTEXT)

push-app: build-app
	docker push $(APP_IMAGE_NAME):$(TAG)
