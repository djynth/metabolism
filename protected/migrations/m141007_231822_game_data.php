<?php

class m141007_231822_game_data extends CDbMigration
{
    public function up()
    {
        $this->alterColumn('games', 'user_id', 'int(11)');
    }

    public function down()
    {
        $this->alterColumn('games', 'user_id', 'int(11) not null');
    }
}