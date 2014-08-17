<?php

/**
 * @db action      varchar(32) the ID of the action to be executed upon the
 *                             invocation of this shortcut
 * @db name        varchar(32) the user-readable short name of this shortcut
 * @db description text        the expanded one-line description of the function
 *                             of this shortcut
 * @db default_key char(1)     the default binding of this shortcut
 */
class KeyboardShortcut extends CActiveRecord
{
    public static function model($className = __CLASS__)
    {
        return parent::model($className);
    }

    public function tableName()
    {
        return 'keyboard_shortcuts';
    }

    public function primaryKey()
    {
        return 'action';
    }

    public static function getShortcuts($user=-1)
    {
        if ($user === -1) {
            $user = User::getCurrentUser();
        }

        $shortcuts = array();
        foreach (self::model()->findAll() as $shortcut) {
            $default = $shortcut->default_key;
            if ($user === null) {
                $current = $default;
            } else {
                // TODO
                var_dump($user->shortcuts);
                die;
            }
            $shortcuts[$shortcut->action] = array(
                'current' => $current,
                'default' => $default,
            );
        }
        return $shortcuts;
    }

    public static function getDefaultShortcuts()
    {
        $shortcuts = array();
        foreach (self::model()->findAll() as $shortcut) {
            $shortcuts[$shortcut->default_key] = $shortcut->action;
        }
        return $shortcuts;
    }
}