<?php

class m140512_211133_db_cleanup3 extends CDbMigration
{
    public function up()
    {
        $this->addForeignKey('fk_resources_resource_rel_hard_min', 'resources', 'rel_hard_min', 'resources', 'id', 'cascade', 'cascade');
        $this->addForeignKey('fk_resources_resource_rel_soft_min', 'resources', 'rel_soft_min', 'resources', 'id', 'cascade', 'cascade');
        $this->addForeignKey('fk_resources_resource_rel_soft_max', 'resources', 'rel_soft_max', 'resources', 'id', 'cascade', 'cascade');
        $this->addForeignKey('fk_resources_resource_rel_hard_max', 'resources', 'rel_hard_max', 'resources', 'id', 'cascade', 'cascade');
    }

    public function down()
    {
        return false;
    }
}