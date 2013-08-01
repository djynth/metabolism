<?php

class m130730_010240_primary_resources extends CDbMigration
{
    public function up()
    {
        $this->addColumn('resources', 'primary', 'tinyint');
    }

    public function down()
    {
        $this->dropColumn('resources', 'primary');   
    }
}