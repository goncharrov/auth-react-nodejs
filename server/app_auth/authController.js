import { Users, UsersVerificationCode } from "./authModels.js";
import  bcrypt  from 'bcryptjs';

import { 
    makeStringCapitalized, 
    getUserDataForSession,
    writeUserVerificationCode,
    verifyUserVerificationCode,
    deleteVerificationCode } from "../logic/userSevice.js";

// Checking the existence of an email

export async function checkEmail(req, res) {

    try {
        const { email } = req.body;        

        if (!email || typeof email !== 'string') {
            return res.status(400).json({
                success: false,
                error: 'Email is required'
            });
        }

        const user = await Users.findOne({ where: { email: email.trim().toLowerCase() } });

        let codeIsWritten = false;
        if (user) {            
            codeIsWritten = await writeUserVerificationCode(user.id);            
        };        

        res.json({
            success: true,
            exists: !!user,
            message: user ? 'User found' : 'User not found',
            loginWithCode: codeIsWritten,
            csrfToken: res.locals.csrfToken
        });
    } catch (error) {
        console.error('Error checking email:', error);
        res.status(500).json({
            success: false,
            error: 'Error checking email'
        });
    }
}

// User login with password

export async function loginWithPassword(req, res) {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password are required'
            });
        }

        // Search for a user
        const user = await Users.findOne({
            where: { email: email.trim().toLowerCase() }
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Incorrect email'
            });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                error: 'Incorrect password'
            });
        }
        
        const userData = getUserDataForSession(user);

        // Create session
        req.session.userId = user.id;
        req.session.user = userData;
        req.session.isAuthenticated = true;

        res.status(201).json({
            success: true,           
            user: userData,
            csrfToken: res.locals.csrfToken
        });

        await deleteVerificationCode(user.id);

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({
            success: false,
            error: 'Error during login'
        });
    }
}

// User login with code

export async function loginWithCode(req, res) {
    try {
        const { email, code } = req.body;

        // Validation
        if (!email || !code) {
            return res.status(400).json({
                success: false,
                error: 'Email and code are required'
            });
        }

        // Search for a user
        const user = await Users.findOne({
            where: { email: email.trim().toLowerCase() }
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Incorrect email'
            });
        }

        const result = await verifyUserVerificationCode(user.id, code);

        if (!result.success) {
                return res.status(401).json({
                success: false,
                error: result.error
            })
        };    
        
        const userData = getUserDataForSession(user);

        // Create session
        req.session.userId = user.id;
        req.session.user = userData;
        req.session.isAuthenticated = true;

        res.status(201).json({
            success: true,           
            user: userData,
            csrfToken: res.locals.csrfToken
        }); 
        
        await deleteVerificationCode(user.id);

    } catch (error) {
        console.log('Error during login:', error);
        res.status(500).json({
            success: false,
            error: 'Error during login'
        });
    }
}

// Send new login code

export async function sendNewLoginCode(req, res) {
    try {
        const { email } = req.body;

        if (!email || typeof email !== 'string') {
            return res.status(400).json({
                success: false,
                error: 'Email is required'
            });
        }

        const user = await Users.findOne({ where: { email: email.trim().toLowerCase() } });

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Incorrect email'
            });
        };

        const codeIsWritten = await writeUserVerificationCode(user.id);
        
        res.json({
            codeIsWritten,
            csrfToken: res.locals.csrfToken
        });            

    } catch {
        return res.status(401).json({
            error: 'Error sending code. Login with email.'
        });
    }
}

// User registration

export async function registration(req, res) {

    const { firstName, lastName, email, password } = req.body; 

    // Validation
    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({
            success: false, 
            message: 'All fields are required' 
        });
    };

    if (password.length < 8) {
        return res.status(400).json({
            success: false,
            error: 'Password must contains at least 8 characters'
        });
    };

    try {

        // Checking email uniqueness
        const existingUser = await Users.findOne({
            where: { email: email.trim().toLowerCase() }
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: 'There is already user with this e-mail address'
            });
        }

        const userFirstName = makeStringCapitalized(firstName)
        const userLastName = makeStringCapitalized(lastName)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await Users.create({
            email: email.trim().toLowerCase(),
            phone: null,            
            firstName: userFirstName,
            lastName: userLastName,
            preferredName: `${userFirstName} ${userLastName}`,
            password: hashedPassword,
            createdAt: Date.now()
        });

        const userData = getUserDataForSession(user);

        // Create session
        req.session.userId = user.id;
        req.session.user = userData;
        req.session.isAuthenticated = true;

        res.status(201).json({
            success: true,
            message: 'The user has been successfully registered',
            user: userData,
            csrfToken: res.locals.csrfToken
        });

    } catch (error) {
        console.error('Error during registration:', error);

        // Обработка ошибок Sequelize
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                success: false,
                error: 'There is already user with this e-mail address'
            });
        }

        if (error.name === 'SequelizeValidationError') {
            const messages = error.errors.map(e => e.message).join(', ');
            return res.status(400).json({
                success: false,
                error: messages
            });
        }

        res.status(500).json({
            success: false,
            error: `Server error: ${error}`
        });

    }

}

// Get current user

export async function getCurrentUser(req, res) {

    try {
        if (!req.session.isAuthenticated || !req.session.userId) {
            return res.json({
                success: true,
                user: null
            });
        }

        const user = await Users.findByPk(req.session.userId, {
            attributes: ['id', 'email', 'phone', 'firstName', 'lastName', 'preferredName', 'birthday', 'gender']
        });

        if (!user) {
            // Clear session if user not found
            req.session.destroy();
            return res.json({
                success: true,
                user: null
            });
        }

        res.json({
            success: true,
            user: {
                email: user.email,
                phone: user.phone,
                firstName: user.firstName,
                lastName: user.lastName,
                preferredName: user.preferredName,
                gender: user.gender,
                birthday: user.birthday
            }
        });
    } catch (error) {
        console.error('Error getting current user:', error);
        res.status(500).json({
            success: false,
            error: 'Error getting current user'
        });
    }
}

// User logout

export async function logout(req, res) {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
        return res.status(500).json({
          success: false,
          error: 'Error destroying session'
        });
      }

      res.clearCookie('auth.sid');
      res.json({
        success: true
      });
    });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({
      success: false,
      error: 'Error during logout'
    });
  }
}
