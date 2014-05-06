<?php

class m140506_200548_resource_aliases extends CDbMigration
{
    public function up()
    {
        $this->createTable('resource_aliases', array(
            'resource_id' => 'smallint(6)',
            'alias' => 'text',
        ), 'Engine InnoDB');

        $this->addForeignKey('fk_resource_aliases_resource_resource_id', 'resource_aliases', 'resource_id', 'resources', 'id', 'cascade', 'cascade');

        $this->dropColumn('resources', 'abbr');
        $this->dropColumn('resources', 'full_name');
    }

    public function down()
    {
        $this->dropTable('resource_aliases');
        $this->addColumn('resources', 'abbr', 'varchar(10)');
        $this->addColumn('resources', 'full_name', 'varchar(80)');
    }
}