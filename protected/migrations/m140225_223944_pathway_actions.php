<?php

class m140225_223944_pathway_actions extends CDbMigration
{
    public function up()
    {
        $this->addColumn('pathways', 'action', 'int(1) default 0');
    }

    public function down()
    {
        $this->dropColumn('pathways', 'action');
    }
}