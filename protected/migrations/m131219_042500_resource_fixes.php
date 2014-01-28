<?php

class m131219_042500_resource_fixes extends CDbMigration
{
    public function up()
    {
        $this->dropColumn('resources', 'global');
        $this->alterColumn('resources', 'primary', 'tinyint(1)');
    }

    public function down()
    {
        $this->addColumn('resources', 'global', 'tinyint(1)');
        $this->alterColumn('resources', 'primary', 'tinyint(4)');
    }
}