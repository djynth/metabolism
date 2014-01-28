<?php

/**
 * @db id                 int(11)         a unique user ID
 * @db username           varchar(255)    this user's chosen name
 * @db password           varchar(255)    this user's chosen password (hashed)
 * @db created            timestamp       the time of the account's creation
 * @db theme              varchar(8)      this user's chosen color theme
 * @db theme_type         varchat(20)     the type of this user's chosen theme
 * @db email              varchar(80)     the email address associated with this
 *                                        user
 * @db email_verified     tinyint(1)      whether the user has verified the
 *                                        email address
 * @db email_verification varchar(16)     the email verification code
 * @db help               tinyint(1)      whether the user has chosen to display
 *                                        help tooltips
 * @fk password_recovery  RecoverPassword
 */
class User extends CActiveRecord
{
    const DEFAULT_THEME = 'frosted';    // the default color theme
    const DEFAULT_THEME_TYPE = 'light'; // the default color theme type
    const DEFAULT_HELP = true;          // whether or not help tooltips should
                                        // be enabled by default

    public static function model($className = __CLASS__)
    {
        return parent::model($className);
    }

    public function tableName()
    {
        return 'users';
    }

    public function primaryKey()
    {
        return 'id';
    }

    public function relations()
    {
        return array(
            'password_recovery' => array(
                self::HAS_ONE,
                'RecoverPassword',
                array('id' => 'user_id')
            ),
        );
    }

    /**
     * Determines whether the given password is authentic.
     * Note that this function does not add any sort of time delay; it
     *  immediately returns the result of attempting to decrypt the user's
     *  hashed password.
     *
     * @return true if the given password is the correct hash key for the
     *         password hash stored for this user
     */
    public function authenticate($password)
    {
        return $this->password === crypt($password, $this->password);
    }

    /**
     * Gets the domain (everything that follows the first "@") in the user's
     *  email address.
     *
     * @return the domain of the user's email address
     */
    public function getEmailDomain()
    {
        $split = split('@', $this->email);
        return $split[1];
    }

    /**
     * Gets the current User.
     * Note that this function is not memoized, and so repeated calls to it may
     *  result in multiple database queries.
     *
     * @return the User who is currently playing, or null if the user is not
     *         logged in
     */
    public static function getCurrentUser()
    {
        if (Yii::app()->user->isGuest) {
            return null;
        }

        return self::findByUsername(Yii::app()->user->id);
    }

    /**
     * Returns the User associated with the given username, if one exists.
     * Note that the results of this function are not memoized, and so repeated
     *  calls to it may result in multiple database queries.
     *
     * @param username string the name of the user to find
     * @return the User with a username matching the given one, or null if no
     *         such User exists
     */
    public static function findByUsername($username)
    {
        return self::model()->findByAttributes(array('username' => $username));
    }

    /**
     * Determines whether a User with the given username already exists.
     *
     * @param username string the username to test
     * @return true if the given username has been taken, false otherwise
     */
    public static function isUsernameTaken($username)
    {
        return self::model()->findByAttributes(array('username' => $username)) 
               !== null;
    }

    /**
     * Determines whether a User with the given email address already exists.
     *
     * @param email string the email address to test
     * @return true if the given email address has been taken, false otherwise
     */
    public static function isEmailTaken($email)
    {
        return self::model()->findByAttributes(array('email' => $email))
               !== null;
    }

    /**
     * Determines whether the given username is valid, i.e. it contains an
     *  appropriate number of useable characters.
     *
     * @param username string the potential username
     * @return true if the username is valid, false otherwise
     */
    public static function isValidUsername($username)
    {
        return preg_match("/^[a-zA-Z0-9_-]{3,16}$/", $username);
    }

    /**
     * Determines whether the given password is valid, i.e. it contains an
     *  appropriate number of useable characters.
     *
     * @param password string the potential password
     * @return true if the password is valid, false otherwise
     */
    public static function isValidPassword($password)
    {
        return preg_match("/^[a-zA-Z0-9:punct:]{3,32}$/", $password);
    }

    /**
     * Determines whether the given email address is valid, i.e. it conforms to
     *  a loose characterization of the form of an email address.
     *
     * @param email string the potential email address
     * @return true if the email address is valid, false otherwise
     */
    public static function isValidEmail($email)
    {
        return preg_match("/.+\@.+\..+/", $email);
    }
}