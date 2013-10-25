<?php

class m130803_173902_resource_visualization_info extends CDbMigration
{
    public function up()
    {
        $this->addColumn('resources', 'formula', 'varchar(20)');
        $this->addColumn('resources', 'description', 'text');
    }

    public function down()
    {
        $this->dropColumn('resources', 'formula');
        $this->dropColumn('resources', 'description');
    }
}