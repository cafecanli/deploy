if [ -n '$COMMIT_MESSAGE' ]; then
  echo -e "Commig message is already set to\n\n$COMMIT_MESSAGE"
  echo "COMMIT_MESSAGE=$COMMIT_MESSAGE" >>$GITHUB_ENV

  exit 0
fi

echo "Commit message is not set, setting default message"

default_msg='
Replaced occurances in files matching the given glob

Matched /${{ inputs.match }}/${{ inputs.flags }} and replaced occurances with
"${{ inputs.replace }}" using glob "${{ inputs.glob }}" in branch "${{ inputs.branch }}"
'

default_msg="$(echo "$default_msg" | xargs)"

echo "COMMIT_MESSAGE=$default_msg" >>$GITHUB_ENV
echo -e "Commit message set to\n\n$default_msg"
