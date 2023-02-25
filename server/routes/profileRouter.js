const Router = require('express')
const router = new Router()
const ProfileController = require('../controllers/profileController')

router.post('/', ProfileController.create)
router.get('/:id', ProfileController.getOne)

module.exports = router
