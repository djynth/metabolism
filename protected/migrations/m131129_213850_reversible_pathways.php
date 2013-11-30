<?php

class m131129_213850_reversible_pathways extends CDbMigration
{
    public function up()
    {
        $this->addColumn('pathways', 'reversible', 'int(1) default 0');
    }

    public function down()
    {
        $this->dropColumn('pathways', 'reversible');
    }
}