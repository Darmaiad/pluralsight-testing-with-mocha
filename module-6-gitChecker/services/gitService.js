const https = require('https');

module.exports = () => {
    const getRepos = (userId) => new Promise((resolve) => {
        const options = {
            host: 'api.github.com',
            path: `/users/${userId}/repos`,
            headers: { 'User-Agent': 'gitExample' }
        };

        const callback = (response) => {
            let str = '';

            response.on('data', (chunk) => { str += chunk });

            response.on('end', () => {
                let repos = JSON.parse(str);
                resolve(repos);
            });
        };

        https.request(options, callback).end();
    });

    const getUser = (userId) => new Promise((resolve) => {
        const options = {
            host: 'api.github.com',
            path: `/users/${userId}`,
            headers: { 'User-Agent': 'gitExample' }
        };

        const callback = (response) => {
            let str = '';

            response.on('data', (chunk) => { str += chunk });

            response.on('end', () => {
                let user = JSON.parse(str);
                getRepos(userId).then((repos) => {
                    console.log('repossssssssssssssssssssss')
                    user.repos = repos;
                });
                resolve(user);
            });

            response.on('error', (e) => {
                console.log(`problem with request: ${e.message}`);
            });
        };

        https.request(options, callback).end();
    });

    return {
        getUser,
        getRepos,
    };
};
