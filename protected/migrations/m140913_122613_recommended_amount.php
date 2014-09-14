<?php

class m140913_122613_recommended_amount extends CDbMigration
{
    public function up()
    {
        $this->renameColumn('resources', 'max_shown_value', 'recommended_amount');
    }

    public function down()
    {
     	$this->renameColumn('resources', 'recommended_amount', 'max_shown_value');
    }
}