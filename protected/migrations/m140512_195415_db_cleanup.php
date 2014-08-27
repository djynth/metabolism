<?php

class m140512_195415_db_cleanup extends CDbMigration
{
    public function up()
    {
        $this->alterColumn('games', 'completed', 'int(1)  default 0 not null');
        $this->alterColumn('games', 'score',     'int(11) default 0 not null');
        $this->alterColumn('games', 'turn',      'int(11) not null');
        $this->alterColumn('games', 'user_id',   'int(11) not null after `id`');

        $this->alterColumn('moves', 'turn',       'int(11) not null');
        $this->alterColumn('moves', 'score',      'int(11) not null');
        $this->alterColumn('moves', 'pathway_id', 'smallint(6) not null');
        $this->alterColumn('moves', 'times_run',  'int(11) default 1 not null after `id`');
        $this->alterColumn('moves', 'organ_id',   'smallint(6) not null after `pathway_id`');
        $this->alterColumn('moves', 'reverse',    'int(1) not null default 0');

        $this->alterColumn('move_levels', 'move_id', 'int(11) not null');
        $this->alterColumn('move_levels', 'resource_id', 'smallint(6) not null');
        $this->alterColumn('move_levels', 'organ_id', 'smallint(6) not null');
        $this->alterColumn('move_levels', 'amount', 'int(11) not null');

        $this->alterColumn('pathways', 'points',     'int(11) default 0 not null');
        $this->alterColumn('pathways', 'limit',      'int(1)  default 0 not null');
        $this->alterColumn('pathways', 'catabolic',  'int(1)  default 0 not null');
        $this->alterColumn('pathways', 'anabolic',   'int(1)  default 0 not null');
        $this->alterColumn('pathways', 'reversible', 'int(1)  default 0 not null');
        $this->alterColumn('pathways', 'action',     'int(1)  default 0 not null');
        $this->alterColumn('pathways', 'passive',    'int(11) default 0 not null');

        $this->alterColumn('pathway_organs', 'pathway_id', 'smallint(6) not null');
        $this->alterColumn('pathway_organs', 'organ_id',   'smallint(6) not null');

        $this->alterColumn('pathway_resources', 'pathway_id',  'smallint(6) not null');
        $this->alterColumn('pathway_resources', 'resource_id', 'smallint(6) not null');
        $this->alterColumn('pathway_resources', 'value',       'int(11) default 1 not null');

        $this->alterColumn('recover_password', 'user_id',      'int(11) not null');
        $this->alterColumn('recover_password', 'verification', 'char(16) not null');
        $this->alterColumn('recover_password', 'attempts',     'int(11) default 0 not null');

        $this->alterColumn('resources', 'starting_value',  'int(11) default 0 not null');
        $this->alterColumn('resources', 'max_shown_value', 'int(11) default 0 not null');
        $this->alterColumn('resources', 'primary',         'int(1)  default 0 not null');
        $this->alterColumn('resources', 'group',           'int(11) default 0 not null');
        $this->addColumn('resources', 'soft_max', 'int(11)');
        $this->addColumn('resources', 'hard_max', 'int(11)');
        $this->addColumn('resources', 'soft_min', 'int(11)');
        $this->addColumn('resources', 'hard_min', 'int(11) default 0');
        $this->addColumn('resources', 'rel_soft_max', 'smallint(6)');
        $this->addColumn('resources', 'rel_hard_max', 'smallint(6)');
        $this->addColumn('resources', 'rel_soft_min', 'smallint(6)');
        $this->addColumn('resources', 'rel_hard_min', 'smallint(6)');
        $this->addColumn('resources', 'penalization', 'decimal(10,4) default 0.1 not null');

        $this->alterColumn('resource_aliases', 'resource_id', 'smallint(6) not null');
        $this->alterColumn('resource_aliases', 'alias',       'text   not null');

        $this->dropTable('resource_limits');

        $this->alterColumn('resource_organs', 'resource_id', 'smallint(6) not null');
        $this->alterColumn('resource_organs', 'organ_id',    'smallint(6) not null');

        $this->alterColumn('users', 'theme_type', 'varchar(20) after `theme`');
        $this->dropColumn('users', 'help');
    }

    public function down()
    {
        return false;
    }
}