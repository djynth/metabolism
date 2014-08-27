<?php

class m140513_212742_game_state extends CDbMigration
{
    public function up()
    {
        $this->dropTable('move_levels');
        $this->dropTable('moves');
        $this->createTable('game_state', array(
            'game_id' => 'int(11) not null',
            'resource_id' => 'smallint(6)',
            'organ_id' => 'smallint(6)',
            'amount' => 'int(11)',
        ), 'engine InnoDB');

        $this->truncateTable('games');
        $this->execute('alter table games auto_increment = 1');
    }

    public function down()
    {
        return false;
    }
}