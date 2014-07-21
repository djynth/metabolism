<?php

class m140721_133734_challenge_goals extends CDbMigration
{
    public function up()
    {
        $this->createTable('challenge_goals', array(
            'challenge_id' => 'int(11) not null',
            'resource_id' => 'smallint(6) not null',
            'min' => 'int(11)',
            'max' => 'int(11)',
        ));
    }

    public function down()
    {
        $this->dropTable('challenge_goals');
    }
}