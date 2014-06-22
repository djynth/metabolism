#!/bin/sh

dumpfile=data.sql.gz
db_user=leontis
db_pass=1vuwif1fe

compass compile
mysqldump -u root -ppassword metabolism organs pathways resources pathway_organs pathway_resources resource_organs resource_aliases | gzip > $dumpfile
scp -r css $dumpfile leontis_metabolism@ssh.phx.nearlyfreespeech.net:

ssh leontis_metabolism@ssh.phx.nearlyfreespeech.net \
   "cp index_unavailable.php index.php &&
    git pull &&
    protected/yiic migrate &&
    gunzip < $dumpfile | mysql -h metabolism.db -u $db_user -p$db_pass metabolism &&
    rm $dumpfile &&
    cp index_full.php index.php"

rm $dumpfile
exit 0