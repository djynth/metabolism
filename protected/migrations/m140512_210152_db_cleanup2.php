<?php

class m140512_210152_db_cleanup2 extends CDbMigration
{
    public function up()
    {
        $this->alterColumn('moves', 'game_id',    'int(11)     not null after `id`');
        $this->alterColumn('moves', 'pathway_id', 'smallint(6) not null after `game_id`');
        $this->alterColumn('moves', 'organ_id',   'smallint(6) not null after `pathway_id`');

        $this->alterColumn('pathways', 'reversible', 'int(1)  not null default 0 after `limit`');
        $this->alterColumn('pathways', 'action',     'int(1)  not null default 0 after `reversible`');
        $this->alterColumn('pathways', 'passive',    'int(11) not null default 0 after `action`');

        $this->alterColumn('resources', 'hard_min', 'int(11) default 0 after `group`');
        $this->alterColumn('resources', 'soft_min', 'int(11) after `hard_min`');
        $this->alterColumn('resources', 'soft_max', 'int(11) after `soft_min`');
        $this->alterColumn('resources', 'hard_max', 'int(11) after `soft_max`');
        $this->alterColumn('resources', 'rel_hard_min', 'smallint(6) after `hard_max`');
        $this->alterColumn('resources', 'rel_soft_min', 'smallint(6) after `rel_hard_min`');
        $this->alterColumn('resources', 'rel_soft_max', 'smallint(6) after `rel_soft_min`');
        $this->alterColumn('resources', 'rel_hard_max', 'smallint(6) after `rel_soft_max`');

        $this->alterColumn('users', 'email_verified', 'int(1) default 0');
    }

    public function down()
    {
        return false;
    }
}