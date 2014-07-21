<?php

class m140721_134721_challenge_goals_cleanup extends CDbMigration
{
    public function up()
    {
        $this->addColumn('challenge_goals', 'organ_id', 'smallint(6) not null after `resource_id`');

        $this->addForeignKey('fk_challenge_goals_challenges_challenge', 'challenge_goals', 'challenge_id', 'challenges', 'id', 'cascade', 'cascade');
        $this->addForeignKey('fk_challenge_goals_resources_resource',   'challenge_goals', 'resource_id',  'resources',  'id', 'cascade', 'cascade');
        $this->addForeignKey('fk_challenge_goals_organs_organ',         'challenge_goals', 'organ_id',     'organs',     'id', 'cascade', 'cascade');
    }

    public function down()
    {
        $this->dropColumn('challenge_goals', 'organ_id');

        $this->dropForeignKey('fk_challenge_goals_challenges_challenge', 'challenge_goals');
        $this->dropForeignKey('fk_challenge_goals_resources_resource',   'challenge_goals');
        $this->dropForeignKey('fk_challenge_goals_organs_organ',         'challenge_goals');
    }
}