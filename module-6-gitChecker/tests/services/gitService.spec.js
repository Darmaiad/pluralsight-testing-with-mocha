// Node.js core module. Passthrough is going to mock out a stream.
const PassThrough = require('stream').PassThrough;
// Node.js caches required modules. If we modify a module with Sinon etc, the next guy to call it, 
// will get the modified stub. We also ned to restore it after we stub it.
const https = require('https');
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const sinon = require('sinon');

// We can place those in an outer config file or something.
var gitJson = {
    login: "jonathanfmills",
    id: 138754,
    avatar_url: "https://avatars3.githubusercontent.com/u/138754?v=3",
    gravatar_id: "",
    url: "https://api.github.com/users/jonathanfmills",
    html_url: "https://github.com/jonathanfmills",
    followers_url: "https://api.github.com/users/jonathanfmills/followers",
    following_url: "https://api.github.com/users/jonathanfmills/following{/other_user}",
    gists_url: "https://api.github.com/users/jonathanfmills/gists{/gist_id}",
    starred_url: "https://api.github.com/users/jonathanfmills/starred{/owner}{/repo}",
    subscriptions_url: "https://api.github.com/users/jonathanfmills/subscriptions",
    organizations_url: "https://api.github.com/users/jonathanfmills/orgs",
    repos_url: "https://api.github.com/users/jonathanfmills/repos",
    events_url: "https://api.github.com/users/jonathanfmills/events{/privacy}",
    received_events_url: "https://api.github.com/users/jonathanfmills/received_events",
    type: "User",
    site_admin: false,
    name: "Jonathan Mills",
    company: null,
    blog: null,
    location: null,
    email: null,
    hireable: null,
    bio: null,
    public_repos: 27,
    public_gists: 3,
    followers: 151,
    following: 0,
    created_at: "2009-10-12T16:05:52Z",
    updated_at: "2017-01-14T03:52:52Z"
}
var repoJson = [{
    id: 28144218,
    name: "AngularForTheNetDev",
    full_name: "jonathanfmills/AngularForTheNetDev",
    owner: {
        login: "jonathanfmills",
        id: 138754,
        avatar_url: "https://avatars3.githubusercontent.com/u/138754?v=3",
        gravatar_id: "",
        url: "https://api.github.com/users/jonathanfmills",
        html_url: "https://github.com/jonathanfmills",
        followers_url: "https://api.github.com/users/jonathanfmills/followers",
        following_url: "https://api.github.com/users/jonathanfmills/following{/other_user}",
        gists_url: "https://api.github.com/users/jonathanfmills/gists{/gist_id}",
        starred_url: "https://api.github.com/users/jonathanfmills/starred{/owner}{/repo}",
        subscriptions_url: "https://api.github.com/users/jonathanfmills/subscriptions",
        organizations_url: "https://api.github.com/users/jonathanfmills/orgs",
        repos_url: "https://api.github.com/users/jonathanfmills/repos",
        events_url: "https://api.github.com/users/jonathanfmills/events{/privacy}",
        received_events_url: "https://api.github.com/users/jonathanfmills/received_events",
        type: "User",
        site_admin: false
    },
    private: false,
    html_url: "https://github.com/jonathanfmills/AngularForTheNetDev",
    description: null,
    fork: false,
    url: "https://api.github.com/repos/jonathanfmills/AngularForTheNetDev",
    forks_url: "https://api.github.com/repos/jonathanfmills/AngularForTheNetDev/forks",
    keys_url: "https://api.github.com/repos/jonathanfmills/AngularForTheNetDev/keys{/key_id}",
    collaborators_url: "https://api.github.com/repos/jonathanfmills/AngularForTheNetDev/collaborators{/collaborator}",
    teams_url: "https://api.github.com/repos/jonathanfmills/AngularForTheNetDev/teams",
    hooks_url: "https://api.github.com/repos/jonathanfmills/AngularForTheNetDev/hooks",
    issue_events_url: "https://api.github.com/repos/jonathanfmills/AngularForTheNetDev/issues/events{/number}",
    events_url: "https://api.github.com/repos/jonathanfmills/AngularForTheNetDev/events",
    assignees_url: "https://api.github.com/repos/jonathanfmills/AngularForTheNetDev/assignees{/user}",
    branches_url: "https://api.github.com/repos/jonathanfmills/AngularForTheNetDev/branches{/branch}",
    tags_url: "https://api.github.com/repos/jonathanfmills/AngularForTheNetDev/tags",
    blobs_url: "https://api.github.com/repos/jonathanfmills/AngularForTheNetDev/git/blobs{/sha}",
    git_tags_url: "https://api.github.com/repos/jonathanfmills/AngularForTheNetDev/git/tags{/sha}",
    git_refs_url: "https://api.github.com/repos/jonathanfmills/AngularForTheNetDev/git/refs{/sha}",
    trees_url: "https://api.github.com/repos/jonathanfmills/AngularForTheNetDev/git/trees{/sha}",
    statuses_url: "https://api.github.com/repos/jonathanfmills/AngularForTheNetDev/statuses/{sha}",
    languages_url: "https://api.github.com/repos/jonathanfmills/AngularForTheNetDev/languages",
    stargazers_url: "https://api.github.com/repos/jonathanfmills/AngularForTheNetDev/stargazers",
    contributors_url: "https://api.github.com/repos/jonathanfmills/AngularForTheNetDev/contributors",
    subscribers_url: "https://api.github.com/repos/jonathanfmills/AngularForTheNetDev/subscribers",
    subscription_url: "https://api.github.com/repos/jonathanfmills/AngularForTheNetDev/subscription",
    commits_url: "https://api.github.com/repos/jonathanfmills/AngularForTheNetDev/commits{/sha}",
    git_commits_url: "https://api.github.com/repos/jonathanfmills/AngularForTheNetDev/git/commits{/sha}",
    comments_url: "https://api.github.com/repos/jonathanfmills/AngularForTheNetDev/comments{/number}",
    issue_comment_url: "https://api.github.com/repos/jonathanfmills/AngularForTheNetDev/issues/comments{/number}",
    contents_url: "https://api.github.com/repos/jonathanfmills/AngularForTheNetDev/contents/{+path}",
    compare_url: "https://api.github.com/repos/jonathanfmills/AngularForTheNetDev/compare/{base}...{head}",
    merges_url: "https://api.github.com/repos/jonathanfmills/AngularForTheNetDev/merges",
    archive_url: "https://api.github.com/repos/jonathanfmills/AngularForTheNetDev/{archive_format}{/ref}",
    downloads_url: "https://api.github.com/repos/jonathanfmills/AngularForTheNetDev/downloads",
    issues_url: "https://api.github.com/repos/jonathanfmills/AngularForTheNetDev/issues{/number}",
    pulls_url: "https://api.github.com/repos/jonathanfmills/AngularForTheNetDev/pulls{/number}",
    milestones_url: "https://api.github.com/repos/jonathanfmills/AngularForTheNetDev/milestones{/number}",
    notifications_url: "https://api.github.com/repos/jonathanfmills/AngularForTheNetDev/notifications{?since,all,participating}",
    labels_url: "https://api.github.com/repos/jonathanfmills/AngularForTheNetDev/labels{/name}",
    releases_url: "https://api.github.com/repos/jonathanfmills/AngularForTheNetDev/releases{/id}",
    deployments_url: "https://api.github.com/repos/jonathanfmills/AngularForTheNetDev/deployments",
    created_at: "2014-12-17T16:00:21Z",
    updated_at: "2014-12-17T16:29:31Z",
    pushed_at: "2014-12-17T16:29:11Z",
    git_url: "git://github.com/jonathanfmills/AngularForTheNetDev.git",
    ssh_url: "git@github.com:jonathanfmills/AngularForTheNetDev.git",
    clone_url: "https://github.com/jonathanfmills/AngularForTheNetDev.git",
    svn_url: "https://github.com/jonathanfmills/AngularForTheNetDev",
    homepage: null,
    size: 18984,
    stargazers_count: 0,
    watchers_count: 0,
    language: "PowerShell",
    has_issues: true,
    has_downloads: true,
    has_wiki: true,
    has_pages: false,
    forks_count: 0,
    mirror_url: null,
    open_issues_count: 0,
    forks: 0,
    open_issues: 0,
    watchers: 0,
    default_branch: "master"
}]

