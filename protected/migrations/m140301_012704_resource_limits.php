<?php

class m140301_012704_resource_limits extends CDbMigration
{
    public function up()
    {
        $this->createTable('resource_limits', array(
            'resource_id' => 'smallint(6) primary key',
            'soft_max' => 'int',
            'hard_max' => 'int',
            'soft_min' => 'int',
            'hard_min' => 'int',
            'rel_soft_max' => 'smallint(6)',
            'rel_hard_max' => 'smallint(6)',
            'rel_soft_min' => 'smallint(6)',
            'rel_hard_min' => 'smallint(6)',
            'penalization' => 'decimal(10,4)',
        ), 'Engine InnoDB');

        $this->addForeignKey('fk_resource_limits_resource_resource_id',  'resource_limits', 'resource_id',  'resources', 'id', 'cascade', 'cascade');
        $this->addForeignKey('fk_resource_limits_resource_rel_soft_max', 'resource_limits', 'rel_soft_max', 'resources', 'id', 'cascade', 'cascade');
        $this->addForeignKey('fk_resource_limits_resource_rel_hard_max', 'resource_limits', 'rel_hard_max', 'resources', 'id', 'cascade', 'cascade');
        $this->addForeignKey('fk_resource_limits_resource_rel_soft_min', 'resource_limits', 'rel_soft_min', 'resources', 'id', 'cascade', 'cascade');
        $this->addForeignKey('fk_resource_limits_resource_rel_hard_min', 'resource_limits', 'rel_hard_min', 'resources', 'id', 'cascade', 'cascade');
    }

    public function down()
    {
        $this->dropTable('resource_limits');
    }
}