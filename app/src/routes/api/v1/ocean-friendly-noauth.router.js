const Router = require('koa-router');
const passport = require('koa-passport');
const SightingModel = require('models/sighting.model');
const ReproductionPlacesModel = require('models/reproduction-places.model');


const router = new Router({
    prefix: '/ocean'
});

class OceanFriendlyNoAuthRouter {

    static async getSighting(ctx) {
        const data = await SightingModel.find();
        ctx.body = data;
    }

    static async getReproductionPlaces(ctx) {
        const data = await ReproductionPlacesModel.find();
        ctx.body = data;
    }

    static async saveReproductionPlaces(ctx) {
        const newReproductionPlace = new ReproductionPlacesModel(ctx.request.body);
        await newReproductionPlace.save();
        ctx.body = newReproductionPlace;
    }

}

router.get('/sighting', OceanFriendlyNoAuthRouter.getSighting);
router.get('/reproduction-places', OceanFriendlyNoAuthRouter.getReproductionPlaces);
router.post('/reproduction-places', OceanFriendlyNoAuthRouter.saveReproductionPlaces);

module.exports = router;