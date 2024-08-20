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
  check_env_vars "GITHUB_TOKEN" "GITHUB_REPO" "GITHUB_BRANCH"

  local repo_url="https://$GITHUB_TOKEN@github.com/$GITHUB_REPO.git"
  local github_ref="refs/heads/$GITHUB_BRANCH"

  if git ls-remote --heads "$repo_url" "$GITHUB_BRANCH" | grep -q "$github_ref"; then
    echo "Remote branch $GITHUB_BRANCH exists."
  else
    die "Remote branch $GITHUB_BRANCH does not exist."
  fi
}

main
