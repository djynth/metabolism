<?php

class m140624_235604_challenge_max_turns extends CDbMigration
{
    public function up()
    {
        $this->dropColumn('games', 'max_turns');
        $this->addColumn('challenges', 'max_turns', 'int(11) not null default -1');   
    }

    public function down()
    {
        $this->addColumn('games', 'max_turns', 'int(11) not null default -1');
        $this->dropColumn('challenges', 'max_turns');
    }
}