<?php

class m131216_151439_game_rework extends CDbMigration
{
    public function up()
    {
        $this->addColumn('games', 'name', 'varchar(20)');
        $this->addColumn('games', 'turn', 'smallint(6)');
        $this->addColumn('games', 'user_id', 'int not null');
        $this->dropTable('user_games');

        $this->addForeignKey('fk_games_users_id', 'games', 'user_id', 'users', 'id', 'cascade', 'cascade');
    }

    public function down()
    {
        $this->dropColumn('games', 'name');
        $this->dropColumn('games', 'turn');
        $this->dropColumn('games', 'user_id');
        $this->createTable('user_games', array(
            'user_id' => 'int not null',
            'game_id' => 'int not null',
        ), 'Engine InnoDB');
    }
}