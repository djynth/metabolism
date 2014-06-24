<?php

class m140624_224553_game_challenge_id extends CDbMigration
{
    public function up()
    {
        $this->dropForeignKey('fk_games_challenges_challenge', 'games');
        $this->renameColumn('games', 'challenge', 'challenge_id');
        $this->addForeignKey('fk_games_challenges_challenge', 'games', 'challenge_id', 'challenges', 'id', 'cascade', 'cascade');
    }

    public function down()
    {
        $this->dropForeignKey('fk_games_challenges_challenge', 'games');
        $this->renameColumn('games', 'challenge_id', 'challenge');
        $this->addForeignKey('fk_games_challenges_challenge', 'games', 'challenge', 'challenges', 'id', 'cascade', 'cascade');
    }
}