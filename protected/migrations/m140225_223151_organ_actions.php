<?php

class m140225_223151_organ_actions extends CDbMigration
{
    public function up()
    {
        $this->addColumn('organs', 'action_name', 'varchar(20)');
    }

    public function down()
    {
        $this->dropColumn('organs', 'action_name');
    }
}