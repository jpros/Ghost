var Router = require('./base/Router'),
    siteRouter = new Router('site'),

    // Sub Routers
    appRouter = require('./app-router'),
    channelService = require('../channels'),

    // Controllers
    controllers = require('../../controllers'),

    // Utils for creating paths
    // @TODO: refactor these away
    config = require('../../config'),
    utils = require('../../utils'),

    _private = {};

_private.mountDefaultRoutes = function mountDefaultRoutes() {
    // @TODO move this path out of this file!
    // Note this also exists in api/index.js
    var previewRoute = utils.url.urlJoin('/', config.get('routeKeywords').preview, ':uuid', ':options?');

    // Preview - register controller as route
    // Ideal version, as we don't want these paths all over the place
    // previewRoute = new Route('GET /:t_preview/:uuid/:options?', previewController);
    // siteRouter.mountRoute(previewRoute);
    // Orrrrr maybe preview should be an internal App??!
    siteRouter.mountRoute(previewRoute, controllers.preview);

    // Channels - register sub-router
    // The purpose of having a parentRouter for channels, is so that we can load channels from wherever we want:
    // config, settings, apps, etc, and that it will be possible for the router to be reloaded.
    siteRouter.mountRouter(channelService.router());

    // Apps - register sub-router
    // The purpose of having a parentRouter for apps, is that Apps can register a route whenever they want.
    // Apps cannot yet deregister, it's complex to implement and I don't yet have a clear use-case for this.
    siteRouter.mountRouter(appRouter.router());

    // Default - register entry controller as route
    siteRouter.mountRoute('*', controllers.entry);
};

module.exports = function router() {
    _private.mountDefaultRoutes();

    return siteRouter.router();
};