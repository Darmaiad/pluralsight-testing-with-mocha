const AuthController = () => {
    let roles = [];
    let user = {};

    const setRoles = (role) => {
        roles = role;
        user.roles = role;
    };

    const setUser = (inUser) => user = inUser;

    const isAuthorized = (neededRole) => roles.indexOf(neededRole) >= 0;

    const isAuthorizedAsync = (neededRole, cb) => setTimeout(() => cb(roles.indexOf(neededRole) >= 0), 100);

    const isAuthorizedPromise = (neededRole) => new Promise((resolve) => setTimeout(() => resolve(roles.indexOf(neededRole) >= 0), 0));

    // Module 5 - Spys
    const isAuthorizedUser = (neededRole) => {
        if (user) {
            return user.isAuthorized(neededRole);
        }
    };

    const getIndex = (req, res) => {
        res.render('index');
    };

    // Module 5 - Stubs
    const getIndex2 = (req, res) => {
        try {
            if (req.user.isAuthorized('admin')) {
                return res.render('index');
            }
            res.render('notAuth');
        } catch (e) {
            res.render('error');
        }
    };

    return {
        setRoles,
        setUser,
        isAuthorized,
        isAuthorizedAsync,
        isAuthorizedPromise,
        isAuthorizedUser,
        getIndex,
        getIndex2,
    };
};

module.exports = AuthController();
