#!/bin/bash

DATA=$(date +%Y%m%d_%H%M%S)

cp /root/afiliados/data/afiliados.db /root/afiliados/backups/afiliados_$DATA.db

find /root/afiliados/backups -type f -name "*.db" -mtime +30 -delete
