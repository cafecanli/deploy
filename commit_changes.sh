#!/bin/bash

set -e

err() {
  echo >&2 "$1"
}

die() {
  err "$1"
  exit 1
}

check_env_vars() {
  local script_vars=("$@") # Capture all arguments as an array of required env var names
  local should_exit=0

  for variable_name in "${script_vars[@]}"; do
    if [ -z "${!variable_name}" ]; then # Dereference to get the value of the variable by name
      err "Required environment variable $variable_name is not set."
      should_exit=1
    fi
  done

  if [ $should_exit -eq 1 ]; then
    die "Exiting due to unset required environment variables."
  fi
}

main() {
  check_env_vars "GITHUB_REPO" "GITHUB_BRANCH" "GITHUB_SHA"

  git add .

  if git diff --staged --quiet; then
    echo "No changes on $GITHUB_REPO/$GITHUB_BRANCH to commit."
  else
    git commit -m "Update $GITHUB_REPO version to $GITHUB_SHA"
    git push origin "$GITHUB_BRANCH"
  fi
}

main
