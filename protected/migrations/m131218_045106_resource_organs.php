<?php

class m131218_045106_organ_pathways extends CDbMigration
{
    public function up()
    {
        $this->createTable('resource_organs', array(
            'resource_id' => 'smallint',
            'organ_id' => 'smallint',
        ), 'ENGINE InnoDB');

        $this->addForeignKey('fk_resource_organs_resources_resource_id', 'resource_organs', 'resource_id', 'resources', 'id', 'cascade', 'cascade');
        $this->addForeignKey('fk_resource_organs_organs_organ_id',       'resource_organs', 'organ_id',    'organs',    'id', 'cascade', 'cascade');
    }

    public function down()
    {
        $this->dropTable('pathway_organs');
    }
}