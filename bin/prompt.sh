#!/usr/bin/env bash
#
# Prompt for input
#
# Intended to provide an alternative to putting plain secrets into script
# arguments. Prompt for the input instead of having it present in the
# command.
#
# Example Usage:
#   ./prompt.sh <label>
#
#   ./example.sh --secret $(./prompt.sh Secret)
#   ./server.sh --api-key $(./prompt.sh API Key)
#
LABEL=$@:

read -s -p "$LABEL" INPUT
echo -n "$INPUT"