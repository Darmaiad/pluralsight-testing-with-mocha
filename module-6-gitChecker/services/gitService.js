const https = require('https');

module.exports = () => {
    const getRepos = (userId, cb) => {
        const options = {
            host: 'api.github.com',
            path: `/users/${userId}/repos`,
            headers: { 'User-Agent': 'gitExample' }
        };

        const callback = (response) => {
            let str = '';

            response.on('data', (chunk) => str += chunk);
            response.on('end', () => cb(JSON.parse(str)));
        };

        https.request(options, callback).end();
    }

    const getUser = (userId) => new Promise((resolve) => {
        const options = {
            host: 'api.github.com',
            path: `/users/${userId}`,
            headers: { 'User-Agent': 'gitExample' }
        };

        const callback = (response) => {
            let str = '';

            response.on('data', (chunk) => str += chunk);

            response.on('end', () => {
                let user = JSON.parse(str);
                // getRepos(userId, (repos) => {
                    // user.repos = repos;
                    resolve(user);
                // });
            });

            response.on('error', (e) => {
                console.log(`problem with request: ${e.message}`);
            });
        };

        https.request(options, callback).end();
    });

    return {
        getUser,
    };
};
