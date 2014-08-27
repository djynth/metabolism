<?php

class m140506_234902_passive_pathways extends CDbMigration
{
    public function up()
    {
        $this->addColumn('pathways', 'passive', 'tinyint(1) default 0');
    }

    public function down()
    {
        $this->dropColumn('pathways', 'passive');
    }
}