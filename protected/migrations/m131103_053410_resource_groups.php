<?php

class m131103_053410_resource_groups extends CDbMigration
{
    public function up()
    {
        $this->addColumn('resources', 'group', 'smallint');
    }

    public function down()
    {
        $this->dropColumn('resources', 'group');        
    }
}