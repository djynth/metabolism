<?php

class m130815_034022_user_data extends CDbMigration
{
    public function up()
    {
        $this->createTable('games', array(
            'id' => 'int primary key auto_increment',
            'completed' => 'tinyint(1) default 0',
            'score' => 'smallint',
        ), 'Engine InnoDB');

        $this->createTable('user_games', array(
            'user_id' => 'int not null',
            'game_id' => 'int not null',
        ), 'Engine InnoDB');

        $this->createTable('moves', array(
            'id' => 'int primary key auto_increment',
            'game_id' => 'int not null',
            'move_number' => 'smallint',
            'score' => 'smallint',
            'pathway_id' => 'smallint',
            'times_run' => 'smallint',
            'organ_id' => 'smallint',
        ), 'Engine InnoDB');

        $this->createTable('move_levels', array(
            'move_id' => 'int',
            'resource_id' => 'smallint',
            'organ_id' => 'smallint',
            'amount' => 'int',
        ), 'Engine InnoDB');

        $this->addForeignKey('fk_user_games_user_user_id',           'user_games',  'user_id',     'user',      'id', 'cascade', 'cascade');
        $this->addForeignKey('fk_user_games_games_game_id',          'user_games',  'game_id',     'games',     'id', 'cascade', 'cascade');
        $this->addForeignKey('fk_moves_games_game_id',               'moves',       'game_id',     'games',     'id', 'cascade', 'cascade');
        $this->addForeignKey('fk_moves_organs_organ_id',             'moves',       'organ_id',    'organs',    'id', 'cascade', 'cascade');
        $this->addForeignKey('fk_move_levels_moves_move_id',         'move_levels', 'move_id',     'moves',     'id', 'cascade', 'cascade');
        $this->addForeignKey('fk_move_levels_resources_resource_id', 'move_levels', 'resource_id', 'resources', 'id', 'cascade', 'cascade');
        $this->addForeignKey('fk_move_levels_organs_organ_id',       'move_levels', 'organ_id',    'organs',    'id', 'cascade', 'cascade');
    }

    public function down()
    {
        $this->dropTable('move_levels');
        $this->dropTable('moves');
        $this->dropTable('user_games');
        $this->dropTable('games');
    }
}