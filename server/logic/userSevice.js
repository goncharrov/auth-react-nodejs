import { Users, UsersVerificationCode } from "../app_auth/authModels.js";

export function makeStringCapitalized(str) {
    str = str.trim().toLowerCase()
    return str.charAt(0).toUpperCase() + str.slice(1)
}

export function getUserDataForSession(user) {
    const {email, phone, firstName, lastName, preferredName, birthday, gender, role} = user;
    return {email, phone, firstName, lastName, preferredName, birthday, gender, role};
}

export async function writeUserVerificationCode(userId) {

    let currentDate = new Date();
    let expireDate = currentDate.setMinutes(currentDate.getMinutes() + 5);
    let code = Math.floor(Math.random() * 10000).toString();
    code = code.padStart(4, '0');
    code = '5555';
    
    try {
        const loginEmailCode = await UsersVerificationCode.findOne({ where: { userId } });
        if (loginEmailCode) {
            loginEmailCode.code = code;
            loginEmailCode.expire = expireDate;
            await loginEmailCode.save();
        } else {
            await UsersVerificationCode.create({
                userId: userId,
                code,
                expire: expireDate
            });
        };

        // Next, you need to send the code to the user's email or phone number. 

        return true;
    } catch (error) {
        console.log('Error during writing login email code:', error);
        return false;
    }      

}

export async function deleteVerificationCode(userId) {
    const verificationCode = await UsersVerificationCode.findOne({ where: { userId } })
    if (verificationCode) {
        verificationCode.destroy();
    }
}

export async function verifyUserVerificationCode(userId, code) {

    // Search verification code
    const verificationCode = await UsersVerificationCode.findOne({ where: { userId } })        

    if (!verificationCode) {
        return {
            success: false,
            error: 'Error receiving verification code.'
        };
    }

    // Check verification code
    if (code !== verificationCode.code) {
        return {
            success: false,
            error: 'The code you entered is incorrect'
        };
    };

    if (new Date() > verificationCode.expire) {
        return {
            success: false,
            error: 'The current verification code is out of date. Get new code.'
        }
    }

    return {success: true}

}

export async function getUserFromSession(userId) {

    if (!userId) {
        return {
            success: false,
            error: 'Error getting session user'
        };
    };

    const user = await Users.findOne({ where: { id: userId } });

    if (!user) {
        return {
            success: false,
            error: 'Incorrect session user id'
        };
    };

    return { success: true, user };

}
