<?php

class m131216_160724_move_changes extends CDbMigration
{
    public function up()
    {
        $this->renameColumn('moves', 'move_number', 'turn');

        $this->addForeignKey('fk_moves_game_id',    'moves', 'game_id',    'games',    'id', 'cascade', 'cascade');
        $this->addForeignKey('fk_moves_pathway_id', 'moves', 'pathway_id', 'pathways', 'id', 'cascade', 'cascade');
        $this->addForeignKey('fk_moves_organ_id',   'moves', 'organ_id',   'organs',   'id', 'cascade', 'cascade');
    }

    public function down()
    {
        $this->renameColumn('moves', 'turn', 'move_number');

        $this->dropForeignKey('fk_moves_game_id',    'moves');
        $this->dropForeignKey('fk_moves_pathway_id', 'moves');
        $this->dropForeignKey('fk_moves_organ_id',   'moves');
    }
}