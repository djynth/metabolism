<?php

class m140507_173557_multi_passive_pathways extends CDbMigration
{
    public function up()
    {
        $this->alterColumn('pathways', 'passive', 'int(6) default 0');
    }

    public function down()
    {
        $this->alterColumn('pathways', 'passive', 'tinyint(1) default 0');
    }
}