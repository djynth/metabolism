<?php

class m130710_021341_resources extends CDbMigration
{
    public function up()
    {
        $this->createTable('resources', array(
            'id' => 'smallint primary key auto_increment',
            'abbr' => 'varchar(10)',
            'name' => 'varchar(20) not null unique',
            'full_name' => 'varchar(80)',
            'starting_value' => 'int',
            'max_shown_value' => 'int',
            'global' => 'bool',
            'color' => 'char(6)'
        ));

        $this->createTable('pathway_resources', array(
            'pathway_id' => 'smallint',
            'resource_id' => 'smallint',
            'value' => 'int'
        ));

        $this->addForeignKey('fk_pathway_resources_pathways_pathway_id',   'pathway_resources', 'pathway_id',  'pathways',  'id', 'cascade', 'cascade');
        $this->addForeignKey('fk_pathway_resources_resources_resource_id', 'pathway_resources', 'resource_id', 'resources', 'id', 'cascade', 'cascade');
    }

    public function down()
    {
        $this->dropTable('resources');
        $this->dropTable('pathway_resources');
    }
}