const gitService = require('./../../services/gitService')();

chai.use(chaiAsPromised);
chai.should();

describe('GitService', function () {
    describe('GetUser', function () {
        // Can't use arrow functions neither in the 'beforeEach' nor in 'it', we need to maintain 'this'.
        beforeEach(function () {
            // If we do not specify that we want to stub the 'request' func, it will stub the whole https module.
            this.request = sinon.stub(https, 'request');
        });

        it('should get a user and repos: ', function (done) {
            this.timeout(4000);
            // Instead of those two, we copy/paste an actual JSON response instance.
            // const rawMockUserResponse = { login: 'jonathanfmills' };
            // const rawMockRepoResponse = [{ name: 'testRepo' }];

            // The https module returns a stream.
            // We want to mock the response of the callback of the two http.request calls
            // Write the mocked response after we stringify it.
            const mockUserResponse = new PassThrough();
            mockUserResponse.write(JSON.stringify(gitJson));
            // mockUserResponse.write(JSON.stringify(rawMockUserResponse));
            mockUserResponse.end();
            const mockRepoResponse = new PassThrough();
            mockRepoResponse.write(JSON.stringify(repoJson));
            // mockRepoResponse.write(JSON.stringify(rawMockRepoResponse));
            mockRepoResponse.end();

            // this.request mocks https.request.
            // Call it, using for the second (index starts at 0) argument mockUserResponse, 
            // and then it will return a new Passthrough. 
            this.request.callsArgWith(1, mockUserResponse).returns(new PassThrough()); // Working

            // this.request // Not working
            //     // The first call of https.request will be made with 'mockUserResponse'.
            //     .onFirstCall().callsArgWith(1, mockUserResponse).returns(new PassThrough())
            //     // While the second call will be made with 'mockRepoResponse'.
            //     .onSecondCall().callsArgWith(1, mockRepoResponse).returns(new PassThrough());

            gitService.getUser('jonathanfmills').then(
                (user) => { // We use arrow function here in order to have access to 'this.request'
                    // console.log('resolved:\n', user);

                    const params = this.request.getCall(0).args;
                    params[0].headers['User-Agent'].should.equal('gitExample');

                    // this.request.getCall(1).args[0].path.should.equal('/users/jonathanmills/repos');
                    // console.log('params: ', params2);

                    user.login.should.equal('jonathanfmills');
                    // user.should.have.property('repos');
                    done();
                });
        });

        // Restore what we stubed
        afterEach(function () {
            this.request.restore();
        });
    });
});
