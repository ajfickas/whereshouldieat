# App

## Command Reference

### Development
- Development environment lifecycle
  - Start development environment: `docker-compose up`
  - Stop development environment: `docker-compose stop`
- Docker environment development
  - Rebuild development environment: `docker-compose build`
  - Destroy development environment (will delete any volumes): `docker-compose down`
- Docker housekeeping
  - Remove all stopped docker containers: `docker container prune`
  - Remove dangling docker images: `docker image prune`
  - Remove all unused docker volumes: `docker volume prune`

### Production
- Deploy: `git push heroku master`
- App server
  - Log into server: `heroku run bash`
  - Display (and tail) logs: `heroku logs | tail -f`

## Set Up Development Environment (MacOS)
1. Prerequisites
    1. Install git
    2. Install Docker for Mac: https://docs.docker.com/docker-for-mac/install/#download-docker-for-mac
    3. Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli
2. Clone repository: `git clone https://github.com/ajfickas/app.git`
3. Create `.env` file
    1. Copy sample: `cp .env.sample .env`
    2. Tweak if desired.
4. Start containers: `docker-compose up`
5. Set up Heroku (for an existing Heroku app)
    1. Log into Heroku: `heroku login`
        1. Enter your Heroku account's email and password.
    2. Add Heroku Git remote: `git remote add heroku <heroku-git-url>`
        - Heroku Git URL found at: `https://dashboard.heroku.com/apps/<app-name>/settings`

## Workflows

### Implement a feature
1. Pull down latest master: `git pull --rebase origin master`
2. Create a feature branch: `git checkout --branch <feature-branch-name>`
3. Start development environment: `docker-compose up`
4. Write code.
5. Test code.
6. Stage code: `git add -p`
7. Commit code: `git commit`
8. Push code: `git push origin <feature-branch-name>`
9. Create, review and merge pull on github.
10. Deploy to production.
    1. Pull latest master: `git pull --rebase origin master`
    2. Deploy: `git push heroku master`

### Install npm dependencies
1. Log into container: `docker-compose run web bash`
2. Run yarn: `yarn install`

## Upgrade node
1. Pull latest node image: `docker pull node:<version>`
2. Rebuild container: `docker-compose build web`
3. Change `engines.node` property in `package.json` to new node version.

## Additional Notes
- Handy shell aliases/functions
  - Run a command in a docker container (`docker-compose run`): `dr`
  - Deploy to heroku (`git push heroku master`): `hd`
- Docker command completion: https://docs.docker.com/compose/completion/
