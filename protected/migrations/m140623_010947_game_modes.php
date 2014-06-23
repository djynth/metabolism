<?php

class m140623_010947_game_modes extends CDbMigration
{
    public function up()
    {
        $this->addColumn('games', 'max_turns', 'int(11) not null default -1');
        $this->addColumn('games', 'mode',      'int(11) not null default 1');
    }

    public function down()
    {
        $this->dropColumn('games', 'max_turns');
        $this->dropColumn('games', 'mode');
    }
}