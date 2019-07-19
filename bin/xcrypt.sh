#!/usr/bin/env bash
#
#: Xcrypt
#:
#  @author Eugene Song <tilleps@gmail.com>
#
#: Usage:
#:    xcrypt -k <key> [options]... -- <input>
#:    xcrypt -k <key> --decrypt [options]... -- <input>
#:
#: Options:
#:   --version              Show version number                           [boolean]
#:   --help                 Show help                                     [boolean]
#:   --secret, -s           The secret key used to encrypt/decrypt       [required]
#:   --decrypt, -d          Set mode to decrypt                           [boolean]
#:   --list-algorithms, -l  List the supported algorithms                 [boolean]
#:   --algorithm, -a        Set the cipher algorithm used to encrypt
#:                                                         [default: "aes-256-ctr"]
#
readonly PROGNAME=$(basename $0)
readonly PROGBASENAME=${PROGNAME%.*}
readonly PROGDIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
readonly ARGS="$@"
readonly ARGNUM="$#"

ALGORITHM=aes-256-ctr
MODE="encrypt"
SECRET_KEY=""
VERSION="0.4.0"

#  version:algorithm:iv:payload
PATTERN="^([^:]+):([^:]+):([^:]+):([^:]+):([^:]+)$"

#  Get piped data
#  https://stackoverflow.com/a/16490611/2424549
INPUT=""


exit_error() {
  echo "${PROGNAME}: ${1:-"Unknown Error"}" 1>&2
  exit 1
}


usage() {
  grep "^#:" "$0" | cut -c 4-
  exit 0
}


#  MD5 Function
if hash md5 2>/dev/null; then
  md5string() {
    md5 -q -s "$1"
  }
else
  md5string() {
    echo -n "$1" | md5sum | cut -d" " -f1
  }
fi



encrypt() {
  local KEYHASH=$(md5string "$SECRET_KEY")
  local KEYHASH_HEX=$(echo -n "$KEYHASH" | xxd -ps -cols 32)

  #  Generate a new IV
  local IV=$(openssl rand -base64 18 | cut -c1-16)
  local IV_HEX=$(echo -n "$IV" | xxd -ps -cols 32)

  local ENCRYPTED=$(echo -n "$INPUT" | openssl enc -"$ALGORITHM" -iv "$IV_HEX" -K "$KEYHASH_HEX" | base64)

  echo -n "xcrypt:$VERSION:$ALGORITHM:$IV:$ENCRYPTED"
}


decrypt() {
  if [[ $INPUT =~ $PATTERN ]]; then
    #
    #  Matches
    #
    i=0
    n=${#BASH_REMATCH[*]}
    while [[ $i -lt $n ]]
    do
      let i++
    done

    local KEYHASH=$(md5string "$SECRET_KEY")
    local KEYHASH_HEX=$(echo -n "$KEYHASH" | xxd -ps -cols 32)

    local CRYPTOR=${BASH_REMATCH[1]}
    local VERSION=${BASH_REMATCH[2]}
    local ALGORITHM=${BASH_REMATCH[3]}
    local IV=${BASH_REMATCH[4]}
    local ENCRYPTED=${BASH_REMATCH[5]}

    local IV_HEX=$(echo -n "$IV" | xxd -ps -cols 32)
    
    echo -n "$ENCRYPTED" | base64 --decode | openssl enc -d -"$ALGORITHM" -iv "$IV_HEX" -K "$KEYHASH_HEX"
  else
    exit_error "Unrecognized encrypted format"
  fi
}


#
#  Get piped data
#  https://stackoverflow.com/a/16490611/2424549
#
if [ -p /dev/stdin ]; then
  INPUT=$(cat -)
fi


#
#  Display help/usage information if no arguments provided
#
if [[ ("$#" -eq 0) && (-z "$INPUT") ]]; then
  usage
fi


#
#  Get Opts
#  https://gist.github.com/dgoguerra/9206418
#
while [ "$#" -gt 0 ]
do
	case "$1" in
	--version)
    echo "$VERSION"
		;;

	-h|--help)
    usage
		;;

  -a|--algorithm)
    ALGORITHM="$2"
    shift
    ;;

  -s|--secret)
    SECRET_KEY="$2"
    shift
    ;;

  -l|--list-algorithms)
    echo "List of algorithms:"
    openssl list-cipher-algorithms
    exit 0;
    ;;

  -e|--encrypt)
    MODE="encrypt"
    ;;

	-d|--decrypt)
    MODE="decrypt"
    ;;

	--)
		;;

	-*)
    exit_error "Invalid option '$1'. Use --help to see the valid options"
		exit 1
		;;

	#  remaining arguments
  *)
    INPUT="$@"
    break;
    ;;
	esac
	shift
done


#
#  Prompt for secret key if none is specified
#
if [[ !(-p /dev/stdin) && (-z "$SECRET_KEY") ]]; then
  read -s -p "Secret key: " SECRET_KEY
  echo
fi


#
#  Check for Missing Key
#
if [ -z "$SECRET_KEY" ]; then
  exit_error "Missing secret key: use the -s|--secret option when piping data"
  exit 1;
fi


#
#  Encrypt / Decrypt
#
case $MODE in
encrypt)
  encrypt "$1"
  ;;
decrypt)
  decrypt "$1"
  ;;
*)
  exit_error "Unsupported mode: $MODE"
  ;;
esac
