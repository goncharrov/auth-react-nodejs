import { Users } from "../app_auth/authModels.js";
import  bcrypt  from 'bcryptjs';

import { 
    makeStringCapitalized, 
    getUserDataForSession,
    writeUserVerificationCode,
    verifyUserVerificationCode,
    deleteVerificationCode,
    getUserFromSession } from "../logic/userSevice.js";

export async function saveUserData(req, res) {

    try {

        let { firstName, lastName, preferredName, gender, birthday  } = req.body;
        
        // Validation
        if (!firstName || !lastName ) {
            return res.status(400).json({
                success: false, 
                message: 'Fields "First name" and "Last name" are required' 
            });
        };

        firstName = makeStringCapitalized(firstName);
        lastName = makeStringCapitalized(lastName);

        if (!preferredName) {
            preferredName = `${firstName} ${lastName}`;
        };

        // Get user from session
        const resultUserFromSession = await getUserFromSession(req.session.userId);

        if (!resultUserFromSession.success) {
                return res.status(401).json({
                success: false,
                error: result.error
            })
        };

        const { user } = resultUserFromSession;

        const userBirthday = new Date(birthday);
    
        user.firstName = firstName;
        user.lastName = lastName;
        user.preferredName = preferredName;
        user.gender = gender.label;      
        if (!isNaN(userBirthday.getTime())) {
            user.birthday = userBirthday;
        };        
        await user.save();

        const userData = getUserDataForSession(user);

        // Create session
        req.session.userId = user.id;
        req.session.user = userData;
        req.session.isAuthenticated = true;

        res.status(201).json({
            success: true,
            message: 'User data has been successfully saved',
            user: userData,
            csrfToken: res.locals.csrfToken
        });

    } catch (error) {
        console.error('Error during saving user data:', error);

        res.status(500).json({
            success: false,
            error: `Server error: ${error}`
        });

    }
        
}

export async function getUserVerificationCode(req, res) {    

    try {

        const { type, isNewValue, newValue } = req.body;
       
        // Get user from session
        const resultUserFromSession = await getUserFromSession(req.session.userId);

        if (!resultUserFromSession.success) {
                return res.status(401).json({
                success: false,
                error: result.error
            })
        };

        const { user } = resultUserFromSession;

        const contactDataValue = isNewValue ? newValue : user[type];

        let isCodeWritten = false;
        if (contactDataValue) {
            isCodeWritten = await writeUserVerificationCode(user.id);
        };

        res.json({
            success: true,
            isCodeWritten,
            isContactDataEmpty: contactDataValue ? false : true,
            csrfToken: res.locals.csrfToken
        });

    } catch (error) {

        console.error('Error writing verification code:', error);
        res.status(500).json({
            success: false,
            error: 'Error writing verification code'
        });

    }

}

export async function checkUserVerificationCode(req, res) {

    try {

        const { code } = req.body;
        
        // Get user from session
        const resultUserFromSession = await getUserFromSession(req.session.userId);

        if (!resultUserFromSession.success) {
                return res.status(401).json({
                success: false,
                error: result.error
            })
        };

        const { user } = resultUserFromSession;

        // verify user verification code
        const result = await verifyUserVerificationCode(user.id, code);

        if (!result.success) {
                return res.status(401).json({
                success: false,
                error: result.error
            })
        };        

        res.status(201).json({
            success: true,           
            csrfToken: res.locals.csrfToken
        });

    } catch (error) {

        console.error('Error receiving verification code:', error);
        res.status(500).json({
            success: false,
            error: 'Error receiving verification code'
        });

    }

}

export async function checkUserContactData(req, res) {
    try {
        const { type, value } = req.body;        

        if (!value || typeof value !== 'string') {
            return res.status(400).json({
                success: false,
                error: `An ${type} is required`
            });
        }

        // Checking contact data uniqueness
        const existingUser = await Users.findOne({ where: { [type]: value.trim().toLowerCase() }});

        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: `This ${type} is already in use`
            });
        };

        // Get user from session
        const resultUserFromSession = await getUserFromSession(req.session.userId);

        if (!resultUserFromSession.success) {
                return res.status(401).json({
                success: false,
                error: result.error
            })
        };

        const { user } = resultUserFromSession;
  
        const iSCodeWritten = await writeUserVerificationCode(user.id); 
        if (!iSCodeWritten) {
            return res.status(401).json({
                success: false,
                error: 'Error writing verification code'
            });
        };      

        res.json({
            success: true,
            csrfToken: res.locals.csrfToken
        });

    } catch (error) {
        console.error(`Error checking ${type}:`, error);
        res.status(500).json({
            success: false,
            error: `Error checking ${type}:`
        });
    }
}

