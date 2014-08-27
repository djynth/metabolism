<?php

class m140623_014644_challenges_indexes extends CDbMigration
{
    public function up()
    {
        $this->addForeignKey('fk_games_challenges_challenge',                     'games',                  'challenge',    'challenges', 'id', 'cascade', 'cascade');
        $this->addForeignKey('fk_challenge_starts_challenges_challenge_id',       'challenge_starts',       'challenge_id', 'challenges', 'id', 'cascade', 'cascade');
        $this->addForeignKey('fk_challenge_starts_resources_resource_id',         'challenge_starts',       'resource_id',  'resources',  'id', 'cascade', 'cascade');
        $this->addForeignKey('fk_challenge_restrictions_challenges_challenge_id', 'challenge_restrictions', 'challenge_id', 'challenges', 'id', 'cascade', 'cascade');
        $this->addForeignKey('fk_challenge_restrictions_pathways_pathway_id',     'challenge_restrictions', 'pathway_id',   'pathways',   'id', 'cascade', 'cascade');
        $this->addForeignKey('fk_challenge_limits_challenges_challenge_id',       'challenge_limits',       'challenge_id', 'challenges', 'id', 'cascade', 'cascade');
        $this->addForeignKey('fk_challenge_limits_resources_resource_id',         'challenge_limits',       'resource_id',  'resources',  'id', 'cascade', 'cascade');
    }

    public function down()
    {
        $this->dropForeignKey('fk_games_challenges_challenge',                     'games');
        $this->dropForeignKey('fk_challenge_starts_challenges_challenge_id',       'challenge_starts');
        $this->dropForeignKey('fk_challenge_starts_resources_resource_id',         'challenge_starts');
        $this->dropForeignKey('fk_challenge_restrictions_challenges_challenge_id', 'challenge_restrictions');
        $this->dropForeignKey('fk_challenge_restrictions_pathways_pathway_id',     'challenge_restrictions');
        $this->dropForeignKey('fk_challenge_limits_challenges_challenge_id',       'challenge_limits');
        $this->dropForeignKey('fk_challenge_limits_resources_resource_id',         'challenge_limits');
    }
}