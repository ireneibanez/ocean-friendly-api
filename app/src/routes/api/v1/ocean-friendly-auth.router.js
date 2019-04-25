const Router = require('koa-router');
const passport = require('koa-passport');
const SightingModel = require('models/sighting.model');



const router = new Router({
    prefix: '/ocean'
});

class OceanFriendlyAuthRouter {

    static async getMySightings(ctx) {
        const user = ctx.state.user;
        const data = await SightingModel.find({user: user.id});
        ctx.body = data;
    }

    static async saveSighting(ctx) {
        const newSighting = new SightingModel(ctx.request.body);
        newSighting.user = ctx.state.user.id;
        await newSighting.save();
        ctx.body = newSighting;
    }

    static async deleteSighting(ctx) {
        try {
            await SightingModel.findOneAndRemove({_id: ctx.params.id});
            ctx.status = 200;
            ctx.body = {
                status: 'ok'
            }
        } catch (err) {
            ctx.status = 400;
            ctx.body = {
                status: 'error',
                message: err.message || 'Sorry, an error has occurred.'
            };
        }
    }

    static async replaceSighting(ctx) {
        try {
            let sighting = await SightingModel.findOne({_id: ctx.params.id});
            if (!sighting) {
                ctx.throw(404, 'Not found');
                return;
            }
            sighting = Object.assign(sighting, ctx.request.body);
            await sighting.save();
            ctx.status = 200;
            ctx.body = sighting;
        } catch (err) {
            console.error(err)
            ctx.status = 400;
            ctx.body = {
                status: 'error',
                message: err.message || 'Sorry, an error has occurred.'
            };
        }
    }

}

router.use(passport.authenticate('jwt', {
    session: false
  }));


router.delete('/sighting/:id', OceanFriendlyAuthRouter.deleteSighting);
router.get('/my-sightings', OceanFriendlyAuthRouter.getMySightings);
router.put('/sighting/:id', OceanFriendlyAuthRouter.replaceSighting);
router.post('/sighting', OceanFriendlyAuthRouter.saveSighting);

module.exports = router;