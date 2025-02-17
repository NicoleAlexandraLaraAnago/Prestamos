#!/bin/bash
# Script para esperar a que MySQL esté disponible antes de continuar

host="$1"
shift
port="$1"
shift
cmd="$@"

until docker exec mysql mysqladmin ping -h $host --password=12345 --silent; do
  >&2 echo "MySQL is unavailable - waiting"
  sleep 5
done

>&2 echo "MySQL is up - executing command"
exec $cmd
