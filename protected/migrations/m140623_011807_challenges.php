<?php

class m140623_011807_challenges extends CDbMigration
{
    public function up()
    {
        $this->addColumn('games', 'challenge', 'int(11) not null default 0');

        $this->createTable('challenges', array(
            'id' => 'int(11) primary key auto_increment',
            'name' => 'varchar(80) not null',
        ), 'engine InnoDB');

        $this->createTable('challenge_starts', array(
            'challenge_id' => 'int(11) not null',
            'resource_id' => 'smallint(6) not null',
            'starting_value' => 'int(11) not null default 0',
        ), 'engine InnoDB');

        $this->createTable('challenge_restrictions', array(
            'challenge_id' => 'int(11) not null',
            'pathway_id' => 'smallint(6) not null',
            'limit' => 'int(11) not null',
        ), 'engine InnoDB');

        $this->createTable('challenge_limits', array(
            'challenge_id' => 'int(11) not null',
            'resource_id' => 'smallint(6) not null',
            'hard_min' => 'int(11) default 0',
            'soft_min' => 'int(11)',
            'soft_max' => 'int(11)',
            'hard_max' => 'int(11)',
            'penalization' => 'decimal(10,4) not null default 0.1',
        ), 'engine InnoDB');

        $this->dropColumn('resources', 'starting_value');
        $this->dropColumn('pathways', 'limit');
        $this->dropColumn('resources', 'hard_min');
        $this->dropColumn('resources', 'soft_min');
        $this->dropColumn('resources', 'soft_max');
        $this->dropColumn('resources', 'hard_max');
        $this->dropForeignKey('fk_resources_resource_rel_hard_min', 'resources');
        $this->dropForeignKey('fk_resources_resource_rel_soft_min', 'resources');
        $this->dropForeignKey('fk_resources_resource_rel_soft_max', 'resources');
        $this->dropForeignKey('fk_resources_resource_rel_hard_max', 'resources');
        $this->dropColumn('resources', 'rel_hard_min');
        $this->dropColumn('resources', 'rel_soft_min');
        $this->dropColumn('resources', 'rel_soft_max');
        $this->dropColumn('resources', 'rel_hard_max');
        $this->dropColumn('resources', 'penalization');
    }

    public function down()
    {
        $this->dropColumn('games', 'challenge');
        $this->dropTable('challenges');
        $this->dropTable('challenge_starts');
        $this->dropTable('challenge_restrictions');
        $this->dropTable('challenge_limits');

        $this->addColumn('resources', 'starting_value', 'int(11) not null default 0');
        $this->addColumn('pathways', 'limit');
        $this->addColumn('resources', 'hard_min', 'int(11) default 0');
        $this->addColumn('resources', 'soft_min', 'int(11)');
        $this->addColumn('resources', 'soft_max', 'int(11)');
        $this->addColumn('resources', 'hard_max', 'int(11)');
        $this->addColumn('resources', 'rel_hard_min', 'smallint(6)');
        $this->addColumn('resources', 'rel_soft_min', 'smallint(6)');
        $this->addColumn('resources', 'rel_soft_max', 'smallint(6)');
        $this->addColumn('resources', 'rel_hard_max', 'smallint(6)');
        $this->addColumn('resources', 'penalization', 'decimal(10,4) not null default 0.1');

        $this->addForeignKey('fk_resources_resource_rel_hard_min', 'resources', 'rel_hard_min', 'resources', 'id', 'cascade', 'cascade');
        $this->addForeignKey('fk_resources_resource_rel_soft_min', 'resources', 'rel_soft_min', 'resources', 'id', 'cascade', 'cascade');
        $this->addForeignKey('fk_resources_resource_rel_soft_max', 'resources', 'rel_soft_max', 'resources', 'id', 'cascade', 'cascade');
        $this->addForeignKey('fk_resources_resource_rel_hard_max', 'resources', 'rel_hard_max', 'resources', 'id', 'cascade', 'cascade');
    }
}