<?php

class m140725_121207_fk_cleanup extends CDbMigration
{
    public function up()
    {
        $this->addForeignKey('fk_game_state_games_game',         'game_state', 'game_id',     'games',     'id', 'cascade', 'cascade');
        $this->addForeignKey('fk_game_state_resources_resource', 'game_state', 'resource_id', 'resources', 'id', 'cascade', 'cascade');
        $this->addForeignKey('fk_game_state_organs_organ',       'game_state', 'organ_id',    'organs',    'id', 'cascade', 'cascade');

        $this->addForeignKey('fk_user_email_verification_users_user', 'user_email_verification', 'user_id', 'users', 'id', 'cascade', 'cascade');
        $this->addForeignKey('fk_user_reset_password_users_user',     'user_reset_password',     'user_id', 'users', 'id', 'cascade', 'cascade');
    }

    public function down()
    {
        $this->dropForeignKey('fk_game_state_games_game',         'game_state');
        $this->dropForeignKey('fk_game_state_resources_resource', 'game_state');
        $this->dropForeignKey('fk_game_state_organs_organ',       'game_state');

        $this->dropForeignKey('fk_user_email_verification_users_user', 'user_email_verification');
        $this->dropForeignKey('fk_user_reset_password_users_user',     'user_reset_password');
    }
}