export async function writeNewUserContactData(req, res) {

    try {

        const { type, value, code } = req.body;

        if (!value || typeof value !== 'string') {
            return res.status(400).json({
                success: false,
                error: `An ${type} is required`
            });
        }

        // Checking email uniqueness
        const existingUser = await Users.findOne({ where: { [type]: value.trim().toLowerCase() }});

        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: `This ${type} is already in use`
            });
        };

        // Get user from session
        const resultUserFromSession = await getUserFromSession(req.session.userId);

        if (!resultUserFromSession.success) {
                return res.status(401).json({
                success: false,
                error: result.error
            })
        };

        const { user } = resultUserFromSession;

        // verify user verification code
        const result = await verifyUserVerificationCode(user.id, code);

        if (!result.success) {
                return res.status(401).json({
                success: false,
                error: result.error
            })
        }; 
        
        if (type === 'email') {
            user.email = value.trim().toLowerCase();
        } else if (type === 'phone') {
            user.phone = value.trim().toLowerCase();            
        };       
        await user.save();

        const userData = getUserDataForSession(user);

        // Update session
        req.session.user = userData;

        res.status(201).json({
            success: true,
            message: 'New user contact data has been successfully saved',
            user: userData,
            csrfToken: res.locals.csrfToken
        });        

    } catch (error) {
        console.error('Error writing user contact data:', error);
        res.status(500).json({
            success: false,
            error: 'Error writing user contact data'
        });
    }
    
}

export async function checkUserPassword(req, res) {

    try {

        const { password } = req.body;

        // Get user from session
        const resultUserFromSession = await getUserFromSession(req.session.userId);

        if (!resultUserFromSession.success) {
                return res.status(401).json({
                success: false,
                error: result.error
            })
        };

        const { user } = resultUserFromSession;

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                error: 'Incorrect password'
            });
        };

        res.status(201).json({
            success: true,           
            csrfToken: res.locals.csrfToken
        });

    } catch (error) {
        console.error('Error during check user password:', error);
        res.status(500).json({
            success: false,
            error: 'Error during check user password'
        });
    }

}

export async function writeNewUserPassword(req, res) {

    try {

        const { password } = req.body;

        if (!password || typeof password !== 'string') {
            return res.status(400).json({
                success: false,
                error: `Password is required`
            });
        }

        // Get user from session
        const resultUserFromSession = await getUserFromSession(req.session.userId);

        if (!resultUserFromSession.success) {
                return res.status(401).json({
                success: false,
                error: result.error
            })
        };

        const { user } = resultUserFromSession;

        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;
        await user.save();

        res.status(201).json({
            success: true,
            csrfToken: res.locals.csrfToken
        }); 

    } catch {
        console.error('Error during writing new user password:', error);
        res.status(500).json({
            success: false,
            error: 'Error during writing new user password'
        });
    }

    




}

export async function deleteUserAccount(req, res) {
    
    try {

        const { password } = req.body;

        // Get user from session
        const resultUserFromSession = await getUserFromSession(req.session.userId);

        if (!resultUserFromSession.success) {
                return res.status(401).json({
                success: false,
                error: result.error
            })
        };

        const { user } = resultUserFromSession;

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                error: 'Incorrect password'
            });
        };
        
        await deleteVerificationCode(user.id);
        user.destroy();

        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session:', err);
                return res.status(500).json({
                    success: false,
                    error: 'Error destroying session'
                });
            }

            res.clearCookie('auth.sid');

            res.status(201).json({
                success: true,           
            });

        });        

    } catch (error) {
        console.error('Error during deleting user account:', error);
        res.status(500).json({
            success: false,
            error: 'Error during deleting user account'
        });
    }

}